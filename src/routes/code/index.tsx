import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Loader2, FileCode, Search, GitFork, Box, Code2, Braces, Package } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { EmptyState } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCodeNodes, useCodeStats, type CodeNodeType } from "@/features/code";
import { cn } from "@/lib/utils";

const codeSearchSchema = z.object({
  type: z.enum(["function", "class", "interface", "type", "module", "package"]).optional(),
  search: z.string().optional(),
  file: z.string().optional(),
});

export const Route = createFileRoute("/code/")({
  validateSearch: codeSearchSchema,
  component: CodeExplorerPage,
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

function CodeExplorerPage() {
  const search = Route.useSearch();
  const [searchQuery, setSearchQuery] = useState(search.search || "");
  const [selectedType, setSelectedType] = useState<CodeNodeType | undefined>(search.type);

  const { data: stats, isLoading: statsLoading } = useCodeStats();
  const { data: nodesData, isLoading: nodesLoading } = useCodeNodes({
    type: selectedType,
    search: search.search,
    file: search.file,
    limit: 50,
  });

  const nodeTypes: CodeNodeType[] = ["function", "class", "interface", "type", "module", "package"];

  return (
    <div className="p-8">
      <PageHeader
        title="Code Explorer"
        description="Browse and explore the code knowledge graph"
      />

      {/* Stats */}
      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="glass">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.totalNodes}</div>
              <p className="text-sm text-text-secondary">Code Nodes</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.totalEdges}</div>
              <p className="text-sm text-text-secondary">Relationships</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.totalCrossLayerRelations}</div>
              <p className="text-sm text-text-secondary">Code ↔ Memory Links</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">
                {Object.values(stats.nodesByType).reduce((a, b) => a + b, 0)}
              </div>
              <p className="text-sm text-text-secondary">Analyzed Symbols</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="glass mb-6 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Search by name, signature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedType === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(undefined)}
            >
              All
            </Button>
            {nodeTypes.map((type) => {
              const Icon = typeIcons[type];
              return (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type === selectedType ? undefined : type)}
                  className="gap-1.5"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {type}
                  {stats?.nodesByType[type] && (
                    <span className="text-xs text-text-muted ml-1">({stats.nodesByType[type]})</span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Code nodes list */}
      {nodesLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
        </div>
      ) : !nodesData || nodesData.nodes.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileCode}
            title="No code nodes found"
            description={
              search.search
                ? "No code nodes match your search criteria."
                : "The code graph is empty. Run a code scan to populate it."
            }
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {nodesData.nodes.map((node) => {
            const Icon = typeIcons[node.type] || Code2;
            return (
              <Link
                key={node.id}
                to="/code/node"
                search={{ id: node.id }}
                className="block"
              >
                <Card className="transition-all hover:bg-bg-elevated hover:shadow-lift hover:-translate-y-0.5">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      {/* Type icon */}
                      <div className={cn("rounded-lg p-2", typeColors[node.type])}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-text-primary truncate">{node.name}</h3>
                          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", typeColors[node.type])}>
                            {node.type}
                          </span>
                        </div>
                        {node.signature && (
                          <code className="mt-1 block text-xs text-text-secondary truncate">
                            {node.signature}
                          </code>
                        )}
                        <p className="mt-1 text-xs text-text-muted truncate">
                          {node.file_path}
                          {node.start_line && `:${node.start_line}`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {/* Pagination info */}
          <div className="mt-4 text-center text-sm text-text-muted">
            Showing {nodesData.nodes.length} of {nodesData.total} nodes
          </div>
        </div>
      )}
    </div>
  );
}
