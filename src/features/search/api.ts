import { api } from "@/lib/api-client";
import type { SearchParams, SearchResponse } from "./types";

export async function searchMemories(params: SearchParams): Promise<SearchResponse> {
  return api.post<SearchResponse>("/search", params);
}

export async function findSimilar(memoryId: string): Promise<{ results: unknown[] }> {
  return api.post<{ results: unknown[] }>(`/search/similar/${memoryId}`);
}
