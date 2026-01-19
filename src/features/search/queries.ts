import { useQuery } from "@tanstack/react-query";
import { searchMemories, findSimilar } from "./api";
import type { SearchParams } from "./types";

export const searchKeys = {
  all: ["search"] as const,
  query: (params: SearchParams) => [...searchKeys.all, params] as const,
  similar: (memoryId: string) => [...searchKeys.all, "similar", memoryId] as const,
};

export function useSearch(params: SearchParams) {
  return useQuery({
    queryKey: searchKeys.query(params),
    queryFn: () => searchMemories(params),
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
