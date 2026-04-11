import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 300000, // 5 minutes — multi-agent pipeline can take time
});

export async function analyseDocument(file, userId) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", userId);
  const { data, headers } = await api.post("/analyse", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return {
    ...data,
    document_id: data.document_id || headers["x-document-id"] || "",
  };
}

export async function chatWithDocument(payload) {
  const { data } = await api.post("/chat", payload);
  return data;
}
