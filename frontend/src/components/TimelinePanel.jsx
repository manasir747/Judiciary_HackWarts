import { Card } from "./ui/card";
import { Gavel, Clock } from "lucide-react";

export function TimelinePanel({ analysis }) {
  return (
    <Card className="premium-glass h-full p-6  transition-all duration-300 hover:shadow-premium">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
          <Gavel className="h-5 w-5 text-primary" />
          Judicial Timeline
        </h2>
        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
          {analysis.case_type || "Standard"}
        </span>
      </div>

      <div className="mb-8 flex items-end gap-3 rounded-xl bg-white/5 p-4 border border-white/5">
        <Clock className="mb-1.5 h-6 w-6 text-primary" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Estimated Duration</p>
          <p className="text-3xl font-extrabold tracking-tight text-white">{analysis.timeline_estimate}</p>
        </div>
      </div>

      <div className="space-y-6">
        {analysis.timeline_stages?.map((stage, index) => (
          <div key={`${stage.stage}-${index}`} className="relative pl-8">
            <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background shadow-[0_0_10px_rgba(148,163,184,0.3)]" />
            {index < analysis.timeline_stages.length - 1 ? (
              <span className="absolute left-[5.5px] top-6 h-10 w-px bg-slate-800" />
            ) : null}
            <p className="text-sm font-bold text-slate-200">{stage.stage}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{stage.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-black/40 p-4 border border-slate-900">
        <p className="text-[10px] leading-relaxed text-slate-600 uppercase tracking-wider font-bold italic">
          Disclaimer: This projection is an agentic estimate based on judicial patterns. 
          Actual proceedings may vary based on court jurisdiction and representation.
        </p>
      </div>
    </Card>
  );
}
