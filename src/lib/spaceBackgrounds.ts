/**
 * NASA James Webb Space Telescope backgrounds.
 * All images are public domain (NASA/ESA/CSA).
 * Using Flickr NASA account for reliable CDN URLs.
 */

// Space/nebula images via Unsplash (reliable CDN, free)
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=70", // Nebula
  "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1200&q=70", // Galaxy
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1200&q=70", // Stars
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=70", // Milky Way
  "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1200&q=70", // Deep space
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=70", // Earth from space
  "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1200&q=70", // Nebula purple
  "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200&q=70", // Stars wide
];

/**
 * Get a space background image URL.
 * Rotates daily based on the date, cycling through all images.
 */
export function getSpaceBackground(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  // Use fallback images (more reliable CDN than STScI direct links)
  return FALLBACK_IMAGES[dayOfYear % FALLBACK_IMAGES.length];
}

/**
 * Get a random space background (changes on each page load).
 */
export function getRandomSpaceBackground(): string {
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
}

/**
 * Preload the current background image for instant display.
 */
export function preloadSpaceBackground(): void {
  const img = new Image();
  img.src = getSpaceBackground();
}

// CSS helper — returns inline style for a space background with dark overlay
export function spaceBackgroundStyle(opacity = 0.7): React.CSSProperties {
  return {
    backgroundImage: `linear-gradient(rgba(0,0,0,${opacity}), rgba(0,0,0,${opacity})), url('${getSpaceBackground()}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };
}
