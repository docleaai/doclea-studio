import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Empty state component for lists and searches.
 * Design principles:
 * - Centered layout with generous padding
 * - Icon de-emphasized (muted color)
 * - Title emphasized, description secondary
 * - Action button prominent if provided
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "w-full py-16 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="mx-auto mb-4 w-fit rounded-full bg-bg-elevated p-4">
          <Icon className="h-8 w-8 text-text-muted" />
        </div>
      )}

      <h3 className="text-base font-medium">{title}</h3>

      {description && (
        <p className="mt-2 text-sm text-text-secondary">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
