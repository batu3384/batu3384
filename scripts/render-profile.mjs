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
  desktopDark: "hero-v4-dark.svg",
  desktopLight: "hero-v4-light.svg",
  mobileDark: "hero-v4-mobile-dark.svg",
  mobileLight: "hero-v4-mobile-light.svg",
  indexDark: "index-v4-dark.svg",
  indexLight: "index-v4-light.svg",
  indexMobileDark: "index-v4-mobile-dark.svg",
  indexMobileLight: "index-v4-mobile-light.svg",
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
    bg: "#07090B",
    board: "#0E1417",
    module: "#151E22",
    raised: "#1C272C",
    text: "#F2F7F5",
    muted: "#8FA3A0",
    trace: "#2C4246",
    ink: "#22D3EE",
    secondary: "#60A5FA",
  },
  light: {
    bg: "#D7DDD8",
    board: "#EEF2ED",
    module: "#F7FAF6",
    raised: "#FFFFFF",
    text: "#122024",
    muted: "#3F534F",
    trace: "#B7C6C2",
    ink: "#0E7490",
    secondary: "#1D4ED8",
  },
};

const DESKTOP = {
  width: 960,
  height: 360,
  board: { x: 12, y: 12, width: 936, height: 336 },
  identity: { x: 28, y: 28, width: 304, height: 304 },
  cards: { x: 356, y: 48, width: 576, height: 88, step: 100 },
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

function cut(x, y, w, h) {
  return `M${x} ${y}H${x + w - 16}L${x + w} ${y + 16}V${y + h}H${x}Z`;
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

function defs(p, id) {
  return `<defs>
    <pattern id="${id}-grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="${p.trace}" stroke-width=".6" opacity=".45"/>
    </pattern>
  </defs>
  <style>
    .display{font-family:"Arial Narrow","Avenir Next Condensed",Impact,sans-serif}
    .body{font-family:"Avenir Next",Avenir,Helvetica,sans-serif}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
    .boot{animation:boot .4s ease-out}
    .scan{stroke-dasharray:5 9;animation:scan 8s linear infinite}
    @keyframes boot{from{opacity:.25}to{opacity:1}}
    @keyframes scan{to{stroke-dashoffset:-140}}
    @media(prefers-reduced-motion:reduce){.boot,.scan{animation:none}}
  </style>`;
}

function desktop(p, id) {
  const cards = flagships
    .map((item, i) => {
      const y = DESKTOP.cards.y + i * DESKTOP.cards.step;
      const accent = i === 2 ? p.secondary : p.ink;
      const index = String(i + 1).padStart(2, "0");
      return `<g class="boot">
        <path d="${cut(DESKTOP.cards.x, y, DESKTOP.cards.width, DESKTOP.cards.height)}" fill="${p.module}" stroke="${p.trace}"/>
        <rect x="${DESKTOP.cards.x}" y="${y}" width="7" height="${DESKTOP.cards.height}" fill="${accent}"/>
        <text x="${DESKTOP.cards.x + 24}" y="${y + 28}" class="mono" font-size="12" letter-spacing="1.6" fill="${accent}">${index}  ${xml(item.domain)}  ·  ${xml(item.stack.toUpperCase())}</text>
        <text x="${DESKTOP.cards.x + 24}" y="${y + 56}" class="body" font-size="22" font-weight="800" fill="${p.text}">${xml(item.repo)}</text>
        <text x="${DESKTOP.cards.x + 24}" y="${y + 76}" class="body" font-size="13" fill="${p.muted}">${xml(item.blurb)}</text>
      </g>`;
    })
    .join("");

  const rail = flagships
    .map((_, i) => {
      const y = DESKTOP.cards.y + 44 + i * DESKTOP.cards.step;
      return `M336 ${y}H356`;
    })
    .join("");

  const alt = xml(
    `${identity.name}, software builder. Selected work: ${flagships.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${DESKTOP.width}" height="${DESKTOP.height}" viewBox="0 0 ${DESKTOP.width} ${DESKTOP.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p, id)}
  <rect width="${DESKTOP.width}" height="${DESKTOP.height}" fill="${p.bg}"/>
  <rect x="${DESKTOP.board.x}" y="${DESKTOP.board.y}" width="${DESKTOP.board.width}" height="${DESKTOP.board.height}" rx="12" fill="${p.board}" stroke="${p.trace}"/>
  <rect x="${DESKTOP.board.x}" y="${DESKTOP.board.y}" width="${DESKTOP.board.width}" height="${DESKTOP.board.height}" rx="12" fill="url(#${id}-grid)"/>
  <path d="${rail}" fill="none" stroke="${p.trace}" stroke-width="2"/>
  <path class="scan" d="${rail}" fill="none" stroke="${p.ink}" stroke-width="1.5"/>
  <g class="boot">
    <path d="${cut(DESKTOP.identity.x, DESKTOP.identity.y, DESKTOP.identity.width, DESKTOP.identity.height)}" fill="${p.module}" stroke="${p.trace}"/>
    <rect x="${DESKTOP.identity.x}" y="${DESKTOP.identity.y}" width="7" height="${DESKTOP.identity.height}" fill="${p.ink}"/>
    <text x="50" y="58" class="mono" font-size="12" letter-spacing="2" fill="${p.ink}">${xml(identity.name.toUpperCase())}</text>
    <text x="48" y="128" class="display" font-size="42" font-weight="900" letter-spacing="-1" fill="${p.text}">SOFTWARE</text>
    <text x="48" y="174" class="display" font-size="42" font-weight="900" letter-spacing="-1" fill="${p.text}">BUILDER</text>
    <text x="50" y="214" class="body" font-size="13" fill="${p.muted}">${xml(identity.tagline)}</text>
    <path d="M50 232H300" stroke="${p.trace}"/>
    <text x="50" y="258" class="mono" font-size="11" letter-spacing="1.1" fill="${p.text}">${xml(identity.stack.toUpperCase())}</text>
    <text x="50" y="302" class="mono" font-size="12" letter-spacing="1.4" fill="${p.ink}">${xml(identity.location.toUpperCase())}</text>
  </g>
  ${cards}
</svg>`;
}

function mobile(p, id) {
  const cards = flagships
    .map((item, i) => {
      const y = MOBILE.cards.y + i * MOBILE.cards.step;
      const accent = i === 2 ? p.secondary : p.ink;
      const index = String(i + 1).padStart(2, "0");
      return `<g class="boot">
        <path d="${cut(MOBILE.cards.x, y, MOBILE.cards.width, MOBILE.cards.height)}" fill="${p.module}" stroke="${p.trace}"/>
        <rect x="${MOBILE.cards.x}" y="${y}" width="8" height="${MOBILE.cards.height}" fill="${accent}"/>
        <text x="40" y="${y + 48}" class="mono" font-size="14" letter-spacing="1.2" fill="${accent}">${index}  ${xml(item.domain)}  ·  ${xml(item.stack.toUpperCase())}</text>
        <text x="40" y="${y + 104}" class="body" font-size="26" font-weight="800" fill="${p.text}">${xml(item.repo)}</text>
        <text x="40" y="${y + 154}" class="body" font-size="16" fill="${p.muted}">${xml(item.blurb)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(
    `${identity.name}, software builder. Selected work: ${flagships.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MOBILE.width}" height="${MOBILE.height}" viewBox="0 0 ${MOBILE.width} ${MOBILE.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p, id)}
  <rect width="${MOBILE.width}" height="${MOBILE.height}" fill="${p.bg}"/>
  <rect x="${MOBILE.board.x}" y="${MOBILE.board.y}" width="${MOBILE.board.width}" height="${MOBILE.board.height}" rx="16" fill="${p.board}" stroke="${p.trace}"/>
  <rect x="${MOBILE.board.x}" y="${MOBILE.board.y}" width="${MOBILE.board.width}" height="${MOBILE.board.height}" rx="16" fill="url(#${id}-grid)"/>
  <g class="boot">
    <path d="${cut(MOBILE.identity.x, MOBILE.identity.y, MOBILE.identity.width, MOBILE.identity.height)}" fill="${p.module}" stroke="${p.trace}"/>
    <rect x="${MOBILE.identity.x}" y="${MOBILE.identity.y}" width="8" height="${MOBILE.identity.height}" fill="${p.ink}"/>
    <text x="40" y="52" class="mono" font-size="13" letter-spacing="1.4" fill="${p.ink}">${xml(identity.name.toUpperCase())}</text>
    <text x="36" y="96" class="display" font-size="28" font-weight="900" fill="${p.text}">SOFTWARE</text>
    <text x="36" y="128" class="display" font-size="28" font-weight="900" fill="${p.text}">BUILDER</text>
    <text x="40" y="154" class="body" font-size="12" fill="${p.muted}">${xml(identity.tagline)}</text>
  </g>
  ${cards}
</svg>`;
}

function indexDesktop(p, id) {
  const cells = also
    .map((item, i) => {
      const x = INDEX.cell.x + i * INDEX.cell.step;
      const accent = i % 2 ? p.secondary : p.ink;
      return `<g class="boot">
        <path d="${cut(x, INDEX.cell.y, INDEX.cell.width, INDEX.cell.height)}" fill="${p.raised}" stroke="${p.trace}"/>
        <rect x="${x}" y="${INDEX.cell.y}" width="6" height="${INDEX.cell.height}" fill="${accent}"/>
        <text x="${x + 18}" y="${INDEX.cell.y + 28}" class="mono" font-size="11" letter-spacing="1.4" fill="${accent}">${xml(item.domain)}  ·  ${xml(item.stack.toUpperCase())}</text>
        <text x="${x + 18}" y="${INDEX.cell.y + 56}" class="body" font-size="18" font-weight="800" fill="${p.text}">${xml(item.repo)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(`Supporting work: ${also.map((item) => item.repo).join(", ")}.`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${INDEX.width}" height="${INDEX.height}" viewBox="0 0 ${INDEX.width} ${INDEX.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p, id)}
  <rect width="${INDEX.width}" height="${INDEX.height}" fill="${p.bg}"/>
  <rect x="${INDEX.board.x}" y="${INDEX.board.y}" width="${INDEX.board.width}" height="${INDEX.board.height}" rx="12" fill="${p.board}" stroke="${p.trace}"/>
  <text x="28" y="34" class="mono" font-size="11" letter-spacing="1.8" fill="${p.muted}">OPERATOR STACK</text>
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
      const accent = i % 2 ? p.secondary : p.ink;
      return `<g class="boot">
        <path d="${cut(x, y, INDEX_MOBILE.cell.width, INDEX_MOBILE.cell.height)}" fill="${p.raised}" stroke="${p.trace}"/>
        <rect x="${x}" y="${y}" width="7" height="${INDEX_MOBILE.cell.height}" fill="${accent}"/>
        <text x="${x + 16}" y="${y + 42}" class="mono" font-size="12" letter-spacing="1" fill="${accent}">${xml(item.domain)}</text>
        <text x="${x + 16}" y="${y + 86}" class="body" font-size="18" font-weight="800" fill="${p.text}">${xml(item.repo)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(`Supporting work: ${also.map((item) => item.repo).join(", ")}.`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${INDEX_MOBILE.width}" height="${INDEX_MOBILE.height}" viewBox="0 0 ${INDEX_MOBILE.width} ${INDEX_MOBILE.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p, id)}
  <rect width="${INDEX_MOBILE.width}" height="${INDEX_MOBILE.height}" fill="${p.bg}"/>
  <rect x="${INDEX_MOBILE.board.x}" y="${INDEX_MOBILE.board.y}" width="${INDEX_MOBILE.board.width}" height="${INDEX_MOBILE.board.height}" rx="16" fill="${p.board}" stroke="${p.trace}"/>
  <text x="18" y="34" class="mono" font-size="12" letter-spacing="1.4" fill="${p.muted}">OPERATOR STACK</text>
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
  if (name.startsWith("hero-") && (!svg.includes("SOFTWARE") || !svg.includes("ScreenTextGrab"))) {
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
