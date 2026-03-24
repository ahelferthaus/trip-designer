# Secure API Proxy for TripDesigner

Move OpenAI/Claude/Gemini calls from browser to Vercel serverless functions. Keys become server-side only, never exposed to clients.

---

## STEP 1: Install Vercel CLI locally (for dev testing)

```bash
npm i -g vercel
```

---

## STEP 2: Create `api/generate.ts` (Vercel serverless function)

This is the secure endpoint that calls OpenAI/Claude/Gemini.

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body as { messages: Array<{ role: string; content: string }> };

  if (!messages) {
    return res.status(400).json({ error: "Missing messages" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content ?? "{}";
    return res.status(200).json({ content });
  } catch (err) {
    console.error("OpenAI error:", err);
    return res.status(500).json({ error: "LLM request failed" });
  }
}
```

---

## STEP 3: Create `api/refine.ts` (same pattern for refinement)

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

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
```

---

## STEP 4: Update `src/lib/llmClient.ts`

Replace the client-side OpenAI calls with fetch to your own API.

```typescript
interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Detect if we're running on Vercel (has API routes) or locally
const isVercel = typeof window !== "undefined" && window.location.hostname.includes("vercel.app");
const API_BASE = isVercel ? "" : "http://localhost:3000"; // Adjust if running vercel dev locally

export async function callLLM(messages: LLMMessage[]): Promise<string> {
  // Try Vercel API first (secure, key hidden)
  try {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return data.content;
  } catch (err) {
    console.log("Vercel API failed, falling back to client-side:", err);
  }

  // Fallback: client-side with user's own key (for local dev without Vercel)
  return callClientSideLLM(messages);
}

async function callClientSideLLM(messages: LLMMessage[]): Promise<string> {
  // This is the existing multi-LLM fallback code, only used:
  // 1. During local dev without vercel dev running
  // 2. If user explicitly wants client-side with their own key
  
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (openaiKey) {
    try { return await callOpenAI(messages, openaiKey); }
    catch (e) { console.log("OpenAI failed:", e); }
  }
  if (anthropicKey) {
    try { return await callAnthropic(messages, anthropicKey); }
    catch (e) { console.log("Claude failed:", e); }
  }
  if (geminiKey) {
    try { return await callGemini(messages, geminiKey); }
    catch (e) { console.log("Gemini failed:", e); }
  }

  throw new Error("All LLMs failed. Add OPENAI_API_KEY to Vercel env vars, or add VITE_OPENAI_API_KEY to .env for local dev.");
}

// Keep the existing callOpenAI, callAnthropic, callGemini functions for fallback
```

---

## STEP 5: Update `package.json` devDependencies

```bash
npm install --save-dev @vercel/node
```

Add to `package.json` scripts:
```json
"dev:api": "vercel dev"
```

---

## STEP 6: Create `vercel.json` at project root (if not exists)

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## STEP 7: Environment Variables for Vercel

**LOCAL** (`.env` file):
```
# For local dev without vercel dev server - optional
VITE_OPENAI_API_KEY=sk-...
```

**VERCEL** (Dashboard → Settings → Environment Variables):
```
OPENAI_API_KEY=sk-...           # No VITE_ prefix! Server-side only
ANTHROPIC_API_KEY=sk-ant-...    # Optional, for proxy fallback
GEMINI_API_KEY=AIza...          # Optional, for proxy fallback
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

## STEP 8: Test locally

```bash
# Terminal 1: Run Vercel dev server (includes API routes)
vercel dev

# Or if you want the React dev server separately:
npm run dev

# Then in another terminal:
vercel dev --listen 3000
```

The API will be at `http://localhost:3000/api/generate`

---

## STEP 9: Deploy

```bash
vercel --prod
```

Or push to GitHub → Vercel auto-deploys.

---

## How it works now

| Before (insecure) | After (secure) |
|-------------------|----------------|
| Browser → OpenAI (key visible in JS) | Browser → Your API (no key) → OpenAI (key server-side) |
| Anyone can steal key from DevTools | Key never leaves Vercel servers |
| Share URL = share your key | Share URL = people use your app, can't steal key |

**Users still see**: Same app, works the same, costs you the same OpenAI tokens. **They just can't scrape the key.**

---

## Optional: Rate limiting

Add this to `api/generate.ts` to prevent abuse:

```typescript
// Simple in-memory rate limiter (resets on cold start, good enough for family/friends)
const RATE_LIMIT = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60 * 1000; // 1 minute
  const max = 10; // 10 requests per minute per IP

  const current = RATE_LIMIT.get(ip);
  if (!current || now > current.reset) {
    RATE_LIMIT.set(ip, { count: 1, reset: now + window });
    return true;
  }
  if (current.count >= max) return false;
  current.count++;
  return true;
}

// In handler:
const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
if (!checkRateLimit(ip as string)) {
  return res.status(429).json({ error: "Rate limited. Try again in a minute." });
}
```

---

## Quality bar
- TypeScript strict, no `any`
- `npm run build` must pass (build doesn't include /api folder, that's server-side)
- Fallback works: if Vercel API fails, falls back to client-side with user's key
- Error messages are user-friendly
