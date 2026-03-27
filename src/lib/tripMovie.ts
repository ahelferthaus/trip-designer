/**
 * Trip Movie Generator
 * Composites trip photos + text slides into a video using Canvas + MediaRecorder.
 * No server needed — runs entirely in the browser.
 */

export interface MovieSlide {
  type: "title" | "day-intro" | "photo" | "moment" | "stats" | "credits";
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  duration: number; // seconds
  stats?: Record<string, string>;
}

export interface MovieConfig {
  width: number;
  height: number;
  fps: number;
  slides: MovieSlide[];
  accentColor: string;
  title: string;
}

const DEFAULT_CONFIG: Partial<MovieConfig> = {
  width: 1080,
  height: 1920, // 9:16 vertical (Instagram/TikTok ready)
  fps: 30,
  accentColor: "#E63956",
};

/**
 * Load an image from URL, handling CORS.
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${url}`));
    img.src = url;
  });
}

/**
 * Draw a slide frame to canvas with Ken Burns (slow zoom) effect.
 */
function drawSlide(
  ctx: CanvasRenderingContext2D,
  slide: MovieSlide,
  img: HTMLImageElement | null,
  progress: number, // 0-1, how far through this slide
  w: number,
  h: number,
  accent: string
) {
  // Background
  ctx.fillStyle = "#0B1D33";
  ctx.fillRect(0, 0, w, h);

  if (img && (slide.type === "photo" || slide.type === "title" || slide.type === "day-intro")) {
    // Ken Burns: slow zoom from 1.0 to 1.15 + slight pan
    const scale = 1.0 + progress * 0.15;
    const panX = progress * 30;
    const panY = progress * 20;

    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgRatio > canvasRatio) {
      drawH = h * scale;
      drawW = drawH * imgRatio;
    } else {
      drawW = w * scale;
      drawH = drawW / imgRatio;
    }
    drawX = (w - drawW) / 2 - panX;
    drawY = (h - drawH) / 2 - panY;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Dark gradient overlay
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "rgba(0,0,0,0.3)");
    grad.addColorStop(0.5, "rgba(0,0,0,0.1)");
    grad.addColorStop(1, "rgba(0,0,0,0.7)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  // Text fade-in (first 20% of slide)
  const textAlpha = Math.min(1, progress * 5);
  ctx.globalAlpha = textAlpha;

  if (slide.type === "title") {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = `bold 72px -apple-system, sans-serif`;
    ctx.fillText(slide.title || "", w / 2, h * 0.45, w - 100);
    ctx.font = `32px -apple-system, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(slide.subtitle || "", w / 2, h * 0.45 + 60, w - 100);
  }

  if (slide.type === "day-intro") {
    ctx.textAlign = "center";
    // Day number circle
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.4, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = `bold 36px -apple-system, sans-serif`;
    ctx.fillText(slide.subtitle || "", w / 2, h * 0.4 + 12);
    // Title
    ctx.font = `bold 48px -apple-system, sans-serif`;
    ctx.fillStyle = "white";
    ctx.fillText(slide.title || "", w / 2, h * 0.4 + 90, w - 80);
  }

  if (slide.type === "photo") {
    // Caption at bottom
    if (slide.caption) {
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.font = `28px -apple-system, sans-serif`;
      ctx.fillText(slide.caption, w / 2, h - 120, w - 80);
    }
    if (slide.title) {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = `22px -apple-system, sans-serif`;
      ctx.fillText(slide.title, w / 2, h - 80, w - 80);
    }
  }

  if (slide.type === "moment") {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = `italic 36px Georgia, serif`;
    // Word-wrap the quote
    const words = (slide.caption || "").split(" ");
    let lines: string[] = [];
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > w - 120) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    const startY = h * 0.4 - (lines.length * 22);
    lines.forEach((l, i) => {
      ctx.fillText(`"${i === 0 ? "" : ""}${l}${i === lines.length - 1 ? "" : ""}`, w / 2, startY + i * 50);
    });
    if (slide.title) {
      ctx.font = `24px -apple-system, sans-serif`;
      ctx.fillStyle = accent;
      ctx.fillText(`— ${slide.title}`, w / 2, startY + lines.length * 50 + 30);
    }
  }

  if (slide.type === "stats" && slide.stats) {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = `bold 48px -apple-system, sans-serif`;
    ctx.fillText("Trip Stats", w / 2, h * 0.25);

    const entries = Object.entries(slide.stats);
    entries.forEach(([key, val], i) => {
      const y = h * 0.35 + i * 100;
      ctx.font = `bold 56px -apple-system, sans-serif`;
      ctx.fillStyle = accent;
      ctx.fillText(val, w / 2, y);
      ctx.font = `24px -apple-system, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText(key, w / 2, y + 35);
    });
  }

  if (slide.type === "credits") {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = `bold 40px -apple-system, sans-serif`;
    ctx.fillText(slide.title || "Until Next Time", w / 2, h * 0.45);
    ctx.font = `24px -apple-system, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("Made with VYBR", w / 2, h * 0.45 + 50);
  }

  ctx.globalAlpha = 1;
}

/**
 * Generate a trip movie as a video Blob.
 * Returns the blob and calls onProgress during rendering.
 */
export async function generateTripMovie(
  config: MovieConfig,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const { width: w, height: h, fps, slides, accentColor } = { ...DEFAULT_CONFIG, ...config } as Required<MovieConfig>;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Preload all images
  const images: (HTMLImageElement | null)[] = [];
  for (const slide of slides) {
    if (slide.imageUrl) {
      try {
        images.push(await loadImage(slide.imageUrl));
      } catch {
        images.push(null);
      }
    } else {
      images.push(null);
    }
  }

  // Set up MediaRecorder
  const stream = canvas.captureStream(fps);
  const chunks: Blob[] = [];

  // Try WebM first, fall back to mp4
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : MediaRecorder.isTypeSupported("video/webm")
      ? "video/webm"
      : "video/mp4";

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4000000 });
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  const finished = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
  });

  recorder.start();

  // Render each slide frame by frame
  const totalFrames = slides.reduce((sum, s) => sum + s.duration * fps, 0);
  let frameCount = 0;

  for (let slideIdx = 0; slideIdx < slides.length; slideIdx++) {
    const slide = slides[slideIdx];
    const img = images[slideIdx];
    const slideFrames = slide.duration * fps;

    for (let f = 0; f < slideFrames; f++) {
      const progress = f / slideFrames;
      drawSlide(ctx, slide, img, progress, w, h, accentColor);
      frameCount++;
      onProgress?.(Math.round((frameCount / totalFrames) * 100));

      // Wait for next frame
      await new Promise((r) => setTimeout(r, 1000 / fps));
    }
  }

  recorder.stop();
  return finished;
}
