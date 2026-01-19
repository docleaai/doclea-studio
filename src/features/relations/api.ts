import { api } from "@/lib/api-client";
import type {
  MemoryRelations,
  GraphData,
  CreateRelationInput,
  RelationSuggestion,
} from "./types";

export async function getRelations(memoryId: string): Promise<MemoryRelations> {
  return api.get<MemoryRelations>(`/relations/${memoryId}`);
}

export async function getGraph(memoryId: string, depth = 2): Promise<GraphData> {
  return api.get<GraphData>(`/relations/graph/${memoryId}`, {
    params: { depth },
  });
}

export async function createRelation(data: CreateRelationInput): Promise<{ id: string }> {
  return api.post<{ id: string }>("/relations", data);
}

export async function updateRelation(
  id: string,
  data: { weight?: number; metadata?: Record<string, unknown> },
): Promise<void> {
  return api.patch<void>(`/relations/${id}`, data);
}

export async function deleteRelation(id: string): Promise<void> {
  return api.delete<void>(`/relations/${id}`);
}

export async function getSuggestions(
  status = "pending",
): Promise<{ suggestions: RelationSuggestion[] }> {
  return api.get<{ suggestions: RelationSuggestion[] }>("/relations/suggestions", {
    params: { status },
  });
}

export async function approveSuggestion(id: string): Promise<{ relationId: string }> {
  return api.post<{ relationId: string }>(`/relations/suggestions/${id}/approve`);
}

export async function rejectSuggestion(id: string): Promise<void> {
  return api.post<void>(`/relations/suggestions/${id}/reject`);
}
