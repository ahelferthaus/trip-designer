import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

// Keep the sample route separate from legacy providers: no cloud session,
// itinerary store, social requests, or background media are loaded by the demo.
const LegacyApp = lazy(() => import("./LegacyApp"));
const PalauPilotPage = lazy(() => import("./pages/PalauPilotPage"));
const PrivateTripAccessPage = lazy(() => import("./pages/PrivateTripAccessPage"));
const PilotSignInPage = lazy(() => import("./pages/PilotSignInPage"));

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<div role="status" style={{ padding: 32, background: "#f7f5ef", color: "#153f46", minHeight: "100vh" }}>Loading VYBR…</div>}>
          <Routes>
            <Route path="/pilot/sign-in" element={<PilotSignInPage />} />
            <Route path="/pilot/palau" element={<PalauPilotPage />} />
            <Route path="/pilot/private/:tripId" element={<PrivateTripAccessPage />} />
            <Route path="/pilot/invite" element={<PrivateTripAccessPage />} />
            <Route path="*" element={<LegacyApp />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
