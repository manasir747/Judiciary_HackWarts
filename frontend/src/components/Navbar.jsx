import { Scale } from "lucide-react";

export function Navbar() {
  return (
    <header className="absolute top-0 z-50 w-full border-b border-white/5 bg-transparent backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary premium-border">
            <Scale className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-white leading-none">LexAI</span>
            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Intelligence</span>
          </div>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-slate-300">
            <li className="cursor-pointer hover:text-white transition-colors">How it works</li>
            <li className="cursor-pointer hover:text-white transition-colors">Security</li>
            <li className="cursor-pointer hover:text-white transition-colors">Contact</li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <p className="hidden text-sm font-medium text-slate-400 sm:block tracking-wide italic">Legal Clarity for Everyone</p>
        </div>
      </div>
    </header>
  );
}
