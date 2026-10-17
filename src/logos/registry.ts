import type { SimpleIcon } from "simple-icons";
import {
  siAnthropic,
  siClaude,
  siCursor,
  siGithub,
  siGooglegemini,
  siInstagram,
  siN8n,
  siNotion,
  siReddit,
  siSupabase,
  siTiktok,
  siVercel,
  siX,
  siYcombinator,
  siYoutube,
} from "simple-icons";

// Registro central de logos das marcas do nicho (IA / dev / social) para as
// cenas. Paths oficiais via simple-icons (viewBox 0 0 24 24); entradas manuais
// documentam a própria fonte e podem ter viewBox próprio.

export type BrandLogoData = {
  slug: string;
  title: string;
  /** atributo `d` do <path> do SVG */
  path: string;
  /** cor oficial da marca, ex. "#D97757" */
  hex: string;
  viewBox: string;
};

const fromSimpleIcon = (slug: string, icon: SimpleIcon): BrandLogoData => ({
  slug,
  title: icon.title,
  path: icon.path,
  hex: `#${icon.hex}`,
  viewBox: "0 0 24 24",
});

// OpenAI foi removida do simple-icons a pedido da marca. Símbolo oficial
// ("blossom") do press kit da OpenAI (https://openai.com/brand), mesmo asset
// que o simple-icons v14 distribuía. A marca atual é preta — em fundo escuro,
// sobrescreva com `color` no BrandLogo.
const OPENAI: BrandLogoData = {
  slug: "openai",
  title: "OpenAI",
  path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  hex: "#000000",
  viewBox: "0 0 24 24",
};

// LinkedIn também foi removida do simple-icons a pedido da marca. Glyph oficial
// "in" (viewBox 0 0 24 24), mesmo asset que o simple-icons distribuía. Cor
// oficial #0A66C2 — em fundo escuro costuma-se sobrescrever com `color` claro.
const LINKEDIN: BrandLogoData = {
  slug: "linkedin",
  title: "LinkedIn",
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  hex: "#0A66C2",
  viewBox: "0 0 24 24",
};

export const LOGOS: Record<string, BrandLogoData> = {
  claude: fromSimpleIcon("claude", siClaude),
  anthropic: fromSimpleIcon("anthropic", siAnthropic),
  openai: OPENAI,
  gemini: fromSimpleIcon("gemini", siGooglegemini),
  youtube: fromSimpleIcon("youtube", siYoutube),
  github: fromSimpleIcon("github", siGithub),
  reddit: fromSimpleIcon("reddit", siReddit),
  x: fromSimpleIcon("x", siX),
  hackernews: fromSimpleIcon("hackernews", siYcombinator),
  tiktok: fromSimpleIcon("tiktok", siTiktok),
  instagram: fromSimpleIcon("instagram", siInstagram),
  linkedin: LINKEDIN,
  n8n: fromSimpleIcon("n8n", siN8n),
  vercel: fromSimpleIcon("vercel", siVercel),
  supabase: fromSimpleIcon("supabase", siSupabase),
  notion: fromSimpleIcon("notion", siNotion),
  cursor: fromSimpleIcon("cursor", siCursor),
};

// Como as marcas costumam ser FALADAS (e transcritas) em PT-BR → slug canônico.
export const ALIASES: Record<string, string> = {
  cloud: "claude",
  "cloud code": "claude",
  gpt: "openai",
  "chat gpt": "openai",
  chatgpt: "openai",
  gêmini: "gemini",
  twitter: "x",
  insta: "instagram",
  "git hub": "github",
};

// Resolve nome falado ou slug para os dados do logo (case-insensitive).
export const resolveBrand = (name: string): BrandLogoData | undefined => {
  const key = name.trim().toLowerCase();
  return LOGOS[ALIASES[key] ?? key];
};
