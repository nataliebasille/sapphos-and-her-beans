import { Antic, MedievalSharp, Montserrat, Noto_Sans } from "next/font/google";

// Brand primary typeface (Baron) — closest free match: Montserrat.
const primaryFont = Montserrat({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Brand secondary typeface (Canva Sans) — closest free match: Noto Sans.
const secondaryFont = Noto_Sans({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Brand tertiary typeface (Antic) — available for free on Google Fonts.
const tertiaryFont = Antic({
  variable: "--font-tertiary",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Stylized display font used on product labels (unchanged from the original).
const BrandingStylizedFont = MedievalSharp({
  subsets: ["latin"],
  weight: "400",
});

export { primaryFont, secondaryFont, tertiaryFont, BrandingStylizedFont };
