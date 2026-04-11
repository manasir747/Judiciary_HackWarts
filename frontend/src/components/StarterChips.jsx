const chips = ["What are my rights?", "What should I do next?", "Explain legal terms"];

export function StarterChips({ onSelect }) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
