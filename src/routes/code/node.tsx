import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileCode,
  GitFork,
  Network,
  Code2,
  Box,
  Braces,
  Package,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { PageHeader } from "@/components/layout";
import { EmptyState } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  useCodeNode,
  useCallGraph,
  useMemoriesForCode,
  type CodeNode,
  type CodeEdge,
  type CodeNodeType,
} from "@/features/code";
import { cn } from "@/lib/utils";

const codeNodeSearchSchema = z.object({
  id: z.string(),
});

export const Route = createFileRoute("/code/node")({
  validateSearch: codeNodeSearchSchema,
  component: CodeNodeDetail,
});

const typeIcons: Record<CodeNodeType, typeof Code2> = {
  function: Code2,
  class: Box,
  interface: Braces,
  type: GitFork,
  module: FileCode,
  package: Package,
};

const typeColors: Record<CodeNodeType, string> = {
  function: "bg-blue-500/20 text-blue-400",
  class: "bg-purple-500/20 text-purple-400",
  interface: "bg-cyan-500/20 text-cyan-400",
  type: "bg-amber-500/20 text-amber-400",
  module: "bg-green-500/20 text-green-400",
  package: "bg-orange-500/20 text-orange-400",
};

const nodeFillColors: Record<CodeNodeType, string> = {
  function: "#3b82f6",
  class: "#a855f7",
  interface: "#06b6d4",
  type: "#f59e0b",
  module: "#22c55e",
  package: "#f97316",
};

const memoryTypeColors: Record<string, string> = {
  decision: "bg-type-decision/20 text-type-decision",
  solution: "bg-type-solution/20 text-type-solution",
  pattern: "bg-type-pattern/20 text-type-pattern",
  architecture: "bg-type-architecture/20 text-type-architecture",
  note: "bg-type-note/20 text-type-note",
};

function CodeNodeDetail() {
  const { id: nodeId } = Route.useSearch();
  const { data: node, isLoading, isError, error } = useCodeNode(nodeId);
  const { data: memoriesData } = useMemoriesForCode(nodeId);
  const [depth, setDepth] = useState(2);
  const [zoom, setZoom] = useState(1);
  const { data: graphData } = useCallGraph(nodeId, { depth });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
      </div>
    );
  }

  if (isError || !node) {
    return (
      <div className="p-8">
        <Link to="/code" className="mb-4 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to code explorer
        </Link>
        <EmptyState
          icon={AlertCircle}
          title="Code node not found"
          description={error?.message || `Could not find code node.`}
          action={
            <Link to="/code">
              <Button variant="outline">Browse code</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const Icon = typeIcons[node.type] || Code2;

  return (
    <div className="p-8">
      <Link to="/code" className="mb-4 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" />
        Back to code explorer
      </Link>

      <PageHeader
        title={node.name}
        description={node.signature || node.file_path}
        actions={
          <div className={cn("rounded-lg p-2", typeColors[node.type])}>
            <Icon className="h-5 w-5" />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content - Call Graph */}
        <div className="lg:col-span-2 space-y-6">
          {/* Graph Controls */}
          <div className="glass rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary">Depth:</span>
                <Slider
                  value={[depth]}
                  onValueChange={([v]) => setDepth(v)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-32"
                />
                <span className="text-sm tabular-nums text-text-muted">{depth}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Zoom:</span>
                <Button variant="ghost" size="sm" onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="min-w-[3rem] text-center text-sm tabular-nums">{(zoom * 100).toFixed(0)}%</span>
                <Button variant="ghost" size="sm" onClick={() => setZoom((z) => Math.min(2, z + 0.25))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setZoom(1)}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              {graphData && (
                <div className="ml-auto text-sm text-text-muted">
                  {graphData.nodes.length} nodes, {graphData.edges.length} edges
                </div>
              )}
            </div>
          </div>

          {/* Call Graph Visualization */}
          <Card className="relative overflow-hidden" style={{ height: "50vh" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Network className="h-4 w-4" />
                Call Graph
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
              {graphData ? (
                <CallGraphVisualization
                  nodes={graphData.nodes}
                  edges={graphData.edges}
                  rootId={graphData.rootId}
                  zoom={zoom}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Memories */}
          {memoriesData && memoriesData.relations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Related Memories</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {memoriesData.relations.map((rel) => (
                    <li key={rel.id}>
                      <Link
                        to="/memories/$memoryId"
                        params={{ memoryId: rel.memoryId }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-elevated transition-colors"
                      >
                        <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium capitalize", memoryTypeColors[rel.memoryType] || memoryTypeColors.note)}>
                          {rel.memoryType}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{rel.memoryTitle}</p>
                          {rel.memorySummary && (
                            <p className="text-xs text-text-muted truncate">{rel.memorySummary}</p>
                          )}
                        </div>
                        <span className="text-xs text-text-muted">
                          {(rel.confidence * 100).toFixed(0)}%
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Type</p>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize", typeColors[node.type])}>
                  <Icon className="h-3 w-3" />
                  {node.type}
                </span>
              </div>

              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">File</p>
                <code className="text-sm text-text-secondary break-all">{node.file_path}</code>
              </div>

              {(node.start_line || node.end_line) && (
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Lines</p>
                  <span className="text-sm">
                    {node.start_line}
                    {node.end_line && ` - ${node.end_line}`}
                  </span>
                </div>
              )}

              {node.signature && (
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Signature</p>
                  <code className="text-xs text-text-secondary break-all block bg-bg-elevated p-2 rounded">
                    {node.signature}
                  </code>
                </div>
              )}

              {node.summary && (
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Summary</p>
                  <p className="text-sm text-text-secondary">{node.summary}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(["function", "class", "interface", "type", "module", "package"] as CodeNodeType[]).map((type) => {
                const TypeIcon = typeIcons[type];
                return (
                  <div key={type} className="flex items-center gap-2 text-sm">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: nodeFillColors[type] }}
                    />
                    <TypeIcon className="h-3 w-3 text-text-muted" />
                    <span className="text-text-secondary capitalize">{type}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface CallGraphVisualizationProps {
  nodes: CodeNode[];
  edges: CodeEdge[];
  rootId: string;
  zoom: number;
}

function CallGraphVisualization({ nodes, edges, rootId, zoom }: CallGraphVisualizationProps) {
  const navigate = useNavigate();

  // Simple force-directed layout
  const layout = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    const width = 800;
    const height = 500;

    // Place root at center
    positions.set(rootId, { x: width / 2, y: height / 2 });

    // Group nodes by distance from root
    const visited = new Set<string>([rootId]);
    const levels: string[][] = [[rootId]];

    let currentLevel = [rootId];
    while (currentLevel.length > 0) {
      const nextLevel: string[] = [];
      for (const nodeId of currentLevel) {
        const connected = edges
          .filter((e) => e.from_node === nodeId || e.to_node === nodeId)
          .map((e) => (e.from_node === nodeId ? e.to_node : e.from_node))
          .filter((id) => !visited.has(id));

        for (const id of connected) {
          visited.add(id);
          nextLevel.push(id);
        }
      }
      if (nextLevel.length > 0) {
        levels.push(nextLevel);
      }
      currentLevel = nextLevel;
    }

    // Position nodes in concentric circles
    levels.forEach((level, levelIndex) => {
      const radius = (levelIndex + 1) * 100;
      const angleStep = (2 * Math.PI) / Math.max(level.length, 1);

      level.forEach((nodeId, i) => {
        if (nodeId !== rootId) {
          const angle = angleStep * i - Math.PI / 2;
          positions.set(nodeId, {
            x: width / 2 + radius * Math.cos(angle),
            y: height / 2 + radius * Math.sin(angle),
          });
        }
      });
    });

    // Handle orphan nodes
    nodes.forEach((node) => {
      if (!positions.has(node.id)) {
        positions.set(node.id, {
          x: Math.random() * width,
          y: Math.random() * height,
        });
      }
    });

    return positions;
  }, [nodes, edges, rootId]);

  const edgeColors: Record<string, string> = {
    calls: "#3b82f6",
    imports: "#22c55e",
    implements: "#a855f7",
    extends: "#f59e0b",
    references: "#64748b",
    depends_on: "#f97316",
  };

  return (
    <svg
      viewBox="0 0 800 500"
      className="h-full w-full"
      style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
    >
      <defs>
        <marker
          id="code-arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map((edge) => {
        const source = layout.get(edge.from_node);
        const target = layout.get(edge.to_node);
        if (!source || !target) return null;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nodeRadius = 20;

        const offsetX = (dx / len) * nodeRadius;
        const offsetY = (dy / len) * nodeRadius;

        return (
          <g key={edge.id}>
            <line
              x1={source.x + offsetX}
              y1={source.y + offsetY}
              x2={target.x - offsetX}
              y2={target.y - offsetY}
              stroke={edgeColors[edge.edge_type] || "#666"}
              strokeWidth={2}
              strokeOpacity={0.6}
              markerEnd="url(#code-arrowhead)"
            />
            <text
              x={(source.x + target.x) / 2}
              y={(source.y + target.y) / 2 - 5}
              textAnchor="middle"
              className="fill-text-muted text-[9px]"
            >
              {edge.edge_type}
            </text>
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const pos = layout.get(node.id);
        if (!pos) return null;

        const isRoot = node.id === rootId;
        const radius = isRoot ? 28 : 20;

        return (
          <g
            key={node.id}
            transform={`translate(${pos.x}, ${pos.y})`}
            className="cursor-pointer"
            onClick={() => navigate({ to: "/code/node", search: { id: node.id } })}
          >
            <circle
              r={radius}
              fill={nodeFillColors[node.type as CodeNodeType] || nodeFillColors.function}
              fillOpacity={0.8}
              stroke={isRoot ? "#fff" : "transparent"}
              strokeWidth={isRoot ? 3 : 0}
              className="transition-all hover:fill-opacity-100"
            />
            <text
              y={radius + 12}
              textAnchor="middle"
              className="fill-text-primary text-[10px] font-medium"
              style={{ pointerEvents: "none" }}
            >
              {node.name.length > 15 ? `${node.name.slice(0, 13)}...` : node.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
