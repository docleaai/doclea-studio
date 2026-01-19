import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRelations,
  getGraph,
  createRelation,
  updateRelation,
  deleteRelation,
  getSuggestions,
  approveSuggestion,
  rejectSuggestion,
} from "./api";
import type { CreateRelationInput } from "./types";

export const relationKeys = {
  all: ["relations"] as const,
  memory: (id: string) => [...relationKeys.all, "memory", id] as const,
  graph: (id: string, depth: number) => [...relationKeys.all, "graph", id, depth] as const,
  suggestions: (status: string) => [...relationKeys.all, "suggestions", status] as const,
};

export function useRelations(memoryId: string) {
  return useQuery({
    queryKey: relationKeys.memory(memoryId),
    queryFn: () => getRelations(memoryId),
    enabled: !!memoryId,
  });
}

export function useGraph(memoryId: string, depth = 2) {
  return useQuery({
    queryKey: relationKeys.graph(memoryId, depth),
    queryFn: () => getGraph(memoryId, depth),
    enabled: !!memoryId,
  });
}

export function useSuggestions(status = "pending") {
  return useQuery({
    queryKey: relationKeys.suggestions(status),
    queryFn: () => getSuggestions(status),
  });
}

export function useCreateRelation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRelationInput) => createRelation(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: relationKeys.memory(variables.sourceId) });
      queryClient.invalidateQueries({ queryKey: relationKeys.memory(variables.targetId) });
      queryClient.invalidateQueries({ queryKey: relationKeys.all });
    },
  });
}

export function useUpdateRelation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { weight?: number; metadata?: Record<string, unknown> } }) =>
      updateRelation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: relationKeys.all });
    },
  });
}

export function useDeleteRelation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRelation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: relationKeys.all });
    },
  });
}

export function useApproveSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveSuggestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: relationKeys.suggestions("pending") });
      queryClient.invalidateQueries({ queryKey: relationKeys.all });
    },
  });
}

export function useRejectSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rejectSuggestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: relationKeys.suggestions("pending") });
    },
  });
}
