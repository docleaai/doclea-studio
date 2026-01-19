export type RelationType = "references" | "implements" | "extends" | "related_to" | "supersedes" | "requires";

export interface Relation {
  id: string;
  type: RelationType;
  weight: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface OutgoingRelation extends Relation {
  targetId: string;
  targetTitle: string;
  targetType: string;
}

export interface IncomingRelation extends Relation {
  sourceId: string;
  sourceTitle: string;
  sourceType: string;
}

export interface MemoryRelations {
  outgoing: OutgoingRelation[];
  incoming: IncomingRelation[];
}

export interface GraphNode {
  id: string;
  title: string;
  type: string;
  importance: number;
  tags: string[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  rootId: string;
}

export interface RelationSuggestion {
  id: string;
  sourceId: string;
  sourceTitle: string;
  sourceType: string;
  targetId: string;
  targetTitle: string;
  targetType: string;
  suggestedType: RelationType;
  confidence: number;
  reason: string;
  detectionMethod: string;
  status: string;
  createdAt: string;
}

export interface CreateRelationInput {
  sourceId: string;
  targetId: string;
  type: RelationType;
  weight?: number;
  metadata?: Record<string, unknown>;
}
