import { Card } from "./ui/card";
import { ArrowRightCircle, Target } from "lucide-react";

export function StrategyPanel({ strategy }) {
  const hasStrategy = strategy && strategy.length > 0;

  return (
    <Card className="premium-glass h-full p-6 animate-fadeIn transition-all duration-300 hover:shadow-premium">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-white">Strategic Roadmap</h2>
        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
          Action Plan
        </span>
      </div>

      <div className="relative space-y-6 pl-4 border-l border-white/10 ml-2">
        {hasStrategy ? strategy.map((item, index) => (
          <div key={index} className="relative group">
            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-emerald-500 bg-background transition-all group-hover:scale-125 group-hover:bg-emerald-500" />
            
            <div className="transition-all group-hover:translate-x-1">
              <div className="mb-1 flex items-center gap-3">
                <h3 className="text-sm font-bold text-white tracking-tight">{item.step}</h3>
                <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-slate-500">
                  {item.priority}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400 font-light">
                {item.description}
              </p>
            </div>
          </div>
        )) : (
          <div className="py-4">
             <p className="text-xs text-slate-500 italic">Formulating step-by-step roadmap...</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-xl bg-emerald-500/5 p-4 border border-emerald-500/10">
        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
          <Target className="h-4 w-4 text-emerald-500" />
        </div>
        <p className="text-[11px] text-emerald-400/80 leading-relaxed italic">
          "Strategic roadmap is formulated by Gemma 2 to optimize your legal standing."
        </p>
      </div>
    </Card>
  );
}
