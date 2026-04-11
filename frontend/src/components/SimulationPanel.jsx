import { Card } from "./ui/card";
import { Sparkles, TrendingUp, TrendingDown, Minus, Lightbulb, Zap, MoreHorizontal, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export function SimulationPanel({ simulations }) {
  const hasSims = simulations && simulations.length > 0;

  const getIcon = (scenario) => {
    const text = scenario.toLowerCase();
    if (text.includes("positive") || text.includes("success") || text.includes("win") || text.includes("acquit")) 
      return <TrendingUp className="h-4 w-4 text-emerald-400 group-hover:scale-125 transition-transform" />;
    if (text.includes("negative") || text.includes("fail") || text.includes("loss") || text.includes("convict") || text.includes("guilty"))
      return <TrendingDown className="h-4 w-4 text-rose-400 group-hover:scale-125 transition-transform" />;
    return <Activity className="h-4 w-4 text-sky-400 group-hover:scale-125 transition-transform" />;
  };

  const getProbabilityColor = (prob) => {
    const p = prob?.toLowerCase() || "";
    if (p.includes("high") || p.includes("likely")) return "text-emerald-400 font-black";
    if (p.includes("low") || p.includes("unlikely")) return "text-rose-400 font-bold";
    return "text-sky-400 font-semibold";
  };

  return (
    <Card className="premium-glass h-full p-6 flex flex-col group overflow-hidden">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 premium-border transition-all group-hover:bg-purple-500/20 group-hover:rotate-6">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-black italic tracking-tight text-white">Legal Outcomes</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-purple-400/80">Simulation Engine v2</p>
          </div>
        </div>
      </div>

      <div className="relative flex-1 space-y-4">
        <AnimatePresence mode="popLayout">
          {hasSims ? simulations.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 200 }}
              className="group/item relative rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent p-5 backdrop-blur-sm transition-all hover:border-purple-500/40 hover:bg-white/[0.08]"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-900/50 flex items-center justify-center border border-white/5">
                    {getIcon(item.scenario)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 tracking-tight leading-none truncate max-w-[150px]">
                    {item.scenario}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Impact</span>
                  <span className={cn("text-[10px] uppercase tracking-tighter", getProbabilityColor(item.probability))}>
                    {item.probability}
                  </span>
                </div>
              </div>
              
              <div className="relative pl-3 border-l-2 border-purple-500/20 py-1 transition-all group-hover/item:border-purple-500/50">
                <p className="text-[11px] leading-relaxed text-slate-400 font-medium group-hover/item:text-slate-200 transition-colors">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 mr-2">Core Logic:</span>
                  {item.reasoning}
                </p>
              </div>
            </motion.div>
          )) : (
            <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
              <Activity className="h-10 w-10 text-slate-700 animate-pulse mb-4" />
              <p className="text-xs text-slate-600 font-bold italic">Predicting stochastic futures...</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-purple-500/5 px-4 py-2 border border-purple-500/10">
        <p className="text-[9px] font-bold text-purple-400/60 uppercase tracking-[0.15em] text-center">
          Projections powered by agentic neural reasoning
        </p>
      </div>
    </Card>
  );
}
