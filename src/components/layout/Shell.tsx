import type { ReactNode } from "react";

interface ShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

/**
 * Main layout shell with sidebar and content area.
 * Following design principles:
 * - Sidebar: elevated (bg-surface + shadow)
 * - Main content: gradient background for glassmorphism
 * - Clear visual hierarchy through depth
 */
export function Shell({ sidebar, children }: ShellProps) {
  return (
    <div className="flex min-h-screen bg-bg-base">
      {/* Sidebar - elevated surface */}
      <aside className="sticky top-0 h-screen w-64 shrink-0 overflow-y-auto border-r border-border bg-bg-surface shadow-md">
        {sidebar}
      </aside>

      {/* Main content - with gradient background for glass effect */}
      <main className="relative flex-1 overflow-x-hidden">
        {/* Gradient orbs for glassmorphism backdrop */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-accent/20 blur-[100px]" />
          <div className="absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-type-pattern/15 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-type-solution/10 blur-[100px]" />
        </div>
        <div className="relative">{children}</div>
      </main>
    </div>
  );
}
