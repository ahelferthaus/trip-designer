import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TripStoreProvider } from "./store/tripStore";
import { ItineraryStoreProvider } from "./store/itineraryStore";
import { ThemeProvider } from "./store/themeStore";
import { AuthProvider } from "./store/authStore";
import HomePage from "./pages/HomePage";
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
import ProfilePage from "./pages/ProfilePage";
import BottomTabBar from "./components/BottomTabBar";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TripStoreProvider>
          <ItineraryStoreProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
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
