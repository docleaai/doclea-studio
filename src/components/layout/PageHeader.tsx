import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * Consistent page header with title, description, and optional actions.
 * Design principles:
 * - Title: larger + bolder for emphasis (text-xl font-semibold)
 * - Description: de-emphasized via lightness (text-secondary)
 * - Actions: right-aligned, visually balanced
 * - Spacing: 2rem bottom margin to separate from content
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-8 flex items-start justify-between gap-4">
      <div>
        {/* Title - emphasized via size and weight */}
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>

        {/* Description - de-emphasized via lightness */}
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>

      {/* Actions slot */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
