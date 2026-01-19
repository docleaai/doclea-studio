import { useQuery } from "@tanstack/react-query";
import { getStats, getRecentMemories } from "./api";

export const statsKeys = {
  all: ["stats"] as const,
  overview: () => [...statsKeys.all, "overview"] as const,
  recent: () => [...statsKeys.all, "recent"] as const,
};

export function useStats() {
  return useQuery({
    queryKey: statsKeys.overview(),
    queryFn: getStats,
  });
}

export function useRecentMemories() {
  return useQuery({
    queryKey: statsKeys.recent(),
    queryFn: getRecentMemories,
    select: (data) => data.memories,
  });
}
