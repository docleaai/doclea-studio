import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type MemoryType = "decision" | "solution" | "pattern" | "architecture" | "note";

interface MemoryTypeBadgeProps {
  type: MemoryType;
  className?: string;
}

/**
 * Badge for displaying memory types with semantic colors.
 * Colors are from the design system (OKLCH-based):
 * - Decision: Orange-amber (warm, action-oriented)
 * - Solution: Green (success, resolution)
 * - Pattern: Purple (creative, reusable)
 * - Architecture: Cyan-blue (structural, technical)
 * - Note: Blue-gray (neutral, informational)
 */
const typeStyles: Record<MemoryType, string> = {
  decision: "bg-type-decision/15 text-type-decision border-type-decision/30",
  solution: "bg-type-solution/15 text-type-solution border-type-solution/30",
  pattern: "bg-type-pattern/15 text-type-pattern border-type-pattern/30",
  architecture:
    "bg-type-architecture/15 text-type-architecture border-type-architecture/30",
  note: "bg-type-note/15 text-type-note border-type-note/30",
};

export function MemoryTypeBadge({ type, className }: MemoryTypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border font-medium capitalize",
        typeStyles[type],
        className,
      )}
    >
      {type}
    </Badge>
  );
}
