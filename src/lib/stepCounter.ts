/**
 * Step counter using DeviceMotionEvent (broad browser support).
 * Falls back gracefully when not available (desktop, denied permission).
 *
 * Algorithm: low-pass filter on acceleration magnitude, peak detection.
 */

let stepCount = 0;
let isRunning = false;
let lastMagnitude = 0;
let lastStepTime = 0;
let onStepCallback: ((count: number) => void) | null = null;

// Low-pass filter state
let filteredMag = 9.8;
const FILTER_ALPHA = 0.15;

// Peak detection thresholds
const STEP_THRESHOLD = 1.3;    // g-force above filtered baseline
const MIN_STEP_INTERVAL = 300; // ms between steps

function handleMotion(event: DeviceMotionEvent) {
  const acc = event.accelerationIncludingGravity;
  if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

  const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2) / 9.81; // normalize to g

  // Low-pass filter
  filteredMag = filteredMag * (1 - FILTER_ALPHA) + magnitude * FILTER_ALPHA;

  const now = Date.now();
  const delta = magnitude - filteredMag;

  // Peak detection: rising above threshold after being below
  if (
    delta > STEP_THRESHOLD &&
    lastMagnitude <= STEP_THRESHOLD &&
    now - lastStepTime > MIN_STEP_INTERVAL
  ) {
    stepCount++;
    lastStepTime = now;
    onStepCallback?.(stepCount);
  }

  lastMagnitude = delta;
}

/** Check if step counting is available on this device */
export function isStepCounterAvailable(): boolean {
  return typeof DeviceMotionEvent !== "undefined" && "addEventListener" in window;
}

/** Request permission (required on iOS 13+) */
async function requestPermission(): Promise<boolean> {
  // iOS 13+ requires explicit permission
  const dme = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
  if (typeof dme.requestPermission === "function") {
    try {
      const result = await dme.requestPermission();
      return result === "granted";
    } catch {
      return false;
    }
  }
  // Android/desktop: no permission needed
  return true;
}

/**
 * Start counting steps.
 * @returns false if not supported or permission denied
 */
export async function startStepCounter(
  onStep?: (count: number) => void
): Promise<boolean> {
  if (!isStepCounterAvailable()) return false;
  if (isRunning) return true;

  const granted = await requestPermission();
  if (!granted) return false;

  stepCount = 0;
  lastMagnitude = 0;
  lastStepTime = 0;
  filteredMag = 9.8;
  onStepCallback = onStep ?? null;
  isRunning = true;

  window.addEventListener("devicemotion", handleMotion);
  return true;
}

/** Stop counting steps */
export function stopStepCounter(): number {
  if (!isRunning) return stepCount;
  window.removeEventListener("devicemotion", handleMotion);
  isRunning = false;
  onStepCallback = null;
  return stepCount;
}

/** Get current step count */
export function getStepCount(): number {
  return stepCount;
}

/** Check if currently running */
export function isStepCounterRunning(): boolean {
  return isRunning;
}
