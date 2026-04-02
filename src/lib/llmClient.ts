interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Call secure Vercel API (key hidden server-side)
async function callSecureAPI(messages: LLMMessage[], endpoint: "/api/generate" | "/api/refine"): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `API ${res.status}`);
    }
    const data = await res.json();
    return data.content;
  } finally {
    clearTimeout(timeout);
  }
}

export async function callLLM(messages: LLMMessage[]): Promise<string> {
  return callSecureAPI(messages, "/api/generate");
}

export async function callRefineLLM(messages: LLMMessage[]): Promise<string> {
  return callSecureAPI(messages, "/api/refine");
}

export function getAvailableProviders(): string[] {
  // Server-side providers — we don't expose which keys are configured
  return ["AI (server)"];
}
