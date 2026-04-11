import { Card } from "./ui/card";

export function SummaryPanel({ analysis, originalLanguage, onToggle }) {
  return (
    <Card className="h-full animate-fadeIn">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">Summary</h2>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-primary">
          {analysis.document_type}
        </span>
      </div>

      <p className="mb-5 text-sm leading-7 text-slate-700">{analysis.summary}</p>

      <h3 className="mb-2 text-sm font-semibold text-text">Key Points</h3>
      <ul className="mb-5 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {analysis.key_points?.map((point, index) => (
          <li key={`${point}-${index}`}>{point}</li>
        ))}
      </ul>

      <button
        onClick={onToggle}
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {originalLanguage ? "Hide Original Language" : "Original Language"}
      </button>
      {originalLanguage ? (
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          Facts and legal language are preserved in backend extraction for auditability.
        </p>
      ) : null}
    </Card>
  );
}
