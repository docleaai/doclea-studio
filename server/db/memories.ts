import { db, withRetry } from "./connection";
import { NotFoundError } from "../middleware/error-handler";

export interface Memory {
  id: string;
  title: string;
  type: "decision" | "solution" | "pattern" | "architecture" | "note";
  content: string;
  summary: string | null;
  importance: number;
  tags: string[];
  related_files: string[];
  created_at: string;
  accessed_at: string;
  access_count: number;
  needs_review: boolean;
}

export interface MemoryListParams {
  type?: Memory["type"];
  tags?: string[];
  sort?: "created" | "accessed" | "importance" | "title";
  order?: "asc" | "desc";
  cursor?: string;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

interface CursorData {
  sortValue: string | number;
  id: string;
}

function encodeCursor(data: CursorData): string {
  return Buffer.from(JSON.stringify(data)).toString("base64url");
}

function decodeCursor(cursor: string): CursorData {
  return JSON.parse(Buffer.from(cursor, "base64url").toString());
}

export class MemoryRepository {
  list(params: MemoryListParams = {}): PaginatedResult<Memory> {
    const {
      type,
      tags,
      sort = "created",
      order = "desc",
      cursor,
      limit = 50,
    } = params;

    const sortColumn = {
      created: "created_at",
      accessed: "accessed_at",
      importance: "importance",
      title: "title",
    }[sort];

    const orderDir = order.toUpperCase();
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (type) {
      conditions.push("type = ?");
      values.push(type);
    }

    if (tags && tags.length > 0) {
      // Match any tag using JSON array
      const tagConditions = tags.map(() => "tags LIKE ?");
      conditions.push(`(${tagConditions.join(" OR ")})`);
      tags.forEach((tag) => values.push(`%"${tag}"%`));
    }

    if (cursor) {
      try {
        const { sortValue, id } = decodeCursor(cursor);
        const op = order === "desc" ? "<" : ">";
        conditions.push(
          `(${sortColumn} ${op} ? OR (${sortColumn} = ? AND id ${op} ?))`,
        );
        values.push(sortValue, sortValue, id);
      } catch {
        // Invalid cursor, ignore
      }
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT
        id, title, type, content, summary, importance,
        tags, related_files, created_at, accessed_at,
        access_count, needs_review
      FROM memories
      ${whereClause}
      ORDER BY ${sortColumn} ${orderDir}, id ${orderDir}
      LIMIT ?
    `;

    values.push(limit + 1);

    const localDb = db.getLocalDb();
    const rows = localDb.prepare(query).all(...values) as Array<{
      id: string;
      title: string;
      type: Memory["type"];
      content: string;
      summary: string | null;
      importance: number;
      tags: string;
      related_files: string;
      created_at: number;
      accessed_at: number;
      access_count: number;
      needs_review: number;
    }>;

    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit).map((row) => ({
      ...row,
      tags: JSON.parse(row.tags || "[]"),
      related_files: JSON.parse(row.related_files || "[]"),
      // Convert unixepoch to ISO string
      created_at: new Date(row.created_at * 1000).toISOString(),
      accessed_at: new Date(row.accessed_at * 1000).toISOString(),
      needs_review: Boolean(row.needs_review),
    }));

    let nextCursor: string | undefined;
    if (hasMore && data.length > 0) {
      const lastItem = data.at(-1);
      if (lastItem) {
        const sortValue =
          sort === "created"
            ? lastItem.created_at
            : sort === "accessed"
              ? lastItem.accessed_at
              : sort === "importance"
                ? lastItem.importance
                : lastItem.title;
        nextCursor = encodeCursor({ sortValue, id: lastItem.id });
      }
    }

    return { data, nextCursor, hasMore };
  }

  getById(id: string): Memory {
    const localDb = db.getLocalDb();
    const row = localDb
      .prepare(
        `
      SELECT
        id, title, type, content, summary, importance,
        tags, related_files, created_at, accessed_at,
        access_count, needs_review
      FROM memories
      WHERE id = ?
    `,
      )
      .get(id) as
      | {
          id: string;
          title: string;
          type: Memory["type"];
          content: string;
          summary: string | null;
          importance: number;
          tags: string;
          related_files: string;
          created_at: number;
          accessed_at: number;
          access_count: number;
          needs_review: number;
        }
      | undefined;

    if (!row) {
      throw new NotFoundError(`Memory with id '${id}' not found`);
    }

    // Update access timestamp
    withRetry(() =>
      localDb
        .prepare(
          `
        UPDATE memories
        SET accessed_at = unixepoch(), access_count = access_count + 1
        WHERE id = ?
      `,
        )
        .run(id),
    );

    return {
      ...row,
      tags: JSON.parse(row.tags || "[]"),
      related_files: JSON.parse(row.related_files || "[]"),
      created_at: new Date(row.created_at * 1000).toISOString(),
      accessed_at: new Date(row.accessed_at * 1000).toISOString(),
      needs_review: Boolean(row.needs_review),
    };
  }

  create(data: Omit<Memory, "created_at" | "accessed_at" | "access_count" | "needs_review">): Memory {
    const localDb = db.getLocalDb();

    withRetry(() =>
      localDb
        .prepare(
          `
        INSERT INTO memories (
          id, title, type, content, summary, importance,
          tags, related_files, created_at, accessed_at,
          access_count, needs_review
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, unixepoch(), unixepoch(), 0, 0)
      `,
        )
        .run(
          data.id,
          data.title,
          data.type,
          data.content,
          data.summary,
          data.importance,
          JSON.stringify(data.tags),
          JSON.stringify(data.related_files),
        ),
    );

    return this.getById(data.id);
  }

  update(id: string, data: Partial<Omit<Memory, "id" | "created_at" | "accessed_at" | "access_count">>): Memory {
    const existing = this.getById(id); // Throws if not found
    const localDb = db.getLocalDb();

    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.title !== undefined) {
      updates.push("title = ?");
      values.push(data.title);
    }
    if (data.type !== undefined) {
      updates.push("type = ?");
      values.push(data.type);
    }
    if (data.content !== undefined) {
      updates.push("content = ?");
      values.push(data.content);
    }
    if (data.summary !== undefined) {
      updates.push("summary = ?");
      values.push(data.summary);
    }
    if (data.importance !== undefined) {
      updates.push("importance = ?");
      values.push(data.importance);
    }
    if (data.tags !== undefined) {
      updates.push("tags = ?");
      values.push(JSON.stringify(data.tags));
    }
    if (data.related_files !== undefined) {
      updates.push("related_files = ?");
      values.push(JSON.stringify(data.related_files));
    }
    if (data.needs_review !== undefined) {
      updates.push("needs_review = ?");
      values.push(data.needs_review ? 1 : 0);
    }

    if (updates.length === 0) {
      return existing;
    }

    values.push(id);

    withRetry(() =>
      localDb
        .prepare(`UPDATE memories SET ${updates.join(", ")} WHERE id = ?`)
        .run(...values),
    );

    return this.getById(id);
  }

  delete(id: string): void {
    this.getById(id); // Throws if not found
    const localDb = db.getLocalDb();

    withRetry(() =>
      localDb.prepare("DELETE FROM memories WHERE id = ?").run(id),
    );
  }
}

export const memoryRepository = new MemoryRepository();
