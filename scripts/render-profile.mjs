#!/usr/bin/env node
// Source of truth for github.com/batu3384 — SVGs + README.md
// Run: node scripts/render-profile.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets");
const USER = "batu3384";
const ASSETS = {
  desktopDark: "hero-workbench-v2-dark.svg",
  desktopLight: "hero-workbench-v2-light.svg",
  mobileDark: "hero-workbench-v2-mobile-dark.svg",
  mobileLight: "hero-workbench-v2-mobile-light.svg",
};

const identity = {
  name: "Batuhan Yüksel",
  headline: "SOFTWARE DEVELOPER",
  tagline: "LOCAL-FIRST SOFTWARE · PRIVACY-AWARE TOOLS",
  location: "Istanbul · MIS",
  stack: "Swift · Go · TypeScript · Python · Rust",
  intro:
    "MIS graduate and software developer in Istanbul. I build local-first macOS apps, terminal tools, and AppSec workflows in Swift, Go, TypeScript, Python, and Rust.",
};

const flagships = [
  {
    repo: "ScreenTextGrab",
    role: "macOS · OCR",
    blurb: "Capture anything visual as usable text.",
    purpose:
      "Local-first macOS OCR for screen, clipboard, files, and PDFs.",
  },
  {
    repo: "calder",
    role: "AI · WORKSPACE",
    blurb: "Run parallel coding CLIs in one workspace.",
    purpose:
      "Terminal-centric Electron workspace for parallel AI coding CLI sessions.",
  },
  {
    repo: "frostwall-beam",
    role: "SECURE · TRANSFER",
    blurb: "Encrypted transfer with receiver approval.",
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
    primary: "#0E7490",
    secondary: "#1D4ED8",
    ink: "#0E7490",
  },
};

const DESKTOP = {
  width: 960,
  height: 430,
  board: { x: 12, y: 12, width: 936, height: 406 },
  identity: { x: 28, y: 28, width: 330, height: 304 },
  cards: { x: 386, y: 68, width: 546, height: 78, step: 90 },
  chips: { x: 28, y: 354, width: 214, height: 48, step: 224 },
};

const MOBILE = {
  width: 640,
  height: 900,
  board: { x: 12, y: 12, width: 616, height: 876 },
  identity: { x: 28, y: 28, width: 584, height: 192 },
  cards: { x: 28, y: 244, width: 584, height: 132, step: 150 },
  chips: { x: 28, y: 710, width: 284, height: 52, stepX: 304, stepY: 66 },
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
  if (!/^[a-z0-9-]+$/i.test(USER)) throw new Error(`unsafe GitHub username: ${USER}`);
  if (flagships.length !== 3) throw new Error("desktop hero is built for 3 flagships");
  if (also.length !== 4) throw new Error("desktop chip row is built for 4 supporting repos");
  if (identity.tagline.length > 42) throw new Error("identity tagline is too long for SVG");
  if (identity.stack.length > 42) throw new Error("identity stack is too long for SVG");
  for (const item of [...flagships, ...also, ...other, ...academic]) {
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(item.repo)) {
      throw new Error(`unsafe repository name: ${item.repo}`);
    }
  }
  const desktopChipRight =
    DESKTOP.chips.x + (also.length - 1) * DESKTOP.chips.step + DESKTOP.chips.width;
  if (desktopChipRight > DESKTOP.board.x + DESKTOP.board.width) {
    throw new Error(`desktop chips overflow board: ${desktopChipRight}`);
  }
  const mobileChipRight = MOBILE.chips.x + MOBILE.chips.stepX + MOBILE.chips.width;
  if (mobileChipRight > MOBILE.board.x + MOBILE.board.width) {
    throw new Error(`mobile chips overflow board: ${mobileChipRight}`);
  }
  for (const item of flagships) {
    if (item.role.length > 20) throw new Error(`role too long for SVG: ${item.repo}`);
    if (item.blurb.length > 52) throw new Error(`blurb too long for SVG card: ${item.repo}`);
  }
  for (const item of also) {
    if (item.role.length > 20) throw new Error(`supporting role too long for SVG: ${item.repo}`);
  }
}

function defs(p, id) {
  return `<defs>
    <pattern id="${id}-perf" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.15" fill="${p.trace}" opacity=".5"/></pattern>
  </defs>
  <style>
    .display{font-family:"Arial Narrow","Avenir Next Condensed",Impact,sans-serif}
    .body{font-family:"Avenir Next",Avenir,Helvetica,sans-serif}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
    .boot{animation:boot .45s cubic-bezier(.2,.8,.2,1)}
    .signal{stroke-dasharray:4 8;animation:signal 7s linear infinite}
    .dial{transform-box:fill-box;transform-origin:center;animation:dial 14s linear infinite}
    @keyframes boot{from{opacity:.3}to{opacity:1}}
    @keyframes signal{to{stroke-dashoffset:-120}}
    @keyframes dial{to{transform:rotate(360deg)}}
    @media(prefers-reduced-motion:reduce){.boot,.signal,.dial{animation:none}}
  </style>`;
}

function desktop(p, id) {
  const cards = flagships
    .map((item, i) => {
      const y = DESKTOP.cards.y + i * DESKTOP.cards.step;
      const accent = i === 2 ? p.secondary : p.ink;
      return `<g class="boot" style="animation-delay:${100 + i * 80}ms">
        <path d="${cut(DESKTOP.cards.x, y, DESKTOP.cards.width, DESKTOP.cards.height)}" fill="${p.module}" stroke="${p.trace}"/>
        <rect x="${DESKTOP.cards.x}" y="${y}" width="6" height="${DESKTOP.cards.height}" fill="${accent}"/>
        <text x="${DESKTOP.cards.x + 22}" y="${y + 25}" class="mono" font-size="11" letter-spacing="1.4" fill="${accent}">${String(i + 1).padStart(2, "0")}  /  ${xml(item.role)}</text>
        <text x="${DESKTOP.cards.x + 22}" y="${y + 53}" class="body" font-size="21" font-weight="800" fill="${p.text}">${xml(item.repo)}</text>
        <text x="${DESKTOP.cards.x + 22}" y="${y + 70}" class="body" font-size="12" fill="${p.muted}">${xml(item.blurb)}</text>
      </g>`;
    })
    .join("");

  const chips = also
    .map((item, i) => {
      const x = DESKTOP.chips.x + i * DESKTOP.chips.step;
      return `<g class="boot" style="animation-delay:${220 + i * 40}ms">
        <path d="${cut(x, DESKTOP.chips.y, DESKTOP.chips.width, DESKTOP.chips.height)}" fill="${p.raised}" stroke="${p.trace}"/>
        <rect x="${x}" y="${DESKTOP.chips.y}" width="5" height="${DESKTOP.chips.height}" fill="${i % 2 ? p.secondary : p.ink}"/>
        <text x="${x + 18}" y="${DESKTOP.chips.y + 21}" class="body" font-size="14" font-weight="800" fill="${p.text}">${xml(item.repo)}</text>
        <text x="${x + 18}" y="${DESKTOP.chips.y + 38}" class="mono" font-size="9" letter-spacing="1" fill="${p.muted}">${xml(item.role)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(
    `${identity.name}, ${identity.headline.toLowerCase()}. ${flagships.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${DESKTOP.width}" height="${DESKTOP.height}" viewBox="0 0 ${DESKTOP.width} ${DESKTOP.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p, id)}
  <rect width="${DESKTOP.width}" height="${DESKTOP.height}" fill="${p.bg}"/>
  <rect x="${DESKTOP.board.x}" y="${DESKTOP.board.y}" width="${DESKTOP.board.width}" height="${DESKTOP.board.height}" rx="14" fill="${p.board}" stroke="${p.trace}"/>
  <rect x="${DESKTOP.board.x}" y="${DESKTOP.board.y}" width="${DESKTOP.board.width}" height="${DESKTOP.board.height}" rx="14" fill="url(#${id}-perf)"/>
  <path d="M${DESKTOP.identity.x + DESKTOP.identity.width + 10} 107H374V107H${DESKTOP.cards.x}" fill="none" stroke="${p.trace}" stroke-width="2"/>
  <path class="signal" d="M${DESKTOP.identity.x + DESKTOP.identity.width + 10} 107H374V107H${DESKTOP.cards.x}" fill="none" stroke="${p.ink}"/>
  <g class="boot">
    <path d="${cut(DESKTOP.identity.x, DESKTOP.identity.y, DESKTOP.identity.width, DESKTOP.identity.height)}" fill="${p.module}" stroke="${p.trace}"/>
    <rect x="${DESKTOP.identity.x}" y="${DESKTOP.identity.y}" width="7" height="${DESKTOP.identity.height}" fill="${p.ink}"/>
    <text x="50" y="60" class="mono" font-size="11" letter-spacing="2.1" fill="${p.ink}">${xml(identity.name.toUpperCase())}</text>
    <text x="50" y="130" class="display" font-size="44" font-weight="900" letter-spacing="-1" fill="${p.text}">SOFTWARE</text>
    <text x="50" y="174" class="display" font-size="44" font-weight="900" letter-spacing="-1" fill="${p.text}">BUILDER</text>
    <text x="50" y="214" class="body" font-size="12" fill="${p.muted}">${xml(identity.tagline)}</text>
    <path d="M50 232H330" stroke="${p.trace}"/>
    <text x="50" y="258" class="mono" font-size="10" letter-spacing="1.2" fill="${p.text}">${xml(identity.stack.toUpperCase())}</text>
    <g transform="translate(310 300)">
      <circle r="20" fill="${p.raised}" stroke="${p.trace}"/>
      <circle class="dial" r="13" fill="none" stroke="${p.secondary}" stroke-width="3" stroke-dasharray="5 5"/>
      <circle r="4" fill="${p.secondary}"/>
    </g>
    <text x="50" y="308" class="mono" font-size="10" letter-spacing="1.2" fill="${p.ink}">${xml(identity.location.toUpperCase())}</text>
  </g>
  <text x="${DESKTOP.cards.x}" y="48" class="mono" font-size="10" letter-spacing="1.8" fill="${p.muted}">SELECTED SYSTEMS  /  ${String(flagships.length).padStart(2, "0")}</text>
  ${cards}
  <text x="${DESKTOP.chips.x}" y="344" class="mono" font-size="10" letter-spacing="1.8" fill="${p.muted}">MORE IN THE STACK  /  ${String(also.length).padStart(2, "0")}</text>
  ${chips}
</svg>`;
}

function mobile(p, id) {
  const cards = flagships
    .map((item, i) => {
      const y = MOBILE.cards.y + i * MOBILE.cards.step;
      const accent = i === 2 ? p.secondary : p.ink;
      return `<g class="boot" style="animation-delay:${80 + i * 70}ms">
        <path d="${cut(MOBILE.cards.x, y, MOBILE.cards.width, MOBILE.cards.height)}" fill="${p.module}" stroke="${p.trace}"/>
        <rect x="${MOBILE.cards.x}" y="${y}" width="8" height="${MOBILE.cards.height}" fill="${accent}"/>
        <text x="${MOBILE.cards.x + 28}" y="${y + 35}" class="mono" font-size="14" letter-spacing="1.8" fill="${accent}">${String(i + 1).padStart(2, "0")}  /  ${xml(item.role)}</text>
        <text x="${MOBILE.cards.x + 28}" y="${y + 80}" class="body" font-size="28" font-weight="800" fill="${p.text}">${xml(item.repo)}</text>
        <text x="${MOBILE.cards.x + 28}" y="${y + 112}" class="body" font-size="16" fill="${p.muted}">${xml(item.blurb)}</text>
      </g>`;
    })
    .join("");

  const chips = also
    .map((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = MOBILE.chips.x + col * MOBILE.chips.stepX;
      const y = MOBILE.chips.y + row * MOBILE.chips.stepY;
      return `<g class="boot">
        <path d="${cut(x, y, MOBILE.chips.width, MOBILE.chips.height)}" fill="${p.raised}" stroke="${p.trace}"/>
        <text x="${x + 20}" y="${y + 24}" class="body" font-size="16" font-weight="800" fill="${p.text}">${xml(item.repo)}</text>
        <text x="${x + 20}" y="${y + 42}" class="mono" font-size="10" letter-spacing="1" fill="${p.muted}">${xml(item.role)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(
    `${identity.name}, ${identity.headline.toLowerCase()}. ${flagships.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MOBILE.width}" height="${MOBILE.height}" viewBox="0 0 ${MOBILE.width} ${MOBILE.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p, id)}
  <rect width="${MOBILE.width}" height="${MOBILE.height}" fill="${p.bg}"/>
  <rect x="${MOBILE.board.x}" y="${MOBILE.board.y}" width="${MOBILE.board.width}" height="${MOBILE.board.height}" rx="18" fill="${p.board}" stroke="${p.trace}"/>
  <rect x="${MOBILE.board.x}" y="${MOBILE.board.y}" width="${MOBILE.board.width}" height="${MOBILE.board.height}" rx="18" fill="url(#${id}-perf)"/>
  <g class="boot">
    <path d="${cut(MOBILE.identity.x, MOBILE.identity.y, MOBILE.identity.width, MOBILE.identity.height)}" fill="${p.module}" stroke="${p.trace}"/>
    <rect x="${MOBILE.identity.x}" y="${MOBILE.identity.y}" width="9" height="${MOBILE.identity.height}" fill="${p.ink}"/>
    <text x="58" y="66" class="mono" font-size="16" letter-spacing="2.2" fill="${p.ink}">${xml(identity.name.toUpperCase())}  ·  ISTANBUL</text>
    <text x="54" y="116" class="display" font-size="38" font-weight="900" fill="${p.text}">SOFTWARE</text>
    <text x="54" y="156" class="display" font-size="38" font-weight="900" fill="${p.text}">BUILDER</text>
    <text x="58" y="190" class="body" font-size="13" fill="${p.muted}">${xml(identity.tagline)}</text>
  </g>
  <text x="${MOBILE.cards.x}" y="232" class="mono" font-size="11" letter-spacing="1.8" fill="${p.muted}">SELECTED SYSTEMS  /  ${String(flagships.length).padStart(2, "0")}</text>
  ${cards}
  <text x="${MOBILE.chips.x}" y="698" class="mono" font-size="11" letter-spacing="1.8" fill="${p.muted}">MORE IN THE STACK  /  ${String(also.length).padStart(2, "0")}</text>
  ${chips}
  <text x="${MOBILE.chips.x}" y="858" class="mono" font-size="11" letter-spacing="1.5" fill="${p.ink}">${xml(identity.stack.toUpperCase())}</text>
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
  <source media="(max-width: 700px) and (prefers-color-scheme: dark)" srcset="assets/${ASSETS.mobileDark}">
  <source media="(max-width: 700px)" srcset="assets/${ASSETS.mobileLight}">
  <source media="(prefers-color-scheme: dark)" srcset="assets/${ASSETS.desktopDark}">
  <source media="(prefers-color-scheme: light)" srcset="assets/${ASSETS.desktopLight}">
  <img alt="${identity.name} — local-first software developer building macOS apps, terminal tools, and AppSec workflows." src="assets/${ASSETS.desktopLight}" width="100%">
</picture>

${identity.intro}

## How I build

- **Local-first products** — desktop tools that keep sensitive work close to the device.
- **Operator tooling** — focused workflows for terminals, AI coding sessions, and daily maintenance.
- **Security-aware flows** — explicit approval, evidence, and safer defaults where actions have consequences.

## Selected work

${selected}

## Supporting work

${supporting}

<details>
<summary>Other public work</summary>

${mdList(other)}

</details>

<details>
<summary>Academic projects</summary>

${mdList(academic)}

</details>

## Contact

[LinkedIn](https://www.linkedin.com/in/${USER}) · [Email](mailto:batu3384@gmail.com)
`;
}

assertLayout();
mkdirSync(outDir, { recursive: true });
function assertSvg(name, svg) {
  if (!/^<svg\b[\s\S]*<\/svg>$/.test(svg)) throw new Error(`${name} is not a complete SVG`);
  if ((svg.match(/<svg\b/g) || []).length !== 1) throw new Error(`${name} has invalid SVG nesting`);
  if (/<script\b|javascript:| on[a-z]+\s*=/i.test(svg)) {
    throw new Error(`${name} contains executable SVG content`);
  }
  if (!svg.includes('role="img"') || !svg.includes("aria-label=")) {
    throw new Error(`${name} is missing accessible image metadata`);
  }
}

const files = {
  [ASSETS.desktopDark]: desktop(palettes.dark, "dark"),
  [ASSETS.desktopLight]: desktop(palettes.light, "light"),
  [ASSETS.mobileDark]: mobile(palettes.dark, "mdark"),
  [ASSETS.mobileLight]: mobile(palettes.light, "mlight"),
};
for (const [name, svg] of Object.entries(files)) {
  if (!svg.includes("SOFTWARE") || !svg.includes("ScreenTextGrab")) {
    throw new Error(`${name} missing identity or flagship`);
  }
  assertSvg(name, svg);
  writeFileSync(join(outDir, name), svg);
}
const readme = renderReadme();
for (const required of ["<picture>", "prefers-color-scheme: light", "## How I build", "## Selected work", "## Contact"]) {
  if (!readme.includes(required)) throw new Error(`README missing ${required}`);
}
writeFileSync(join(root, "README.md"), readme);
console.log("wrote 4 profile SVGs and README.md");
