import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Simple rate limiter
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown") as string;
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Rate limited. Try again in a minute." });
  }

  if (!openai) {
    return res.status(500).json({ error: "OpenAI not configured on server" });
  }

  const { messages } = req.body as { messages: Array<{ role: string; content: string }> };
  if (!messages) return res.status(400).json({ error: "Missing messages" });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    return res.status(200).json({ content: response.choices[0].message.content ?? "{}" });
  } catch (err) {
    console.error("OpenAI error:", err);
    return res.status(500).json({ error: "LLM request failed" });
  }
}
