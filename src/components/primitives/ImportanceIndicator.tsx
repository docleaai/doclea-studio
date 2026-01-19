import { cn } from "@/lib/utils";

interface ImportanceIndicatorProps {
  value: number; // 0-1
  className?: string;
  showLabel?: boolean;
}

/**
 * Visual indicator for memory importance (0-1 scale).
 * Design principles:
 * - Uses accent color with opacity based on value
 * - Simple bar visualization (avoid unnecessary complexity)
 * - Optional label for accessibility
 */
export function ImportanceIndicator({
  value,
  className,
  showLabel = false,
}: ImportanceIndicatorProps) {
  const percentage = Math.round(value * 100);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Visual bar */}
      <div className="h-1.5 w-16 rounded-full bg-bg-inset">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Optional label */}
      {showLabel && (
        <span className="text-xs text-text-muted tabular-nums">
          {percentage}%
        </span>
      )}
    </div>
  );
}
