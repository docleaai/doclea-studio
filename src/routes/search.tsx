import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { EmptyState } from "@/components/primitives";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useSearch, type SearchResult } from "@/features/search";
import { cn } from "@/lib/utils";

const searchParamsSchema = z.object({
  q: z.string().optional().default(""),
  hybridWeight: z.coerce.number().optional().default(0.7),
  type: z.enum(["decision", "solution", "pattern", "architecture", "note"]).optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchParamsSchema,
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState(search.q);
  const [hybridWeight, setHybridWeight] = useState(search.hybridWeight);

  // Debounce search
  const [debouncedQuery, setDebouncedQuery] = useState(search.q);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query !== search.q) {
        navigate({ search: { ...search, q: query } });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isError } = useSearch({
    query: debouncedQuery,
    hybridWeight,
    type: search.type,
    limit: 20,
  });

  const results = data?.results ?? [];

  return (
    <div className="p-8">
      <PageHeader
        title="Semantic Search"
        description="Search memories using semantic similarity and keywords"
      />

      {/* Search input - glassmorphism for prominence */}
      <div className="glass mb-8 rounded-xl p-5">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            type="text"
            placeholder="Search memories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-20"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="rounded border border-glass-border bg-bg-inset px-1.5 py-0.5 text-xs text-text-muted">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Hybrid weight slider */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-text-secondary">
            Semantic weight:
          </span>
          <Slider
            value={[hybridWeight]}
            onValueChange={([value]) => setHybridWeight(value)}
            min={0}
            max={1}
            step={0.1}
            className="w-48"
          />
          <span className="min-w-[8rem] text-sm tabular-nums text-text-muted">
            {(hybridWeight * 100).toFixed(0)}% semantic /{" "}
            {((1 - hybridWeight) * 100).toFixed(0)}% keyword
          </span>
        </div>
      </div>

      {/* Search results */}
      <Card className="gap-0 overflow-hidden py-0">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
          </div>
        ) : isError ? (
          <EmptyState
            title="Search failed"
            description="An error occurred while searching. Please try again."
          />
        ) : !debouncedQuery ? (
          <EmptyState
            icon={SearchIcon}
            title="Start searching"
            description="Enter a query to search your memories using semantic similarity"
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title="No results found"
            description="Try adjusting your search terms or semantic weight"
          />
        ) : (
          <div className="divide-y divide-border-subtle">
            {results.map((result) => (
              <SearchResultItem key={result.id} result={result} />
            ))}
          </div>
        )}
      </Card>

      {/* Results count */}
      {data && results.length > 0 && (
        <p className="mt-4 text-sm text-text-muted">
          Showing {results.length} of {data.totalMatches} matches
        </p>
      )}
    </div>
  );
}

function SearchResultItem({ result }: { result: SearchResult }) {
  const typeColors: Record<string, string> = {
    decision: "bg-type-decision/20 text-type-decision",
    solution: "bg-type-solution/20 text-type-solution",
    pattern: "bg-type-pattern/20 text-type-pattern",
    architecture: "bg-type-architecture/20 text-type-architecture",
    note: "bg-type-note/20 text-type-note",
  };

  return (
    <Link
      to="/memories/$memoryId"
      params={{ memoryId: result.memory_id }}
      className="block p-4 transition-colors hover:bg-bg-subtle/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", typeColors[result.type] || typeColors.note)}>
              {result.type}
            </span>
            <span className="text-xs text-text-muted">
              {(result.importance * 100).toFixed(0)}% importance
            </span>
          </div>
          <p className="font-medium text-text-primary truncate">{result.title}</p>
          {result.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {result.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded bg-bg-elevated px-1.5 py-0.5 text-xs text-text-secondary">
                  {tag}
                </span>
              ))}
              {result.tags.length > 4 && (
                <span className="text-xs text-text-muted">+{result.tags.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Score breakdown */}
        <div className="shrink-0 text-right">
          <p className="text-lg font-semibold text-accent">
            {(result.score * 100).toFixed(0)}%
          </p>
          <div className="mt-1 text-xs text-text-muted">
            <div>S: {(result.breakdown.semantic * 100).toFixed(0)}%</div>
            <div>K: {(result.breakdown.keyword * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
