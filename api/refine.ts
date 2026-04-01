import type { VercelRequest, VercelResponse } from "@vercel/node";

const RATE_LIMIT = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60 * 1000;
  const max = 10;
  const current = RATE_LIMIT.get(ip);
  if (!current || now > current.reset) {
    RATE_LIMIT.set(ip, { count: 1, reset: now + window });
    return true;
  }
  if (current.count >= max) return false;
  current.count++;
  return true;
}

async function callOpenAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("No OpenAI key");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "gpt-4o", messages, temperature: 0.7, response_format: { type: "json_object" } }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callAnthropic(messages: Array<{ role: string; content: string }>): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("No Anthropic key");
  const system = messages.find(m => m.role === "system")?.content ?? "";
  const userMessages = messages.filter(m => m.role !== "system");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-5-20250514", max_tokens: 8096, system, messages: userMessages }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

async function callGemini(messages: Array<{ role: string; content: string }>): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("No Gemini key");
  const combined = messages.map(m => `${m.role}: ${m.content}`).join("\n\n");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: combined }] }], generationConfig: { responseMimeType: "application/json" } }),
    }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown") as string;
  if (!checkRateLimit(ip)) return res.status(429).json({ error: "Rate limited." });

  const { messages } = req.body as { messages: Array<{ role: string; content: string }> };
  if (!messages) return res.status(400).json({ error: "Missing messages" });

  const providers = [
    { name: "OpenAI", fn: callOpenAI },
    { name: "Anthropic", fn: callAnthropic },
    { name: "Gemini", fn: callGemini },
  ];

  const errors: string[] = [];
  for (const provider of providers) {
    try {
      const content = await provider.fn(messages);
      return res.status(200).json({ content });
    } catch (err) {
      errors.push(`${provider.name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return res.status(500).json({ error: `All providers failed. ${errors.join("; ")}` });
}
