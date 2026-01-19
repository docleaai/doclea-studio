import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagListProps {
  tags: string[];
  max?: number;
  className?: string;
}

/**
 * Displays a list of tags as badges.
 * Design principles:
 * - Subtle styling (secondary variant, de-emphasized)
 * - Truncate with "+N" when exceeding max
 * - Small gap between tags (0.25rem - closely related)
 */
export function TagList({ tags, max = 3, className }: TagListProps) {
  if (tags.length === 0) {
    return <span className="text-xs text-text-muted">No tags</span>;
  }

  const visibleTags = tags.slice(0, max);
  const remainingCount = tags.length - max;

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {visibleTags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="text-xs font-normal"
        >
          {tag}
        </Badge>
      ))}

      {remainingCount > 0 && (
        <span className="text-xs text-text-muted">+{remainingCount}</span>
      )}
    </div>
  );
}
