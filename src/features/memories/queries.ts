import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listMemories,
  getMemory,
  createMemory,
  updateMemory,
  deleteMemory,
} from "./api";
import type { MemoryListParams, CreateMemoryInput, UpdateMemoryInput } from "./types";

// Query key factory for consistent cache management
export const memoryKeys = {
  all: ["memories"] as const,
  lists: () => [...memoryKeys.all, "list"] as const,
  list: (params: MemoryListParams) => [...memoryKeys.lists(), params] as const,
  details: () => [...memoryKeys.all, "detail"] as const,
  detail: (id: string) => [...memoryKeys.details(), id] as const,
};

// List memories with filtering and pagination
export function useMemories(params: MemoryListParams = {}) {
  return useQuery({
    queryKey: memoryKeys.list(params),
    queryFn: () => listMemories(params),
  });
}

// Get single memory by ID
export function useMemory(id: string) {
  return useQuery({
    queryKey: memoryKeys.detail(id),
    queryFn: () => getMemory(id),
    enabled: !!id,
  });
}

// Create memory mutation
export function useCreateMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMemoryInput) => createMemory(data),
    onSuccess: () => {
      // Invalidate all lists to refetch
      queryClient.invalidateQueries({ queryKey: memoryKeys.lists() });
    },
  });
}

// Update memory mutation
export function useUpdateMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemoryInput }) =>
      updateMemory(id, data),
    onSuccess: (updatedMemory) => {
      // Update the detail cache
      queryClient.setQueryData(
        memoryKeys.detail(updatedMemory.id),
        updatedMemory,
      );
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: memoryKeys.lists() });
    },
  });
}

// Delete memory mutation
export function useDeleteMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMemory(id),
    onSuccess: (_, id) => {
      // Remove from detail cache
      queryClient.removeQueries({ queryKey: memoryKeys.detail(id) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: memoryKeys.lists() });
    },
  });
}
