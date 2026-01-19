import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getDb } from "../db/connection";

const app = new Hono();

// Types
interface CodeNode {
  id: string;
  type: string;
  name: string;
  file_path: string;
  start_line: number | null;
  end_line: number | null;
  signature: string | null;
  summary: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface CodeEdge {
  id: string;
  from_node: string;
  to_node: string;
  edge_type: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// Helper to parse JSON metadata
function parseMetadata(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Helper to convert unix timestamp to ISO string
function toISOString(timestamp: number | null): string {
  if (!timestamp) return new Date().toISOString();
  return new Date(timestamp * 1000).toISOString();
}

// Helper to transform row to CodeNode
function rowToCodeNode(row: {
  id: string;
  type: string;
  name: string;
  file_path: string;
  start_line: number | null;
  end_line: number | null;
  signature: string | null;
  summary: string | null;
  metadata: string | null;
  created_at: number;
  updated_at: number;
}): CodeNode {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    file_path: row.file_path,
    start_line: row.start_line,
    end_line: row.end_line,
    signature: row.signature,
    summary: row.summary,
    metadata: parseMetadata(row.metadata),
    created_at: toISOString(row.created_at),
    updated_at: toISOString(row.updated_at),
  };
}

// GET /code/nodes - List code nodes with filtering
const listNodesQuerySchema = z.object({
  type: z.enum(["function", "class", "interface", "type", "module", "package"]).optional(),
  file: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
});

app.get("/nodes", zValidator("query", listNodesQuerySchema), (c) => {
  const { type, file, search, limit, offset } = c.req.valid("query");
  const localDb = getDb("local");

  let sql = `SELECT * FROM code_nodes WHERE 1=1`;
  const params: (string | number)[] = [];

  if (type) {
    sql += ` AND type = ?`;
    params.push(type);
  }

  if (file) {
    sql += ` AND file_path LIKE ?`;
    params.push(`%${file}%`);
  }

  if (search) {
    sql += ` AND (name LIKE ? OR signature LIKE ? OR summary LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  // Count total
  const countSql = sql.replace("SELECT *", "SELECT COUNT(*) as count");
  const countRow = localDb.prepare(countSql).get(...params) as { count: number };

  // Add pagination
  sql += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const rows = localDb.prepare(sql).all(...params) as Array<{
    id: string;
    type: string;
    name: string;
    file_path: string;
    start_line: number | null;
    end_line: number | null;
    signature: string | null;
    summary: string | null;
    metadata: string | null;
    created_at: number;
    updated_at: number;
  }>;

  return c.json({
    nodes: rows.map(rowToCodeNode),
    total: countRow.count,
    limit,
    offset,
  });
});

// GET /code/node - Get node details (using query param for complex IDs)
const getNodeQuerySchema = z.object({
  id: z.string(),
});

app.get("/node", zValidator("query", getNodeQuerySchema), (c) => {
  const { id } = c.req.valid("query");
  const localDb = getDb("local");

  const row = localDb.prepare(`SELECT * FROM code_nodes WHERE id = ?`).get(id) as {
    id: string;
    type: string;
    name: string;
    file_path: string;
    start_line: number | null;
    end_line: number | null;
    signature: string | null;
    summary: string | null;
    metadata: string | null;
    created_at: number;
    updated_at: number;
  } | undefined;

  if (!row) {
    return c.json({ error: "Code node not found" }, 404);
  }

  return c.json(rowToCodeNode(row));
});

// GET /code/call-graph - Get call graph for a node (using query params)
const callGraphQuerySchema = z.object({
  nodeId: z.string(),
  depth: z.coerce.number().min(1).max(5).optional().default(2),
  direction: z.enum(["outgoing", "incoming", "both"]).optional().default("both"),
});

app.get("/call-graph", zValidator("query", callGraphQuerySchema), (c) => {
  const { nodeId, depth, direction } = c.req.valid("query");
  const localDb = getDb("local");

  // Verify node exists
  const nodeExists = localDb.prepare(`SELECT id FROM code_nodes WHERE id = ?`).get(nodeId);
  if (!nodeExists) {
    return c.json({ error: "Code node not found" }, 404);
  }

  const visitedNodes = new Set<string>();
  const visitedEdges = new Set<string>();
  const nodes: CodeNode[] = [];
  const edges: CodeEdge[] = [];

  // BFS traversal
  const queue: Array<{ id: string; currentDepth: number }> = [{ id: nodeId, currentDepth: 0 }];

  while (queue.length > 0) {
    const { id, currentDepth } = queue.shift()!;

    if (visitedNodes.has(id)) continue;
    visitedNodes.add(id);

    // Get node
    const nodeRow = localDb.prepare(`SELECT * FROM code_nodes WHERE id = ?`).get(id) as {
      id: string;
      type: string;
      name: string;
      file_path: string;
      start_line: number | null;
      end_line: number | null;
      signature: string | null;
      summary: string | null;
      metadata: string | null;
      created_at: number;
      updated_at: number;
    } | undefined;

    if (nodeRow) {
      nodes.push(rowToCodeNode(nodeRow));
    }

    if (currentDepth >= depth) continue;

    // Get edges based on direction
    let edgeRows: Array<{
      id: string;
      from_node: string;
      to_node: string;
      edge_type: string;
      metadata: string | null;
      created_at: number;
    }> = [];

    if (direction === "outgoing" || direction === "both") {
      const outgoing = localDb
        .prepare(`SELECT * FROM code_edges WHERE from_node = ? AND edge_type = 'calls'`)
        .all(id) as typeof edgeRows;
      edgeRows.push(...outgoing);
    }

    if (direction === "incoming" || direction === "both") {
      const incoming = localDb
        .prepare(`SELECT * FROM code_edges WHERE to_node = ? AND edge_type = 'calls'`)
        .all(id) as typeof edgeRows;
      edgeRows.push(...incoming);
    }

    for (const edgeRow of edgeRows) {
      if (!visitedEdges.has(edgeRow.id)) {
        visitedEdges.add(edgeRow.id);
        edges.push({
          id: edgeRow.id,
          from_node: edgeRow.from_node,
          to_node: edgeRow.to_node,
          edge_type: edgeRow.edge_type,
          metadata: parseMetadata(edgeRow.metadata),
          created_at: toISOString(edgeRow.created_at),
        });
      }

      const nextId = edgeRow.from_node === id ? edgeRow.to_node : edgeRow.from_node;
      if (!visitedNodes.has(nextId)) {
        queue.push({ id: nextId, currentDepth: currentDepth + 1 });
      }
    }
  }

  return c.json({
    nodes,
    edges,
    rootId: nodeId,
  });
});

// GET /code/dependency-tree - Get dependency tree (using query params)
const depTreeQuerySchema = z.object({
  moduleId: z.string(),
  depth: z.coerce.number().min(1).max(10).optional().default(3),
  direction: z.enum(["imports", "importedBy", "both"]).optional().default("both"),
});

app.get("/dependency-tree", zValidator("query", depTreeQuerySchema), (c) => {
  const { moduleId, depth, direction } = c.req.valid("query");
  const localDb = getDb("local");

  // Verify module exists
  const moduleExists = localDb.prepare(`SELECT id FROM code_nodes WHERE id = ?`).get(moduleId);
  if (!moduleExists) {
    return c.json({ error: "Module not found" }, 404);
  }

  const visitedNodes = new Set<string>();
  const visitedEdges = new Set<string>();
  const nodes: CodeNode[] = [];
  const edges: CodeEdge[] = [];

  const queue: Array<{ id: string; currentDepth: number }> = [{ id: moduleId, currentDepth: 0 }];

  while (queue.length > 0) {
    const { id, currentDepth } = queue.shift()!;

    if (visitedNodes.has(id)) continue;
    visitedNodes.add(id);

    const nodeRow = localDb.prepare(`SELECT * FROM code_nodes WHERE id = ?`).get(id) as {
      id: string;
      type: string;
      name: string;
      file_path: string;
      start_line: number | null;
      end_line: number | null;
      signature: string | null;
      summary: string | null;
      metadata: string | null;
      created_at: number;
      updated_at: number;
    } | undefined;

    if (nodeRow) {
      nodes.push(rowToCodeNode(nodeRow));
    }

    if (currentDepth >= depth) continue;

    let edgeRows: Array<{
      id: string;
      from_node: string;
      to_node: string;
      edge_type: string;
      metadata: string | null;
      created_at: number;
    }> = [];

    // "imports" = what this module imports
    if (direction === "imports" || direction === "both") {
      const imports = localDb
        .prepare(`SELECT * FROM code_edges WHERE from_node = ? AND edge_type = 'imports'`)
        .all(id) as typeof edgeRows;
      edgeRows.push(...imports);
    }

    // "importedBy" = what imports this module
    if (direction === "importedBy" || direction === "both") {
      const importedBy = localDb
        .prepare(`SELECT * FROM code_edges WHERE to_node = ? AND edge_type = 'imports'`)
        .all(id) as typeof edgeRows;
      edgeRows.push(...importedBy);
    }

    for (const edgeRow of edgeRows) {
      if (!visitedEdges.has(edgeRow.id)) {
        visitedEdges.add(edgeRow.id);
        edges.push({
          id: edgeRow.id,
          from_node: edgeRow.from_node,
          to_node: edgeRow.to_node,
          edge_type: edgeRow.edge_type,
          metadata: parseMetadata(edgeRow.metadata),
          created_at: toISOString(edgeRow.created_at),
        });
      }

      const nextId = edgeRow.from_node === id ? edgeRow.to_node : edgeRow.from_node;
      if (!visitedNodes.has(nextId)) {
        queue.push({ id: nextId, currentDepth: currentDepth + 1 });
      }
    }
  }

  return c.json({
    nodes,
    edges,
    rootId: moduleId,
  });
});

// GET /code/cross-layer - Get code nodes related to a memory (using query param)
const crossLayerQuerySchema = z.object({
  memoryId: z.string(),
});

app.get("/cross-layer", zValidator("query", crossLayerQuerySchema), (c) => {
  const { memoryId } = c.req.valid("query");
  const localDb = getDb("local");

  // Get cross-layer relations
  const relations = localDb
    .prepare(
      `SELECT clr.*, cn.name as code_name, cn.type as code_type, cn.file_path, cn.signature
       FROM cross_layer_relations clr
       JOIN code_nodes cn ON clr.code_node_id = cn.id
       WHERE clr.memory_id = ?
       ORDER BY clr.confidence DESC`
    )
    .all(memoryId) as Array<{
      id: string;
      memory_id: string;
      code_node_id: string;
      relation_type: string;
      direction: string;
      confidence: number;
      metadata: string | null;
      created_at: number;
      code_name: string;
      code_type: string;
      file_path: string;
      signature: string | null;
    }>;

  return c.json({
    memoryId,
    relations: relations.map((r) => ({
      id: r.id,
      codeNodeId: r.code_node_id,
      codeName: r.code_name,
      codeType: r.code_type,
      filePath: r.file_path,
      signature: r.signature,
      relationType: r.relation_type,
      direction: r.direction,
      confidence: r.confidence,
      metadata: parseMetadata(r.metadata),
      createdAt: toISOString(r.created_at),
    })),
  });
});

// GET /code/memories - Get memories related to a code node (using query param)
const memoriesQuerySchema = z.object({
  codeNodeId: z.string(),
});

app.get("/memories", zValidator("query", memoriesQuerySchema), (c) => {
  const { codeNodeId } = c.req.valid("query");
  const localDb = getDb("local");

  const relations = localDb
    .prepare(
      `SELECT clr.*, m.title as memory_title, m.type as memory_type, m.summary as memory_summary
       FROM cross_layer_relations clr
       JOIN memories m ON clr.memory_id = m.id
       WHERE clr.code_node_id = ?
       ORDER BY clr.confidence DESC`
    )
    .all(codeNodeId) as Array<{
      id: string;
      memory_id: string;
      code_node_id: string;
      relation_type: string;
      direction: string;
      confidence: number;
      metadata: string | null;
      created_at: number;
      memory_title: string;
      memory_type: string;
      memory_summary: string | null;
    }>;

  return c.json({
    codeNodeId,
    relations: relations.map((r) => ({
      id: r.id,
      memoryId: r.memory_id,
      memoryTitle: r.memory_title,
      memoryType: r.memory_type,
      memorySummary: r.memory_summary,
      relationType: r.relation_type,
      direction: r.direction,
      confidence: r.confidence,
      metadata: parseMetadata(r.metadata),
      createdAt: toISOString(r.created_at),
    })),
  });
});

// GET /code/stats - Get code graph statistics
app.get("/stats", (c) => {
  const localDb = getDb("local");

  // Count by node type
  const typeCounts = localDb
    .prepare(`SELECT type, COUNT(*) as count FROM code_nodes GROUP BY type`)
    .all() as Array<{ type: string; count: number }>;

  // Count by edge type
  const edgeCounts = localDb
    .prepare(`SELECT edge_type, COUNT(*) as count FROM code_edges GROUP BY edge_type`)
    .all() as Array<{ edge_type: string; count: number }>;

  // Total counts
  const totalNodes = localDb.prepare(`SELECT COUNT(*) as count FROM code_nodes`).get() as { count: number };
  const totalEdges = localDb.prepare(`SELECT COUNT(*) as count FROM code_edges`).get() as { count: number };
  const totalCrossLayer = localDb.prepare(`SELECT COUNT(*) as count FROM cross_layer_relations`).get() as {
    count: number;
  };

  return c.json({
    totalNodes: totalNodes.count,
    totalEdges: totalEdges.count,
    totalCrossLayerRelations: totalCrossLayer.count,
    nodesByType: Object.fromEntries(typeCounts.map((t) => [t.type, t.count])),
    edgesByType: Object.fromEntries(edgeCounts.map((e) => [e.edge_type, e.count])),
  });
});

export { app as codeApi };
