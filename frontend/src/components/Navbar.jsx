import { Scale } from "lucide-react";

export function Navbar() {
  return (
    <header className="w-full border-b border-border/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-text">
          <Scale className="h-5 w-5 text-primary" />
          <span className="text-lg font-extrabold tracking-tight">LexAI</span>
        </div>
        <p className="text-sm font-medium text-slate-500">Legal clarity for everyone</p>
      </div>
    </header>
  );
}
