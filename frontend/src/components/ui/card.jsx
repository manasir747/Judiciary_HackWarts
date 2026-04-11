import { cn } from "../../lib/utils";

export function Card({ className, children }) {
  return (
    <div
      className={cn(
        "premium-glass rounded-card p-5 shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}
