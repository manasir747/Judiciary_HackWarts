import { useState } from "react";
import { SendHorizontal, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { chatWithDocument } from "../lib/api";
import { useLexStore } from "../store/useLexStore";
import { ChatBubble } from "./ChatBubble";
import { StarterChips } from "./StarterChips";
import { Card } from "./ui/card";

function TypingIndicator() {
  return (
    <div className="mb-3 flex justify-start animate-fadeIn">
      <div className="rounded-2xl bg-slate-800 px-3 py-2 border border-white/5">
        <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
        <span className="typing-dot ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
        <span className="typing-dot ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
      </div>
    </div>
  );
}

export function ChatPanel() {
  const [draft, setDraft] = useState("");
  const { documentId, messages, addMessage, aiTyping, setAiTyping } = useLexStore();

  async function submitMessage(input) {
    if (aiTyping) {
      return;
    }

    const message = input?.trim();
    if (!message) {
      return;
    }
    // We no longer strictly require documentId for general chatting
    // The backend handles document_id: null for general queries
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user" && lastMessage?.message?.trim() === message) {
      return;
    }


    addMessage({ role: "user", message });
    setDraft("");
    setAiTyping(true);

    try {
      const data = await chatWithDocument({ document_id: documentId, message });
      addMessage({ role: "ai", message: data.reply });
    } catch (error) {
      const msg = error?.response?.data?.detail || "Unable to get chat response.";
      toast.error(msg);
    } finally {
      setAiTyping(false);
    }
  }

  return (
    <Card className="premium-glass flex flex-col h-full p-6 animate-fadeIn transition-all duration-300 hover:shadow-premium">
      <div className="mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="font-serif text-xl font-bold text-white">Legal Assistant</h2>
      </div>
      
      <StarterChips onSelect={submitMessage} disabled={aiTyping} />

      <div className="mb-4 h-[360px] overflow-y-auto rounded-xl border border-white/5 bg-black/30 p-4 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
             <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-700">
               <MessageSquare className="h-5 w-5" />
             </div>
             <p className="text-xs text-slate-500 font-medium">Ask specific questions about the document's legal implications.</p>
          </div>
        ) : (
          messages.map((m, idx) => <ChatBubble key={`${m.role}-${idx}`} role={m.role} message={m.message} />)
        )}
        {aiTyping ? <TypingIndicator /> : null}
      </div>

      <form
        className="relative flex items-center"
        onSubmit={(e) => {
          e.preventDefault();
          submitMessage(draft);
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask a legal query..."
          className="h-12 w-full rounded-xl border border-white/10 bg-black/50 px-4 pr-12 text-sm text-slate-200 outline-none transition-all focus:border-primary/50 focus:bg-black/70"
        />
        <button
          type="submit"
          className="absolute right-1.5 h-9 w-9 inline-flex items-center justify-center rounded-lg bg-primary text-black transition-all hover:bg-white active:scale-95 disabled:opacity-50"
          disabled={!draft.trim() || aiTyping}
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </form>
    </Card>
  );
}
