# TripDesigner — Next Feature Build

Read all existing code carefully before changing anything. Do NOT break existing functionality. Build must pass `npm run build` with zero errors when done.

---

## TASK 1: Lodging + Flights Section

### Add to `src/lib/types.ts`
Add a `LodgingOption` interface:
```typescript
export interface LodgingOption {
  city: string;
  checkIn: string;
  checkOut: string;
}
```

### Create `src/lib/lodgingLinks.ts`
```typescript
export function getLodgingLinks(city: string, checkIn: string, checkOut: string) {
  const c = encodeURIComponent(city);
  return [
    { label: "Airbnb", url: `https://www.airbnb.com/s/${c}/homes?checkin=${checkIn}&checkout=${checkOut}` },
    { label: "VRBO", url: `https://www.vrbo.com/search/keywords:${c}?arrival=${checkIn}&departure=${checkOut}` },
    { label: "Hotels.com", url: `https://www.hotels.com/search.do?q-destination=${c}&q-check-in=${checkIn}&q-check-out=${checkOut}` },
    { label: "Expedia", url: `https://www.expedia.com/Hotel-Search?destination=${c}&startDate=${checkIn}&endDate=${checkOut}` },
  ];
}

export function getFlightsLink(destination: string, date: string) {
  const d = encodeURIComponent(destination);
  return `https://www.google.com/travel/flights?q=Flights+to+${d}&date=${date}`;
}
```

### Add to `src/lib/generateItinerary.ts`
Add a `hiddenGem` field to the `GeneratedItinerary` type and the prompt:
- Add to the `GeneratedItinerary` interface: `hiddenGems?: { day_number: number; tip: string; location?: string }[]`
- Add to the prompt rules: "Also return a `hiddenGems` array — one entry per day. Each entry: a genuine local secret, non-touristy tip, or under-the-radar spot most visitors miss. Keep each tip under 2 sentences."

### Add Lodging + Flights UI to `src/pages/ItineraryPage.tsx`
Below the sticky nav bar and above the refinement section, add a "Lodging & Flights" card:

```
╔═══════════════════════════════╗
║  ✈️ Flights to {destination}  ║  → Google Flights link
║                               ║
║  🏨 Where to stay             ║
║  Airbnb · VRBO · Hotels.com · Expedia  ║  → all links
╚═══════════════════════════════╝
```

Style: white card with iOS-native look, use CSS variables. Links open in new tab. Collapsible (collapsed by default, tap to expand).

---

## TASK 2: Hidden Gems Section

In `src/pages/ItineraryPage.tsx`, at the END of each day's slots, add a "Hidden Gem" card if `itinerary.hiddenGems` has an entry for that day:

```
🪄 Hidden Gem
[tip text]
[location if available]
```

Style: slightly different background (use a tinted version of --td-accent at low opacity), iOS card, non-tappable but visually distinct.

---

## TASK 3: Multi-LLM Fallback

### Create `src/lib/llmClient.ts`

This is the single LLM abstraction layer for the app. All AI calls go through this.

```typescript
// Priority order: GPT-4o → Claude → Gemini
// Falls back to next if current fails or key missing

interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface LLMConfig {
  openaiKey?: string;       // VITE_OPENAI_API_KEY
  anthropicKey?: string;    // VITE_ANTHROPIC_API_KEY
  geminiKey?: string;       // VITE_GEMINI_API_KEY
}

function getConfig(): LLMConfig {
  return {
    openaiKey: import.meta.env.VITE_OPENAI_API_KEY,
    anthropicKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    geminiKey: import.meta.env.VITE_GEMINI_API_KEY,
  };
}

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

export async function callLLM(messages: LLMMessage[]): Promise<string> {
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

  throw new Error(`All LLMs failed:\n${errors.join("\n")}`);
}

export function getAvailableProviders(): string[] {
  const config = getConfig();
  const providers = [];
  if (config.openaiKey) providers.push("GPT-4o");
  if (config.anthropicKey) providers.push("Claude");
  if (config.geminiKey) providers.push("Gemini");
  return providers;
}
```

### Update `src/lib/generateItinerary.ts`
Replace the OpenAI SDK call with `callLLM()` from `llmClient.ts`. Remove the OpenAI SDK import from this file.

### Update `src/lib/refineItinerary.ts`
Same — replace OpenAI SDK with `callLLM()`.

### Add to `.env.example`
```
VITE_ANTHROPIC_API_KEY=
VITE_GEMINI_API_KEY=
```

### Settings Page — `src/pages/SettingsPage.tsx`
Create a settings page at `/settings`:

- Nav: "‹ Back" + "Settings" title
- Section: "AI Providers"
  - Shows which keys are configured (from import.meta.env) with ✓ green / ✗ grey
  - Note: "Add keys to your .env file to enable additional providers. Priority: GPT-4o → Claude → Gemini"
- Section: "Appearance"
  - Link to /theme
- Section: "Trip Passcode"
  - Show current passcode (default: 1234)
  - Input to change it — saves to localStorage as `td-passcode`
  - Note: "Share this with your travel group"

Update the TRIP_PASSCODE in ItineraryPage to read from localStorage:
```typescript
const TRIP_PASSCODE = localStorage.getItem("td-passcode") ?? "1234";
```

Add Settings gear icon (⚙️) to the HomePage top-right area alongside the theme button.

Add the /settings route to App.tsx.

---

## TASK 4: Vercel Deployment Config

### Create `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
This ensures React Router works on Vercel (all routes serve index.html).

### Update `README.md`
Add a deployment section:
```markdown
## Deploy to Vercel

1. Push to GitHub (already done)
2. Go to vercel.com → Import Project → select `trip-designer`
3. Add environment variables in Vercel dashboard:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_OPENAI_API_KEY (at minimum one LLM key required)
   - VITE_ANTHROPIC_API_KEY (optional)
   - VITE_GEMINI_API_KEY (optional)
4. Deploy — Vercel auto-detects Vite

## Sharing with Friends & Family

Option A — They use your deployed app:
- Share your Vercel URL
- Your API keys stay server-side (in Vercel env vars, never exposed to browser)
- Consider adding rate limiting if usage gets heavy

Option B — They self-host:
- Fork the repo
- Add their own LLM keys to .env
- Deploy their own Vercel instance
```

---

## Quality Bar
- TypeScript strict — no `any`, no unused vars
- All type-only imports use `import type`
- `npm run build` must pass with zero errors
- Do not break existing localStorage fallback
- iOS-native styling throughout using CSS vars
