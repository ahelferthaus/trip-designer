// Helper to format dates for different booking sites
function formatDate(date: string, format: "iso" | "us" | "naked"): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date; // fallback to original if invalid
  
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  
  switch (format) {
    case "iso": return `${yyyy}-${mm}-${dd}`; // 2026-03-24
    case "us": return `${mm}/${dd}/${yyyy}`; // 03/24/2026
    case "naked": return `${yyyy}${mm}${dd}`; // 20260324
    default: return date;
  }
}

export function getLodgingLinks(city: string, checkIn: string, checkOut: string) {
  const c = encodeURIComponent(city);
  const checkInISO = formatDate(checkIn, "iso");
  const checkOutISO = formatDate(checkOut, "iso");
  const checkInUS = formatDate(checkIn, "us");
  const checkOutUS = formatDate(checkOut, "us");
  
  return [
    { 
      label: "Airbnb", 
      url: `https://www.airbnb.com/s/${c}/homes?check_in=${checkInISO}&check_out=${checkOutISO}` 
    },
    { 
      label: "VRBO", 
      url: `https://www.vrbo.com/search?destination=${c}&startDate=${checkInISO}&endDate=${checkOutISO}` 
    },
    { 
      label: "Hotels.com", 
      url: `https://www.hotels.com/search.do?q-destination=${c}&q-check-in=${checkInUS}&q-check-out=${checkOutUS}` 
    },
    { 
      label: "Expedia", 
      url: `https://www.expedia.com/Hotel-Search?destination=${c}&startDate=${checkInISO}&endDate=${checkOutISO}` 
    },
  ];
}

export function getFlightsLink(destination: string, startDate: string, endDate?: string) {
  const d = encodeURIComponent(destination);
  // Google Flights format: flights to X on YYYY-MM-DD, optionally returning on YYYY-MM-DD
  if (endDate) {
    return `https://www.google.com/travel/flights?q=Flights%20to%20${d}%20on%20${startDate},%20returning%20on%20${endDate}`;
  }
  return `https://www.google.com/travel/flights?q=Flights%20to%20${d}%20on%20${startDate}`;
}
