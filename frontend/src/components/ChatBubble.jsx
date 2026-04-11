export function ChatBubble({ role, message }) {
  const isUser = role === "user";
  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser 
            ? "bg-primary text-black font-bold rounded-tr-none" 
            : "bg-slate-800/80 text-slate-200 border border-white/5 rounded-tl-none"
        }`}
      >
        <div className="whitespace-pre-wrap">{message}</div>
      </div>
    </div>
  );
}
