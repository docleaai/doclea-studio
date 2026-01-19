import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Plus, FileText, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { EmptyState } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMemories, type Memory } from "@/features/memories";

type MemoryType = "decision" | "solution" | "pattern" | "architecture" | "note";

const memoriesSearchSchema = z.object({
  type: z
    .enum(["decision", "solution", "pattern", "architecture", "note"])
    .optional(),
  tags: z.array(z.string()).optional().default([]),
  sort: z
    .enum(["created", "accessed", "importance", "title"])
    .optional()
    .default("created"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  cursor: z.string().optional(),
});

export const Route = createFileRoute("/memories/")({
  validateSearch: memoriesSearchSchema,
  component: MemoriesList,
});

const memoryTypes: MemoryType[] = [
  "decision",
  "solution",
  "pattern",
  "architecture",
  "note",
];

function MemoriesList() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useMemories({
    type: search.type,
    sort: search.sort,
    order: search.order,
    cursor: search.cursor,
    limit: 25,
  });

  const memories = data?.data ?? [];
  const hasMemories = memories.length > 0;

  return (
    <div className="p-8">
      <PageHeader
        title="Memories"
        description="Browse and manage your memory database"
        actions={
          <Link to="/memories/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Memory
            </Button>
          </Link>
        }
      />

      {/* Filters toolbar - glassmorphism for prominence */}
      <div className="glass mb-6 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <TypeFilter currentType={search.type} />
          <div className="ml-auto">
            <SortSelect currentSort={search.sort} currentOrder={search.order} />
          </div>
        </div>
      </div>

      {/* Memory table - recessed appearance with inset header */}
      <Card className="gap-0 overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Importance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-text-muted" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState
                    title="Failed to load memories"
                    description={error?.message || "An error occurred while fetching memories."}
                  />
                </TableCell>
              </TableRow>
            ) : !hasMemories ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState
                    icon={FileText}
                    title="No memories found"
                    description={search.type
                      ? `No ${search.type} memories found. Try clearing the filter or create a new one.`
                      : "Your memory database is empty. Create your first memory to get started."
                    }
                    action={
                      <Link to="/memories/new">
                        <Button variant="outline">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Memory
                        </Button>
                      </Link>
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              memories.map((memory) => (
                <MemoryRow key={memory.id} memory={memory} />
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {data && (data.nextCursor || data.prevCursor) && (
          <div className="flex items-center justify-between border-t border-border-subtle px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              disabled={!data.prevCursor}
              onClick={() => navigate({ search: { ...search, cursor: data.prevCursor } })}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!data.nextCursor}
              onClick={() => navigate({ search: { ...search, cursor: data.nextCursor } })}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function MemoryRow({ memory }: { memory: Memory }) {
  const typeColors: Record<string, string> = {
    decision: "bg-type-decision/20 text-type-decision",
    solution: "bg-type-solution/20 text-type-solution",
    pattern: "bg-type-pattern/20 text-type-pattern",
    architecture: "bg-type-architecture/20 text-type-architecture",
    note: "bg-type-note/20 text-type-note",
  };

  return (
    <TableRow className="cursor-pointer hover:bg-bg-subtle/50">
      <TableCell>
        <Link
          to="/memories/$memoryId"
          params={{ memoryId: memory.id }}
          className="font-medium text-text-primary hover:text-accent"
        >
          {memory.title}
        </Link>
        {memory.summary && (
          <p className="mt-0.5 text-sm text-text-muted line-clamp-1">{memory.summary}</p>
        )}
      </TableCell>
      <TableCell>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", typeColors[memory.type] || typeColors.note)}>
          {memory.type}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {memory.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded bg-bg-elevated px-1.5 py-0.5 text-xs text-text-secondary">
              {tag}
            </span>
          ))}
          {memory.tags.length > 3 && (
            <span className="text-xs text-text-muted">+{memory.tags.length - 3}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-text-secondary">
        {formatDate(memory.created_at)}
      </TableCell>
      <TableCell className="text-right">
        <ImportanceBadge value={memory.importance} />
      </TableCell>
    </TableRow>
  );
}

function ImportanceBadge({ value }: { value: number }) {
  const level = value >= 0.8 ? "high" : value >= 0.5 ? "medium" : "low";
  const colors = {
    high: "text-type-decision",
    medium: "text-type-solution",
    low: "text-text-muted",
  };
  return (
    <span className={cn("text-sm font-medium", colors[level])}>
      {(value * 100).toFixed(0)}%
    </span>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

function TypeFilter({ currentType }: { currentType?: MemoryType }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-secondary">Type:</span>
      <div className="flex gap-1">
        <Link
          to="/memories"
          search={{ type: undefined }}
          className={cn(
            "rounded px-2.5 py-1 text-sm transition-colors",
            !currentType
              ? "bg-bg-elevated font-medium text-text-primary"
              : "text-text-secondary hover:bg-bg-elevated/50 hover:text-text-primary",
          )}
        >
          All
        </Link>
        {memoryTypes.map((type) => (
          <Link
            key={type}
            to="/memories"
            search={{ type }}
            className={cn(
              "rounded px-2.5 py-1 text-sm capitalize transition-colors",
              currentType === type
                ? "bg-bg-elevated font-medium text-text-primary"
                : "text-text-secondary hover:bg-bg-elevated/50 hover:text-text-primary",
            )}
          >
            {type}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SortSelect({
  currentSort,
  currentOrder,
}: {
  currentSort: string;
  currentOrder: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-secondary">Sort:</span>
      <Select defaultValue={`${currentSort}-${currentOrder}`}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created-desc">Newest first</SelectItem>
          <SelectItem value="created-asc">Oldest first</SelectItem>
          <SelectItem value="accessed-desc">Recently accessed</SelectItem>
          <SelectItem value="importance-desc">Most important</SelectItem>
          <SelectItem value="title-asc">Title A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
