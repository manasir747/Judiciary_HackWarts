const chips = ["What are my rights?", "Summarize the risks", "Legal terms explained"];

export function StarterChips({ onSelect }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2 animate-fadeIn">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className="rounded-full border border-white/5 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-all hover:bg-white/10 hover:border-primary/30 hover:text-white"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
