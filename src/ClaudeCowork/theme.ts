// Claude-brand-inspired warm palette (coral / clay + cream on warm dark).
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";

export const COLORS = {
  // Warm near-black background.
  bg: "#171310",
  bgLift: "#1E1813",
  // Card surfaces.
  card: "#241C16",
  cardActive: "#2C221A",
  stroke: "rgba(244,236,224,0.10)",
  strokeActive: "rgba(217,119,87,0.55)",
  // Claude coral / clay.
  coral: "#D97757",
  coralLight: "#EBA98B",
  coralDeep: "#BE5F3C",
  // Cream text.
  text: "#F4ECE0",
  muted: "#A2937F",
};

export const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
}).fontFamily;

export const fraunces = loadFraunces("normal", {
  weights: ["500", "600"],
  subsets: ["latin"],
}).fontFamily;
