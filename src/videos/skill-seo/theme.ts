// Tema do vídeo "skill-seo" — direção LIQUID GLASS (iOS 26 / macOS Tahoe), a
// mesma de `meetily` / `plugin-administrativo`: preto absoluto OLED, vidro
// translúcido e um único acento coral herdado do sistema Claude para keyword e
// número. A assinatura própria deste vídeo é a BUSCA — o campo de pesquisa e a
// linha de consulta com volume (ver `search.tsx`).
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

export const COLORS = {
  // Base — preto de verdade, não cinza-escuro. É o que faz o vidro existir.
  black: "#000000",
  ink: "#050506",

  // Vidro. Camadas do material, do mais fino ao mais denso.
  glass: "rgba(255,255,255,0.055)",
  glassLift: "rgba(255,255,255,0.085)",
  glassDeep: "rgba(255,255,255,0.13)",
  rim: "rgba(255,255,255,0.16)",
  rimHot: "rgba(255,255,255,0.55)",

  // Tipografia — hierarquia da Apple no escuro: branco puro, depois cinzas frios.
  text: "#FFFFFF",
  text2: "#EBEBF5",
  muted: "#8E8E93",
  faint: "#48484A",

  // Acento único.
  coral: "#D97757",
  coralLight: "#F0A183",
  coralDeep: "#A8482A",
  coralRGB: "217,119,87",

  // Aberração cromática do rim — sopro de cor só na quina do vidro, como no
  // material real. Nunca vira cor de texto.
  chromaA: "rgba(120,200,255,0.45)",
  chromaB: "rgba(190,150,255,0.40)",

  ok: "#30D158", // verde sistema iOS, só para estados de "feito"
} as const;

export const geist = loadGeist("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
}).fontFamily;

export const mono = loadGeistMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
}).fontFamily;

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// split-safe: todo conteúdo informativo vive acima disto (webcam ocupa a metade
// de baixo na edição). O fundo pode ocupar o frame inteiro.
export const SAFE_BOTTOM = 912; // 960 - 48 de margem
// Margem split-safe SUPERIOR: a UI do Instagram cobre a faixa de cima do Reel —
// conteúdo informativo só a partir daqui (fundos/blobs podem sangrar). Atenção:
// o push-in do Rig (zoom > 1) empurra o topo pra CIMA no início da cena — o y
// autorado do elemento mais alto precisa de folga além de SAFE_TOP para o
// RENDERIZADO nunca subir de y=90 (conta: y >= origem + (SAFE_TOP - origem)/zoom).
export const SAFE_TOP = 96;
export const SAFE_X = 48;

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Molas traduzidas das da Apple (response 0.3 / damping 0.6, bouncy 0.35).
export const SPRING = {
  snap: { damping: 18, stiffness: 240 },
  bouncy: { damping: 12, stiffness: 170, mass: 1.15 },
  gel: { damping: 14, stiffness: 130, mass: 1.35 },
  soft: { damping: 22, stiffness: 120 },
} as const;
