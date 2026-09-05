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
  desktopDark: "hero-v7-dark.svg",
  desktopLight: "hero-v7-light.svg",
  mobileDark: "hero-v7-mobile-dark.svg",
  mobileLight: "hero-v7-mobile-light.svg",
};

const identity = {
  name: "Batuhan Yüksel",
  line: "Building local-first tools",
  tagline: "macOS · terminal · AppSec",
  location: "Istanbul · MIS",
  intro:
    "I ship software that stays on your machine — screen capture, parallel AI workspaces, and evidence-backed AppSec. Istanbul.",
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
    mark: "ocr",
    stack: "Swift",
    blurb: "Menu bar OCR for screen, code, PDFs.",
    purpose:
      "Local-first macOS menu bar OCR for screen, code, subtitles, tables, and PDFs.",
  },
  {
    repo: "calder",
    mark: "panes",
    stack: "TypeScript",
    blurb: "Parallel Claude, Codex, Cursor, Antigravity.",
    purpose:
      "Terminal-centric Electron workspace for parallel Claude Code, Codex, Cursor, and Antigravity sessions.",
  },
  {
    repo: "ironsentinel",
    mark: "shield",
    stack: "Go",
    blurb: "Guided scans, trust checks, evidence.",
    purpose:
      "Local-first AppSec CLI for guided scans, runtime trust checks, and HTML / SARIF / CSV evidence.",
  },
];

const also = [
  {
    repo: "falcon-dm",
    mark: "download",
    stack: "Rust",
    purpose:
      "Local-only macOS download manager for HTTP, HLS, and YouTube. No cloud queue.",
  },
  {
    repo: "frostwall-beam",
    mark: "beam",
    stack: "Rust",
    purpose:
      "Encrypted LAN and internet file transfer with pairing codes and receiver approval.",
  },
  {
    repo: "sift",
    mark: "sieve",
    stack: "Go",
    purpose:
      "Review-first terminal cleaner for macOS and Windows. Destructive work is previewed before it runs.",
  },
  {
    repo: "byteback",
    mark: "disk",
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

const lanes = [
  { heading: "On the Mac", repos: ["ScreenTextGrab", "falcon-dm", "frostwall-beam"] },
  { heading: "In the terminal", repos: ["calder", "sift"] },
  { heading: "AppSec", repos: ["ironsentinel", "byteback"] },
];

const palettes = {
  dark: {
    bg: "#0d1117",
    window: "#161b22",
    chrome: "#21262d",
    card: "#21262d",
    dock: "#21262d",
    text: "#e6edf3",
    muted: "#8b949e",
    border: "#30363d",
    accent: "#58a6ff",
  },
  light: {
    bg: "#ffffff",
    window: "#ffffff",
    chrome: "#f6f8fa",
    card: "#f6f8fa",
    dock: "#f6f8fa",
    text: "#1f2328",
    muted: "#59636e",
    border: "#d0d7de",
    accent: "#0969da",
  },
};

const DESKTOP = {
  width: 960,
  height: 508,
  window: { x: 12, y: 12, width: 936, height: 484 },
  cards: { x: 28, y: 168, width: 292, height: 196, step: 304 },
  dock: { x: 28, y: 380, width: 214, height: 96, step: 224 },
};

const MOBILE = {
  width: 400,
  height: 1040,
  window: { x: 8, y: 8, width: 384, height: 1024 },
  cards: { x: 20, y: 148, width: 360, height: 186, step: 198 },
  dock: { x: 20, y: 758, width: 174, height: 118, stepX: 184, stepY: 130 },
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

function box(x, y, w, h, fill, border, rx = 10) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${border}"/>`;
}

function projects() {
  return [...flagships, ...also, ...shipping, ...other, ...academic];
}

function byRepo(name) {
  const item = projects().find((row) => row.repo === name);
  if (!item) throw new Error(`missing project: ${name}`);
  return item;
}

function glyph(mark, color) {
  const s = `fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"`;
  if (mark === "ocr") {
    return `<g>
      <rect x="1" y="4" width="26" height="18" rx="3" ${s}/>
      <path d="M7 4V1M21 4V1M7 22v3M21 22v3" ${s}/>
      <line class="scan" x1="5" y1="8" x2="23" y2="8" stroke="${color}" stroke-width="1.4"/>
    </g>`;
  }
  if (mark === "panes") {
    return `<g>
      <rect x="0" y="3" width="8" height="20" rx="1.5" ${s}/>
      <rect x="10" y="3" width="8" height="20" rx="1.5" ${s}/>
      <rect x="20" y="3" width="8" height="20" rx="1.5" ${s}/>
    </g>`;
  }
  if (mark === "shield") {
    return `<path d="M14 2.5L25 7.5v8c0 6.2-11 10-11 10s-11-3.8-11-10v-8z" ${s}/>`;
  }
  if (mark === "download") {
    return `<g>
      <path d="M14 3v14M8 12l6 7 6-7" ${s}/>
      <path d="M4 23h20" ${s}/>
    </g>`;
  }
  if (mark === "beam") {
    return `<g>
      <circle cx="6" cy="13" r="4.5" ${s}/>
      <circle cx="22" cy="13" r="4.5" ${s}/>
      <path d="M10.5 13h7" ${s}/>
    </g>`;
  }
  if (mark === "sieve") {
    return `<path d="M3 5h22l-6 11v7H9v-7z" ${s}/>`;
  }
  if (mark === "disk") {
    return `<g>
      <circle cx="14" cy="13" r="10" ${s}/>
      <circle cx="14" cy="13" r="3.2" ${s}/>
    </g>`;
  }
  throw new Error(`unknown mark: ${mark}`);
}

function assertLayout() {
  if (!/^[a-z0-9-]+$/i.test(USER)) throw new Error(`unsafe GitHub username: ${USER}`);
  if (flagships.length !== 3) throw new Error("hero is built for 3 flagships");
  if (also.length !== 4) throw new Error("dock is built for 4 supporting repos");
  if (identity.line.length > 36) throw new Error("identity line is too long for SVG");
  if (identity.tagline.length > 32) throw new Error("identity tagline is too long for SVG");
  for (const item of projects()) {
    if (!item || typeof item.repo !== "string") {
      throw new Error("every listed project must be an object with repo");
    }
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(item.repo)) {
      throw new Error(`unsafe repository name: ${item.repo}`);
    }
  }
  const named = new Set(projects().map((item) => item.repo));
  const laneRepos = lanes.flatMap((lane) => lane.repos);
  if (new Set(laneRepos).size !== laneRepos.length) throw new Error("lane repos must be unique");
  for (const name of laneRepos) {
    if (!named.has(name)) throw new Error(`lane points at unknown repo: ${name}`);
  }
  const cardRight = DESKTOP.cards.x + (flagships.length - 1) * DESKTOP.cards.step + DESKTOP.cards.width;
  if (cardRight > DESKTOP.window.x + DESKTOP.window.width) {
    throw new Error(`desktop cards overflow window: ${cardRight}`);
  }
  const dockRight = DESKTOP.dock.x + (also.length - 1) * DESKTOP.dock.step + DESKTOP.dock.width;
  if (dockRight > DESKTOP.window.x + DESKTOP.window.width) {
    throw new Error(`desktop dock overflow window: ${dockRight}`);
  }
  for (const item of flagships) {
    if (item.blurb.length > 44) throw new Error(`blurb too long: ${item.repo}`);
  }
}

function defs(p) {
  return `<defs>
    <radialGradient id="glow" cx="16%" cy="20%" r="42%">
      <stop offset="0" stop-color="${p.accent}" stop-opacity=".18"/>
      <stop offset="1" stop-color="${p.accent}" stop-opacity="0"/>
    </radialGradient>
    <style>
      .display,.body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif}
      .mono{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace}
      .rise{animation:rise .5s ease-out both}
      .caret{animation:blink 1.1s step-end infinite}
      .scan{animation:scan 2.2s ease-in-out infinite alternate}
      @keyframes rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      @keyframes blink{50%{opacity:0}}
      @keyframes scan{from{transform:translateY(0)}to{transform:translateY(10px)}}
      @media(prefers-reduced-motion:reduce){.rise,.caret,.scan{animation:none}}
    </style>
  </defs>`;
}

function trafficLights(x, y) {
  return `<g>
    <circle cx="${x}" cy="${y}" r="5" fill="#ff5f57"/>
    <circle cx="${x + 16}" cy="${y}" r="5" fill="#febc2e"/>
    <circle cx="${x + 32}" cy="${y}" r="5" fill="#28c840"/>
  </g>`;
}

function desktop(p, id) {
  const cards = flagships
    .map((item, i) => {
      const x = DESKTOP.cards.x + i * DESKTOP.cards.step;
      const y = DESKTOP.cards.y;
      return `<g class="rise" style="animation-delay:${i * 70}ms">
        ${box(x, y, DESKTOP.cards.width, DESKTOP.cards.height, p.card, p.border)}
        <rect x="${x}" y="${y + 14}" width="3" height="${DESKTOP.cards.height - 28}" rx="1.5" fill="${LANG[item.stack] || p.accent}"/>
        <g transform="translate(${x + 18} ${y + 22})">${glyph(item.mark, LANG[item.stack] || p.accent)}</g>
        <text x="${x + 56}" y="${y + 42}" class="mono" font-size="12" fill="${p.muted}">${xml(item.stack)}</text>
        <text x="${x + 18}" y="${y + 88}" class="body" font-size="18" font-weight="600" fill="${p.accent}">${xml(item.repo)}</text>
        <text x="${x + 18}" y="${y + 116}" class="body" font-size="13" fill="${p.muted}">${xml(item.blurb)}</text>
      </g>`;
    })
    .join("");

  const dock = also
    .map((item, i) => {
      const x = DESKTOP.dock.x + i * DESKTOP.dock.step;
      const y = DESKTOP.dock.y;
      return `<g class="rise" style="animation-delay:${220 + i * 50}ms">
        ${box(x, y, DESKTOP.dock.width, DESKTOP.dock.height, p.dock, p.border, 12)}
        <g transform="translate(${x + 16} ${y + 34}) scale(.85)">${glyph(item.mark, LANG[item.stack] || p.accent)}</g>
        <text x="${x + 50}" y="${y + 42}" class="mono" font-size="11" fill="${p.muted}">${xml(item.stack)}</text>
        <text x="${x + 50}" y="${y + 64}" class="body" font-size="13" font-weight="600" fill="${p.text}">${xml(item.repo)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(
    `${identity.name}, local-first developer. ${flagships.map((item) => item.repo).join(", ")}. Also ${also.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${DESKTOP.width}" height="${DESKTOP.height}" viewBox="0 0 ${DESKTOP.width} ${DESKTOP.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p)}
  <rect width="${DESKTOP.width}" height="${DESKTOP.height}" fill="${p.bg}"/>
  ${box(DESKTOP.window.x, DESKTOP.window.y, DESKTOP.window.width, DESKTOP.window.height, p.window, p.border, 14)}
  ${box(DESKTOP.window.x, DESKTOP.window.y, DESKTOP.window.width, 38, p.chrome, p.border, 14)}
  <rect x="${DESKTOP.window.x}" y="36" width="${DESKTOP.window.width}" height="14" fill="${p.chrome}"/>
  <ellipse cx="210" cy="118" rx="260" ry="88" fill="url(#glow)"/>
  ${trafficLights(36, 31)}
  <text x="86" y="35" class="mono" font-size="12" fill="${p.muted}">${USER}</text>
  <text x="928" y="35" class="body" font-size="12" text-anchor="end" fill="${p.muted}">${xml(identity.location)}</text>
  <text x="36" y="92" class="display" font-size="28" font-weight="600" fill="${p.text}">${xml(identity.name)}</text>
  <text x="36" y="124" class="body" font-size="15" fill="${p.text}">${xml(identity.line)}</text>
  <rect class="caret" x="206" y="110" width="7" height="16" rx="1" fill="${p.accent}"/>
  <text x="36" y="148" class="body" font-size="13" fill="${p.muted}">${xml(identity.tagline)}</text>
  ${cards}
  ${dock}
</svg>`;
}

function mobile(p, id) {
  const cards = flagships
    .map((item, i) => {
      const y = MOBILE.cards.y + i * MOBILE.cards.step;
      const x = MOBILE.cards.x;
      return `<g class="rise">
        ${box(x, y, MOBILE.cards.width, MOBILE.cards.height, p.card, p.border)}
        <rect x="${x}" y="${y + 14}" width="3" height="${MOBILE.cards.height - 28}" rx="1.5" fill="${LANG[item.stack] || p.accent}"/>
        <g transform="translate(${x + 18} ${y + 22})">${glyph(item.mark, LANG[item.stack] || p.accent)}</g>
        <text x="${x + 56}" y="${y + 42}" class="mono" font-size="13" fill="${p.muted}">${xml(item.stack)}</text>
        <text x="${x + 18}" y="${y + 92}" class="body" font-size="22" font-weight="600" fill="${p.accent}">${xml(item.repo)}</text>
        <text x="${x + 18}" y="${y + 128}" class="body" font-size="15" fill="${p.muted}">${xml(item.blurb)}</text>
      </g>`;
    })
    .join("");

  const dock = also
    .map((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = MOBILE.dock.x + col * MOBILE.dock.stepX;
      const y = MOBILE.dock.y + row * MOBILE.dock.stepY;
      return `<g class="rise">
        ${box(x, y, MOBILE.dock.width, MOBILE.dock.height, p.dock, p.border, 12)}
        <g transform="translate(${x + 16} ${y + 22}) scale(.85)">${glyph(item.mark, LANG[item.stack] || p.accent)}</g>
        <text x="${x + 16}" y="${y + 78}" class="mono" font-size="11" fill="${p.muted}">${xml(item.stack)}</text>
        <text x="${x + 16}" y="${y + 100}" class="body" font-size="14" font-weight="600" fill="${p.text}">${xml(item.repo)}</text>
      </g>`;
    })
    .join("");

  const alt = xml(
    `${identity.name}, local-first developer. ${flagships.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MOBILE.width}" height="${MOBILE.height}" viewBox="0 0 ${MOBILE.width} ${MOBILE.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p)}
  <rect width="${MOBILE.width}" height="${MOBILE.height}" fill="${p.bg}"/>
  ${box(MOBILE.window.x, MOBILE.window.y, MOBILE.window.width, MOBILE.window.height, p.window, p.border, 14)}
  ${box(MOBILE.window.x, MOBILE.window.y, MOBILE.window.width, 38, p.chrome, p.border, 14)}
  <rect x="${MOBILE.window.x}" y="32" width="${MOBILE.window.width}" height="14" fill="${p.chrome}"/>
  <ellipse cx="120" cy="100" rx="160" ry="70" fill="url(#glow)"/>
  ${trafficLights(28, 27)}
  <text x="78" y="31" class="mono" font-size="12" fill="${p.muted}">${USER}</text>
  <text x="24" y="78" class="display" font-size="22" font-weight="600" fill="${p.text}">${xml(identity.name)}</text>
  <text x="24" y="106" class="body" font-size="14" fill="${p.text}">${xml(identity.line)}</text>
  <rect class="caret" x="185" y="92" width="6" height="15" rx="1" fill="${p.accent}"/>
  <text x="24" y="130" class="body" font-size="13" fill="${p.muted}">${xml(identity.tagline)}</text>
  ${cards}
  ${dock}
</svg>`;
}

function mdItems(rows) {
  return rows
    .map((item) => `- **[${item.repo}](${repoUrl(item.repo)})** — ${item.purpose}`)
    .join("\n");
}

function mdLanes() {
  return lanes
    .map((lane) => `### ${lane.heading}\n\n${mdItems(lane.repos.map(byRepo))}`)
    .join("\n\n");
}

function widget(theme) {
  const stats = `https://github-stats-extended.vercel.app/api?username=${USER}&show_icons=true&hide_border=true&theme=${theme}`;
  const langs = `https://github-stats-extended.vercel.app/api/top-langs/?username=${USER}&layout=compact&langs_count=6&hide_border=true&theme=${theme}`;
  return { stats, langs };
}

function renderReadme() {
  const dark = widget("github_dark");
  const light = widget("github_light");
  const skillsDark = "https://skillicons.dev/icons?i=swift,go,ts,python,rust,cpp&theme=dark";
  const skillsLight = "https://skillicons.dev/icons?i=swift,go,ts,python,rust,cpp&theme=light";

  return `<!-- Generated by scripts/render-profile.mjs. Edit that file, then run: node scripts/render-profile.mjs -->
<picture>
  <source media="(max-width: 700px) and (prefers-color-scheme: dark)" srcset="assets/${ASSETS.mobileDark}">
  <source media="(max-width: 700px)" srcset="assets/${ASSETS.mobileLight}">
  <source media="(prefers-color-scheme: dark)" srcset="assets/${ASSETS.desktopDark}">
  <source media="(prefers-color-scheme: light)" srcset="assets/${ASSETS.desktopLight}">
  <img alt="${identity.name} — local-first developer. Selected work: ${flagships.map((item) => item.repo).join(", ")}." src="assets/${ASSETS.desktopLight}" width="100%">
</picture>

${identity.intro}

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${skillsDark}">
    <img src="${skillsLight}" alt="Swift, Go, TypeScript, Python, Rust, C++">
  </picture>
</p>

## Selected work

${mdLanes()}

## Also shipping

${mdItems(shipping)}

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${dark.stats}">
    <img src="${light.stats}" alt="GitHub stats for ${USER}" height="160">
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${dark.langs}">
    <img src="${light.langs}" alt="Top languages for ${USER}" height="160">
  </picture>
</p>

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
};

for (const [name, svg] of Object.entries(files)) {
  if (!svg.includes("Batuhan") || !svg.includes("ScreenTextGrab") || !svg.includes("sift")) {
    throw new Error(`${name} missing identity or work`);
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
  "### On the Mac",
  "### In the terminal",
  "### AppSec",
  "skillicons.dev",
  "github-stats-extended.vercel.app",
  "## Also shipping",
  "byteback",
  "duetto",
  "## Contact",
]) {
  if (!readme.includes(required)) throw new Error(`README missing ${required}`);
}
if (readme.includes("## How I build")) throw new Error("README still has unused philosophy block");
if (readme.includes("## Tools")) throw new Error("README still has flat tools dump");
writeFileSync(join(root, "README.md"), readme);
console.log("wrote 4 profile SVGs and README.md");
