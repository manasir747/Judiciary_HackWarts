import { Card } from "./ui/card";
import { Target, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export function StrategyPanel({ strategy }) {
  const hasStrategy = strategy && strategy.length > 0;

  const getPriorityColor = (priority) => {
    const p = priority?.toLowerCase() || "";
    if (p.includes("critical") || p.includes("high")) return "text-red-400 bg-red-400/10 border-red-400/20";
    if (p.includes("medium")) return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  };

  return (
    <Card className="premium-glass h-full p-6 flex flex-col overflow-hidden group">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 premium-border transition-transform group-hover:scale-110">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-black italic tracking-tight text-white">Strategic Roadmap</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/70 font-bold">Actionable Intel</p>
          </div>
        </div>
      </div>

      <div className="relative flex-1 space-y-8 pl-4 border-l-2 border-white/5 ml-4">
        <AnimatePresence mode="popLayout">
          {hasStrategy ? (
            strategy.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group/item"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[27px] top-1.5 h-4 w-4 rounded-full border-2 border-background bg-emerald-500/20 flex items-center justify-center transition-all group-hover/item:scale-125 group-hover/item:bg-emerald-500">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.05] hover:border-white/10">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                       {item.step}
                    </h3>
                    <span className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest shrink-0",
                      getPriorityColor(item.priority)
                    )}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400 font-medium opacity-80 group-hover/item:opacity-100 transition-opacity">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
               <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="mb-4 h-12 w-12 rounded-full border-b-2 border-emerald-500/30"
               />
               <p className="text-xs text-slate-500 font-medium italic tracking-wide">
                 Formulating battle-ready strategy...
               </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent p-4 border border-emerald-500/10">
        <Zap className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse" />
        <p className="text-[10px] text-emerald-400/90 leading-relaxed font-bold italic tracking-tight">
          Strategy optimized by Llama 3.3 for maximum legal leverage.
        </p>
      </div>
    </Card>
  );
}
