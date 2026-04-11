import { create } from "zustand";

export const useLexStore = create((set) => ({
  file: null,
  documentId: "",
  loading: false,
  analysis: null,
  messages: [],
  aiTyping: false,
  originalLanguage: false,
  setFile: (file) => set({ file }),
  setLoading: (loading) => set({ loading }),
  setAnalysis: (analysis) =>
    set({
      analysis,
      documentId: analysis?.document_id || "",
    }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setAiTyping: (aiTyping) => set({ aiTyping }),
  toggleOriginalLanguage: () =>
    set((state) => ({ originalLanguage: !state.originalLanguage })),
  resetForNewFile: () =>
    set({
      loading: false,
      analysis: null,
      documentId: "",
      messages: [],
      aiTyping: false,
      originalLanguage: false,
    }),
}));
