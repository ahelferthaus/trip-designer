# VYBR Security Remediation — Action Checklist
**Date:** April 1, 2026
**Issue:** OpenAI detected exposed API key in compiled JS bundle and revoked it

---

## Root Cause

Vite embeds any `VITE_` prefixed environment variable into the client-side JavaScript bundle. API keys stored as `VITE_OPENAI_API_KEY`, `VITE_ANTHROPIC_API_KEY`, etc. were baked into the compiled JS at `vybrtravel.com/assets/index-*.js` — publicly downloadable by anyone.

**Code fix deployed:** All client-side LLM key references removed. AI calls now go exclusively through server-side `/api/generate` and `/api/refine` endpoints.

---

## Your Action Items

### 1. Rotate ALL API Keys (URGENT)

| Service | Where to Rotate | Old Key Status |
|---------|----------------|----------------|
| OpenAI | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | **REVOKED by OpenAI** |
| Anthropic | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) | Exposed — rotate now |
| Google Gemini | [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials) | Exposed — rotate now |
| Lulu | Lulu developer dashboard | Exposed — rotate when convenient |
| Thanks.io | Thanks.io dashboard | Exposed — rotate when convenient |
| Mapbox | [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens) | Public by design — but add domain restriction to `vybrtravel.com` |

### 2. Set New Keys in Vercel (Server-Side Only)

Go to: **Vercel Dashboard → trip-designer → Settings → Environment Variables**

Add these WITHOUT the `VITE_` prefix (server-side only, never sent to browser):

```
OPENAI_API_KEY = sk-proj-YOUR-NEW-KEY
ANTHROPIC_API_KEY = sk-ant-YOUR-NEW-KEY
GEMINI_API_KEY = AIzaYOUR-NEW-KEY
```

These are used by `/api/generate.ts` and `/api/refine.ts` on the server. They cascade: OpenAI → Anthropic → Gemini.

### 3. Clean Up Local `.env` File

Remove these lines (no longer needed — all LLM calls go through server):
```
VITE_OPENAI_API_KEY=...        ← DELETE
VITE_ANTHROPIC_API_KEY=...     ← DELETE
VITE_GEMINI_API_KEY=...        ← DELETE
```

Keep these (safe to be client-side):
```
VITE_SUPABASE_URL=...          ← KEEP (public by design)
VITE_SUPABASE_ANON_KEY=...     ← KEEP (public, protected by RLS)
VITE_MAPBOX_TOKEN=...          ← KEEP (public, add domain restriction)
```

Optionally keep for local dev only (not deployed):
```
OPENAI_API_KEY=...             ← For local `vercel dev` server
```

### 4. Restrict Mapbox Token

Go to [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens):
- Edit your token
- Under "URL restrictions", add: `vybrtravel.com`
- This prevents the token from being used on other domains

### 5. Redeploy After Key Rotation

After setting new keys in Vercel:
```bash
npx vercel --prod
```

### 6. Verify

Visit `vybrtravel.com`, open DevTools → Sources → search for `sk-proj-` or `sk-ant-` in the JS files. You should find **zero results**.

Test the API: go to `/admin/api-test` and run tests — LLM should return success.

---

## What's Now Secure (Code Changes Deployed)

- [x] `llmClient.ts` — removed all client-side LLM calls and key references
- [x] `openai.ts` — deleted (dead code with `dangerouslyAllowBrowser: true`)
- [x] `ApiTestPage.tsx` — rewritten to test through server endpoints only
- [x] `SettingsPage.tsx` — removed VITE_ key name references
- [x] `api/generate.ts` — cascades OpenAI → Anthropic → Gemini server-side
- [x] `api/refine.ts` — same cascade
- [x] Production bundle verified: zero API key strings

## Keys That Are OK to Be Public

| Key | Why |
|-----|-----|
| `VITE_SUPABASE_ANON_KEY` | Designed to be public. Security enforced via Row Level Security (RLS) policies on the database. |
| `VITE_MAPBOX_TOKEN` | Designed to be public. Security enforced via domain restrictions in Mapbox dashboard. |

## Keys That Must NEVER Be `VITE_` Prefixed

| Key | Why |
|-----|-----|
| `OPENAI_API_KEY` | Direct billing access. Anyone with this key can make unlimited API calls charged to your account. |
| `ANTHROPIC_API_KEY` | Same — direct billing. |
| `GEMINI_API_KEY` | Same — direct billing. |
| `LULU_API_KEY` | Can place physical print orders charged to your account. |
| `THANKS_IO_API_KEY` | Can send physical postcards charged to your account. |
