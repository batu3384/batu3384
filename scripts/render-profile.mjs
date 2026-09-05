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
  desktopDark: "hero-v6-dark.svg",
  desktopLight: "hero-v6-light.svg",
  mobileDark: "hero-v6-mobile-dark.svg",
  mobileLight: "hero-v6-mobile-light.svg",
  indexDark: "index-v6-dark.svg",
  indexLight: "index-v6-light.svg",
  indexMobileDark: "index-v6-mobile-dark.svg",
  indexMobileLight: "index-v6-mobile-light.svg",
};

const identity = {
  name: "Batuhan Yüksel",
  tagline: "macOS · terminal · AppSec",
  location: "Istanbul · MIS",
  stack: "Swift · Go · TS · Python · Rust",
  intro:
    "MIS graduate in Istanbul. I build local-first macOS apps, terminal tools, and AppSec workflows in Swift, Go, TypeScript, Python, and Rust.",
};

const LANG = {
  Swift: "#F05138",
  TypeScript: "#3178C6",
  Go: "#00ADD8",
  Rust: "#DEA584",
  "C++": "#F34B7D",
};

const flagships = [
  {
    repo: "ScreenTextGrab",
    domain: "macOS",
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
    repo: "ironsentinel",
    domain: "APPSEC",
    stack: "Go",
    blurb: "Guided scans, trust checks, evidence reports.",
    purpose:
      "Local-first AppSec CLI for guided scans, runtime trust checks, and HTML / SARIF / CSV evidence.",
  },
];

const also = [
  {
    repo: "sift",
    domain: "TERMINAL",
    stack: "Go",
    purpose:
      "Review-first terminal cleaner for macOS and Windows. Destructive work is previewed before it runs.",
  },
  {
    repo: "falcon-dm",
    domain: "macOS",
    stack: "Rust",
    purpose:
      "Local-only macOS download manager for HTTP, HLS, and YouTube. No cloud queue.",
  },
  {
    repo: "frostwall-beam",
    domain: "TRANSFER",
    stack: "Rust",
    purpose:
      "Encrypted LAN and internet file transfer with pairing codes and receiver approval.",
  },
  {
    repo: "byteback",
    domain: "FORENSICS",
    stack: "C++",
    purpose:
      "Windows forensic imaging and data recovery with a native C++ engine and an examiner UI.",
  },
];

const shipping = [
  {
    repo: "agent-atlas",
    purpose:
      "Installer and router that gives AI agents open-web search and research tools.",
  },
  {
    repo: "codebase-audit",
    purpose:
      "Evidence-backed whole-repo architecture audit skill for Cursor, Claude Code, Codex, and Antigravity.",
  },
  {
    repo: "deskward",
    purpose:
      "Tailscale-first remote desktop with a Rust core and Flutter client. Still in phased host-agent work.",
  },
  {
    repo: "duetto",
    purpose:
      "Chrome extension for Udemy: dual captions, translation, lecture notes, and precision playback.",
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
    bg: "#0d1117",
    board: "#0d1117",
    slab: "#161b22",
    slabText: "#e6edf3",
    slabMuted: "#9198a1",
    module: "#161b22",
    raised: "#161b22",
    text: "#e6edf3",
    muted: "#9198a1",
    line: "#3d444d",
    accent: "#4493f8",
    slabAccent: "#4493f8",
    mark: "#4493f8",
    border: "#3d444d",
  },
  light: {
    bg: "#ffffff",
    board: "#ffffff",
    slab: "#f6f8fa",
    slabText: "#1f2328",
    slabMuted: "#59636e",
    module: "#ffffff",
    raised: "#ffffff",
    text: "#1f2328",
    muted: "#59636e",
    line: "#d1d9e0",
    accent: "#0969da",
    slabAccent: "#0969da",
    mark: "#0969da",
    border: "#d1d9e0",
  },
};

const DESKTOP = {
  width: 960,
  height: 392,
  board: { x: 12, y: 12, width: 936, height: 368 },
  identity: { x: 24, y: 24, width: 328, height: 220 },
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

function box(x, y, w, h, fill, border) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="${border}"/>`;
}

function langDot(x, y, stack) {
  return `<circle cx="${x}" cy="${y}" r="4" fill="${LANG[stack] || "#8b949e"}"/>`;
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
    .display,.body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif}
    .mono{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace}
    .rise{animation:rise .45s ease-out}
    @keyframes rise{from{opacity:.2}to{opacity:1}}
    @media(prefers-reduced-motion:reduce){.rise{animation:none}}
  </style>`;
}

function desktop(p, id) {
  const cards = flagships
    .map((item, i) => {
      const y = DESKTOP.cards.y + i * DESKTOP.cards.step;
      const x = DESKTOP.cards.x;
      return `<g class="rise">
        ${box(x, y, DESKTOP.cards.width, DESKTOP.cards.height, p.module, p.border)}
        ${langDot(x + 20, y + 28, item.stack)}
        <text x="${x + 32}" y="${y + 32}" class="mono" font-size="12" fill="${p.muted}">${xml(item.stack)}</text>
        <text x="${x + 18}" y="${y + 58}" class="body" font-size="16" font-weight="600" fill="${p.accent}">${xml(item.repo)}</text>
        <text x="${x + 18}" y="${y + 80}" class="body" font-size="13" fill="${p.muted}">${xml(item.blurb)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(
    `${identity.name}, software developer. Selected work: ${flagships.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${DESKTOP.width}" height="${DESKTOP.height}" viewBox="0 0 ${DESKTOP.width} ${DESKTOP.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs()}
  <rect width="${DESKTOP.width}" height="${DESKTOP.height}" fill="${p.bg}"/>
  <g class="rise">
    ${box(DESKTOP.identity.x, DESKTOP.identity.y, DESKTOP.identity.width, DESKTOP.identity.height, p.slab, p.border)}
    <text x="44" y="56" class="mono" font-size="12" fill="${p.muted}">${xml(identity.name)}</text>
    <text x="44" y="100" class="display" font-size="24" font-weight="600" fill="${p.slabText}">Software developer</text>
    <text x="44" y="136" class="body" font-size="14" fill="${p.slabMuted}">${xml(identity.tagline)}</text>
    <path d="M44 160H328" stroke="${p.border}" stroke-width="1"/>
    <text x="44" y="192" class="mono" font-size="12" fill="${p.slabText}">${xml(identity.stack)}</text>
    <text x="44" y="224" class="body" font-size="13" fill="${p.muted}">${xml(identity.location)}</text>
  </g>
  ${cards}
</svg>`;
}

function mobile(p, id) {
  const cards = flagships
    .map((item, i) => {
      const y = MOBILE.cards.y + i * MOBILE.cards.step;
      return `<g class="rise">
        ${box(MOBILE.cards.x, y, MOBILE.cards.width, MOBILE.cards.height, p.module, p.border)}
        ${langDot(40, y + 36, item.stack)}
        <text x="52" y="${y + 40}" class="mono" font-size="13" fill="${p.muted}">${xml(item.stack)}</text>
        <text x="40" y="${y + 92}" class="body" font-size="22" font-weight="600" fill="${p.accent}">${xml(item.repo)}</text>
        <text x="40" y="${y + 132}" class="body" font-size="15" fill="${p.muted}">${xml(item.blurb)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(
    `${identity.name}, software developer. Selected work: ${flagships.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MOBILE.width}" height="${MOBILE.height}" viewBox="0 0 ${MOBILE.width} ${MOBILE.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs()}
  <rect width="${MOBILE.width}" height="${MOBILE.height}" fill="${p.bg}"/>
  <g class="rise">
    ${box(MOBILE.identity.x, MOBILE.identity.y, MOBILE.identity.width, MOBILE.identity.height, p.slab, p.border)}
    <text x="36" y="48" class="mono" font-size="12" fill="${p.muted}">${xml(identity.name)}</text>
    <text x="36" y="88" class="display" font-size="24" font-weight="600" fill="${p.slabText}">Software developer</text>
    <text x="36" y="122" class="body" font-size="13" fill="${p.slabMuted}">${xml(identity.tagline)}</text>
  </g>
  ${cards}
</svg>`;
}

function indexDesktop(p, id) {
  const cells = also
    .map((item, i) => {
      const x = INDEX.cell.x + i * INDEX.cell.step;
      return `<g class="rise">
        ${box(x, INDEX.cell.y, INDEX.cell.width, INDEX.cell.height, p.raised, p.border)}
        ${langDot(x + 16, INDEX.cell.y + 24, item.stack)}
        <text x="${x + 28}" y="${INDEX.cell.y + 28}" class="mono" font-size="11" fill="${p.muted}">${xml(item.stack)}</text>
        <text x="${x + 16}" y="${INDEX.cell.y + 58}" class="body" font-size="14" font-weight="600" fill="${p.accent}">${xml(item.repo)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(`Tools: ${also.map((item) => item.repo).join(", ")}.`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${INDEX.width}" height="${INDEX.height}" viewBox="0 0 ${INDEX.width} ${INDEX.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs()}
  <rect width="${INDEX.width}" height="${INDEX.height}" fill="${p.bg}"/>
  <text x="28" y="32" class="body" font-size="12" font-weight="600" fill="${p.muted}">Tools</text>
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
        ${box(x, y, INDEX_MOBILE.cell.width, INDEX_MOBILE.cell.height, p.raised, p.border)}
        ${langDot(x + 16, y + 28, item.stack)}
        <text x="${x + 28}" y="${y + 32}" class="mono" font-size="12" fill="${p.muted}">${xml(item.stack)}</text>
        <text x="${x + 16}" y="${y + 88}" class="body" font-size="16" font-weight="600" fill="${p.accent}">${xml(item.repo)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(`Tools: ${also.map((item) => item.repo).join(", ")}.`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${INDEX_MOBILE.width}" height="${INDEX_MOBILE.height}" viewBox="0 0 ${INDEX_MOBILE.width} ${INDEX_MOBILE.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs()}
  <rect width="${INDEX_MOBILE.width}" height="${INDEX_MOBILE.height}" fill="${p.bg}"/>
  <text x="18" y="32" class="body" font-size="13" font-weight="600" fill="${p.muted}">Tools</text>
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
  <img alt="${identity.name} — software developer. Selected work: ${flagships.map((item) => item.repo).join(", ")}." src="assets/${ASSETS.desktopLight}" width="100%">
</picture>

${identity.intro}

## Selected work

${selected}

<picture>
  <source media="(max-width: 700px) and (prefers-color-scheme: dark)" srcset="assets/${ASSETS.indexMobileDark}">
  <source media="(max-width: 700px)" srcset="assets/${ASSETS.indexMobileLight}">
  <source media="(prefers-color-scheme: dark)" srcset="assets/${ASSETS.indexDark}">
  <source media="(prefers-color-scheme: light)" srcset="assets/${ASSETS.indexLight}">
  <img alt="Tools: ${also.map((item) => item.repo).join(", ")}." src="assets/${ASSETS.indexLight}" width="100%">
</picture>

## Tools

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
  "## Tools",
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
