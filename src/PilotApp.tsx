import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
const Sample = lazy(() => import('./pages/PalauPilotPage'));
const Access = lazy(() => import('./pages/PrivateTripAccessPage'));
const SignIn = lazy(() => import('./pages/PilotSignInPage'));
const Recovery = lazy(() => import('./pages/PilotRecoveryPage'));
const foundationEnabled = import.meta.env.VITE_VYBR_TRIP_FOUNDATION_ENABLED === 'true';
const TripDashboard = foundationEnabled ? lazy(() => import('./pages/TripDashboardPage')) : () => null;
export default function PilotApp() {
  return <BrowserRouter><ErrorBoundary><Suspense fallback={<p role="status">Loading VYBR…</p>}><Routes>
    {foundationEnabled && <Route path="/pilot/trips" element={<TripDashboard />} />}
    <Route path="/" element={<Navigate to={foundationEnabled ? "/pilot/trips" : "/pilot/sign-in"} replace />} />
    <Route path="/pilot/palau" element={<Sample />} />
    <Route path="/pilot/private/:tripId" element={<Access />} />
    <Route path="/pilot/invite" element={<Access />} />
    <Route path="/pilot/sign-in" element={<SignIn />} />
    <Route path="/pilot/recover" element={<Recovery />} />
    <Route path="*" element={<Navigate to="/pilot/palau" replace />} />
  </Routes></Suspense></ErrorBoundary></BrowserRouter>;
}
