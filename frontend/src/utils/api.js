
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://lex-ai-backend-jxnx.onrender.com";

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  
  const res = await fetch(url, options);
  if (!res.ok) {
    let detail = "Request failed";
    try {
      const payload = await res.json();
      detail = payload?.detail || detail;
    } catch {
      // ignore json parse errors and keep default message
    }
    throw new Error(detail);
  }

  return res.json();
};
