import { Card } from "./ui/card";

export function TimelinePanel({ analysis }) {
  return (
    <Card className="h-full animate-fadeIn">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">Case Timeline</h2>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {analysis.case_type}
        </span>
      </div>

      <p className="mb-6 text-3xl font-extrabold tracking-tight text-text">{analysis.timeline_estimate}</p>

      <div className="space-y-4">
        {analysis.timeline_stages?.map((stage, index) => (
          <div key={`${stage.stage}-${index}`} className="relative pl-6">
            <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
            {index < analysis.timeline_stages.length - 1 ? (
              <span className="absolute left-[4px] top-4 h-9 w-px bg-indigo-200" />
            ) : null}
            <p className="text-sm font-semibold text-text">{stage.stage}</p>
            <p className="text-xs text-slate-600">{stage.description}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Disclaimer: Timeline is an estimate based on common Indian judiciary process patterns and document signals.
      </p>
    </Card>
  );
}
