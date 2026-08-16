#!/usr/bin/env node
// Source of truth for github.com/batu3384 — SVGs + README.md
// Run: node scripts/render-profile.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets");
const USER = "batu3384";

const identity = {
  name: "Batuhan Yüksel",
  headline: "SOFTWARE DEVELOPER",
  tagline: "macOS apps · terminal tools · AppSec · AI workspaces",
  location: "Istanbul · MIS",
  stack: "Swift · Go · TypeScript · Python · Rust",
  intro:
    "Software developer in Istanbul. I build local-first macOS apps, terminal tools, and AppSec workflows in Swift, Go, TypeScript, Python, and Rust.",
};

const flagships = [
  {
    repo: "ScreenTextGrab",
    role: "macOS OCR",
    blurb: "On-device OCR for screen, files, and PDFs.",
    purpose:
      "Local-first macOS OCR for screen, clipboard, files, and PDFs.",
  },
  {
    repo: "calder",
    role: "AI workspace",
    blurb: "Parallel AI coding CLIs in one Electron shell.",
    purpose:
      "Terminal-centric Electron workspace for parallel AI coding CLI sessions.",
  },
  {
    repo: "frostwall-beam",
    role: "File transfer",
    blurb: "Encrypted LAN/internet transfer, receiver approval.",
    purpose:
      "Encrypted LAN and internet file transfer with receiver approval.",
  },
];

const also = [
  {
    repo: "sift",
    role: "Terminal cleaner",
    purpose:
      "Review-first terminal cleaner with safer destructive flows on macOS and Windows.",
  },
  {
    repo: "ironsentinel",
    role: "AppSec CLI",
    purpose:
      "Local-first AppSec CLI with HTML, SARIF, and CSV export for findings review.",
  },
  {
    repo: "falcon-dm",
    role: "Download manager",
    purpose: "Local-only macOS download manager for HTTP, HLS, and YouTube.",
  },
  {
    repo: "deskward",
    role: "Remote desktop",
    purpose:
      "Self-hosted remote desktop with a Rust core, Flutter client, and E2EE sessions.",
  },
];

const other = [
  ["agent-atlas", "Open-web search and research router for AI agents"],
  ["hexloom", "FastAPI studio for encoding, decoding, and validating structured payloads"],
  ["jobcraft", "Job-search workspace for Turkey with Cursor and Claude Code"],
];

const academic = [
  ["vetvision", "Desktop AI assistant for dog breed recognition"],
  ["fast-express-kds", "Cargo operations dashboard with branch analytics and forecasting"],
  ["sisler-bulvari-cafe-system", "Digital ordering prototype for Sisler Bulvarı Sanat Kafe"],
  ["autonomous-line-following-robot", "Raspberry Pi line-following robot with obstacle stopping"],
];

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
    ink: "#22D3EE",
  },
  light: {
    bg: "#DCE2DE",
    board: "#EDF1EC",
    module: "#F8FAF5",
    raised: "#FFFFFF",
    text: "#142022",
    muted: "#4B5C59",
    trace: "#B5C6C2",
    shadow: "#9AA8A4",
    primary: "#0E7490",
    secondary: "#1D4ED8",
    ink: "#0E7490",
  },
};

const DESKTOP = {
  width: 1200,
  height: 480,
  boardRight: 1190,
  cardX: 724,
  cardW: 452,
  cardH: 104,
  cardStep: 118,
  chipY: 392,
  chipW: 282,
  chipH: 64,
  chipStep: 294,
  chipX: 24,
};

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function repoUrl(name) {
  return `https://github.com/${USER}/${name}`;
}

function cut(x, y, w, h) {
  return `M${x} ${y}H${x + w - 18}L${x + w} ${y + 18}V${y + h}H${x}Z`;
}

function assertLayout() {
  if (flagships.length !== 3) throw new Error("desktop hero is built for 3 flagships");
  if (also.length !== 4) throw new Error("desktop chip row is built for 4 supporting repos");
  const lastChipRight = DESKTOP.chipX + (also.length - 1) * DESKTOP.chipStep + DESKTOP.chipW;
  if (lastChipRight > DESKTOP.boardRight) {
    throw new Error(`chip row overflows desktop board: ${lastChipRight} > ${DESKTOP.boardRight}`);
  }
  for (const item of flagships) {
    if (item.role.length > 16) throw new Error(`role too long for SVG: ${item.repo}`);
    if (item.blurb.length > 56) throw new Error(`blurb too long for SVG card: ${item.repo}`);
  }
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
    .map((item, i) => {
      const y = 28 + i * DESKTOP.cardStep;
      const accent = i === 2 ? p.secondary : p.ink;
      return `<g class="boot" style="animation-delay:${100 + i * 80}ms" filter="url(#${id}-shadow)">
        <path d="${cut(DESKTOP.cardX, y, DESKTOP.cardW, DESKTOP.cardH)}" fill="${p.module}" stroke="${p.trace}"/>
        <path d="M${DESKTOP.cardX} ${y + 8}H${760 + i * 48}" stroke="${accent}" stroke-width="4"/>
        <text x="748" y="${y + 36}" class="mono" font-size="12" letter-spacing="1.6" fill="${accent}">${String(i + 1).padStart(2, "0")}  /  ${xml(item.role.toUpperCase())}</text>
        <text x="748" y="${y + 64}" class="body" font-size="20" font-weight="800" fill="${p.text}">${xml(item.repo)}</text>
        <text x="748" y="${y + 88}" class="body" font-size="13" fill="${p.muted}">${xml(item.blurb)}</text>
      </g>`;
    })
    .join("");

  const chips = also
    .map((item, i) => {
      const x = DESKTOP.chipX + i * DESKTOP.chipStep;
      return `<g class="boot" style="animation-delay:${220 + i * 40}ms" filter="url(#${id}-shadow)">
        <path d="${cut(x, DESKTOP.chipY, DESKTOP.chipW, DESKTOP.chipH)}" fill="${p.raised}" stroke="${p.trace}"/>
        <rect x="${x}" y="${DESKTOP.chipY}" width="5" height="${DESKTOP.chipH}" fill="${i % 2 ? p.secondary : p.ink}"/>
        <text x="${x + 22}" y="416" class="body" font-size="15" font-weight="800" fill="${p.text}">${xml(item.repo)}</text>
        <text x="${x + 22}" y="438" class="mono" font-size="11" letter-spacing="1.2" fill="${p.muted}">${xml(item.role.toUpperCase())}</text>
      </g>`;
    })
    .join("");

  const alt = xml(
    `${identity.name}, ${identity.headline.toLowerCase()}. ${flagships.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${DESKTOP.width}" height="${DESKTOP.height}" viewBox="0 0 ${DESKTOP.width} ${DESKTOP.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p, id)}
  <rect width="${DESKTOP.width}" height="${DESKTOP.height}" fill="${p.bg}"/>
  <rect x="10" y="10" width="1180" height="460" rx="14" fill="url(#${id}-glow)" stroke="${p.trace}"/>
  <rect x="10" y="10" width="1180" height="460" rx="14" fill="url(#${id}-perf)"/>
  <path d="M690 56H706V76H724M690 174H706V194H724M690 292H706V312H724" fill="none" stroke="${p.trace}" stroke-width="2"/>
  <path class="signal" d="M690 56H706V76H724M690 174H706V194H724M690 292H706V312H724" fill="none" stroke="${p.ink}"/>
  <g class="boot" filter="url(#${id}-shadow)">
    <path d="${cut(24, 24, 666, 348)}" fill="${p.module}" stroke="${p.trace}"/>
    <rect x="24" y="24" width="8" height="348" fill="${p.ink}"/>
    <text x="54" y="58" class="mono" font-size="13" letter-spacing="2.4" fill="${p.ink}">${xml(identity.name.toUpperCase())}</text>
    <text x="50" y="128" class="display" font-size="52" font-weight="900" letter-spacing="-1" fill="${p.text}">SOFTWARE</text>
    <text x="50" y="182" class="display" font-size="52" font-weight="900" letter-spacing="-1" fill="${p.text}">DEVELOPER</text>
    <text x="54" y="228" class="body" font-size="16" fill="${p.muted}">${xml(identity.tagline)}</text>
    <path d="M54 248H430" stroke="${p.trace}"/>
    <text x="54" y="276" class="mono" font-size="12" letter-spacing="1.6" fill="${p.text}">${xml(identity.stack.toUpperCase())}</text>
    <g transform="translate(620 92)">
      <circle r="40" fill="${p.raised}" stroke="${p.trace}"/>
      <circle class="dial" r="28" fill="none" stroke="${p.secondary}" stroke-width="4" stroke-dasharray="8 7"/>
      <circle r="9" fill="${p.secondary}"/>
      <path d="M0-22V-34" stroke="${p.text}" stroke-width="2"/>
    </g>
    <g transform="translate(54 308)">
      <path d="${cut(0, 0, 188, 44)}" fill="${p.raised}" stroke="${p.trace}"/>
      <text x="16" y="28" class="mono" font-size="12" font-weight="700" fill="${p.ink}">${xml(identity.location.toUpperCase())}</text>
    </g>
  </g>
  ${cards}
  ${chips}
</svg>`;
}

function mobile(p, id) {
  const cards = flagships
    .map((item, i) => {
      const y = 268 + i * 168;
      const accent = i === 2 ? p.secondary : p.ink;
      return `<g class="boot" style="animation-delay:${80 + i * 70}ms" filter="url(#${id}-shadow)">
        <path d="${cut(28, y, 744, 152)}" fill="${p.module}" stroke="${p.trace}"/>
        <rect x="28" y="${y}" width="8" height="152" fill="${accent}"/>
        <text x="56" y="${y + 42}" class="mono" font-size="20" letter-spacing="2" fill="${accent}">${String(i + 1).padStart(2, "0")}  /  ${xml(item.role.toUpperCase())}</text>
        <text x="56" y="${y + 86}" class="body" font-size="32" font-weight="800" fill="${p.text}">${xml(item.repo)}</text>
        <text x="56" y="${y + 124}" class="body" font-size="20" fill="${p.muted}">${xml(item.blurb)}</text>
      </g>`;
    })
    .join("");

  const chips = also
    .map((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 28 + col * 372;
      const y = 788 + row * 112;
      return `<g class="boot" filter="url(#${id}-shadow)">
        <path d="${cut(x, y, 360, 96)}" fill="${p.raised}" stroke="${p.trace}"/>
        <text x="${x + 24}" y="${y + 42}" class="body" font-size="24" font-weight="800" fill="${p.text}">${xml(item.repo)}</text>
        <text x="${x + 24}" y="${y + 72}" class="mono" font-size="16" fill="${p.muted}">${xml(item.role.toUpperCase())}</text>
      </g>`;
    })
    .join("");

  const alt = xml(
    `${identity.name}, ${identity.headline.toLowerCase()}. ${flagships.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1020" viewBox="0 0 800 1020" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p, id)}
  <rect width="800" height="1020" fill="${p.bg}"/>
  <rect x="12" y="12" width="776" height="996" rx="18" fill="url(#${id}-glow)" stroke="${p.trace}"/>
  <rect x="12" y="12" width="776" height="996" rx="18" fill="url(#${id}-perf)"/>
  <g class="boot" filter="url(#${id}-shadow)">
    <path d="${cut(28, 28, 744, 220)}" fill="${p.module}" stroke="${p.trace}"/>
    <rect x="28" y="28" width="10" height="220" fill="${p.ink}"/>
    <text x="58" y="72" class="mono" font-size="18" letter-spacing="2.4" fill="${p.ink}">${xml(identity.name.toUpperCase())}  ·  ISTANBUL</text>
    <text x="54" y="128" class="display" font-size="44" font-weight="900" fill="${p.text}">SOFTWARE DEVELOPER</text>
    <text x="58" y="176" class="body" font-size="20" fill="${p.muted}">macOS apps · terminal · AppSec · AI tools</text>
    <text x="58" y="214" class="mono" font-size="16" fill="${p.text}">SWIFT · GO · TS · PYTHON · RUST</text>
  </g>
  ${cards}
  ${chips}
</svg>`;
}

function mdList(rows) {
  return rows
    .map(([repo, purpose]) => `- [\`${repo}\`](${repoUrl(repo)}) — ${purpose}`)
    .join("\n");
}

function renderReadme() {
  const selected = flagships
    .map(
      (item) =>
        `**[${item.repo}](${repoUrl(item.repo)})** — ${item.purpose}`,
    )
    .join("\n\n");
  const supporting = also
    .map(
      (item) =>
        `- **[${item.repo}](${repoUrl(item.repo)})** — ${item.purpose}`,
    )
    .join("\n");

  return `<!-- Generated by scripts/render-profile.mjs. Edit that file, then run: node scripts/render-profile.mjs -->
<picture>
  <source media="(max-width: 700px) and (prefers-color-scheme: dark)" srcset="assets/hero-mobile-dark.svg">
  <source media="(max-width: 700px)" srcset="assets/hero-mobile-light.svg">
  <source media="(prefers-color-scheme: dark)" srcset="assets/hero-dark.svg">
  <img alt="${identity.name} — software developer. Selected work: ${flagships.map((item) => item.repo).join(", ")}." src="assets/hero-light.svg" width="100%">
</picture>

${identity.intro}

## Selected work

${selected}

## Also

${supporting}

<details>
<summary>Other public work</summary>

${mdList(other)}

</details>

<details>
<summary>Academic projects</summary>

${mdList(academic)}

</details>

<p align="center"><a href="https://www.linkedin.com/in/${USER}">LinkedIn</a> · <a href="mailto:batu3384@gmail.com">Email</a></p>
`;
}

assertLayout();
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
  if (svg.includes("<") === false) throw new Error(`${name} is not SVG`);
  writeFileSync(join(outDir, name), svg);
}
writeFileSync(join(root, "README.md"), renderReadme());
console.log("wrote 4 profile SVGs and README.md");
