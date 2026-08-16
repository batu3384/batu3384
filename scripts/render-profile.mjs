#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets");

const palettes = {
  dark: {
    bg: "#080B0D",
    board: "#101619",
    module: "#182125",
    raised: "#202C31",
    text: "#EEF6F4",
    muted: "#8BA19F",
    trace: "#30494C",
    shadow: "#000000",
    primary: "#22D3EE",
    secondary: "#3B82F6",
  },
  light: {
    bg: "#DCE2DE",
    board: "#EDF1EC",
    module: "#F8FAF5",
    raised: "#FFFFFF",
    text: "#142022",
    muted: "#627471",
    trace: "#B5C6C2",
    shadow: "#9AA8A4",
    primary: "#22D3EE",
    secondary: "#3B82F6",
  },
};

const flagships = [
  ["ScreenTextGrab", "macOS OCR", "On-device capture for screen, files, and PDFs."],
  ["calder", "AI workspace", "Parallel coding CLI sessions in one Electron shell."],
  ["frostwall-beam", "File transfer", "Encrypted LAN and internet send with receiver approval."],
];

const also = [
  ["sift", "Terminal cleaner"],
  ["ironsentinel", "AppSec CLI"],
  ["falcon-dm", "Download manager"],
  ["deskward", "Remote desktop"],
];

function cut(x, y, w, h) {
  return `M${x} ${y}H${x + w - 18}L${x + w} ${y + 18}V${y + h}H${x}Z`;
}

function defs(p, id) {
  return `<defs>
    <pattern id="${id}-perf" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.15" fill="${p.trace}" opacity=".5"/></pattern>
    <linearGradient id="${id}-glow" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${p.board}"/><stop offset=".62" stop-color="${p.board}"/><stop offset="1" stop-color="${p.primary}" stop-opacity=".08"/></linearGradient>
    <filter id="${id}-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="5" stdDeviation="3" flood-color="${p.shadow}" flood-opacity=".34"/></filter>
  </defs>
  <style>
    .display{font-family:"Arial Narrow","Avenir Next Condensed",Impact,sans-serif}
    .body{font-family:"Avenir Next",Avenir,Helvetica,sans-serif}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
    .boot{animation:boot .65s cubic-bezier(.2,.8,.2,1)}
    .signal{stroke-dasharray:4 8;animation:signal 7s linear infinite}
    .dial{transform-box:fill-box;transform-origin:center;animation:dial 14s linear infinite}
    @keyframes boot{from{opacity:.3;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
    @keyframes signal{to{stroke-dashoffset:-120}}
    @keyframes dial{to{transform:rotate(360deg)}}
    @media(prefers-reduced-motion:reduce){.boot,.signal,.dial{animation:none}}
  </style>`;
}

function desktop(p, id) {
  const cards = flagships
    .map(([name, role, desc], i) => {
      const y = 28 + i * 118;
      const accent = i === 2 ? p.secondary : p.primary;
      return `<g class="boot" style="animation-delay:${100 + i * 80}ms" filter="url(#${id}-shadow)">
        <path d="${cut(724, y, 452, 104)}" fill="${p.module}" stroke="${p.trace}"/>
        <path d="M724 ${y + 8}H${760 + i * 48}" stroke="${accent}" stroke-width="4"/>
        <text x="748" y="${y + 36}" class="mono" font-size="12" letter-spacing="1.6" fill="${accent}">${String(i + 1).padStart(2, "0")}  /  ${role.toUpperCase()}</text>
        <text x="748" y="${y + 64}" class="body" font-size="20" font-weight="800" fill="${p.text}">${name}</text>
        <text x="748" y="${y + 88}" class="body" font-size="13" fill="${p.muted}">${desc}</text>
      </g>`;
    })
    .join("");

  const chips = also
    .map(([name, role], i) => {
      const x = 24 + i * 294;
      return `<g class="boot" style="animation-delay:${220 + i * 40}ms" filter="url(#${id}-shadow)">
        <path d="${cut(x, 392, 282, 64)}" fill="${p.raised}" stroke="${p.trace}"/>
        <rect x="${x}" y="392" width="5" height="64" fill="${i % 2 ? p.secondary : p.primary}"/>
        <text x="${x + 22}" y="416" class="body" font-size="15" font-weight="800" fill="${p.text}">${name}</text>
        <text x="${x + 22}" y="438" class="mono" font-size="11" letter-spacing="1.2" fill="${p.muted}">${role.toUpperCase()}</text>
      </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480" viewBox="0 0 1200 480" role="img" aria-label="Batuhan Yüksel software developer" data-mode="${id}">
  ${defs(p, id)}
  <rect width="1200" height="480" fill="${p.bg}"/>
  <rect x="10" y="10" width="1180" height="460" rx="14" fill="url(#${id}-glow)" stroke="${p.trace}"/>
  <rect x="10" y="10" width="1180" height="460" rx="14" fill="url(#${id}-perf)"/>
  <path d="M690 56H706V76H724M690 174H706V194H724M690 292H706V312H724" fill="none" stroke="${p.trace}" stroke-width="2"/>
  <path class="signal" d="M690 56H706V76H724M690 174H706V194H724M690 292H706V312H724" fill="none" stroke="${p.primary}"/>
  <g class="boot" filter="url(#${id}-shadow)">
    <path d="${cut(24, 24, 666, 348)}" fill="${p.module}" stroke="${p.trace}"/>
    <rect x="24" y="24" width="8" height="348" fill="${p.primary}"/>
    <text x="54" y="58" class="mono" font-size="13" letter-spacing="2.4" fill="${p.primary}">BATUHAN YÜKSEL</text>
    <text x="50" y="128" class="display" font-size="52" font-weight="900" letter-spacing="-1" fill="${p.text}">SOFTWARE</text>
    <text x="50" y="182" class="display" font-size="52" font-weight="900" letter-spacing="-1" fill="${p.text}">DEVELOPER</text>
    <text x="54" y="228" class="body" font-size="16" fill="${p.muted}">macOS apps · terminal tools · AppSec · AI workspaces</text>
    <path d="M54 248H430" stroke="${p.trace}"/>
    <text x="54" y="276" class="mono" font-size="12" letter-spacing="1.6" fill="${p.text}">SWIFT  ·  GO  ·  TYPESCRIPT  ·  PYTHON  ·  RUST</text>
    <g transform="translate(620 92)">
      <circle r="40" fill="${p.raised}" stroke="${p.trace}"/>
      <circle class="dial" r="28" fill="none" stroke="${p.secondary}" stroke-width="4" stroke-dasharray="8 7"/>
      <circle r="9" fill="${p.secondary}"/>
      <path d="M0-22V-34" stroke="${p.text}" stroke-width="2"/>
    </g>
    <g transform="translate(54 308)">
      <path d="${cut(0, 0, 188, 44)}" fill="${p.raised}" stroke="${p.trace}"/>
      <text x="16" y="28" class="mono" font-size="12" font-weight="700" fill="${p.primary}">ISTANBUL · MIS</text>
    </g>
  </g>
  ${cards}
  ${chips}
</svg>`;
}

function mobile(p, id) {
  const cards = flagships
    .map(([name, role, desc], i) => {
      const y = 268 + i * 168;
      const accent = i === 2 ? p.secondary : p.primary;
      return `<g class="boot" style="animation-delay:${80 + i * 70}ms" filter="url(#${id}-shadow)">
        <path d="${cut(28, y, 744, 152)}" fill="${p.module}" stroke="${p.trace}"/>
        <rect x="28" y="${y}" width="8" height="152" fill="${accent}"/>
        <text x="56" y="${y + 42}" class="mono" font-size="20" letter-spacing="2" fill="${accent}">${String(i + 1).padStart(2, "0")}  /  ${role.toUpperCase()}</text>
        <text x="56" y="${y + 86}" class="body" font-size="32" font-weight="800" fill="${p.text}">${name}</text>
        <text x="56" y="${y + 124}" class="body" font-size="20" fill="${p.muted}">${desc}</text>
      </g>`;
    })
    .join("");

  const chips = also
    .map(([name, role], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 28 + col * 372;
      const y = 788 + row * 112;
      return `<g class="boot" filter="url(#${id}-shadow)">
        <path d="${cut(x, y, 360, 96)}" fill="${p.raised}" stroke="${p.trace}"/>
        <text x="${x + 24}" y="${y + 42}" class="body" font-size="24" font-weight="800" fill="${p.text}">${name}</text>
        <text x="${x + 24}" y="${y + 72}" class="mono" font-size="16" fill="${p.muted}">${role.toUpperCase()}</text>
      </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1020" viewBox="0 0 800 1020" role="img" aria-label="Batuhan Yüksel software developer" data-mode="${id}">
  ${defs(p, id)}
  <rect width="800" height="1020" fill="${p.bg}"/>
  <rect x="12" y="12" width="776" height="996" rx="18" fill="url(#${id}-glow)" stroke="${p.trace}"/>
  <rect x="12" y="12" width="776" height="996" rx="18" fill="url(#${id}-perf)"/>
  <g class="boot" filter="url(#${id}-shadow)">
    <path d="${cut(28, 28, 744, 220)}" fill="${p.module}" stroke="${p.trace}"/>
    <rect x="28" y="28" width="10" height="220" fill="${p.primary}"/>
    <text x="58" y="72" class="mono" font-size="18" letter-spacing="2.4" fill="${p.primary}">BATUHAN YÜKSEL  ·  ISTANBUL</text>
    <text x="54" y="128" class="display" font-size="44" font-weight="900" fill="${p.text}">SOFTWARE DEVELOPER</text>
    <text x="58" y="176" class="body" font-size="20" fill="${p.muted}">macOS apps · terminal · AppSec · AI tools</text>
    <text x="58" y="214" class="mono" font-size="16" fill="${p.text}">SWIFT · GO · TS · PYTHON · RUST</text>
  </g>
  ${cards}
  ${chips}
</svg>`;
}

mkdirSync(outDir, { recursive: true });
const files = {
  "hero-dark.svg": desktop(palettes.dark, "dark"),
  "hero-light.svg": desktop(palettes.light, "light"),
  "hero-mobile-dark.svg": mobile(palettes.dark, "mdark"),
  "hero-mobile-light.svg": mobile(palettes.light, "mlight"),
};
for (const [name, svg] of Object.entries(files)) {
  if (!svg.includes("SOFTWARE") || !svg.includes("ScreenTextGrab")) {
    throw new Error(`${name} missing identity or flagship`);
  }
  writeFileSync(join(outDir, name), svg);
}
console.log("wrote 4 profile SVGs");
