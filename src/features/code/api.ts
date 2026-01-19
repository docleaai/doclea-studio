import { api } from "@/lib/api-client";
import type {
  CodeNode,
  CodeGraphData,
  CodeNodesListParams,
  CodeNodesListResponse,
  CrossLayerResponse,
  CodeMemoriesResponse,
  CodeStats,
} from "./types";

export async function getCodeNodes(params: CodeNodesListParams = {}): Promise<CodeNodesListResponse> {
  return api.get<CodeNodesListResponse>("/code/nodes", { params });
}

export async function getCodeNode(id: string): Promise<CodeNode> {
  return api.get<CodeNode>("/code/node", { params: { id } });
}

export async function getCallGraph(
  nodeId: string,
  options: { depth?: number; direction?: "outgoing" | "incoming" | "both" } = {}
): Promise<CodeGraphData> {
  return api.get<CodeGraphData>("/code/call-graph", {
    params: {
      nodeId,
      depth: options.depth ?? 2,
      direction: options.direction ?? "both",
    },
  });
}

export async function getDependencyTree(
  moduleId: string,
  options: { depth?: number; direction?: "imports" | "importedBy" | "both" } = {}
): Promise<CodeGraphData> {
  return api.get<CodeGraphData>("/code/dependency-tree", {
    params: {
      moduleId,
      depth: options.depth ?? 3,
      direction: options.direction ?? "both",
    },
  });
}

export async function getCodeForMemory(memoryId: string): Promise<CrossLayerResponse> {
  return api.get<CrossLayerResponse>("/code/cross-layer", { params: { memoryId } });
}

export async function getMemoriesForCode(codeNodeId: string): Promise<CodeMemoriesResponse> {
  return api.get<CodeMemoriesResponse>("/code/memories", { params: { codeNodeId } });
}

export async function getCodeStats(): Promise<CodeStats> {
  return api.get<CodeStats>("/code/stats");
}
