import { cn } from "@/lib/utils";

interface PanelGridProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}

export function PanelGrid({ children, cols = 4, className }: PanelGridProps) {
  return (
    <div
      className={cn(
        "os-panel-grid grid gap-2.5 sm:gap-3",
        cols === 2 && "grid-cols-1 sm:grid-cols-2",
        cols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        cols === 4 && "grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
