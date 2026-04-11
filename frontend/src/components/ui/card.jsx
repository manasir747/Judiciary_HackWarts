import { cn } from "../../lib/utils";

export function Card({ className, children }) {
  return (
    <div
      className={cn(
        "glass-card rounded-card border border-border bg-white/90 p-5 shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}
