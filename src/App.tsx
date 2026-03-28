import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TripStoreProvider } from "./store/tripStore";
import { ItineraryStoreProvider } from "./store/itineraryStore";
import { ThemeProvider } from "./store/themeStore";
import { AuthProvider } from "./store/authStore";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import IntakePage from "./pages/IntakePage";
import ItineraryPage from "./pages/ItineraryPage";
import JoinPage from "./pages/JoinPage";
import ThemePage from "./pages/ThemePage";
import TripsPage from "./pages/TripsPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import ExplorePage from "./pages/ExplorePage";
import TripDetailPage from "./pages/TripDetailPage";
import FeedPage from "./pages/FeedPage";
import OnboardingPage from "./pages/OnboardingPage";
import PhotoBookPage from "./pages/PhotoBookPage";
import PostcardPage from "./pages/PostcardPage";
import TripMoviePage from "./pages/TripMoviePage";
import SeedTripsPage from "./pages/SeedTripsPage";
import ApiTestPage from "./pages/ApiTestPage";
import ProfilePage from "./pages/ProfilePage";
import UnpackedPage from "./pages/UnpackedPage";
import BottomTabBar from "./components/BottomTabBar";
import AppHeader from "./components/AppHeader";
import { useEffect } from "react";
import { getSpaceBackground, preloadSpaceBackground } from "./lib/spaceBackgrounds";
import SpaceEffects from "./components/SpaceEffects";
import ErrorBoundary from "./components/ErrorBoundary";

function SpaceBackgroundSetter() {
  useEffect(() => {
    preloadSpaceBackground();
    const url = getSpaceBackground();
    document.documentElement.style.setProperty("--space-bg", `url('${url}')`);
  }, []);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TripStoreProvider>
          <ItineraryStoreProvider>
            <BrowserRouter>
              <SpaceBackgroundSetter />
              <SpaceEffects />
              <AppHeader />
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<ErrorBoundary><LandingPage /></ErrorBoundary>} />
                  <Route path="/home" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
                  <Route path="/auth" element={<ErrorBoundary><AuthPage /></ErrorBoundary>} />
                  <Route path="/intake" element={<ErrorBoundary><IntakePage /></ErrorBoundary>} />
                  <Route path="/itinerary" element={<ErrorBoundary><ItineraryPage /></ErrorBoundary>} />
                  <Route path="/join/:inviteCode" element={<ErrorBoundary><JoinPage /></ErrorBoundary>} />
                  <Route path="/theme" element={<ErrorBoundary><ThemePage /></ErrorBoundary>} />
                  <Route path="/trips" element={<ErrorBoundary><TripsPage /></ErrorBoundary>} />
                  <Route path="/settings" element={<ErrorBoundary><SettingsPage /></ErrorBoundary>} />
                  <Route path="/explore" element={<ErrorBoundary><ExplorePage /></ErrorBoundary>} />
                  <Route path="/trip/:tripId" element={<ErrorBoundary><TripDetailPage /></ErrorBoundary>} />
                  <Route path="/feed" element={<ErrorBoundary><FeedPage /></ErrorBoundary>} />
                  <Route path="/onboarding" element={<ErrorBoundary><OnboardingPage /></ErrorBoundary>} />
                  <Route path="/book/:tripId" element={<ErrorBoundary><PhotoBookPage /></ErrorBoundary>} />
                  <Route path="/postcard" element={<ErrorBoundary><PostcardPage /></ErrorBoundary>} />
                  <Route path="/movie" element={<ErrorBoundary><TripMoviePage /></ErrorBoundary>} />
                  <Route path="/admin/seed" element={<ErrorBoundary><SeedTripsPage /></ErrorBoundary>} />
                  <Route path="/admin/api-test" element={<ErrorBoundary><ApiTestPage /></ErrorBoundary>} />
                  <Route path="/profile/:userId" element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
                  <Route path="/unpacked" element={<ErrorBoundary><UnpackedPage /></ErrorBoundary>} />
                </Routes>
              </ErrorBoundary>
              <BottomTabBar />
            </BrowserRouter>
          </ItineraryStoreProvider>
        </TripStoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
