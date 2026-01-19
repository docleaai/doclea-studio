import { useQuery } from "@tanstack/react-query";
import {
  getCodeNodes,
  getCodeNode,
  getCallGraph,
  getDependencyTree,
  getCodeForMemory,
  getMemoriesForCode,
  getCodeStats,
} from "./api";
import type { CodeNodesListParams } from "./types";

export const codeKeys = {
  all: ["code"] as const,
  nodes: () => [...codeKeys.all, "nodes"] as const,
  nodesList: (params: CodeNodesListParams) => [...codeKeys.nodes(), params] as const,
  node: (id: string) => [...codeKeys.nodes(), id] as const,
  callGraph: (nodeId: string, depth: number, direction: string) =>
    [...codeKeys.all, "call-graph", nodeId, depth, direction] as const,
  dependencyTree: (moduleId: string, depth: number, direction: string) =>
    [...codeKeys.all, "dependency-tree", moduleId, depth, direction] as const,
  crossLayer: (memoryId: string) => [...codeKeys.all, "cross-layer", memoryId] as const,
  memories: (codeNodeId: string) => [...codeKeys.all, "memories", codeNodeId] as const,
  stats: () => [...codeKeys.all, "stats"] as const,
};

export function useCodeNodes(params: CodeNodesListParams = {}) {
  return useQuery({
    queryKey: codeKeys.nodesList(params),
    queryFn: () => getCodeNodes(params),
  });
}

export function useCodeNode(id: string) {
  return useQuery({
    queryKey: codeKeys.node(id),
    queryFn: () => getCodeNode(id),
    enabled: !!id,
  });
}

export function useCallGraph(
  nodeId: string,
  options: { depth?: number; direction?: "outgoing" | "incoming" | "both" } = {}
) {
  const depth = options.depth ?? 2;
  const direction = options.direction ?? "both";

  return useQuery({
    queryKey: codeKeys.callGraph(nodeId, depth, direction),
    queryFn: () => getCallGraph(nodeId, { depth, direction }),
    enabled: !!nodeId,
  });
}

export function useDependencyTree(
  moduleId: string,
  options: { depth?: number; direction?: "imports" | "importedBy" | "both" } = {}
) {
  const depth = options.depth ?? 3;
  const direction = options.direction ?? "both";

  return useQuery({
    queryKey: codeKeys.dependencyTree(moduleId, depth, direction),
    queryFn: () => getDependencyTree(moduleId, { depth, direction }),
    enabled: !!moduleId,
  });
}

export function useCodeForMemory(memoryId: string) {
  return useQuery({
    queryKey: codeKeys.crossLayer(memoryId),
    queryFn: () => getCodeForMemory(memoryId),
    enabled: !!memoryId,
  });
}

export function useMemoriesForCode(codeNodeId: string) {
  return useQuery({
    queryKey: codeKeys.memories(codeNodeId),
    queryFn: () => getMemoriesForCode(codeNodeId),
    enabled: !!codeNodeId,
  });
}

export function useCodeStats() {
  return useQuery({
    queryKey: codeKeys.stats(),
    queryFn: getCodeStats,
  });
}
