import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { vectorStore, hybridScore } from "../db/vectors";
import { db } from "../db/connection";

const app = new Hono();

const searchBodySchema = z.object({
  query: z.string().min(1),
  embedding: z.array(z.number()).optional(),
  type: z
    .enum(["decision", "solution", "pattern", "architecture", "note"])
    .optional(),
  limit: z.number().min(1).max(100).default(20),
  hybridWeight: z.number().min(0).max(1).default(0.7),
  minImportance: z.number().min(0).max(1).optional(),
});

interface SearchResult {
  id: string;
  memory_id: string;
  type: string;
  title: string;
  tags: string[];
  related_files: string[];
  importance: number;
  score: number;
  breakdown: {
    semantic: number;
    keyword: number;
  };
}

// POST /search - Hybrid semantic + keyword search
app.post("/", zValidator("json", searchBodySchema), (c) => {
  const { query, embedding, type, limit, hybridWeight, minImportance } =
    c.req.valid("json");

  const results: SearchResult[] = [];
  let maxDistance = 2.0; // Max cosine distance
  let maxKeywordMatches = 1;

  // If embedding provided, do semantic search
  if (embedding && embedding.length > 0) {
    const semanticResults = vectorStore.search({
      embedding,
      limit: limit * 2,
      type,
      minImportance,
    });

    // Track max distance for normalization
    if (semanticResults.length > 0) {
      maxDistance = Math.max(
        ...semanticResults.map((r) => r.distance),
        0.01,
      );
    }

    for (const result of semanticResults) {
      results.push({
        id: result.id,
        memory_id: result.memory_id,
        type: result.type,
        title: result.title,
        tags: result.tags,
        related_files: result.related_files,
        importance: result.importance,
        score: result.score,
        breakdown: {
          semantic: result.score,
          keyword: 0,
        },
      });
    }
  }

  // Do keyword search on local DB
  const localDb = db.getLocalDb();
  const keywordQuery = `
    SELECT
      id,
      title,
      type,
      tags,
      related_files,
      importance,
      (
        CASE WHEN title LIKE ? THEN 2 ELSE 0 END +
        CASE WHEN content LIKE ? THEN 1 ELSE 0 END +
        CASE WHEN summary LIKE ? THEN 1 ELSE 0 END
      ) AS match_score
    FROM memories
    WHERE (title LIKE ? OR content LIKE ? OR summary LIKE ?)
    ${type ? "AND type = ?" : ""}
    ${minImportance !== undefined ? "AND importance >= ?" : ""}
    ORDER BY match_score DESC
    LIMIT ?
  `;

  const searchPattern = `%${query}%`;
  const keywordParams: unknown[] = [
    searchPattern,
    searchPattern,
    searchPattern,
    searchPattern,
    searchPattern,
    searchPattern,
  ];
  if (type) keywordParams.push(type);
  if (minImportance !== undefined) keywordParams.push(minImportance);
  keywordParams.push(limit * 2);

  const keywordResults = localDb.prepare(keywordQuery).all(...keywordParams) as Array<{
    id: string;
    title: string;
    type: string;
    tags: string;
    related_files: string;
    importance: number;
    match_score: number;
  }>;

  // Track max keyword matches for normalization
  if (keywordResults.length > 0) {
    maxKeywordMatches = Math.max(
      ...keywordResults.map((r) => r.match_score),
      1,
    );
  }

  // Merge keyword results
  for (const row of keywordResults) {
    const existing = results.find((r) => r.memory_id === row.id);
    const keywordScore = row.match_score / maxKeywordMatches;

    if (existing) {
      existing.breakdown.keyword = keywordScore;
      existing.score = hybridScore(
        1 - existing.breakdown.semantic,
        row.match_score,
        maxDistance,
        maxKeywordMatches,
        hybridWeight,
      );
    } else {
      results.push({
        id: row.id,
        memory_id: row.id,
        type: row.type,
        title: row.title,
        tags: JSON.parse(row.tags || "[]"),
        related_files: JSON.parse(row.related_files || "[]"),
        importance: row.importance,
        score: keywordScore * (1 - hybridWeight),
        breakdown: {
          semantic: 0,
          keyword: keywordScore,
        },
      });
    }
  }

  // Sort by combined score and limit
  results.sort((a, b) => b.score - a.score);
  const finalResults = results.slice(0, limit);

  return c.json({
    results: finalResults,
    query,
    hybridWeight,
    totalMatches: results.length,
  });
});

// POST /search/similar/:id - Find similar memories
app.post("/similar/:id", (c) => {
  const id = c.req.param("id");
  const results = vectorStore.findSimilar(id);
  return c.json({ results });
});

export default app;
