import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db/connection";

const app = new Hono();

// Relation types
const relationTypes = ["references", "implements", "extends", "related_to", "supersedes", "requires"] as const;

const createRelationSchema = z.object({
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  type: z.enum(relationTypes),
  weight: z.number().min(0).max(1).default(1.0),
  metadata: z.record(z.unknown()).optional(),
});

const updateRelationSchema = z.object({
  weight: z.number().min(0).max(1).optional(),
  metadata: z.record(z.unknown()).optional(),
});

interface RelationRow {
  id: string;
  source_id: string;
  target_id: string;
  type: string;
  weight: number;
  metadata: string | null;
  created_at: number;
}

interface MemoryNode {
  id: string;
  title: string;
  type: string;
  importance: number;
  tags: string;
}

// GET /relations/:memoryId - Get all relations for a memory
app.get("/:memoryId", (c) => {
  const memoryId = c.req.param("memoryId");
  const localDb = db.getLocalDb();

  // Get outgoing relations
  const outgoing = localDb
    .prepare(
      `
    SELECT r.*, m.title as target_title, m.type as target_type
    FROM memory_relations r
    JOIN memories m ON m.id = r.target_id
    WHERE r.source_id = ?
    ORDER BY r.weight DESC
  `,
    )
    .all(memoryId) as Array<RelationRow & { target_title: string; target_type: string }>;

  // Get incoming relations
  const incoming = localDb
    .prepare(
      `
    SELECT r.*, m.title as source_title, m.type as source_type
    FROM memory_relations r
    JOIN memories m ON m.id = r.source_id
    WHERE r.target_id = ?
    ORDER BY r.weight DESC
  `,
    )
    .all(memoryId) as Array<RelationRow & { source_title: string; source_type: string }>;

  return c.json({
    outgoing: outgoing.map((r) => ({
      id: r.id,
      targetId: r.target_id,
      targetTitle: r.target_title,
      targetType: r.target_type,
      type: r.type,
      weight: r.weight,
      metadata: r.metadata ? JSON.parse(r.metadata) : null,
      createdAt: new Date(r.created_at * 1000).toISOString(),
    })),
    incoming: incoming.map((r) => ({
      id: r.id,
      sourceId: r.source_id,
      sourceTitle: r.source_title,
      sourceType: r.source_type,
      type: r.type,
      weight: r.weight,
      metadata: r.metadata ? JSON.parse(r.metadata) : null,
      createdAt: new Date(r.created_at * 1000).toISOString(),
    })),
  });
});

// GET /relations/graph/:memoryId - Get graph data for visualization (nodes + edges)
app.get("/graph/:memoryId", (c) => {
  const memoryId = c.req.param("memoryId");
  const depth = Number.parseInt(c.req.query("depth") || "2");
  const localDb = db.getLocalDb();

  const visited = new Set<string>();
  const nodes: Array<{ id: string; title: string; type: string; importance: number; tags: string[] }> = [];
  const edges: Array<{ id: string; source: string; target: string; type: string; weight: number }> = [];

  // BFS to collect nodes and edges
  const queue: Array<{ id: string; currentDepth: number }> = [{ id: memoryId, currentDepth: 0 }];

  while (queue.length > 0) {
    const { id, currentDepth } = queue.shift()!;

    if (visited.has(id) || currentDepth > depth) continue;
    visited.add(id);

    // Get node info
    const node = localDb
      .prepare("SELECT id, title, type, importance, tags FROM memories WHERE id = ?")
      .get(id) as MemoryNode | undefined;

    if (node) {
      nodes.push({
        id: node.id,
        title: node.title,
        type: node.type,
        importance: node.importance,
        tags: JSON.parse(node.tags || "[]"),
      });

      // Get relations
      const relations = localDb
        .prepare(
          `
        SELECT id, source_id, target_id, type, weight
        FROM memory_relations
        WHERE source_id = ? OR target_id = ?
      `,
        )
        .all(id, id) as Array<{ id: string; source_id: string; target_id: string; type: string; weight: number }>;

      for (const rel of relations) {
        // Add edge if not already added
        if (!edges.find((e) => e.id === rel.id)) {
          edges.push({
            id: rel.id,
            source: rel.source_id,
            target: rel.target_id,
            type: rel.type,
            weight: rel.weight,
          });
        }

        // Add connected nodes to queue
        const connectedId = rel.source_id === id ? rel.target_id : rel.source_id;
        if (!visited.has(connectedId) && currentDepth < depth) {
          queue.push({ id: connectedId, currentDepth: currentDepth + 1 });
        }
      }
    }
  }

  return c.json({ nodes, edges, rootId: memoryId });
});

// POST /relations - Create a new relation
app.post("/", zValidator("json", createRelationSchema), (c) => {
  const { sourceId, targetId, type, weight, metadata } = c.req.valid("json");
  const localDb = db.getLocalDb();

  const id = crypto.randomUUID();

  localDb
    .prepare(
      `
    INSERT INTO memory_relations (id, source_id, target_id, type, weight, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, unixepoch())
  `,
    )
    .run(id, sourceId, targetId, type, weight, metadata ? JSON.stringify(metadata) : null);

  return c.json({ id, sourceId, targetId, type, weight }, 201);
});

// PATCH /relations/:id - Update a relation
app.patch("/:id", zValidator("json", updateRelationSchema), (c) => {
  const id = c.req.param("id");
  const { weight, metadata } = c.req.valid("json");
  const localDb = db.getLocalDb();

  const updates: string[] = [];
  const values: unknown[] = [];

  if (weight !== undefined) {
    updates.push("weight = ?");
    values.push(weight);
  }
  if (metadata !== undefined) {
    updates.push("metadata = ?");
    values.push(JSON.stringify(metadata));
  }

  if (updates.length > 0) {
    values.push(id);
    localDb.prepare(`UPDATE memory_relations SET ${updates.join(", ")} WHERE id = ?`).run(...values);
  }

  return c.json({ success: true });
});

// DELETE /relations/:id - Delete a relation
app.delete("/:id", (c) => {
  const id = c.req.param("id");
  const localDb = db.getLocalDb();

  localDb.prepare("DELETE FROM memory_relations WHERE id = ?").run(id);

  return c.body(null, 204);
});

// GET /relations/suggestions - Get pending relation suggestions
app.get("/suggestions", (c) => {
  const localDb = db.getLocalDb();
  const status = c.req.query("status") || "pending";

  const suggestions = localDb
    .prepare(
      `
    SELECT
      s.*,
      sm.title as source_title, sm.type as source_type,
      tm.title as target_title, tm.type as target_type
    FROM relation_suggestions s
    JOIN memories sm ON sm.id = s.source_id
    JOIN memories tm ON tm.id = s.target_id
    WHERE s.status = ?
    ORDER BY s.confidence DESC
    LIMIT 50
  `,
    )
    .all(status) as Array<{
    id: string;
    source_id: string;
    target_id: string;
    suggested_type: string;
    confidence: number;
    reason: string;
    detection_method: string;
    status: string;
    created_at: number;
    source_title: string;
    source_type: string;
    target_title: string;
    target_type: string;
  }>;

  return c.json({
    suggestions: suggestions.map((s) => ({
      id: s.id,
      sourceId: s.source_id,
      sourceTitle: s.source_title,
      sourceType: s.source_type,
      targetId: s.target_id,
      targetTitle: s.target_title,
      targetType: s.target_type,
      suggestedType: s.suggested_type,
      confidence: s.confidence,
      reason: s.reason,
      detectionMethod: s.detection_method,
      status: s.status,
      createdAt: new Date(s.created_at * 1000).toISOString(),
    })),
  });
});

// POST /relations/suggestions/:id/approve - Approve a suggestion
app.post("/suggestions/:id/approve", (c) => {
  const id = c.req.param("id");
  const localDb = db.getLocalDb();

  // Get the suggestion
  const suggestion = localDb
    .prepare("SELECT * FROM relation_suggestions WHERE id = ?")
    .get(id) as { source_id: string; target_id: string; suggested_type: string } | undefined;

  if (!suggestion) {
    return c.json({ error: "Suggestion not found" }, 404);
  }

  // Create the relation
  const relationId = crypto.randomUUID();
  localDb
    .prepare(
      `
    INSERT INTO memory_relations (id, source_id, target_id, type, weight, created_at)
    VALUES (?, ?, ?, ?, 0.8, unixepoch())
  `,
    )
    .run(relationId, suggestion.source_id, suggestion.target_id, suggestion.suggested_type);

  // Update suggestion status
  localDb
    .prepare("UPDATE relation_suggestions SET status = 'approved', reviewed_at = unixepoch() WHERE id = ?")
    .run(id);

  return c.json({ relationId });
});

// POST /relations/suggestions/:id/reject - Reject a suggestion
app.post("/suggestions/:id/reject", (c) => {
  const id = c.req.param("id");
  const localDb = db.getLocalDb();

  localDb
    .prepare("UPDATE relation_suggestions SET status = 'rejected', reviewed_at = unixepoch() WHERE id = ?")
    .run(id);

  return c.json({ success: true });
});

export default app;
