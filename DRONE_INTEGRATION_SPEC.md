# VYBR Drone Footage Integration — Technical Specification
**Date:** March 31, 2026

---

## Overview

Add drone video import, GPS flight path visualization, smart clip extraction, and trip movie integration to VYBR Travel. Designed as a premium feature ("VYBR Pro") to drive subscription revenue.

---

## 1. Video Import Pipeline

### Upload Strategy
- **tus resumable upload protocol** (Supabase Storage v2 supports natively)
- 6 MB chunks, auto-resume on network drops — critical for travelers on spotty connections
- New Supabase Storage bucket: `drone-footage`
- Accept MP4 and MOV (DJI's two output formats)
- **New dependency:** `tus-js-client` (~15 KB gzipped)

### Thumbnail Generation
- In-browser: create `<video>` element, seek to 2s, draw frame to canvas, export JPEG
- Same pattern as existing `imageUtils.ts` resize

### Storage
- MVP: Supabase Storage (100 GB on Pro plan)
- Scale: migrate to Cloudflare R2 (~$0.015/GB/month) when volume grows

---

## 2. GPS/EXIF Extraction

### Three strategies (cascading fallback):

**1. SRT sidecar file (primary)** — DJI records `.SRT` alongside every `.MP4` with per-frame GPS, altitude, speed, gimbal data. Simple regex parse, no library needed. Most reliable.

**2. MP4 metadata atoms (fallback)** — Use `mp4box.js` (~45 KB) to read `moov/udta` atoms. Gets takeoff GPS + duration. Only first few MB read.

**3. EXIF from MOV (fallback)** — Use `exifr` (~20 KB) for QuickTime metadata. Single GPS point.

### Output
Flight path stored as GeoJSON LineString with altitude (3D coordinates):
```json
{
  "type": "Feature",
  "geometry": {
    "type": "LineString",
    "coordinates": [[lng, lat, altitude_m], ...]
  },
  "properties": { "timestamps": [...], "duration_s": 180 }
}
```

---

## 3. Smart Clip Extraction

### MVP: GPS-aware time sampling (no AI needed)
1. Parse SRT flight data for speed/direction/altitude changes
2. Extract 10-15s clips at key moments:
   - Takeoff (establishing shot)
   - Altitude change (ascending/descending reveals)
   - Steady smooth movement (cinematic pans)
   - Landing approach
3. ~15-25 MB per clip at 1080p/8Mbps

### V2: AI-powered scene scoring
- Send 1 keyframe/second (320px) to OpenAI Vision API
- Score segments for visual interest
- Uses existing OpenAI integration

### Processing
- **Not in-browser** (ffmpeg.wasm too heavy for 2GB files)
- Use AWS Lambda + FFmpeg layer (500MB /tmp, 15min timeout) or managed service (Mux/Transloadit)
- Trigger via Supabase Edge Function webhook on upload

---

## 4. 3D Flight Path Visualization

### Rendering on Mapbox 3D Map
- Mapbox GL JS v3 `line-z-offset` paint property for altitude
- **Orange dashed line** (distinct from blue solid ground tracks)
- Drone SVG icon marker along the path
- Camera mode toggle: "Ground View" vs "Drone View"

| Property | Ground Track | Drone Path |
|----------|-------------|------------|
| Color | Blue (#007AFF) | Orange (#FF6B00) |
| Style | Solid | Dashed |
| Altitude | Flat on terrain | Elevated via z-offset |
| Icon | Pulsing dot | Drone SVG |

### In Playback
- Drone icon animates along flight path alongside ground marker
- Journal photo popups appear at drone clip timestamps
- Speed controls work for both ground and drone paths

---

## 5. Trip Movie Integration

### New slide type: `"drone-clip"`
- Load clip into hidden `<video>` element
- Draw video frames to canvas with `ctx.drawImage(videoElement, ...)`
- Same MediaRecorder capture pipeline as photos
- Cross-fade transitions (0.5s overlap) between photo and drone slides

### Slide ordering per day
```
day-intro -> photo -> DRONE-CLIP -> photo -> photo
```
- 1 drone clip per day (highest scored)
- Max 2-3 drone clips per movie total
- Placed between ground photos for visual contrast

---

## 6. Database Schema

### `drone_flights` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| trip_id | uuid FK | |
| user_id | uuid FK | |
| video_url | text | Supabase Storage URL |
| thumbnail_url | text | |
| flight_path | jsonb | GeoJSON with altitude |
| takeoff_lat/lng | double precision | |
| altitude_min/max_m | real | |
| duration_s | real | |
| drone_model | text | e.g. "DJI Mini 4 Pro" |
| srt_data | text | Raw SRT for reprocessing |
| processing_status | text | uploading/uploaded/extracting/ready/error |

### `drone_clips` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| flight_id | uuid FK | |
| clip_url | text | Processed clip URL |
| start_time_s | real | Within source video |
| duration_s | real | 10-15 seconds |
| clip_type | text | takeoff/reveal/pan/descent/auto |
| score | real | Quality score 0-1 |
| clip_path | jsonb | GeoJSON for clip segment |
| include_in_movie | boolean | |

---

## 7. Premium Tier (VYBR Pro)

### Feature gating

| Feature | Free | Pro ($7.99/mo) |
|---------|------|----------------|
| Drone uploads | 1 per trip | Unlimited |
| Flight path on map | 2D only | 3D with altitude |
| Auto clip extraction | 1 clip/flight | 5 clips/flight |
| Drone in trip movie | Watermarked | Full quality |
| Video storage | 2 GB total | 50 GB total |
| Movie export | 720p | 1080p |

### Stripe integration
- `api/create-checkout.ts` — Stripe Checkout session
- `api/stripe-webhook.ts` — handle subscription events
- `user_profiles.tier` column: 'free' | 'pro'
- New dependencies: `@stripe/stripe-js`

---

## 8. Implementation Phases

### Phase 1: Upload + Metadata (1-2 weeks)
Upload drone videos, parse SRT, show thumbnails + GPS data.
- `droneUpload.ts`, `droneMetadata.ts`, `DroneUploadPanel.tsx`

### Phase 2: Flight Path Visualization (1 week)
Drone paths on the 3D map, distinct from ground tracks.
- Extend `LiveRouteMap.tsx`, `TripPlaybackPage.tsx`

### Phase 3: Trip Movie Integration (1-2 weeks)
Drone clips in auto-generated movies.
- Extend `tripMovie.ts`, add `DroneClipPicker.tsx`

### Phase 4: Server-Side Clip Extraction (2-3 weeks)
Automatic best-moment extraction.
- AWS Lambda + FFmpeg, webhook triggers

### Phase 5: Stripe + Premium (1-2 weeks)
Subscription gating and payments.

---

## 9. New Dependencies

| Package | Size | Purpose |
|---------|------|---------|
| `tus-js-client` | ~15 KB | Resumable video upload |
| `mp4box` | ~45 KB | MP4 metadata extraction |
| `exifr` | ~20 KB | EXIF GPS from MOV files |
| `@stripe/stripe-js` | ~30 KB | Payment processing |

---

## 10. Affiliate Opportunity

Rather than selling hardware, partner with DJI as an affiliate:
- "Recommended drone for VYBR" page linking to DJI Mini 4K ($299) / Mini 2 SE ($379)
- 5-8% affiliate commission on referral purchases
- No inventory, shipping, warranty, or liability risk
- Natural funnel: user sees drone features in VYBR -> buys recommended drone -> uploads footage
