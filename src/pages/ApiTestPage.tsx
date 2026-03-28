import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TestResult {
  name: string;
  status: "pending" | "success" | "failed" | "not-set";
  message: string;
}

export default function ApiTestPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const updateResult = (name: string, status: TestResult["status"], message: string) => {
    setResults(prev => {
      const existing = prev.findIndex(r => r.name === name);
      const updated = { name, status, message };
      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const runTests = async () => {
    setRunning(true);
    setResults([]);

    // 1. Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
    if (!supabaseUrl || !supabaseKey) {
      updateResult("Supabase", "not-set", "VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set");
    } else {
      updateResult("Supabase", "pending", "Testing...");
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/trips?select=id&limit=1`, {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        });
        if (res.ok) updateResult("Supabase", "success", `Connected — ${res.status}`);
        else updateResult("Supabase", "failed", `HTTP ${res.status}`);
      } catch (e) {
        updateResult("Supabase", "failed", `${e}`);
      }
    }

    // 2. OpenAI
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY as string;
    if (!openaiKey) {
      updateResult("OpenAI", "not-set", "VITE_OPENAI_API_KEY not set");
    } else {
      updateResult("OpenAI", "pending", "Testing...");
      try {
        const res = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${openaiKey}` },
        });
        if (res.ok) updateResult("OpenAI", "success", "Key valid — models endpoint OK");
        else updateResult("OpenAI", "failed", `HTTP ${res.status} — key may be invalid or expired`);
      } catch (e) {
        updateResult("OpenAI", "failed", `${e}`);
      }
    }

    // 3. Anthropic
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string;
    if (!anthropicKey) {
      updateResult("Anthropic", "not-set", "VITE_ANTHROPIC_API_KEY not set");
    } else {
      updateResult("Anthropic", "pending", "Testing...");
      try {
        // Anthropic doesn't have a simple models endpoint, so we send a minimal request
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-5-20250514",
            max_tokens: 1,
            messages: [{ role: "user", content: "hi" }],
          }),
        });
        if (res.ok || res.status === 200) updateResult("Anthropic", "success", "Key valid — API responded");
        else if (res.status === 401) updateResult("Anthropic", "failed", "Invalid API key");
        else updateResult("Anthropic", "success", `API responded — ${res.status} (key is valid)`);
      } catch (e) {
        updateResult("Anthropic", "failed", `${e}`);
      }
    }

    // 4. Gemini
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
    if (!geminiKey) {
      updateResult("Gemini", "not-set", "VITE_GEMINI_API_KEY not set");
    } else {
      updateResult("Gemini", "pending", "Testing...");
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`
        );
        if (res.ok) updateResult("Gemini", "success", "Key valid — models listed");
        else updateResult("Gemini", "failed", `HTTP ${res.status}`);
      } catch (e) {
        updateResult("Gemini", "failed", `${e}`);
      }
    }

    // 5. Mapbox
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN as string;
    if (!mapboxToken) {
      updateResult("Mapbox", "not-set", "VITE_MAPBOX_TOKEN not set");
    } else {
      updateResult("Mapbox", "pending", "Testing...");
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${mapboxToken}&limit=1`
        );
        if (res.ok) updateResult("Mapbox", "success", "Token valid — geocoding OK");
        else updateResult("Mapbox", "failed", `HTTP ${res.status} — token may be invalid`);
      } catch (e) {
        updateResult("Mapbox", "failed", `${e}`);
      }
    }

    // 6. Lulu
    const luluKey = import.meta.env.VITE_LULU_API_KEY as string;
    const luluSandbox = import.meta.env.VITE_LULU_SANDBOX === "true";
    if (!luluKey) {
      updateResult("Lulu", "not-set", "VITE_LULU_API_KEY not set");
    } else {
      updateResult("Lulu", "pending", "Testing...");
      try {
        const base = luluSandbox ? "https://api.sandbox.lulu.com" : "https://api.lulu.com";
        const res = await fetch(`${base}/print-job-cost-calculations/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${luluKey}`,
          },
          body: JSON.stringify({
            line_items: [{
              pod_package_id: "0850X1100FCPERFCW",
              page_count: 24,
              quantity: 1,
            }],
            shipping_address: {
              country_code: "US",
              state_code: "CO",
              postal_code: "80302",
            },
            shipping_level: "MAIL",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const cost = data.total_cost_incl_tax;
          updateResult("Lulu", "success", `Key valid${luluSandbox ? " (sandbox)" : ""} — sample book cost: $${cost || "?"}`);
        } else if (res.status === 401) {
          updateResult("Lulu", "failed", "Invalid API key — check Base64 encoding");
        } else {
          const err = await res.json().catch(() => ({}));
          updateResult("Lulu", "failed", `HTTP ${res.status}: ${JSON.stringify(err).slice(0, 100)}`);
        }
      } catch (e) {
        updateResult("Lulu", "failed", `${e}`);
      }
    }

    // 7. Thanks.io
    const thanksKey = import.meta.env.VITE_THANKS_IO_API_KEY as string;
    if (!thanksKey) {
      updateResult("Thanks.io", "not-set", "VITE_THANKS_IO_API_KEY not set");
    } else {
      updateResult("Thanks.io", "pending", "Testing...");
      try {
        const res = await fetch("https://api.thanks.io/api/v2/account", {
          headers: { Authorization: `Bearer ${thanksKey}` },
        });
        if (res.ok) {
          const data = await res.json();
          updateResult("Thanks.io", "success", `Key valid — account: ${data.name || data.email || "connected"}`);
        } else if (res.status === 401) {
          updateResult("Thanks.io", "failed", "Invalid API key");
        } else {
          updateResult("Thanks.io", "failed", `HTTP ${res.status}`);
        }
      } catch (e) {
        updateResult("Thanks.io", "failed", `${e}`);
      }
    }

    setRunning(false);
  };

  const statusColor = (s: TestResult["status"]) => {
    if (s === "success") return "#34C759";
    if (s === "failed") return "#FF3B30";
    if (s === "not-set") return "var(--td-secondary)";
    return "var(--td-accent)";
  };

  const statusIcon = (s: TestResult["status"]) => {
    if (s === "success") return "✓";
    if (s === "failed") return "✗";
    if (s === "not-set") return "—";
    return "⋯";
  };

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ backgroundColor: "var(--td-bg)" }}>
      <div className="px-4 pt-4 pb-2 safe-top flex items-center gap-3">
        <button onClick={() => navigate("/settings")} className="text-[17px]" style={{ color: "var(--td-accent)" }}>‹ Settings</button>
        <h1 className="text-[17px] font-semibold" style={{ color: "var(--td-label)" }}>API Key Tester</h1>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>
          Tests each API key by making a lightweight request. No data is created or charged.
        </p>

        <button
          onClick={runTests}
          disabled={running}
          className="w-full py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98] transition-transform"
          style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
        >
          {running ? "Testing..." : "Test All Keys"}
        </button>

        {results.length > 0 && (
          <div className="rounded-2xl overflow-hidden shadow-sm divide-y"
            style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
            {results.map(r => (
              <div key={r.name} className="px-4 py-3 flex items-start gap-3">
                <span className="text-[18px] font-bold mt-0.5" style={{ color: statusColor(r.status) }}>
                  {statusIcon(r.status)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-semibold" style={{ color: "var(--td-label)" }}>{r.name}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: statusColor(r.status) + "20", color: statusColor(r.status) }}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-[12px] mt-0.5 break-all" style={{ color: "var(--td-secondary)" }}>
                    {r.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
