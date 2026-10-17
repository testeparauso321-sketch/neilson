// Tema do vídeo "5-plugins" — continua o sistema visual ClaudeCowork e replica o
// do #0 (5 MCPs): fundo escuro quente, coral/argila, texto creme. Mono nas cenas
// de terminal/código.
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

export const COLORS = {
  bg: "#171310",
  bgLift: "#1E1813",
  card: "#241C16",
  cardActive: "#2C221A",
  stroke: "rgba(244,236,224,0.10)",
  strokeActive: "rgba(217,119,87,0.55)",
  coral: "#D97757",
  coralLight: "#EBA98B",
  coralDeep: "#BE5F3C",
  text: "#F4ECE0",
  muted: "#A2937F",
  // Astro/spark do Claude — luz quente de ALTA saturação, de propósito mais
  // vibrante e mais dourada que o coral do texto, pra a estrela "descolar" do
  // headline em vez de virar mancha da mesma cor. Ver SparkBurst.
  spark: {
    core: "#FFF3E4", // núcleo quente quase branco
    gold: "#FFC06A", // pontas douradas (valor alto, separa por matiz do texto)
    hot: "#FF7A3C", // corpo laranja-coral vivo
    ember: "#E9481A", // base brasa saturada
    glowRGB: "255,122,60", // halo laranja saturado (não o marrom 217,119,87)
  },
  // Terminal.
  term: "#0E0B09",
  termChrome: "#1C1613",
  green: "#4ade80",
};

export const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
}).fontFamily;

export const fraunces = loadFraunces("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
}).fontFamily;

export const mono = loadJetBrainsMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
}).fontFamily;

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
