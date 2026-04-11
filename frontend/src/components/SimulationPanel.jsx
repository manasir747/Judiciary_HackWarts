import { Card } from "./ui/card";
import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function SimulationPanel({ simulations }) {
  const hasSims = simulations && simulations.length > 0;

  const getIcon = (scenario) => {
    const text = scenario.toLowerCase();
    if (text.includes("positive") || text.includes("success") || text.includes("win")) 
      return <TrendingUp className="h-4 w-4 text-emerald-400" />;
    if (text.includes("negative") || text.includes("fail") || text.includes("loss") || text.includes("convict"))
      return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  return (
    <Card className="premium-glass h-full p-6 animate-fadeIn transition-all duration-300 hover:shadow-premium">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-white">Legal Outcomes</h2>
        <div className="flex items-center gap-2">
           <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Simulation Engine</span>
        </div>
      </div>

      <div className="space-y-5">
        {hasSims ? simulations.map((item, index) => (
          <div key={index} className="group relative rounded-xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-4 transition-all hover:border-purple-500/30">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(item.scenario)}
                <h3 className="text-sm font-bold text-slate-200">{item.scenario}</h3>
              </div>
              <div className="text-right">
                <span className="block text-[8px] font-bold uppercase tracking-tighter text-slate-500">Probability</span>
                <span className="text-xs font-black text-purple-400">{item.probability}</span>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 font-light">
               <span className="font-bold text-slate-500">Reasoning:</span> {item.reasoning}
            </p>
          </div>
        )) : (
          <div className="py-8 text-center">
            <p className="text-xs text-slate-500 italic">Running predictive simulations...</p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg bg-black/40 p-3 border border-white/5">
        <p className="text-[9px] text-slate-500 leading-relaxed text-center">
          Simulation models are stochastic. Real-world outcomes may vary.
        </p>
      </div>
    </Card>
  );
}
