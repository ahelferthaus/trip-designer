import type { ActivityOption } from "./types";

export function getActivityLink(option: ActivityOption, destination?: string): { url: string; label: string } | null {
  const place = option.location?.name ?? option.title;
  const dest = destination ?? "";

  switch (option.category) {
    case "attraction":
      return {
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(option.title.replace(/ /g, "_"))}`,
        label: "Wikipedia",
      };
    case "food":
      return {
        url: `https://www.google.com/maps/search/${encodeURIComponent(place + (dest ? ` ${dest}` : ""))}`,
        label: "Google Maps",
      };
    case "adventure":
      return {
        url: `https://www.viator.com/search/${encodeURIComponent(place)}?text=${encodeURIComponent(option.title)}`,
        label: "Viator",
      };
    case "transport":
      return {
        url: `https://www.rome2rio.com/s/${encodeURIComponent(dest)}/${encodeURIComponent(place)}`,
        label: "Rome2Rio",
      };
    case "rest":
      return {
        url: `https://www.google.com/maps/search/${encodeURIComponent(place + (dest ? ` ${dest}` : ""))}`,
        label: "Google Maps",
      };
    default:
      return null;
  }
}
