export type MemoryType = "decision" | "solution" | "pattern" | "architecture" | "note";

export interface Memory {
  id: string;
  title: string;
  type: MemoryType;
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
  type?: MemoryType;
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

export interface CreateMemoryInput {
  id: string;
  title: string;
  type: MemoryType;
  content: string;
  summary?: string | null;
  importance?: number;
  tags?: string[];
  related_files?: string[];
}

export interface UpdateMemoryInput {
  title?: string;
  type?: MemoryType;
  content?: string;
  summary?: string | null;
  importance?: number;
  tags?: string[];
  related_files?: string[];
  needs_review?: boolean;
}
