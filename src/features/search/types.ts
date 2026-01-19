export interface SearchResult {
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

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  hybridWeight: number;
  totalMatches: number;
}

export interface SearchParams {
  query: string;
  embedding?: number[];
  type?: "decision" | "solution" | "pattern" | "architecture" | "note";
  limit?: number;
  hybridWeight?: number;
  minImportance?: number;
}
