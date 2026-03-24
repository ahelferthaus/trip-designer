export function getLodgingLinks(city: string, checkIn: string, checkOut: string) {
  const c = encodeURIComponent(city);
  return [
    { label: "Airbnb", url: `https://www.airbnb.com/s/${c}/homes?checkin=${checkIn}&checkout=${checkOut}` },
    { label: "VRBO", url: `https://www.vrbo.com/search/keywords:${c}?arrival=${checkIn}&departure=${checkOut}` },
    { label: "Hotels.com", url: `https://www.hotels.com/search.do?q-destination=${c}&q-check-in=${checkIn}&q-check-out=${checkOut}` },
    { label: "Expedia", url: `https://www.expedia.com/Hotel-Search?destination=${c}&startDate=${checkIn}&endDate=${checkOut}` },
  ];
}

export function getFlightsLink(destination: string, date: string) {
  const d = encodeURIComponent(destination);
  return `https://www.google.com/travel/flights?q=Flights+to+${d}&date=${date}`;
}
