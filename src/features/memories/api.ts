import { api } from "@/lib/api-client";
import type {
  Memory,
  MemoryListParams,
  PaginatedResult,
  CreateMemoryInput,
  UpdateMemoryInput,
} from "./types";

export async function listMemories(
  params: MemoryListParams = {},
): Promise<PaginatedResult<Memory>> {
  const { tags, ...rest } = params;
  return api.get<PaginatedResult<Memory>>("/memories", {
    params: {
      ...rest,
      tags: tags?.join(","),
    },
  });
}

export async function getMemory(id: string): Promise<Memory> {
  return api.get<Memory>(`/memories/${id}`);
}

export async function createMemory(data: CreateMemoryInput): Promise<Memory> {
  return api.post<Memory>("/memories", data);
}

export async function updateMemory(
  id: string,
  data: UpdateMemoryInput,
): Promise<Memory> {
  return api.patch<Memory>(`/memories/${id}`, data);
}

export async function deleteMemory(id: string): Promise<void> {
  return api.delete<void>(`/memories/${id}`);
}
