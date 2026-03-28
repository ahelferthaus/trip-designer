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
import BottomTabBar from "./components/BottomTabBar";
import { useEffect } from "react";
import { getSpaceBackground, preloadSpaceBackground } from "./lib/spaceBackgrounds";

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
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/intake" element={<IntakePage />} />
                <Route path="/itinerary" element={<ItineraryPage />} />
                <Route path="/join/:inviteCode" element={<JoinPage />} />
                <Route path="/theme" element={<ThemePage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/trip/:tripId" element={<TripDetailPage />} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/book/:tripId" element={<PhotoBookPage />} />
                <Route path="/postcard" element={<PostcardPage />} />
                <Route path="/movie" element={<TripMoviePage />} />
                <Route path="/admin/seed" element={<SeedTripsPage />} />
                <Route path="/admin/api-test" element={<ApiTestPage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
              </Routes>
              <BottomTabBar />
            </BrowserRouter>
          </ItineraryStoreProvider>
        </TripStoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
