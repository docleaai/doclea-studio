export type CodeNodeType = "function" | "class" | "interface" | "type" | "module" | "package";
export type CodeEdgeType = "calls" | "imports" | "implements" | "extends" | "references" | "depends_on";

export interface CodeNode {
  id: string;
  type: CodeNodeType;
  name: string;
  file_path: string;
  start_line: number | null;
  end_line: number | null;
  signature: string | null;
  summary: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CodeEdge {
  id: string;
  from_node: string;
  to_node: string;
  edge_type: CodeEdgeType;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CodeGraphData {
  nodes: CodeNode[];
  edges: CodeEdge[];
  rootId: string;
}

export interface CodeNodesListParams {
  type?: CodeNodeType;
  file?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CodeNodesListResponse {
  nodes: CodeNode[];
  total: number;
  limit: number;
  offset: number;
}

export interface CrossLayerRelation {
  id: string;
  codeNodeId: string;
  codeName: string;
  codeType: CodeNodeType;
  filePath: string;
  signature: string | null;
  relationType: string;
  direction: string;
  confidence: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface MemoryCrossLayerRelation {
  id: string;
  memoryId: string;
  memoryTitle: string;
  memoryType: string;
  memorySummary: string | null;
  relationType: string;
  direction: string;
  confidence: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface CrossLayerResponse {
  memoryId: string;
  relations: CrossLayerRelation[];
}

export interface CodeMemoriesResponse {
  codeNodeId: string;
  relations: MemoryCrossLayerRelation[];
}

export interface CodeStats {
  totalNodes: number;
  totalEdges: number;
  totalCrossLayerRelations: number;
  nodesByType: Record<string, number>;
  edgesByType: Record<string, number>;
}
