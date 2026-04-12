import { apiCall } from "../utils/api";

export async function analyseDocument(file, userId) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", userId);
  const data = await apiCall("/analyse", {
    method: "POST",
    body: formData,
  });

  return {
    ...data,
    document_id: data.document_id || "",
  };
}

export async function chatWithDocument(payload) {
  const data = await apiCall("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return data;
}
