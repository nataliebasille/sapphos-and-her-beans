/**
 * Single-location data for the /locations page. Sappho currently sells in
 * person at exactly one spot — Forest City Vault. Fields marked TODO are
 * placeholders pending real details; no address is invented, and `mapsQuery`
 * searches by name.
 */
export type Stockist = {
  name: string;
  city: string;
  tagline: string;
  blurb: string;
  address?: string;
  mapsQuery: string;
  website?: string;
  phone?: string;
  hours: { day: string; time: string }[];
  highlights: string[];
};

export const FOREST_CITY_VAULT: Stockist = {
  name: "Forest City Vault",
  city: "Cleveland, OH", // TODO: confirm city
  tagline: "Whole beans by the bag, roasted in small batches.",
  blurb:
    "Forest City Vault carries our whole beans by the bag, roasted in small batches. Pick up the full seasonally rotating catalog to brew at home, fresh off the roaster.",
  address: undefined, // TODO: add real street address
  mapsQuery: "Forest City Vault Cleveland",
  website: undefined, // TODO: add real link
  phone: undefined, // TODO: add real phone
  hours: [
    { day: "Mon – Tue", time: "Closed" },
    { day: "Wed – Fri", time: "12:00p – 7:00p" },
    { day: "Sat", time: "11:00a – 7:00p" },
    { day: "Sun", time: "11:00a – 5:00p" },
  ],
  highlights: [
    "Full seasonally rotating catalog",
    "Whole beans to brew at home",
    "LGBTQ+ owned & welcoming",
    "Say hi to the roaster",
  ],
};

export function directionsUrl(s: Stockist): string {
  return `https://maps.google.com/?q=${encodeURIComponent(s.mapsQuery)}`;
}
