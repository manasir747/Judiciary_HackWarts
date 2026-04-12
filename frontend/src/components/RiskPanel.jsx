import { Card } from "./ui/card";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";

const SEVERITY_STYLES = {
  high: {
    badge: "text-red-400 bg-red-400/10 border-red-400/30",
    icon: "text-red-400",
    bar: "bg-red-500",
  },
  medium: {
    badge: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    icon: "text-yellow-400",
    bar: "bg-yellow-500",
  },
  low: {
    badge: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    icon: "text-blue-400",
    bar: "bg-blue-500",
  },
};

function getSeverityStyle(severity = "") {
  return SEVERITY_STYLES[severity.toLowerCase()] || SEVERITY_STYLES.low;
}

export function RiskPanel({ risks }) {
  const safeRisks = Array.isArray(risks) ? risks : [];
  const hasRisks = safeRisks.length > 0;

  const highCount = safeRisks.filter(r => r.severity?.toLowerCase() === "high").length;
  const medCount = safeRisks.filter(r => r.severity?.toLowerCase() === "medium").length;
  const lowCount = safeRisks.filter(r => r.severity?.toLowerCase() === "low").length;

  return (
    <Card className="premium-glass h-full p-6  transition-all duration-300 hover:shadow-premium">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-white">Legal Risks</h2>
        <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-500">
          Vulnerabilities
        </span>
      </div>

      {/* Summary Pills */}
      {hasRisks && (
        <div className="mb-5 flex gap-2 flex-wrap">
          {highCount > 0 && (
            <span className="flex items-center gap-1 rounded-full border border-red-400/30 bg-red-400/10 px-2.5 py-0.5 text-[10px] font-bold text-red-400">
              🔴 {highCount} High
            </span>
          )}
          {medCount > 0 && (
            <span className="flex items-center gap-1 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-2.5 py-0.5 text-[10px] font-bold text-yellow-400">
              🟡 {medCount} Medium
            </span>
          )}
          {lowCount > 0 && (
            <span className="flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-400/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-400">
              🔵 {lowCount} Low
            </span>
          )}
        </div>
      )}

      {/* Risk Cards */}
      <div className="space-y-3">
        {hasRisks ? (
          safeRisks.map((item, index) => {
            const style = getSeverityStyle(item.severity);
            return (
              <div
                key={index}
                className="group rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-all duration-200 hover:bg-white/[0.07] hover:border-white/10"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-200 leading-snug">
                    <AlertTriangle className={`h-4 w-4 shrink-0 ${style.icon}`} />
                    {item.risk}
                  </h3>
                  <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${style.badge}`}>
                    {item.severity}
                  </span>
                </div>
                {item.mitigation && (
                  <p className="pl-6 text-xs leading-relaxed text-slate-500 font-light">
                    <span className="text-slate-600 font-medium">Mitigation: </span>
                    {item.mitigation}
                  </p>
                )}
                {/* Severity bar accent */}
                <div className={`mt-3 h-0.5 w-full rounded-full opacity-20 ${style.bar}`} />
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <ShieldCheck className="h-8 w-8 text-slate-700" />
            <p className="text-xs text-slate-600 italic text-center">
              Risk analysis pending. Upload a document to identify legal vulnerabilities.
            </p>
          </div>
        )}
      </div>

      {/* Footer Attribution */}
      <div className="mt-5 flex items-center gap-3 rounded-lg bg-red-500/5 p-3 border border-red-500/10">
        <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
        <p className="text-[10px] text-red-400/70 leading-relaxed font-medium">
          Gemma 2 has flagged these points as critical procedural or legal hazards.
        </p>
      </div>
    </Card>
  );
}
