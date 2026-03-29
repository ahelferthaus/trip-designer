import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useItineraryStore } from "../store/itineraryStore";
import { useTripStore } from "../store/tripStore";
import { getAllTripPhotos } from "../lib/tripPhotos";
import { getMemorableMoments } from "../lib/supabaseTrips";
import { generateTripMovie } from "../lib/tripMovie";
import { downloadBlob } from "../lib/bookExport";
import type { MovieSlide, MovieConfig } from "../lib/tripMovie";

export default function TripMoviePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cloudTripId = searchParams.get("tripId");
  useAuth(); // ensure auth context is available
  const { itinerary } = useItineraryStore();
  const { form } = useTripStore();

  const [slides, setSlides] = useState<MovieSlide[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const destination = form.destination?.name || itinerary?.title || "Trip";

  // Build slides from trip data
  useEffect(() => {
    if (!itinerary || !cloudTripId) { setLoading(false); return; }
    (async () => {
      const photos = await getAllTripPhotos(cloudTripId);
      const moments = await getMemorableMoments(cloudTripId);

      const movieSlides: MovieSlide[] = [];

      // Title slide
      movieSlides.push({
        type: "title",
        title: itinerary.title || `${destination} Trip`,
        subtitle: `${itinerary.days.length} days of adventure`,
        imageUrl: photos[0]?.photo_url,
        duration: 4,
      });

      // Day slides with photos
      let photoIdx = 0;
      for (const day of itinerary.days) {
        // Day intro
        movieSlides.push({
          type: "day-intro",
          title: day.title || `Day ${day.day_number}`,
          subtitle: String(day.day_number),
          imageUrl: photos[photoIdx]?.photo_url,
          duration: 3,
        });

        // Activity photos for this day
        const dayPhotos = photos.filter(p => p.slot_id.startsWith(`slot-${day.day_number}-`));
        const photosToUse = dayPhotos.length > 0 ? dayPhotos : photos.slice(photoIdx, photoIdx + 2);

        for (const photo of photosToUse.slice(0, 2)) {
          movieSlides.push({
            type: "photo",
            imageUrl: photo.photo_url,
            caption: photo.caption || undefined,
            title: photo.uploader_name,
            duration: 4,
          });
          photoIdx++;
        }
      }

      // Memorable moments
      const momentEntries = Object.entries(moments).filter(([, m]) => m.trim());
      for (const [name, moment] of momentEntries.slice(0, 3)) {
        movieSlides.push({
          type: "moment",
          title: name,
          caption: moment,
          duration: 4,
        });
      }

      // Stats
      movieSlides.push({
        type: "stats",
        duration: 4,
        stats: {
          Days: String(itinerary.days.length),
          Photos: String(photos.length),
          Travelers: String(form.group_members?.length || 1),
          Moments: String(momentEntries.length),
        },
      });

      // Credits
      movieSlides.push({
        type: "credits",
        title: "Until Next Time",
        duration: 3,
      });

      setSlides(movieSlides);
      setLoading(false);
    })();
  }, [itinerary, cloudTripId, destination, form.group_members?.length]);

  const handleGenerate = async () => {
    if (slides.length === 0) return;
    setGenerating(true);
    setProgress(0);

    const config: MovieConfig = {
      width: 1080,
      height: 1920,
      fps: 24, // Lower FPS for faster rendering
      slides,
      accentColor: "#E63956",
      title: itinerary?.title || "Trip Movie",
    };

    try {
      const blob = await generateTripMovie(config, setProgress);
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (err) {
      console.error("Movie generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    // Fetch the blob from the object URL
    fetch(videoUrl).then(r => r.blob()).then(blob => {
      const filename = `${(itinerary?.title || "Trip").replace(/[^a-zA-Z0-9]/g, "_")}_VYBR.webm`;
      downloadBlob(blob, filename);
    });
  };

  const handleShare = async () => {
    if (!videoUrl) return;
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const file = new File([blob], "trip-movie.webm", { type: blob.type });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: itinerary?.title || "Trip Movie" });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  const totalDuration = slides.reduce((s, sl) => s + sl.duration, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1A1A1A" }}>
        <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24" style={{ color: "white" }}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#1A1A1A" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 safe-top">
        <button onClick={() => navigate(-1)} className="text-[15px] font-medium text-white/70 active:opacity-70">
          ‹ Back
        </button>
        <h1 className="text-[15px] font-semibold text-white">Trip Movie</h1>
        <div className="w-12" />
      </div>

      <div className="flex-1 px-4 flex flex-col">
        {/* Video preview or slide preview */}
        {videoUrl ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ maxHeight: "60vh", aspectRatio: "9/16" }}>
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                style={{ backgroundColor: "#000" }}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Slide preview grid */}
            <p className="text-[12px] uppercase tracking-widest text-white/40 font-semibold mb-3 mt-2">
              {slides.length} slides · ~{totalDuration}s
            </p>
            <div className="grid grid-cols-3 gap-2 overflow-y-auto flex-1" style={{ maxHeight: "55vh" }}>
              {slides.map((slide, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden aspect-[9/16] flex items-center justify-center text-center p-2"
                  style={{
                    backgroundColor: slide.imageUrl ? "#1A1A1A" : "#132F4C",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {slide.imageUrl ? (
                    <img src={slide.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div>
                      <p className="text-[10px] font-bold text-white/80">{slide.title || slide.type}</p>
                      {slide.subtitle && <p className="text-[8px] text-white/40 mt-0.5">{slide.subtitle}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Generation progress */}
            {generating && (
              <div className="mt-4">
                <div className="flex justify-between text-[12px] text-white/50 mb-1">
                  <span>Rendering movie…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%`, backgroundColor: "#E63956" }}
                  />
                </div>
                <p className="text-[11px] text-white/30 mt-1 text-center">
                  This may take a minute. Keep this tab open.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-4 pt-3 pb-6 safe-bottom flex flex-col gap-2">
        {videoUrl ? (
          <>
            <button
              onClick={handleShare}
              className="w-full py-4 rounded-2xl text-[17px] font-bold btn-spring"
              style={{ backgroundColor: "#E63956", color: "white", boxShadow: "0 4px 16px rgba(230,57,86,0.3)" }}
            >
              Share Movie
            </button>
            <button
              onClick={handleDownload}
              className="w-full py-3.5 rounded-2xl text-[15px] font-semibold active:opacity-70"
              style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
            >
              Download
            </button>
            <button
              onClick={() => { setVideoUrl(null); setProgress(0); }}
              className="w-full py-3 text-[14px] text-white/50 active:opacity-70"
            >
              Re-generate
            </button>
          </>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={generating || slides.length === 0}
            className="w-full py-4 rounded-2xl text-[17px] font-bold btn-spring gradient-animate"
            style={{
              background: generating ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #E63956, #D42E4A, #E63956)",
              backgroundSize: "200% 200%",
              color: "white",
              boxShadow: generating ? "none" : "0 4px 16px rgba(230,57,86,0.3)",
            }}
          >
            {generating ? `Rendering… ${progress}%` : `Create Movie (${totalDuration}s)`}
          </button>
        )}
      </div>
    </div>
  );
}
