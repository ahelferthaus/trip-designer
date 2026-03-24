export interface Theme {
  id: string;
  film: string;
  year: string;
  description: string;
  colors: {
    bg: string;         // page background
    card: string;       // card/surface
    accent: string;     // primary action color
    accentText: string; // text on accent color
    label: string;      // primary text
    secondary: string;  // secondary text
    separator: string;  // dividers
    fill: string;       // inactive fills
    navBg: string;      // nav bar background
  };
  swatch: string[];     // preview swatches
}

export const themes: Theme[] = [
  {
    id: "ios-default",
    film: "Default",
    year: "",
    description: "Classic, clean, predictable. Like a ham sandwich.",
    colors: {
      bg: "#F2F2F7",
      card: "#FFFFFF",
      accent: "#007AFF",
      accentText: "#FFFFFF",
      label: "#000000",
      secondary: "#8E8E93",
      separator: "#E5E5EA",
      fill: "#E5E5EA",
      navBg: "#FFFFFF",
    },
    swatch: ["#007AFF", "#F2F2F7", "#FFFFFF", "#8E8E93"],
  },
  {
    id: "grand-budapest",
    film: "The Grand Budapest Hotel",
    year: "2014",
    description: "You fancy, huh? Pack your monogrammed luggage.",
    colors: {
      bg: "#F9EEF2",
      card: "#FFFFFF",
      accent: "#D9381E",
      accentText: "#FFFFFF",
      label: "#5B1A18",
      secondary: "#8B5FBF",
      separator: "#F4A8B9",
      fill: "#F4A8B9",
      navBg: "#F4A8B9",
    },
    swatch: ["#F4A8B9", "#8B5FBF", "#D9381E", "#F1BB7B"],
  },
  {
    id: "moonrise-kingdom",
    film: "Moonrise Kingdom",
    year: "2012",
    description: "Summer camp vibes. Will probably involve a canoe.",
    colors: {
      bg: "#F5F0E8",
      card: "#FFFDF7",
      accent: "#6B8E23",
      accentText: "#FFFFFF",
      label: "#3B2A1A",
      secondary: "#A67B5B",
      separator: "#D9B382",
      fill: "#D9B382",
      navBg: "#FFC857",
    },
    swatch: ["#FFC857", "#6B8E23", "#A67B5B", "#D9B382"],
  },
  {
    id: "royal-tenenbaums",
    film: "The Royal Tenenbaums",
    year: "2001",
    description: "Dysfunctional family reunion. Bring a tennis racket.",
    colors: {
      bg: "#F2EDE4",
      card: "#FAEFD1",
      accent: "#C93312",
      accentText: "#FFFFFF",
      label: "#2A2A2A",
      secondary: "#899DA4",
      separator: "#D4C9A8",
      fill: "#E8DFC8",
      navBg: "#899DA4",
    },
    swatch: ["#899DA4", "#C93312", "#FAEFD1", "#DC863B"],
  },
  {
    id: "fantastic-mr-fox",
    film: "Fantastic Mr. Fox",
    year: "2009",
    description: "Charming, slightly mischievous. Watch for farmers.",
    colors: {
      bg: "#FDF3E3",
      card: "#FFFBF2",
      accent: "#DD8D29",
      accentText: "#FFFFFF",
      label: "#3B1A08",
      secondary: "#8D4D1E",
      separator: "#E8C98A",
      fill: "#F0D9A8",
      navBg: "#E2D200",
    },
    swatch: ["#DD8D29", "#E2D200", "#46ACC8", "#8D4D1E"],
  },
  {
    id: "life-aquatic",
    film: "The Life Aquatic",
    year: "2004",
    description: "Marine biology meets midlife crisis. Dive in.",
    colors: {
      bg: "#E8F4F8",
      card: "#FFFFFF",
      accent: "#3B9AB2",
      accentText: "#FFFFFF",
      label: "#1A3A42",
      secondary: "#446455",
      separator: "#78B7C5",
      fill: "#C5E3EC",
      navBg: "#78B7C5",
    },
    swatch: ["#3B9AB2", "#78B7C5", "#EBCC2A", "#446455"],
  },
  {
    id: "darjeeling",
    film: "The Darjeeling Limited",
    year: "2007",
    description: "Train journey. Emotional baggage included.",
    colors: {
      bg: "#FFF8EE",
      card: "#FFFFFF",
      accent: "#E27505",
      accentText: "#FFFFFF",
      label: "#2A1215",
      secondary: "#9C1425",
      separator: "#F2AD00",
      fill: "#FFE5B4",
      navBg: "#F2AD00",
    },
    swatch: ["#FF0000", "#00A08A", "#F2AD00", "#E27505"],
  },
  {
    id: "french-dispatch",
    film: "The French Dispatch",
    year: "2021",
    description: "Journalist chic. You probably read Sartre.",
    colors: {
      bg: "#F0EDE8",
      card: "#E5E5E5",
      accent: "#5F7470",
      accentText: "#FFFFFF",
      label: "#313131",
      secondary: "#7F5539",
      separator: "#C8C0B0",
      fill: "#D8D0C4",
      navBg: "#313131",
    },
    swatch: ["#313131", "#E5E5E5", "#DDB892", "#5F7470"],
  },
  {
    id: "isle-of-dogs",
    film: "Isle of Dogs",
    year: "2018",
    description: "Dystopian but cute. Watch out for trash islands.",
    colors: {
      bg: "#EFEFEF",
      card: "#FFFFFF",
      accent: "#D93954",
      accentText: "#FFFFFF",
      label: "#1A1A1A",
      secondary: "#4A4A4A",
      separator: "#CCCCCC",
      fill: "#DDDDDD",
      navBg: "#4A4A4A",
    },
    swatch: ["#A3A3A3", "#D93954", "#F4D35E", "#6B8E23"],
  },
  {
    id: "bottle-rocket",
    film: "Bottle Rocket",
    year: "1996",
    description: "Heist movie energy. You are definitely the mastermind.",
    colors: {
      bg: "#EAECEC",
      card: "#FFFFFF",
      accent: "#A42820",
      accentText: "#FFFFFF",
      label: "#1A1A1A",
      secondary: "#3F5151",
      separator: "#C8CCCC",
      fill: "#D8DCDC",
      navBg: "#3F5151",
    },
    swatch: ["#A42820", "#3F5151", "#9B110E", "#5F5647"],
  },
];

export const defaultTheme = themes[0];
