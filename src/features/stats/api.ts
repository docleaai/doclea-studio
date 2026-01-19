import { api } from "@/lib/api-client";
import type { MemoryStats, RecentMemory } from "./types";

export async function getStats(): Promise<MemoryStats> {
  return api.get<MemoryStats>("/stats");
}

export async function getRecentMemories(): Promise<{ memories: RecentMemory[] }> {
  return api.get<{ memories: RecentMemory[] }>("/stats/recent");
}
