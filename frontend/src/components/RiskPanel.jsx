import { Card } from "./ui/card";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export function RiskPanel({ risks }) {
  const hasRisks = risks && risks.length > 0;

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      default:
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    }
  };

  return (
    <Card className="premium-glass h-full p-6 animate-fadeIn transition-all duration-300 hover:shadow-premium">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-white">Legal Risks</h2>
        <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-500">
          Vulnerabilities
        </span>
      </div>

      <div className="space-y-4">
        {hasRisks ? risks.map((item, index) => (
          <div key={index} className="rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                {item.risk}
              </h3>
              <span className={`rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter ${getSeverityColor(item.severity)}`}>
                {item.severity}
              </span>
            </div>
            <p className="pl-6 text-xs leading-relaxed text-slate-400 font-light italic">
              Mitigation: {item.mitigation}
            </p>
          </div>
        )) : (
          <div className="py-8 text-center">
            <p className="text-xs text-slate-500 italic">No legal risks detected or analysis pending...</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-lg bg-red-500/5 p-3 border border-red-500/10">
        <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
        <p className="text-[10px] text-red-400/70 leading-relaxed font-medium">
          Gemma 2 has flagged these points as critical procedural or legal hazards.
        </p>
      </div>
    </Card>
  );
}
