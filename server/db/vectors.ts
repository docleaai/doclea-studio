import { db } from "./connection";

export interface VectorSearchResult {
  id: string;
  memory_id: string;
  type: string;
  title: string;
  tags: string[];
  related_files: string[];
  importance: number;
  distance: number;
  score: number;
}

export interface SearchParams {
  embedding: number[];
  limit?: number;
  type?: string;
  minImportance?: number;
}

export class VectorStore {
  private tableName = "memory_vectors";
  private vectorSize = 384;

  search(params: SearchParams): VectorSearchResult[] {
    const { embedding, limit = 20, type, minImportance } = params;
    const vectorDb = db.getVectorDb();

    // Build filter conditions
    const conditions: string[] = [];
    const filterValues: unknown[] = [];

    if (type) {
      conditions.push("v.type = ?");
      filterValues.push(type);
    }
    if (minImportance !== undefined) {
      conditions.push("v.importance >= ?");
      filterValues.push(minImportance);
    }

    const filterClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Convert embedding to vector format
    const vectorBlob = new Float32Array(embedding);

    // Use KNN search with libSQL vector functions
    const query = `
      SELECT
        v.id,
        v.memory_id,
        v.type,
        v.title,
        v.tags,
        v.related_files,
        v.importance,
        vector_distance_cos(v.embedding, vector(?)) AS distance
      FROM vector_top_k('${this.tableName}_vec_idx', vector(?), ?) AS vt
      JOIN ${this.tableName} AS v ON v.rowid = vt.id
      ${filterClause}
      ORDER BY distance ASC
    `;

    const rows = vectorDb
      .prepare(query)
      .all(
        vectorBlob,
        vectorBlob,
        limit * 2,
        ...filterValues,
      ) as Array<{
      id: string;
      memory_id: string;
      type: string;
      title: string;
      tags: string;
      related_files: string;
      importance: number;
      distance: number;
    }>;

    return rows.slice(0, limit).map((row) => ({
      ...row,
      tags: JSON.parse(row.tags || "[]"),
      related_files: JSON.parse(row.related_files || "[]"),
      score: 1 - row.distance, // Convert distance to similarity score
    }));
  }

  findSimilar(
    memoryId: string,
    limit = 10,
  ): VectorSearchResult[] {
    const vectorDb = db.getVectorDb();

    // Get the embedding for the given memory
    const row = vectorDb
      .prepare(
        `SELECT embedding FROM ${this.tableName} WHERE memory_id = ?`,
      )
      .get(memoryId) as { embedding: ArrayBuffer } | undefined;

    if (!row || !row.embedding) {
      return [];
    }

    // Search for similar memories, excluding the original
    const embedding = Array.from(new Float32Array(row.embedding));
    const results = this.search({ embedding, limit: limit + 1 });

    return results.filter((r) => r.memory_id !== memoryId).slice(0, limit);
  }
}

export const vectorStore = new VectorStore();

// Hybrid search combining semantic and keyword search
export function hybridScore(
  semanticDistance: number,
  keywordMatches: number,
  maxDistance: number,
  maxMatches: number,
  weight = 0.7, // 70% semantic, 30% keyword
): number {
  // Convert distance to similarity (0-1, higher = better)
  const semanticScore = 1 - semanticDistance / maxDistance;

  // Normalize keyword matches (0-1)
  const keywordScore = maxMatches > 0 ? keywordMatches / maxMatches : 0;

  // Weighted combination
  return semanticScore * weight + keywordScore * (1 - weight);
}
