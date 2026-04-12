const isProd =
  import.meta.env.PROD ||
  (typeof process !== "undefined" && process?.env?.NODE_ENV === "production");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getMockResponse(endpoint) {
  if (endpoint === "/analyse") {
    return {
      document_id: "demo-doc",
      document_type: "Legal Document",
      summary: "Demo response (AI disabled in deployed version)",
      key_points: [
        "This is a production demo mode response.",
        "Full AI analysis is available in local/full deployment.",
      ],
      risks: [],
      strategy: [],
      simulations: [],
      case_type: "civil",
      timeline_estimate: "Unknown",
      timeline_stages: [],
    };
  }

  if (endpoint === "/chat") {
    return {
      reply: "Demo response (AI disabled in deployed version)",
    };
  }

  if (endpoint === "/send-report") {
    return {
      status: "success",
    };
  }

  return {
    success: true,
    data: "Demo response (AI disabled in deployed version)",
  };
}

export const apiCall = async (endpoint, options = {}) => {
  if (isProd) {
    console.log("Mock API (Production)");
    await wait(800);
    return getMockResponse(endpoint);
  }

  const res = await fetch(`http://localhost:8000${endpoint}`, options);
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
