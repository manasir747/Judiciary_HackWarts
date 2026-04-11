import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { toast } from "sonner";

import { chatWithDocument } from "../lib/api";
import { useLexStore } from "../store/useLexStore";
import { ChatBubble } from "./ChatBubble";
import { StarterChips } from "./StarterChips";
import { Card } from "./ui/card";

function TypingIndicator() {
  return (
    <div className="mb-3 flex justify-start">
      <div className="rounded-2xl bg-slate-100 px-3 py-2">
        <span className="typing-dot inline-block h-2 w-2 rounded-full bg-slate-400" />
        <span className="typing-dot ml-1 inline-block h-2 w-2 rounded-full bg-slate-400" />
        <span className="typing-dot ml-1 inline-block h-2 w-2 rounded-full bg-slate-400" />
      </div>
    </div>
  );
}

export function ChatPanel() {
  const [draft, setDraft] = useState("");
  const { documentId, messages, addMessage, aiTyping, setAiTyping } = useLexStore();

  async function submitMessage(input) {
    const message = input?.trim();
    if (!message) {
      return;
    }
    if (!documentId) {
      toast.error("Analyse a document before chatting.");
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
    <Card className="h-full animate-fadeIn">
      <h2 className="mb-4 text-lg font-bold text-text">Chat</h2>
      <StarterChips onSelect={submitMessage} />

      <div className="mb-4 h-[360px] overflow-y-auto rounded-xl border border-border bg-white p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">Ask questions about this document.</p>
        ) : (
          messages.map((m, idx) => <ChatBubble key={`${m.role}-${idx}`} role={m.role} message={m.message} />)
        )}
        {aiTyping ? <TypingIndicator /> : null}
      </div>

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submitMessage(draft);
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about this legal document..."
          className="h-11 flex-1 rounded-xl border border-border px-3 text-sm outline-none ring-primary/30 focus:ring"
        />
        <button
          type="submit"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-indigo-500"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </form>
    </Card>
  );
}
