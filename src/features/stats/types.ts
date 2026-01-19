export interface MemoryStats {
  total: number;
  byType: Record<string, number>;
  recentCount: number;
  staleCount: number;
  avgImportance: number;
  topTags: Array<{ tag: string; count: number }>;
}

export interface RecentMemory {
  id: string;
  title: string;
  type: string;
  summary: string | null;
  importance: number;
  tags: string[];
  created_at: string;
}
