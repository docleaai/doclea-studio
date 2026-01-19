import { useQuery } from "@tanstack/react-query";
import { searchMemories, searchWithEmbedding, findSimilar } from "./api";
import type { SearchParams } from "./types";

export const searchKeys = {
  all: ["search"] as const,
  query: (params: SearchParams) => [...searchKeys.all, params] as const,
  similar: (memoryId: string) => [...searchKeys.all, "similar", memoryId] as const,
};

export function useSearch(params: SearchParams & { useSemanticSearch?: boolean }) {
  const { useSemanticSearch = true, ...searchParams } = params;

  return useQuery({
    queryKey: searchKeys.query(params),
    queryFn: () =>
      useSemanticSearch
        ? searchWithEmbedding(searchParams)
        : searchMemories(searchParams),
    enabled: params.query.length > 0,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useSimilarMemories(memoryId: string) {
  return useQuery({
    queryKey: searchKeys.similar(memoryId),
    queryFn: () => findSimilar(memoryId),
    enabled: !!memoryId,
  });
}
