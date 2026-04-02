import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TestResult {
  name: string;
  status: "pending" | "success" | "failed";
  message: string;
}

export default function ApiTestPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const updateResult = (name: string, status: TestResult["status"], message: string) => {
    setResults(prev => {
      const idx = prev.findIndex(r => r.name === name);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { name, status, message };
        return updated;
      }
      return [...prev, { name, status, message }];
    });
  };

  const runTests = async () => {
    setRunning(true);
    setResults([]);

    // Test LLM via server endpoint (keys hidden server-side)
    updateResult("LLM (Server)", "pending", "Testing...");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Return valid JSON only." },
            { role: "user", content: 'Return: {"test": "ok"}' },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        updateResult("LLM (Server)", "success", `Response: ${data.content?.slice(0, 100)}`);
      } else {
        const err = await res.json().catch(() => ({}));
        updateResult("LLM (Server)", "failed", err.error || `HTTP ${res.status}`);
      }
    } catch (e) {
      updateResult("LLM (Server)", "failed", e instanceof Error ? e.message : "Unknown error");
    }

    // Test Supabase
    updateResult("Supabase", "pending", "Testing...");
    try {
      const { supabase } = await import("../lib/supabase");
      if (!supabase) {
        updateResult("Supabase", "failed", "Not configured");
      } else {
        const { count } = await supabase.from("trips").select("id", { count: "exact", head: true });
        updateResult("Supabase", "success", `Connected — ${count ?? 0} trips`);
      }
    } catch (e) {
      updateResult("Supabase", "failed", e instanceof Error ? e.message : "Unknown error");
    }

    // Test Mapbox
    updateResult("Mapbox", "pending", "Testing...");
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!mapboxToken) {
      updateResult("Mapbox", "failed", "VITE_MAPBOX_TOKEN not set");
    } else {
      try {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/Paris.json?access_token=${mapboxToken}&limit=1`);
        if (res.ok) updateResult("Mapbox", "success", "Geocoding working");
        else updateResult("Mapbox", "failed", `HTTP ${res.status}`);
      } catch (e) {
        updateResult("Mapbox", "failed", e instanceof Error ? e.message : "Unknown error");
      }
    }

    setRunning(false);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ backgroundColor: "var(--td-bg)" }}>
      <div className="px-4 pt-4 pb-2 safe-top flex items-center gap-3">
        <button onClick={() => navigate("/home")} className="text-[17px]" style={{ color: "var(--td-accent)" }}>‹ Home</button>
        <h1 className="text-[17px] font-semibold" style={{ color: "var(--td-label)" }}>API Tests</h1>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>
          Tests server-side API connections. No API keys are exposed to the browser.
        </p>

        <button
          onClick={runTests}
          disabled={running}
          className="w-full py-3.5 rounded-2xl text-[15px] font-semibold active:opacity-70"
          style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
        >
          {running ? "Running..." : "Run All Tests"}
        </button>

        {results.map(r => (
          <div key={r.name} className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: "var(--td-card)" }}>
            <span className="text-[18px]">
              {r.status === "success" ? "✅" : r.status === "failed" ? "❌" : "⏳"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold" style={{ color: "var(--td-label)" }}>{r.name}</p>
              <p className="text-[12px] truncate" style={{ color: "var(--td-secondary)" }}>{r.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
