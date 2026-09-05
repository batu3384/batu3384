#!/usr/bin/env node
// Source of truth for github.com/batu3384 — SVGs + README.md
// Run: node scripts/render-profile.mjs

import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets");
const USER = "batu3384";
const ASSETS = {
  desktopDark: "hero-v5-dark.svg",
  desktopLight: "hero-v5-light.svg",
  mobileDark: "hero-v5-mobile-dark.svg",
  mobileLight: "hero-v5-mobile-light.svg",
  indexDark: "index-v5-dark.svg",
  indexLight: "index-v5-light.svg",
  indexMobileDark: "index-v5-mobile-dark.svg",
  indexMobileLight: "index-v5-mobile-light.svg",
};

const identity = {
  name: "Batuhan Yüksel",
  headline: "SOFTWARE BUILDER",
  tagline: "LOCAL-FIRST APPS AND CLI TOOLS",
  location: "Istanbul · MIS",
  stack: "Swift · Go · TS · Python · Rust",
  intro:
    "I ship local-first macOS apps, terminal tools, and AppSec workflows from Istanbul — capture, parallel AI workspaces, private transfer, and evidence-backed review.",
};

const flagships = [
  {
    repo: "ScreenTextGrab",
    domain: "CAPTURE",
    stack: "Swift",
    blurb: "Menu bar OCR for screen, code, tables, PDFs.",
    purpose:
      "Local-first macOS menu bar OCR for screen, code, subtitles, tables, and PDFs.",
  },
  {
    repo: "calder",
    domain: "WORKSPACE",
    stack: "TypeScript",
    blurb: "Parallel Claude, Codex, Cursor, Antigravity.",
    purpose:
      "Terminal-centric Electron workspace for parallel Claude Code, Codex, Cursor, and Antigravity sessions.",
  },
  {
    repo: "frostwall-beam",
    domain: "TRANSFER",
    stack: "Rust",
    blurb: "Encrypted transfer with a receiver gate.",
    purpose:
      "Encrypted LAN and internet file transfer with pairing codes and receiver approval.",
  },
];

const also = [
  {
    repo: "sift",
    domain: "MAINTAIN",
    stack: "Go",
    purpose:
      "Review-first terminal cleaner for macOS and Windows. Destructive work is previewed before it runs.",
  },
  {
    repo: "ironsentinel",
    domain: "SECURE",
    stack: "Go",
    purpose:
      "Local-first AppSec CLI for guided scans, runtime trust checks, and HTML / SARIF / CSV evidence.",
  },
  {
    repo: "falcon-dm",
    domain: "FETCH",
    stack: "Rust",
    purpose:
      "Local-only macOS download manager for HTTP, HLS, and YouTube. No cloud queue.",
  },
  {
    repo: "deskward",
    domain: "REMOTE",
    stack: "Rust",
    purpose:
      "Tailscale-first remote desktop with a Rust core, Flutter client, and E2EE sessions.",
  },
];

const shipping = [
  {
    repo: "byteback",
    purpose:
      "Windows forensic imaging and data recovery with a native C++ engine and an examiner UI.",
  },
  {
    repo: "duetto",
    purpose:
      "Chrome extension for Udemy: dual captions, translation, lecture notes, and precision playback.",
  },
  {
    repo: "codebase-audit",
    purpose:
      "Evidence-backed whole-repo architecture audit skill for Cursor, Claude Code, Codex, and Antigravity.",
  },
  {
    repo: "agent-atlas",
    purpose:
      "Installer and router that gives AI agents open-web search and research tools.",
  },
];

const other = [
  {
    repo: "hexloom",
    purpose: "FastAPI studio for encoding, decoding, and validating structured payloads.",
  },
  {
    repo: "jobcraft",
    purpose: "Local-first job-search workspace for Turkey with Cursor and Claude Code.",
  },
];

const academic = [
  {
    repo: "vetvision",
    purpose:
      "Desktop AI assistant for dog breed recognition, PDF export, and optional Gemini reports.",
  },
  {
    repo: "fast-express-kds",
    purpose:
      "Cargo operations dashboard with branch analytics, personnel scoring, and forecasting.",
  },
  {
    repo: "sisler-bulvari-cafe-system",
    purpose:
      "Digital ordering prototype for Sisler Bulvarı Sanat Kafe with menu, orders, and sales views.",
  },
  {
    repo: "autonomous-line-following-robot",
    purpose:
      "Raspberry Pi line-following robot with ultrasonic obstacle stop, LEDs, and buzzer alerts.",
  },
];

const palettes = {
  dark: {
    bg: "#12100E",
    board: "#1A1714",
    slab: "#F3E6D4",
    slabText: "#1A1714",
    slabMuted: "#6B5A4A",
    module: "#241F1B",
    raised: "#2A241F",
    text: "#F6EFE6",
    muted: "#B7A798",
    line: "#3D342C",
    accent: "#C45C26",
    slabAccent: "#9A3412",
    mark: "#E8B86D",
  },
  light: {
    bg: "#E6DCCF",
    board: "#F7F1E8",
    slab: "#1A1714",
    slabText: "#F7F1E8",
    slabMuted: "#C4B4A4",
    module: "#FFFFFF",
    raised: "#FFFFFF",
    text: "#1A1714",
    muted: "#6B5A4A",
    line: "#D9CBBA",
    accent: "#C45C26",
    slabAccent: "#E8B86D",
    mark: "#9A3412",
  },
};

const DESKTOP = {
  width: 960,
  height: 392,
  board: { x: 12, y: 12, width: 936, height: 368 },
  identity: { x: 24, y: 24, width: 328, height: 344 },
  cards: { x: 372, y: 40, width: 556, height: 96, step: 108 },
};

const MOBILE = {
  width: 400,
  height: 860,
  board: { x: 8, y: 8, width: 384, height: 844 },
  identity: { x: 18, y: 18, width: 364, height: 148 },
  cards: { x: 18, y: 186, width: 364, height: 198, step: 214 },
};

const INDEX = {
  width: 960,
  height: 148,
  board: { x: 12, y: 12, width: 936, height: 124 },
  cell: { x: 28, y: 44, width: 220, height: 76, step: 232 },
};

const INDEX_MOBILE = {
  width: 400,
  height: 360,
  board: { x: 8, y: 8, width: 384, height: 344 },
  cell: { x: 18, y: 48, width: 176, height: 136, stepX: 188, stepY: 148 },
};

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function repoUrl(name) {
  return `https://github.com/${USER}/${name}`;
}

function rr(x, y, w, h, r, fill) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
}

function projects() {
  return [...flagships, ...also, ...shipping, ...other, ...academic];
}

function assertLayout() {
  if (!/^[a-z0-9-]+$/i.test(USER)) throw new Error(`unsafe GitHub username: ${USER}`);
  if (flagships.length !== 3) throw new Error("hero is built for 3 flagships");
  if (also.length !== 4) throw new Error("index is built for 4 supporting repos");
  if (identity.tagline.length > 32) throw new Error("identity tagline is too long for SVG");
  if (identity.stack.length > 34) throw new Error("identity stack is too long for SVG");
  for (const item of projects()) {
    if (!item || typeof item.repo !== "string") {
      throw new Error("every listed project must be an object with repo");
    }
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(item.repo)) {
      throw new Error(`unsafe repository name: ${item.repo}`);
    }
  }
  const desktopCardRight = DESKTOP.cards.x + DESKTOP.cards.width;
  if (desktopCardRight > DESKTOP.board.x + DESKTOP.board.width) {
    throw new Error(`desktop cards overflow board: ${desktopCardRight}`);
  }
  const indexRight = INDEX.cell.x + (also.length - 1) * INDEX.cell.step + INDEX.cell.width;
  if (indexRight > INDEX.board.x + INDEX.board.width) {
    throw new Error(`index cells overflow board: ${indexRight}`);
  }
  for (const item of flagships) {
    if (item.domain.length > 12) throw new Error(`domain too long: ${item.repo}`);
    if (item.blurb.length > 48) throw new Error(`blurb too long: ${item.repo}`);
  }
  for (const item of also) {
    if (item.domain.length > 12) throw new Error(`supporting domain too long: ${item.repo}`);
  }
}

function defs() {
  return `<style>
    .display{font-family:Georgia,"Times New Roman",serif}
    .body{font-family:"Avenir Next",Avenir,Helvetica,sans-serif}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
    .rise{animation:rise .45s ease-out}
    @keyframes rise{from{opacity:.2}to{opacity:1}}
    @media(prefers-reduced-motion:reduce){.rise{animation:none}}
  </style>`;
}

function desktop(p, id) {
  const cards = flagships
    .map((item, i) => {
      const y = DESKTOP.cards.y + i * DESKTOP.cards.step;
      const index = String(i + 1).padStart(2, "0");
      return `<g class="rise">
        ${rr(DESKTOP.cards.x, y, DESKTOP.cards.width, DESKTOP.cards.height, 16, p.module)}
        <text x="${DESKTOP.cards.x + DESKTOP.cards.width - 28}" y="${y + 70}" class="display" font-size="64" text-anchor="end" fill="${p.line}" opacity=".55">${index}</text>
        <text x="${DESKTOP.cards.x + 24}" y="${y + 32}" class="mono" font-size="11" letter-spacing="1.8" fill="${p.mark}">${xml(item.domain)}  ·  ${xml(item.stack.toUpperCase())}</text>
        <text x="${DESKTOP.cards.x + 24}" y="${y + 60}" class="body" font-size="22" font-weight="700" fill="${p.text}">${xml(item.repo)}</text>
        <text x="${DESKTOP.cards.x + 24}" y="${y + 82}" class="body" font-size="13" fill="${p.muted}">${xml(item.blurb)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(
    `${identity.name}, software builder. Selected work: ${flagships.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${DESKTOP.width}" height="${DESKTOP.height}" viewBox="0 0 ${DESKTOP.width} ${DESKTOP.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs()}
  <rect width="${DESKTOP.width}" height="${DESKTOP.height}" fill="${p.bg}"/>
  ${rr(DESKTOP.board.x, DESKTOP.board.y, DESKTOP.board.width, DESKTOP.board.height, 24, p.board)}
  <g class="rise">
    ${rr(DESKTOP.identity.x, DESKTOP.identity.y, DESKTOP.identity.width, DESKTOP.identity.height, 20, p.slab)}
    <rect x="${DESKTOP.identity.x}" y="${DESKTOP.identity.y + 28}" width="4" height="48" fill="${p.accent}"/>
    <text x="48" y="64" class="mono" font-size="12" letter-spacing="2.2" fill="${p.slabAccent}">${xml(identity.name.toUpperCase())}</text>
    <text x="46" y="148" class="display" font-size="46" fill="${p.slabText}">Software</text>
    <text x="46" y="198" class="display" font-size="46" fill="${p.slabText}">builder</text>
    <text x="48" y="242" class="body" font-size="13" fill="${p.slabMuted}">${xml(identity.tagline)}</text>
    <path d="M48 260H316" stroke="${p.accent}" stroke-width="1" opacity=".35"/>
    <text x="48" y="292" class="mono" font-size="11" letter-spacing="1.2" fill="${p.slabText}">${xml(identity.stack.toUpperCase())}</text>
    <text x="48" y="336" class="mono" font-size="12" letter-spacing="1.6" fill="${p.slabAccent}">${xml(identity.location.toUpperCase())}</text>
  </g>
  ${cards}
</svg>`;
}

function mobile(p, id) {
  const cards = flagships
    .map((item, i) => {
      const y = MOBILE.cards.y + i * MOBILE.cards.step;
      const index = String(i + 1).padStart(2, "0");
      return `<g class="rise">
        ${rr(MOBILE.cards.x, y, MOBILE.cards.width, MOBILE.cards.height, 18, p.module)}
        <text x="${MOBILE.cards.x + MOBILE.cards.width - 18}" y="${y + 150}" class="display" font-size="72" text-anchor="end" fill="${p.line}" opacity=".45">${index}</text>
        <text x="40" y="${y + 48}" class="mono" font-size="13" letter-spacing="1.4" fill="${p.mark}">${xml(item.domain)}  ·  ${xml(item.stack.toUpperCase())}</text>
        <text x="40" y="${y + 100}" class="body" font-size="26" font-weight="700" fill="${p.text}">${xml(item.repo)}</text>
        <text x="40" y="${y + 148}" class="body" font-size="16" fill="${p.muted}">${xml(item.blurb)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(
    `${identity.name}, software builder. Selected work: ${flagships.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MOBILE.width}" height="${MOBILE.height}" viewBox="0 0 ${MOBILE.width} ${MOBILE.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs()}
  <rect width="${MOBILE.width}" height="${MOBILE.height}" fill="${p.bg}"/>
  ${rr(MOBILE.board.x, MOBILE.board.y, MOBILE.board.width, MOBILE.board.height, 22, p.board)}
  <g class="rise">
    ${rr(MOBILE.identity.x, MOBILE.identity.y, MOBILE.identity.width, MOBILE.identity.height, 18, p.slab)}
    <rect x="${MOBILE.identity.x}" y="${MOBILE.identity.y + 22}" width="4" height="40" fill="${p.accent}"/>
    <text x="40" y="48" class="mono" font-size="12" letter-spacing="1.6" fill="${p.slabAccent}">${xml(identity.name.toUpperCase())}</text>
    <text x="38" y="92" class="display" font-size="30" fill="${p.slabText}">Software</text>
    <text x="38" y="126" class="display" font-size="30" fill="${p.slabText}">builder</text>
    <text x="40" y="152" class="body" font-size="12" fill="${p.slabMuted}">${xml(identity.tagline)}</text>
  </g>
  ${cards}
</svg>`;
}

function indexDesktop(p, id) {
  const cells = also
    .map((item, i) => {
      const x = INDEX.cell.x + i * INDEX.cell.step;
      return `<g class="rise">
        ${rr(x, INDEX.cell.y, INDEX.cell.width, INDEX.cell.height, 14, p.raised)}
        <rect x="${x + 16}" y="${INDEX.cell.y}" width="${INDEX.cell.width - 32}" height="3" fill="${p.accent}"/>
        <text x="${x + 16}" y="${INDEX.cell.y + 32}" class="mono" font-size="11" letter-spacing="1.6" fill="${p.mark}">${xml(item.domain)}  ·  ${xml(item.stack.toUpperCase())}</text>
        <text x="${x + 16}" y="${INDEX.cell.y + 60}" class="body" font-size="18" font-weight="700" fill="${p.text}">${xml(item.repo)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(`Supporting work: ${also.map((item) => item.repo).join(", ")}.`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${INDEX.width}" height="${INDEX.height}" viewBox="0 0 ${INDEX.width} ${INDEX.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs()}
  <rect width="${INDEX.width}" height="${INDEX.height}" fill="${p.bg}"/>
  ${rr(INDEX.board.x, INDEX.board.y, INDEX.board.width, INDEX.board.height, 20, p.board)}
  <text x="28" y="36" class="mono" font-size="11" letter-spacing="2" fill="${p.muted}">OPERATOR STACK</text>
  ${cells}
</svg>`;
}

function indexMobile(p, id) {
  const cells = also
    .map((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = INDEX_MOBILE.cell.x + col * INDEX_MOBILE.cell.stepX;
      const y = INDEX_MOBILE.cell.y + row * INDEX_MOBILE.cell.stepY;
      return `<g class="rise">
        ${rr(x, y, INDEX_MOBILE.cell.width, INDEX_MOBILE.cell.height, 16, p.raised)}
        <rect x="${x + 14}" y="${y}" width="${INDEX_MOBILE.cell.width - 28}" height="3" fill="${p.accent}"/>
        <text x="${x + 14}" y="${y + 44}" class="mono" font-size="12" letter-spacing="1.2" fill="${p.mark}">${xml(item.domain)}</text>
        <text x="${x + 14}" y="${y + 90}" class="body" font-size="18" font-weight="700" fill="${p.text}">${xml(item.repo)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(`Supporting work: ${also.map((item) => item.repo).join(", ")}.`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${INDEX_MOBILE.width}" height="${INDEX_MOBILE.height}" viewBox="0 0 ${INDEX_MOBILE.width} ${INDEX_MOBILE.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs()}
  <rect width="${INDEX_MOBILE.width}" height="${INDEX_MOBILE.height}" fill="${p.bg}"/>
  ${rr(INDEX_MOBILE.board.x, INDEX_MOBILE.board.y, INDEX_MOBILE.board.width, INDEX_MOBILE.board.height, 20, p.board)}
  <text x="18" y="34" class="mono" font-size="12" letter-spacing="1.6" fill="${p.muted}">OPERATOR STACK</text>
  ${cells}
</svg>`;
}

function mdItems(rows) {
  return rows
    .map((item) => `- **[${item.repo}](${repoUrl(item.repo)})** — ${item.purpose}`)
    .join("\n");
}

function renderReadme() {
  const selected = flagships
    .map(
      (item) =>
        `**[${item.repo}](${repoUrl(item.repo)})** — ${item.stack}. ${item.purpose}`,
    )
    .join("\n\n");

  return `<!-- Generated by scripts/render-profile.mjs. Edit that file, then run: node scripts/render-profile.mjs -->
<picture>
  <source media="(max-width: 700px) and (prefers-color-scheme: dark)" srcset="assets/${ASSETS.mobileDark}">
  <source media="(max-width: 700px)" srcset="assets/${ASSETS.mobileLight}">
  <source media="(prefers-color-scheme: dark)" srcset="assets/${ASSETS.desktopDark}">
  <source media="(prefers-color-scheme: light)" srcset="assets/${ASSETS.desktopLight}">
  <img alt="${identity.name} — local-first software builder. Selected work: ${flagships.map((item) => item.repo).join(", ")}." src="assets/${ASSETS.desktopLight}" width="100%">
</picture>

${identity.intro}

## Selected work

${selected}

<picture>
  <source media="(max-width: 700px) and (prefers-color-scheme: dark)" srcset="assets/${ASSETS.indexMobileDark}">
  <source media="(max-width: 700px)" srcset="assets/${ASSETS.indexMobileLight}">
  <source media="(prefers-color-scheme: dark)" srcset="assets/${ASSETS.indexDark}">
  <source media="(prefers-color-scheme: light)" srcset="assets/${ASSETS.indexLight}">
  <img alt="Operator stack: ${also.map((item) => item.repo).join(", ")}." src="assets/${ASSETS.indexLight}" width="100%">
</picture>

## Operator stack

${mdItems(also)}

## Also shipping

${mdItems(shipping)}

<details>
<summary>Other public work</summary>

${mdItems(other)}

</details>

<details>
<summary>Academic projects</summary>

${mdItems(academic)}

</details>

## Contact

[LinkedIn](https://www.linkedin.com/in/${USER}) · [Email](mailto:batu3384@gmail.com)
`;
}

function assertSvg(name, svg) {
  if (!/^<svg\b[\s\S]*<\/svg>$/.test(svg)) throw new Error(`${name} is not a complete SVG`);
  if ((svg.match(/<svg\b/g) || []).length !== 1) throw new Error(`${name} has invalid SVG nesting`);
  if (/<script\b|javascript:| on[a-z]+\s*=/i.test(svg)) {
    throw new Error(`${name} contains executable SVG content`);
  }
  if (!svg.includes('role="img"') || !svg.includes("aria-label=")) {
    throw new Error(`${name} is missing accessible image metadata`);
  }
  if (svg.includes("undefined")) throw new Error(`${name} leaked undefined into markup`);
}

assertLayout();
mkdirSync(outDir, { recursive: true });

const files = {
  [ASSETS.desktopDark]: desktop(palettes.dark, "dark"),
  [ASSETS.desktopLight]: desktop(palettes.light, "light"),
  [ASSETS.mobileDark]: mobile(palettes.dark, "mdark"),
  [ASSETS.mobileLight]: mobile(palettes.light, "mlight"),
  [ASSETS.indexDark]: indexDesktop(palettes.dark, "idark"),
  [ASSETS.indexLight]: indexDesktop(palettes.light, "ilight"),
  [ASSETS.indexMobileDark]: indexMobile(palettes.dark, "imidark"),
  [ASSETS.indexMobileLight]: indexMobile(palettes.light, "imilight"),
};

for (const [name, svg] of Object.entries(files)) {
  if (name.startsWith("hero-") && (!svg.includes("Software") || !svg.includes("ScreenTextGrab"))) {
    throw new Error(`${name} missing identity or flagship`);
  }
  if (name.startsWith("index-") && !svg.includes("sift")) {
    throw new Error(`${name} missing supporting work`);
  }
  assertSvg(name, svg);
  writeFileSync(join(outDir, name), svg);
}

const keep = new Set(Object.keys(files));
for (const name of readdirSync(outDir)) {
  if (name.endsWith(".svg") && !keep.has(name)) unlinkSync(join(outDir, name));
}

const readme = renderReadme();
for (const required of [
  "<picture>",
  "prefers-color-scheme: light",
  "## Selected work",
  "## Operator stack",
  "## Also shipping",
  "byteback",
  "duetto",
  "## Contact",
]) {
  if (!readme.includes(required)) throw new Error(`README missing ${required}`);
}
if (readme.includes("## How I build")) throw new Error("README still has unused philosophy block");
writeFileSync(join(root, "README.md"), readme);
console.log("wrote 8 profile SVGs and README.md");
