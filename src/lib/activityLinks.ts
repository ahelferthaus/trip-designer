import type { ActivityOption } from "./types";

export function getActivityLink(option: ActivityOption, destination?: string): { url: string; label: string } | null {
  const title = encodeURIComponent(option.title);
  const dest = encodeURIComponent(destination ?? "");
  const query = encodeURIComponent(`${option.title} ${destination ?? ""}`);

  switch (option.category) {
    case "attraction":
      return {
        url: `https://en.wikipedia.org/wiki/Special:Search?search=${title}`,
        label: "Wikipedia",
      };
    case "food":
      return {
        url: `https://www.google.com/maps/search/${query}`,
        label: "Find on Maps",
      };
    case "adventure":
      return {
        url: `https://www.viator.com/search/${dest}?text=${title}`,
        label: "Book on Viator",
      };
    case "transport":
      return {
        url: `https://www.rome2rio.com/s/${dest}`,
        label: "Plan on Rome2Rio",
      };
    case "rest":
      return {
        url: `https://www.booking.com/searchresults.html?ss=${dest}`,
        label: "Find on Booking.com",
      };
    default:
      return {
        url: `https://www.google.com/search?q=${query}`,
        label: "Search",
      };
  }
}

export function getPhotosLink(option: ActivityOption, destination?: string): { url: string; label: string } {
  const query = encodeURIComponent(`${option.title} ${destination ?? ""}`);
  return {
    url: `https://www.google.com/search?tbm=isch&q=${query}`,
    label: "📷 See photos",
  };
}
