import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Brain, Search, Settings, Code2, Network } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/memories", label: "Memories", icon: Brain },
  { to: "/search", label: "Search", icon: Search },
  { to: "/code", label: "Code Explorer", icon: Code2 },
  { to: "/graph", label: "Graph View", icon: Network },
] as const;

/**
 * Sidebar navigation component.
 * Design principles applied:
 * - Logo area with accent color for brand identity
 * - Nav items with lighter bg on active state (elevated)
 * - De-emphasized secondary text via lightness
 * - Spacing: 1.5rem padding, 0.25rem gap for related items
 */
export function Sidebar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <div className="flex h-full flex-col p-4">
      {/* Logo/Brand - 1.5rem padding from edges, 2rem gap from nav */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent shadow-sm">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight">Doclea</h1>
          <p className="text-xs text-text-muted">Studio</p>
        </div>
      </div>

      {/* Navigation - 0.25rem gap between items (closely related) */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.to === "/"
              ? currentPath === "/"
              : currentPath.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                // Base styles - inner padding 0.75rem/0.5rem (horizontal > vertical)
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                // Active state - elevated (lighter bg)
                isActive
                  ? "bg-bg-elevated text-text-primary font-medium"
                  : "text-text-secondary hover:bg-bg-elevated/50 hover:text-text-primary",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer - separated from nav (1.5rem gap via flex) */}
      <div className="border-t border-border-subtle pt-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-text-muted hover:bg-bg-elevated/50 hover:text-text-secondary transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}
