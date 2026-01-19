import { useState, useMemo, useCallback } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Loader2, ZoomIn, ZoomOut, Maximize2, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { EmptyState } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useGraph, type GraphNode, type GraphEdge } from "@/features/relations";
import { cn } from "@/lib/utils";

const graphSearchSchema = z.object({
  id: z.string().optional(),
  depth: z.coerce.number().optional().default(2),
});

export const Route = createFileRoute("/graph")({
  validateSearch: graphSearchSchema,
  component: GraphPage,
});

function GraphPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [depth, setDepth] = useState(search.depth);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const { data, isLoading, isError } = useGraph(search.id || "", depth);

  const handleDepthChange = useCallback((newDepth: number) => {
    setDepth(newDepth);
    if (search.id) {
      navigate({ search: { id: search.id, depth: newDepth } });
    }
  }, [search.id, navigate]);

  if (!search.id) {
    return (
      <div className="p-8">
        <PageHeader
          title="Memory Graph"
          description="Visualize relationships between memories"
        />
        <Card className="py-16">
          <EmptyState
            title="Select a memory"
            description="Go to a memory detail page and click 'View Graph' to visualize its relationships"
            action={
              <Link to="/memories">
                <Button variant="outline">Browse Memories</Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link to="/memories/$memoryId" params={{ memoryId: search.id }} className="mb-4 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" />
        Back to memory
      </Link>

      <PageHeader
        title="Memory Graph"
        description="Visualize relationships between memories"
      />

      {/* Controls */}
      <div className="glass mb-6 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">Depth:</span>
            <Slider
              value={[depth]}
              onValueChange={([v]) => handleDepthChange(v)}
              min={1}
              max={4}
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

          {data && (
            <div className="ml-auto text-sm text-text-muted">
              {data.nodes.length} nodes, {data.edges.length} edges
            </div>
          )}
        </div>
      </div>

      {/* Graph visualization */}
      <Card className="relative overflow-hidden" style={{ height: "70vh" }}>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
          </div>
        ) : isError ? (
          <EmptyState
            title="Failed to load graph"
            description="Could not load the memory graph. Please try again."
          />
        ) : data ? (
          <GraphVisualization
            nodes={data.nodes}
            edges={data.edges}
            rootId={data.rootId}
            zoom={zoom}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
          />
        ) : null}
      </Card>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-type-decision" />
          <span className="text-text-secondary">Decision</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-type-solution" />
          <span className="text-text-secondary">Solution</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-type-pattern" />
          <span className="text-text-secondary">Pattern</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-type-architecture" />
          <span className="text-text-secondary">Architecture</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-type-note" />
          <span className="text-text-secondary">Note</span>
        </div>
      </div>
    </div>
  );
}

interface GraphVisualizationProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  rootId: string;
  zoom: number;
  selectedNode: string | null;
  onSelectNode: (id: string | null) => void;
}

function GraphVisualization({
  nodes,
  edges,
  rootId,
  zoom,
  selectedNode,
  onSelectNode,
}: GraphVisualizationProps) {
  const navigate = useNavigate();

  // Simple force-directed layout simulation
  const layout = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    const width = 800;
    const height = 600;

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
          .filter((e) => e.source === nodeId || e.target === nodeId)
          .map((e) => (e.source === nodeId ? e.target : e.source))
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
      const radius = (levelIndex + 1) * 120;
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

    // Handle any orphan nodes
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

  const typeColors: Record<string, string> = {
    decision: "var(--color-type-decision)",
    solution: "var(--color-type-solution)",
    pattern: "var(--color-type-pattern)",
    architecture: "var(--color-type-architecture)",
    note: "var(--color-type-note)",
  };

  const edgeColors: Record<string, string> = {
    references: "#888",
    implements: "#10b981",
    extends: "#8b5cf6",
    related_to: "#64748b",
    supersedes: "#ef4444",
    requires: "#f59e0b",
  };

  return (
    <svg
      viewBox="0 0 800 600"
      className="h-full w-full"
      style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
    >
      <defs>
        <marker
          id="arrowhead"
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
        const source = layout.get(edge.source);
        const target = layout.get(edge.target);
        if (!source || !target) return null;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nodeRadius = 24;

        // Shorten line to not overlap with node circles
        const offsetX = (dx / len) * nodeRadius;
        const offsetY = (dy / len) * nodeRadius;

        return (
          <g key={edge.id}>
            <line
              x1={source.x + offsetX}
              y1={source.y + offsetY}
              x2={target.x - offsetX}
              y2={target.y - offsetY}
              stroke={edgeColors[edge.type] || "#666"}
              strokeWidth={Math.max(1, edge.weight * 3)}
              strokeOpacity={0.6}
              markerEnd="url(#arrowhead)"
            />
            {/* Edge label */}
            <text
              x={(source.x + target.x) / 2}
              y={(source.y + target.y) / 2 - 5}
              textAnchor="middle"
              className="fill-text-muted text-[10px]"
            >
              {edge.type.replace("_", " ")}
            </text>
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const pos = layout.get(node.id);
        if (!pos) return null;

        const isRoot = node.id === rootId;
        const isSelected = node.id === selectedNode;
        const radius = isRoot ? 32 : 24 + node.importance * 8;

        return (
          <g
            key={node.id}
            transform={`translate(${pos.x}, ${pos.y})`}
            className="cursor-pointer"
            onClick={() => onSelectNode(isSelected ? null : node.id)}
            onDoubleClick={() => navigate({ to: "/memories/$memoryId", params: { memoryId: node.id } })}
          >
            {/* Node circle */}
            <circle
              r={radius}
              fill={typeColors[node.type] || typeColors.note}
              fillOpacity={0.8}
              stroke={isRoot ? "#fff" : isSelected ? "#fff" : "transparent"}
              strokeWidth={isRoot ? 3 : isSelected ? 2 : 0}
              className="transition-all hover:fill-opacity-100"
            />
            {/* Node label */}
            <text
              y={radius + 14}
              textAnchor="middle"
              className="fill-text-primary text-xs font-medium"
              style={{ pointerEvents: "none" }}
            >
              {node.title.length > 20 ? `${node.title.slice(0, 18)}...` : node.title}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
