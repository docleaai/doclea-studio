import { api } from "@/lib/api-client";
import type { SearchParams, SearchResponse } from "./types";

interface EmbedResponse {
  embedding: number[];
  dimensions: number;
  model: string;
}

export async function embedText(text: string): Promise<EmbedResponse> {
  return api.post<EmbedResponse>("/embed", { text });
}

export async function searchMemories(params: SearchParams): Promise<SearchResponse> {
  return api.post<SearchResponse>("/search", params);
}

export async function searchWithEmbedding(params: Omit<SearchParams, "embedding">): Promise<SearchResponse> {
  // First generate embedding for the query
  const { embedding } = await embedText(params.query);

  // Then search with the embedding
  return api.post<SearchResponse>("/search", {
    ...params,
    embedding,
  });
}

export async function findSimilar(memoryId: string): Promise<{ results: unknown[] }> {
  return api.post<{ results: unknown[] }>(`/search/similar/${memoryId}`);
}
