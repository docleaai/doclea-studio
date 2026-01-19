import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, Tag, FileText, Loader2, AlertCircle, Pencil, Trash2, Network, ArrowRight, ArrowLeftRight, Code2, Box, Braces, GitFork, Package } from "lucide-react";
import { PageHeader } from "@/components/layout";
import { EmptyState } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemory } from "@/features/memories";
import { useRelations, type OutgoingRelation, type IncomingRelation } from "@/features/relations";
import { useCodeForMemory, type CodeNodeType } from "@/features/code";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/memories/$memoryId")({
  component: MemoryDetail,
});

function MemoryDetail() {
  const { memoryId } = Route.useParams();
  const { data: memory, isLoading, isError, error } = useMemory(memoryId);
  const { data: relations } = useRelations(memoryId);
  const { data: codeRelations } = useCodeForMemory(memoryId);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
      </div>
    );
  }

  if (isError || !memory) {
    return (
      <div className="p-8">
        <Link to="/memories" className="mb-4 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to memories
        </Link>
        <EmptyState
          icon={AlertCircle}
          title="Memory not found"
          description={error?.message || `Could not find memory with ID "${memoryId}".`}
          action={
            <Link to="/memories">
              <Button variant="outline">View all memories</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link to="/memories" className="mb-4 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" />
        Back to memories
      </Link>

      <PageHeader
        title={memory.title}
        description={memory.summary || undefined}
        actions={
          <div className="flex gap-2">
            <Link to="/graph" search={{ id: memoryId, depth: 2 }}>
              <Button variant="outline" size="sm">
                <Network className="mr-2 h-4 w-4" />
                View Graph
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-text-primary">
                  {memory.content}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Related files */}
          {memory.related_files.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base font-medium">Related Files</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {memory.related_files.map((file) => (
                    <li key={file} className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-text-muted" />
                      <code className="text-text-secondary">{file}</code>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Relations */}
          {relations && (relations.outgoing.length > 0 || relations.incoming.length > 0) && (
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium">Relations</CardTitle>
                <Link to="/graph" search={{ id: memoryId, depth: 2 }}>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Network className="mr-1.5 h-3 w-3" />
                    View Graph
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Outgoing relations */}
                {relations.outgoing.length > 0 && (
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-2 flex items-center gap-1">
                      <ArrowRight className="h-3 w-3" />
                      Outgoing ({relations.outgoing.length})
                    </p>
                    <ul className="space-y-2">
                      {relations.outgoing.map((rel) => (
                        <RelationItem key={rel.id} relation={rel} direction="outgoing" />
                      ))}
                    </ul>
                  </div>
                )}

                {/* Incoming relations */}
                {relations.incoming.length > 0 && (
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-2 flex items-center gap-1">
                      <ArrowLeft className="h-3 w-3" />
                      Incoming ({relations.incoming.length})
                    </p>
                    <ul className="space-y-2">
                      {relations.incoming.map((rel) => (
                        <RelationItem key={rel.id} relation={rel} direction="incoming" />
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Related Code */}
          {codeRelations && codeRelations.relations.length > 0 && (
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium">Related Code</CardTitle>
                <Link to="/code">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Code2 className="mr-1.5 h-3 w-3" />
                    Explore Code
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {codeRelations.relations.map((rel) => (
                    <CodeRelationItem key={rel.id} relation={rel} />
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type */}
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Type</p>
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium capitalize", typeColors[memory.type] || typeColors.note)}>
                  {memory.type}
                </span>
              </div>

              {/* Importance */}
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Importance</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-bg-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${memory.importance * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{(memory.importance * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Needs Review */}
              {memory.needs_review && (
                <div>
                  <span className="rounded-full bg-type-decision/20 px-2.5 py-1 text-xs font-medium text-type-decision">
                    Needs Review
                  </span>
                </div>
              )}

              {/* Tags */}
              {memory.tags.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {memory.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded bg-bg-elevated px-2 py-0.5 text-xs text-text-secondary">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-text-muted" />
                <span className="text-text-secondary">Created:</span>
                <span>{formatDateTime(memory.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-text-muted" />
                <span className="text-text-secondary">Last accessed:</span>
                <span>{formatDateTime(memory.accessed_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-secondary ml-6">Access count:</span>
                <span>{memory.access_count}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const relationTypeColors: Record<string, string> = {
  references: "text-text-secondary",
  implements: "text-green-400",
  extends: "text-violet-400",
  related_to: "text-slate-400",
  supersedes: "text-red-400",
  requires: "text-amber-400",
};

const typeColors: Record<string, string> = {
  decision: "bg-type-decision/20 text-type-decision",
  solution: "bg-type-solution/20 text-type-solution",
  pattern: "bg-type-pattern/20 text-type-pattern",
  architecture: "bg-type-architecture/20 text-type-architecture",
  note: "bg-type-note/20 text-type-note",
};

interface RelationItemProps {
  relation: OutgoingRelation | IncomingRelation;
  direction: "outgoing" | "incoming";
}

function RelationItem({ relation, direction }: RelationItemProps) {
  const isOutgoing = direction === "outgoing";
  const targetId = isOutgoing
    ? (relation as OutgoingRelation).targetId
    : (relation as IncomingRelation).sourceId;
  const targetTitle = isOutgoing
    ? (relation as OutgoingRelation).targetTitle
    : (relation as IncomingRelation).sourceTitle;
  const targetType = isOutgoing
    ? (relation as OutgoingRelation).targetType
    : (relation as IncomingRelation).sourceType;

  return (
    <li className="flex items-center gap-2 text-sm">
      <span className={cn("text-xs font-medium", relationTypeColors[relation.type] || "text-text-muted")}>
        {relation.type.replace("_", " ")}
      </span>
      <ArrowLeftRight className="h-3 w-3 text-text-muted" />
      <Link
        to="/memories/$memoryId"
        params={{ memoryId: targetId }}
        className="flex items-center gap-1.5 hover:underline"
      >
        <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium capitalize", typeColors[targetType] || typeColors.note)}>
          {targetType}
        </span>
        <span className="text-text-primary truncate max-w-[200px]">{targetTitle}</span>
      </Link>
      {relation.weight > 0 && (
        <span className="ml-auto text-xs text-text-muted">
          {(relation.weight * 100).toFixed(0)}%
        </span>
      )}
    </li>
  );
}

const codeTypeIcons: Record<CodeNodeType, typeof Code2> = {
  function: Code2,
  class: Box,
  interface: Braces,
  type: GitFork,
  module: FileText,
  package: Package,
};

const codeTypeColors: Record<CodeNodeType, string> = {
  function: "bg-blue-500/20 text-blue-400",
  class: "bg-purple-500/20 text-purple-400",
  interface: "bg-cyan-500/20 text-cyan-400",
  type: "bg-amber-500/20 text-amber-400",
  module: "bg-green-500/20 text-green-400",
  package: "bg-orange-500/20 text-orange-400",
};

interface CodeRelationItemProps {
  relation: {
    id: string;
    codeNodeId: string;
    codeName: string;
    codeType: CodeNodeType;
    filePath: string;
    signature: string | null;
    relationType: string;
    confidence: number;
  };
}

function CodeRelationItem({ relation }: CodeRelationItemProps) {
  const Icon = codeTypeIcons[relation.codeType] || Code2;

  return (
    <li>
      <Link
        to="/code/node"
        search={{ id: relation.codeNodeId }}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-elevated transition-colors"
      >
        <div className={cn("rounded p-1.5", codeTypeColors[relation.codeType])}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary truncate">{relation.codeName}</span>
            <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", codeTypeColors[relation.codeType])}>
              {relation.codeType}
            </span>
          </div>
          <p className="text-xs text-text-muted truncate">{relation.filePath}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-text-secondary">{relation.relationType}</span>
          <p className="text-xs text-text-muted">{(relation.confidence * 100).toFixed(0)}%</p>
        </div>
      </Link>
    </li>
  );
}
