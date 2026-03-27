import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useItineraryStore } from "../store/itineraryStore";
import { useTripStore } from "../store/tripStore";
import { getBookForTrip, generateBookFromTrip, saveBook } from "../lib/photoBook";
import type { PhotoBook, BookPage } from "../lib/photoBook";

// --- Template Styles ---
const TEMPLATES = {
  minimal: {
    bg: "#FAFAF8", text: "#1A1A1A", accent: "#C8A97E",
    secondary: "#888", font: "'Georgia', serif", coverBg: "#1A1A1A",
  },
  scrapbook: {
    bg: "#FFF8F0", text: "#2D2D2D", accent: "#D4524B",
    secondary: "#8B7355", font: "'Palatino', 'Book Antiqua', serif", coverBg: "#2D3436",
  },
};

function PageRenderer({ page, template, isSpread }: { page: BookPage; template: "minimal" | "scrapbook"; isSpread?: boolean }) {
  const t = TEMPLATES[template];
  const h = isSpread ? 500 : 400;

  if (page.type === "cover") {
    return (
      <div className="relative rounded-xl overflow-hidden shadow-2xl" style={{ height: h, backgroundColor: t.coverBg }}>
        {page.photos[0] && (
          <img src={page.photos[0]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-[32px] font-bold text-white leading-tight" style={{ fontFamily: t.font }}>
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-[16px] text-white/70 mt-2" style={{ fontFamily: t.font }}>{page.subtitle}</p>
          )}
        </div>
      </div>
    );
  }

  if (page.type === "title") {
    return (
      <div className="rounded-xl flex flex-col items-center justify-center text-center p-10" style={{ height: h, backgroundColor: t.bg }}>
        <h2 className="text-[28px] font-bold mb-3" style={{ color: t.text, fontFamily: t.font }}>{page.title}</h2>
        {page.subtitle && <p className="text-[15px] mb-2" style={{ color: t.secondary, fontFamily: t.font }}>{page.subtitle}</p>}
        {page.caption && <p className="text-[13px] italic" style={{ color: t.accent, fontFamily: t.font }}>{page.caption}</p>}
        <div className="w-12 h-0.5 mt-6" style={{ backgroundColor: t.accent }} />
      </div>
    );
  }

  if (page.layout === "full-photo" && page.photos[0]) {
    return (
      <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ height: h }}>
        <img src={page.photos[0]} alt="" className="w-full h-full object-cover" />
        {page.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
            <p className="text-[13px] text-white/90" style={{ fontFamily: t.font }}>{page.caption}</p>
          </div>
        )}
      </div>
    );
  }

  if (page.layout === "two-photo") {
    return (
      <div className="rounded-xl overflow-hidden" style={{ height: h, backgroundColor: t.bg }}>
        <div className="flex h-[60%]">
          {page.photos.slice(0, 2).map((url, i) => (
            <div key={i} className="flex-1 overflow-hidden">
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="p-5">
          {page.title && <h3 className="text-[18px] font-bold mb-1" style={{ color: t.text, fontFamily: t.font }}>{page.title}</h3>}
          {page.subtitle && <p className="text-[12px] mb-1" style={{ color: t.secondary }}>{page.subtitle}</p>}
          {page.caption && <p className="text-[13px] leading-snug" style={{ color: t.secondary, fontFamily: t.font }}>{page.caption}</p>}
        </div>
      </div>
    );
  }

  if (page.layout === "photo-text") {
    return (
      <div className="rounded-xl overflow-hidden flex flex-col" style={{ height: h, backgroundColor: t.bg }}>
        {page.photos[0] && (
          <div className="h-[55%] overflow-hidden">
            <img src={page.photos[0]} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 p-5">
          {page.title && <h3 className="text-[18px] font-bold mb-1" style={{ color: t.text, fontFamily: t.font }}>{page.title}</h3>}
          {page.subtitle && <p className="text-[12px] mb-1" style={{ color: t.secondary }}>{page.subtitle}</p>}
          {page.caption && <p className="text-[13px] leading-relaxed" style={{ color: t.secondary, fontFamily: t.font }}>{page.caption}</p>}
        </div>
      </div>
    );
  }

  if (page.layout === "map-spread") {
    return (
      <div className="rounded-xl overflow-hidden" style={{ height: h, backgroundColor: "#0B1D33" }}>
        {page.photos[0] ? (
          <img src={page.photos[0]} alt="Route map" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white/50 text-[14px]">Map preview available with Mapbox token</p>
          </div>
        )}
        {page.title && (
          <div className="absolute bottom-4 left-5">
            <h3 className="text-[20px] font-bold text-white drop-shadow-lg" style={{ fontFamily: t.font }}>{page.title}</h3>
          </div>
        )}
      </div>
    );
  }

  // Stats page
  if (page.type === "stats" && page.stats) {
    return (
      <div className="rounded-xl flex flex-col items-center justify-center text-center p-8" style={{ height: h, backgroundColor: t.bg }}>
        <h3 className="text-[22px] font-bold mb-6" style={{ color: t.text, fontFamily: t.font }}>{page.title}</h3>
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          {Object.entries(page.stats).map(([key, val]) => (
            <div key={key} className="rounded-xl p-3" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
              <div className="text-[20px] font-bold" style={{ color: t.accent }}>{val}</div>
              <div className="text-[11px] uppercase tracking-wide mt-0.5" style={{ color: t.secondary }}>{key}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Text-only / ending
  return (
    <div className="rounded-xl flex flex-col items-center justify-center text-center p-8" style={{ height: h, backgroundColor: t.bg }}>
      {page.title && <h3 className="text-[24px] font-bold mb-2" style={{ color: t.text, fontFamily: t.font }}>{page.title}</h3>}
      {page.caption && <p className="text-[14px]" style={{ color: t.secondary, fontFamily: t.font }}>{page.caption}</p>}
      {page.type === "ending" && <div className="w-8 h-0.5 mt-6" style={{ backgroundColor: t.accent }} />}
    </div>
  );
}

export default function PhotoBookPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { itinerary } = useItineraryStore();
  const { form } = useTripStore();

  const [book, setBook] = useState<PhotoBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [saving, setSaving] = useState(false);

  // Load or generate book
  useEffect(() => {
    if (!tripId || !user) { setLoading(false); return; }
    (async () => {
      let existing = await getBookForTrip(tripId);
      if (!existing && itinerary && form) {
        existing = await generateBookFromTrip(tripId, user.id, itinerary, form);
      }
      setBook(existing);
      setLoading(false);
    })();
  }, [tripId, user, itinerary, form]);

  const handleSave = useCallback(async () => {
    if (!book) return;
    setSaving(true);
    await saveBook(book.id, { pages: book.pages, title: book.title, subtitle: book.subtitle, template: book.template });
    setSaving(false);
  }, [book]);

  const handleTemplateChange = (t: "minimal" | "scrapbook") => {
    if (!book) return;
    setBook({ ...book, template: t });
  };

  const handlePageCaptionEdit = (pageIdx: number, caption: string) => {
    if (!book) return;
    const pages = [...book.pages];
    pages[pageIdx] = { ...pages[pageIdx], caption };
    setBook({ ...book, pages });
  };

  const handleExportPDF = () => {
    // PDF export would use html2canvas + jsPDF
    // For now, show a coming-soon message
    alert("PDF export coming soon! Your book draft is saved.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--td-bg)" }}>
        <div className="text-center">
          <svg className="animate-spin w-8 h-8 mx-auto mb-3" fill="none" viewBox="0 0 24 24" style={{ color: "var(--td-accent)" }}>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-[14px]" style={{ color: "var(--td-secondary)" }}>Creating your photo book…</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "var(--td-bg)" }}>
        <div className="text-5xl mb-4">📖</div>
        <h2 className="text-[22px] font-bold mb-2" style={{ color: "var(--td-label)" }}>No photos yet</h2>
        <p className="text-[15px] text-center mb-6" style={{ color: "var(--td-secondary)" }}>
          Add photos to your trip activities first, then come back to create your book.
        </p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-2xl text-[17px] font-semibold"
          style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}>
          Go Back
        </button>
      </div>
    );
  }

  const page = book.pages[currentPage];
  const totalPages = book.pages.length;

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ backgroundColor: "#1A1A1A" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 safe-top">
        <button onClick={() => navigate(-1)} className="text-[15px] font-medium text-white/70 active:opacity-70">
          ‹ Back
        </button>
        <h1 className="text-[15px] font-semibold text-white">{book.title}</h1>
        <button onClick={handleSave} disabled={saving} className="text-[13px] font-semibold text-white/70 active:opacity-70">
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Template picker */}
      <div className="flex gap-2 px-4 mb-3">
        {(["minimal", "scrapbook"] as const).map(t => (
          <button
            key={t}
            onClick={() => handleTemplateChange(t)}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold active:opacity-70"
            style={{
              backgroundColor: book.template === t ? TEMPLATES[t].accent : "rgba(255,255,255,0.1)",
              color: "white",
            }}
          >
            {t === "minimal" ? "Minimal Luxury" : "Family Scrapbook"}
          </button>
        ))}
      </div>

      {/* Main preview */}
      <div className="flex-1 px-4">
        <div className="relative">
          <PageRenderer page={page} template={book.template} isSpread />

          {/* Page number */}
          <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "white" }}>
            {currentPage + 1} / {totalPages}
          </div>
        </div>

        {/* Caption editor */}
        {page.type === "day" && (
          <div className="mt-3">
            <input
              type="text"
              value={page.caption || ""}
              onChange={e => handlePageCaptionEdit(currentPage, e.target.value)}
              placeholder="Add a caption…"
              className="w-full px-4 py-3 rounded-xl text-[14px] bg-transparent focus:outline-none"
              style={{ color: "white", border: "1px solid rgba(255,255,255,0.15)" }}
            />
          </div>
        )}
      </div>

      {/* Page thumbnails */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {book.pages.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCurrentPage(i)}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${currentPage === i ? "ring-2 ring-white scale-105" : "opacity-60"}`}
              style={{ width: 56, height: 72 }}
            >
              <div className="w-full h-full flex items-center justify-center text-[8px] font-bold"
                style={{
                  backgroundColor: p.photos[0] ? undefined : TEMPLATES[book.template].bg,
                  color: TEMPLATES[book.template].text,
                }}>
                {p.photos[0] ? (
                  <img src={p.photos[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{p.type === "cover" ? "Cover" : p.type === "ending" ? "End" : p.dayNumber ? `D${p.dayNumber}` : p.type.slice(0, 4)}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-4 pt-2 flex gap-2">
        <button
          onClick={handleExportPDF}
          className="flex-1 py-3.5 rounded-2xl text-[15px] font-semibold active:opacity-70"
          style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
        >
          Export PDF
        </button>
        <button
          className="flex-1 py-3.5 rounded-2xl text-[15px] font-bold active:opacity-70"
          style={{ backgroundColor: TEMPLATES[book.template].accent, color: "white" }}
          onClick={() => alert("Print ordering coming soon! Save your draft for now.")}
        >
          Order Print
        </button>
      </div>
    </div>
  );
}
