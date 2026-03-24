import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TripStoreProvider } from "./store/tripStore";
import { ItineraryStoreProvider } from "./store/itineraryStore";
import { ThemeProvider } from "./store/themeStore";
import HomePage from "./pages/HomePage";
import IntakePage from "./pages/IntakePage";
import ItineraryPage from "./pages/ItineraryPage";
import JoinPage from "./pages/JoinPage";
import ThemePage from "./pages/ThemePage";
import TripsPage from "./pages/TripsPage";

export default function App() {
  return (
    <ThemeProvider>
      <TripStoreProvider>
        <ItineraryStoreProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/intake" element={<IntakePage />} />
              <Route path="/itinerary" element={<ItineraryPage />} />
              <Route path="/join/:inviteCode" element={<JoinPage />} />
              <Route path="/theme" element={<ThemePage />} />
              <Route path="/trips" element={<TripsPage />} />
            </Routes>
          </BrowserRouter>
        </ItineraryStoreProvider>
      </TripStoreProvider>
    </ThemeProvider>
  );
}
