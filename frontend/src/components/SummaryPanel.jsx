import { Card } from "./ui/card";
import { BadgeCheck, Info, Mail } from "lucide-react";
import { toast } from "sonner";
import { apiCall } from "../utils/api";

const isProd =
  import.meta.env.PROD ||
  (typeof process !== "undefined" && process?.env?.NODE_ENV === "production");

export function SummaryPanel({ analysis, originalLanguage, onToggle }) {
  const handleEmailReport = async () => {
    const email = window.prompt("Enter recipient email address:");
    if (!email) return;

    try {
      await apiCall("/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, analysis }),
      });
      toast.success("Report emailed successfully!");
    } catch {
      toast.error("Error sending report.");
    }
  };

  return (
    <Card className="premium-glass h-full p-6 animate-fadeIn transition-all duration-300 hover:shadow-premium">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-white">Legal Summary</h2>
        <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
          {analysis.document_type || "Document"}
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm leading-relaxed text-slate-300 font-light italic">
            "{analysis.summary}"
          </p>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Key Findings
          </h3>
          <ul className="list-none space-y-3 pl-0 text-sm text-slate-300">
            {analysis.key_points?.map((point, index) => (
              <li key={`${point}-${index}`} className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-3">
        {isProd ? (
          <p className="w-full text-xs text-slate-500">Feature available in full version</p>
        ) : null}

        <button
          onClick={onToggle}
          className="group flex items-center gap-2 rounded-lg border border-slate-800 bg-black/40 px-4 py-2 text-xs font-semibold text-slate-400 transition-all hover:border-primary/50 hover:text-white"
        >
          <Info className="h-3.5 w-3.5" />
          {originalLanguage ? "Hide Metadata" : "View Extracted Facts"}
        </button>

        <button
          onClick={handleEmailReport}
          className="group flex items-center gap-2 rounded-lg border border-slate-800 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white"
        >
          <Mail className="h-3.5 w-3.5" />
          Email Report
        </button>

        {originalLanguage ? (
          <div className="w-full mt-4 rounded-lg bg-slate-900/50 p-4 border border-slate-800 animate-fadeIn">
            <p className="text-[11px] leading-relaxed text-slate-500">
              Agentic Reasoner Note: This summary was generated using multi-agent verification. 
              The original legal phrasing has been cross-referenced with judicial precedents 
              to ensure high accuracy and simplification without loss of intent.
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
