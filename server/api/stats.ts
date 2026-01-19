import { Hono } from "hono";
import { db } from "../db/connection";

const app = new Hono();

interface MemoryStats {
  total: number;
  byType: Record<string, number>;
  recentCount: number;
  staleCount: number;
  avgImportance: number;
  topTags: Array<{ tag: string; count: number }>;
}

// GET /stats - Dashboard statistics
app.get("/", (c) => {
  const localDb = db.getLocalDb();

  // Total count
  const totalRow = localDb.prepare("SELECT COUNT(*) as count FROM memories").get() as {
    count: number;
  };

  // Count by type
  const typeRows = localDb
    .prepare(
      `
    SELECT type, COUNT(*) as count
    FROM memories
    GROUP BY type
  `,
    )
    .all() as Array<{ type: string; count: number }>;

  const byType: Record<string, number> = {};
  for (const row of typeRows) {
    byType[row.type] = row.count;
  }

  // Recent count (last 7 days) - created_at is unixepoch integer
  const recentRow = localDb
    .prepare(
      `
    SELECT COUNT(*) as count
    FROM memories
    WHERE created_at >= unixepoch('now', '-7 days')
  `,
    )
    .get() as { count: number };

  // Stale count (not accessed in 30 days) - accessed_at is unixepoch integer
  const staleRow = localDb
    .prepare(
      `
    SELECT COUNT(*) as count
    FROM memories
    WHERE accessed_at < unixepoch('now', '-30 days')
  `,
    )
    .get() as { count: number };

  // Averages
  const avgRow = localDb
    .prepare(
      `
    SELECT
      AVG(importance) as avgImportance
    FROM memories
  `,
    )
    .get() as { avgImportance: number | null };

  // Top tags
  const tagRows = localDb
    .prepare(
      `
    SELECT value as tag, COUNT(*) as count
    FROM memories, json_each(tags)
    GROUP BY value
    ORDER BY count DESC
    LIMIT 10
  `,
    )
    .all() as Array<{ tag: string; count: number }>;

  const stats: MemoryStats = {
    total: totalRow.count,
    byType,
    recentCount: recentRow.count,
    staleCount: staleRow.count,
    avgImportance: avgRow.avgImportance ?? 0,
    topTags: tagRows,
  };

  return c.json(stats);
});

// GET /stats/recent - Recent memories
app.get("/recent", (c) => {
  const localDb = db.getLocalDb();

  const rows = localDb
    .prepare(
      `
    SELECT
      id, title, type, summary, importance, tags, created_at
    FROM memories
    ORDER BY created_at DESC
    LIMIT 10
  `,
    )
    .all() as Array<{
    id: string;
    title: string;
    type: string;
    summary: string | null;
    importance: number;
    tags: string;
    created_at: number;
  }>;

  const memories = rows.map((row) => ({
    ...row,
    tags: JSON.parse(row.tags || "[]"),
    // Convert unixepoch to ISO string
    created_at: new Date(row.created_at * 1000).toISOString(),
  }));

  return c.json({ memories });
});

export default app;
