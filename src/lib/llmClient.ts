interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface LLMConfig {
  openaiKey?: string;
  anthropicKey?: string;
  geminiKey?: string;
}

function getConfig(): LLMConfig {
  return {
    openaiKey: import.meta.env.VITE_OPENAI_API_KEY,
    anthropicKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    geminiKey: import.meta.env.VITE_GEMINI_API_KEY,
  };
}

// Call secure Vercel API (key hidden server-side)
async function callSecureAPI(messages: LLMMessage[], endpoint: "/api/generate" | "/api/refine"): Promise<string> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API ${res.status}`);
  }
  const data = await res.json();
  return data.content;
}

// Client-side fallbacks (only used if secure API fails or for local dev)
async function callOpenAI(messages: LLMMessage[], key: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "gpt-4o", messages, temperature: 0.8, response_format: { type: "json_object" } }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callAnthropic(messages: LLMMessage[], key: string): Promise<string> {
  const system = messages.find(m => m.role === "system")?.content ?? "";
  const userMessages = messages.filter(m => m.role !== "system");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 8096,
      system,
      messages: userMessages,
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

async function callGemini(messages: LLMMessage[], key: string): Promise<string> {
  const combined = messages.map(m => `${m.role}: ${m.content}`).join("\n\n");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: combined }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

// Client-side fallback chain
async function callClientSideLLM(messages: LLMMessage[]): Promise<string> {
  const config = getConfig();
  const errors: string[] = [];

  if (config.openaiKey) {
    try { return await callOpenAI(messages, config.openaiKey); }
    catch (e) { errors.push(`OpenAI: ${e}`); }
  }
  if (config.anthropicKey) {
    try { return await callAnthropic(messages, config.anthropicKey); }
    catch (e) { errors.push(`Anthropic: ${e}`); }
  }
  if (config.geminiKey) {
    try { return await callGemini(messages, config.geminiKey); }
    catch (e) { errors.push(`Gemini: ${e}`); }
  }

  throw new Error(`All LLMs failed. Add OPENAI_API_KEY to Vercel env vars, or add VITE_OPENAI_API_KEY to .env for local dev.\n${errors.join("\n")}`);
}

export async function callLLM(messages: LLMMessage[]): Promise<string> {
  // Try secure API first (server-side key, not exposed)
  try {
    console.log("Trying secure API...");
    const result = await callSecureAPI(messages, "/api/generate");
    console.log("Secure API succeeded");
    return result;
  } catch (err) {
    console.log("Secure API failed, falling back to client-side:", err);
  }

  // Fallback to client-side (for local dev without vercel dev server)
  return callClientSideLLM(messages);
}

export async function callRefineLLM(messages: LLMMessage[]): Promise<string> {
  // Try secure API first
  try {
    return await callSecureAPI(messages, "/api/refine");
  } catch (err) {
    console.log("Secure API failed, trying client-side fallback:", err);
  }

  // Fallback to client-side
  return callClientSideLLM(messages);
}

export function getAvailableProviders(): string[] {
  const config = getConfig();
  const providers: string[] = [];
  if (config.openaiKey) providers.push("GPT-4o");
  if (config.anthropicKey) providers.push("Claude");
  if (config.geminiKey) providers.push("Gemini");
  return providers;
}
