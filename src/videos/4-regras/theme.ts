// Tema do vídeo "4-regras" — direção NOVA: "mesa de papel".
// Os vídeos anteriores são escuros; este inverte para papel claro + tinta
// escura, tudo desenhado à mão (caneta tremida, marca-texto, post-it, fita).
// Cada cena alterna a superfície entre BRANCO e CINZA (pedido do usuário) —
// ver TONE abaixo e o prop `tone` do <Paper>.
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPermanentMarker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

// As duas superfícies que alternam clipe a clipe.
export const TONE = {
  white: {
    bg: "#FCFAF5",
    bgDeep: "#F1EADC",
    fiber: "rgba(40,28,20,0.05)",
    rule: "rgba(40,28,20,0.07)",
    card: "#FFFFFF",
    shadow: "0 22px 46px rgba(60,44,28,0.16)",
  },
  gray: {
    bg: "#D7D1C6",
    bgDeep: "#C6BFB1",
    fiber: "rgba(30,22,14,0.07)",
    rule: "rgba(30,22,14,0.10)",
    card: "#F6F2E9",
    shadow: "0 22px 46px rgba(45,34,22,0.24)",
  },
} as const;

export type ToneName = keyof typeof TONE;

// Tintas. Tudo é "caneta sobre papel": nada de neon, nada de glow frio.
export const INK = {
  ink: "#241C16", // caneta preta/grafite escuro
  soft: "#6B5C4B", // lápis
  faint: "#9A8C79", // lápis leve
  red: "#D93A2B", // caneta vermelha (dor, erro)
  coral: "#D9663B", // coral da marca (keyword, CTA)
  green: "#2E9E5B", // caneta verde (ok, entregue)
  blue: "#2F5FD0", // caneta azul (anotação secundária)
  yellow: "rgba(255,206,58,0.62)", // marca-texto amarelo
  yellowSolid: "#FFCE3A",
  tape: "rgba(226,209,168,0.82)", // fita crepe
} as const;

// Post-its.
export const STICKY = {
  yellow: "#FFE873",
  pink: "#FFB7C5",
  blue: "#A6D9F2",
  green: "#B9E5A2",
  orange: "#FFC79A",
} as const;

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

/** Carimbos e punches — traço grosso de marcador. */
export const marker = loadPermanentMarker("normal", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily;

/** Anotações à mão, etiquetas de seta, margens. */
export const hand = loadCaveat("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
}).fontFamily;

export const W = 1080;
export const H = 1920;
export const FPS = 30;

/** split-safe: todo conteúdo informativo vive entre estes dois y. */
export const SAFE_TOP = 96;
export const SAFE_BOTTOM = 910;

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
