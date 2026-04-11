export function ChatBubble({ role, message }) {
  const isUser = role === "user";
  return (
    <div className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-6 ${
          isUser ? "bg-primary text-white" : "bg-slate-100 text-slate-800"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
