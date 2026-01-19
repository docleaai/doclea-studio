import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Lightbulb, GitBranch, Layers, FileText, Loader2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/primitives";
import { useStats, useRecentMemories, type RecentMemory } from "@/features/stats";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useStats();
  const { data: recentMemories, isLoading: recentLoading, isError: recentError } = useRecentMemories();

  return (
    <div className="p-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your memory database"
      />

      {/* Stats grid - 4 columns on large, 2 on medium, 1 on small */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Memories"
          value={statsLoading ? "..." : statsError ? "--" : stats?.total ?? 0}
          icon={Brain}
        />
        <StatCard
          title="Decisions"
          value={statsLoading ? "..." : statsError ? "--" : stats?.byType?.decision ?? 0}
          icon={Lightbulb}
          iconClassName="text-type-decision"
        />
        <StatCard
          title="Solutions"
          value={statsLoading ? "..." : statsError ? "--" : stats?.byType?.solution ?? 0}
          icon={GitBranch}
          iconClassName="text-type-solution"
        />
        <StatCard
          title="Patterns"
          value={statsLoading ? "..." : statsError ? "--" : stats?.byType?.pattern ?? 0}
          icon={Layers}
          iconClassName="text-type-pattern"
        />
      </div>

      {/* Additional stats row */}
      {stats && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Recent (7 days)</p>
              <p className="mt-1 text-xl font-semibold text-type-solution">{stats.recentCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Avg. Importance</p>
              <p className="mt-1 text-xl font-semibold">{(stats.avgImportance * 100).toFixed(0)}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Stale (30+ days)</p>
              <p className={cn("mt-1 text-xl font-semibold", stats.staleCount > 0 && "text-type-decision")}>
                {stats.staleCount}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent memories section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Recent Memories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
            </div>
          ) : recentError ? (
            <EmptyState
              icon={AlertCircle}
              title="Failed to load"
              description="Could not connect to the database. Make sure the server is running."
            />
          ) : !recentMemories || recentMemories.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No memories yet"
              description="Your memory database is empty. Create your first memory to get started."
            />
          ) : (
            <div className="space-y-3">
              {recentMemories.map((memory) => (
                <RecentMemoryItem key={memory.id} memory={memory} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RecentMemoryItem({ memory }: { memory: RecentMemory }) {
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
      params={{ memoryId: memory.id }}
      className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-bg-subtle"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", typeColors[memory.type] || typeColors.note)}>
            {memory.type}
          </span>
          <span className="text-xs text-text-muted">
            {formatRelativeTime(memory.created_at)}
          </span>
        </div>
        <p className="mt-1 font-medium text-text-primary truncate">{memory.title}</p>
        {memory.summary && (
          <p className="mt-0.5 text-sm text-text-secondary line-clamp-1">{memory.summary}</p>
        )}
      </div>
      <div className="text-sm font-medium text-text-muted">
        {(memory.importance * 100).toFixed(0)}%
      </div>
    </Link>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
}

/**
 * Stat card following design principles:
 * - Card is elevated (bg-surface via Card component)
 * - Icon de-emphasized (muted) unless colored
 * - Value emphasized (larger, semibold)
 * - Title secondary (smaller, muted)
 */
function StatCard({ title, value, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
          </div>
          <div className="rounded-lg bg-bg-elevated p-2">
            <Icon className={iconClassName || "h-5 w-5 text-text-muted"} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
