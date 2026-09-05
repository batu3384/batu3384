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
  desktopDark: "hero-v8-dark.svg",
  desktopLight: "hero-v8-light.svg",
  mobileDark: "hero-v8-mobile-dark.svg",
  mobileLight: "hero-v8-mobile-light.svg",
};

const identity = {
  name: "Batuhan Yüksel",
  line: "Local-first software",
  tagline: "macOS · terminal · AppSec",
  location: "Istanbul · MIS",
  intro:
    "Selected work below — shipped tools that stay on your machine, grouped by where they run.",
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
    blurb: "Menu bar OCR for screen, code, tables, and PDFs.",
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
    blurb: "Guided scans, trust checks, SARIF evidence.",
    purpose:
      "Local-first AppSec CLI for guided scans, runtime trust checks, and HTML / SARIF / CSV evidence.",
  },
];

const secondary = [
  {
    repo: "falcon-dm",
    mark: "download",
    stack: "Rust",
    blurb: "Local macOS downloads — HTTP, HLS, YouTube.",
    purpose:
      "Local-only macOS download manager for HTTP, HLS, and YouTube. No cloud queue.",
  },
  {
    repo: "frostwall-beam",
    mark: "beam",
    stack: "Rust",
    blurb: "Encrypted transfer with receiver approval.",
    purpose:
      "Encrypted LAN and internet file transfer with pairing codes and receiver approval.",
  },
];

const shipping = [
  {
    repo: "sift",
    purpose:
      "Review-first terminal cleaner for macOS and Windows. Destructive work is previewed before it runs.",
  },
  {
    repo: "byteback",
    purpose:
      "Windows forensic imaging and data recovery with a native C++ engine and an examiner UI.",
  },
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
];

const building = [
  {
    repo: "deskward",
    purpose:
      "Tailscale-first remote desktop with a Rust core and Flutter client. Host agents still in phased rollout.",
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
    window: "#0d1117",
    chrome: "#161b22",
    panel: "#161b22",
    tile: "#161b22",
    tileHi: "#21262d",
    text: "#f0f6fc",
    muted: "#8b949e",
    border: "#30363d",
    accent: "#58a6ff",
    grid: "#21262d",
  },
  light: {
    bg: "#ffffff",
    window: "#ffffff",
    chrome: "#f6f8fa",
    panel: "#f6f8fa",
    tile: "#ffffff",
    tileHi: "#f6f8fa",
    text: "#1f2328",
    muted: "#59636e",
    border: "#d0d7de",
    accent: "#0969da",
    grid: "#eaeef2",
  },
};

const DESKTOP = {
  width: 960,
  height: 432,
  window: { x: 12, y: 12, width: 936, height: 408 },
  panel: { x: 28, y: 52, width: 248, height: 344 },
  tiles: {
    grab: { x: 292, y: 52, width: 404, height: 164 },
    calder: { x: 708, y: 52, width: 216, height: 164 },
    iron: { x: 292, y: 228, width: 312, height: 168 },
    falcon: { x: 616, y: 228, width: 152, height: 168 },
    beam: { x: 780, y: 228, width: 144, height: 168 },
  },
};

const MOBILE = {
  width: 400,
  height: 920,
  window: { x: 8, y: 8, width: 384, height: 904 },
  panel: { x: 20, y: 48, width: 360, height: 132 },
  grab: { x: 20, y: 196, width: 360, height: 148 },
  calder: { x: 20, y: 356, width: 360, height: 132 },
  iron: { x: 20, y: 500, width: 360, height: 132 },
  sec: { x: 20, y: 648, width: 176, height: 120, step: 184 },
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

function box(x, y, w, h, fill, border, rx = 12) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${border}"/>`;
}

function projects() {
  return [...flagships, ...secondary, ...shipping, ...building, ...other, ...academic];
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
  throw new Error(`unknown mark: ${mark}`);
}

function tileContent(item, x, y, w, h, p, large = false) {
  const fill = large ? p.tileHi : p.tile;
  const title = large ? 20 : 16;
  const body = large ? 14 : 12;
  const iconY = y + (large ? 24 : 18);
  return `<g class="rise">
    ${box(x, y, w, h, fill, p.border)}
    <rect x="${x}" y="${y + 12}" width="3" height="${h - 24}" rx="1.5" fill="${LANG[item.stack] || p.accent}"/>
    <g transform="translate(${x + 18} ${iconY})">${glyph(item.mark, LANG[item.stack] || p.accent)}</g>
    <text x="${x + 56}" y="${iconY + 16}" class="mono" font-size="11" fill="${p.muted}">${xml(item.stack)}</text>
    <text x="${x + 18}" y="${y + (large ? 92 : 72)}" class="body" font-size="${title}" font-weight="600" fill="${p.text}">${xml(item.repo)}</text>
    <text x="${x + 18}" y="${y + (large ? 118 : 94)}" class="body" font-size="${body}" fill="${p.muted}">${xml(item.blurb)}</text>
  </g>`;
}

function assertLayout() {
  if (!/^[a-z0-9-]+$/i.test(USER)) throw new Error(`unsafe GitHub username: ${USER}`);
  if (flagships.length !== 3) throw new Error("hero is built for 3 flagships");
  if (secondary.length !== 2) throw new Error("hero is built for 2 secondary tiles");
  if (identity.line.length > 24) throw new Error("identity line is too long for SVG");
  if (identity.tagline.length > 34) throw new Error("identity tagline is too long for SVG");
  for (const item of projects()) {
    if (!item || typeof item.repo !== "string") {
      throw new Error("every listed project must be an object with repo");
    }
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(item.repo)) {
      throw new Error(`unsafe repository name: ${item.repo}`);
    }
  }
  for (const item of [...flagships, ...secondary]) {
    if (item.blurb.length > 52) throw new Error(`blurb too long: ${item.repo}`);
  }
  const named = new Set(projects().map((item) => item.repo));
  for (const name of lanes.flatMap((lane) => lane.repos)) {
    if (!named.has(name)) throw new Error(`lane points at unknown repo: ${name}`);
  }
}

function defs(p) {
  return `<defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="${p.grid}" stroke-width="1" opacity=".35"/>
    </pattern>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.accent}" stop-opacity=".12"/>
      <stop offset="1" stop-color="${p.accent}" stop-opacity="0"/>
    </linearGradient>
    <style>
      .display,.body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif}
      .mono{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace}
      .rise{animation:rise .45s ease-out both}
      .caret{animation:blink 1.1s step-end infinite}
      .scan{animation:scan 2.4s ease-in-out infinite alternate}
      @keyframes rise{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
      @keyframes blink{50%{opacity:0}}
      @keyframes scan{from{transform:translateY(0)}to{transform:translateY(8px)}}
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
  const t = DESKTOP.tiles;
  const [grab, calder, iron, falcon, beam] = [flagships[0], flagships[1], flagships[2], secondary[0], secondary[1]];
  const alt = xml(
    `${identity.name}. Featured: ${flagships.map((item) => item.repo).join(", ")}. Also ${secondary.map((item) => item.repo).join(", ")}.`,
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${DESKTOP.width}" height="${DESKTOP.height}" viewBox="0 0 ${DESKTOP.width} ${DESKTOP.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p)}
  <rect width="${DESKTOP.width}" height="${DESKTOP.height}" fill="${p.bg}"/>
  ${box(DESKTOP.window.x, DESKTOP.window.y, DESKTOP.window.width, DESKTOP.window.height, p.window, p.border, 16)}
  ${box(DESKTOP.window.x, DESKTOP.window.y, DESKTOP.window.width, 40, p.chrome, p.border, 16)}
  <rect x="${DESKTOP.window.x}" y="38" width="${DESKTOP.window.width}" height="16" fill="${p.chrome}"/>
  <rect x="292" y="52" width="632" height="344" fill="url(#grid)" opacity=".45"/>
  ${trafficLights(36, 31)}
  <text x="86" y="35" class="mono" font-size="12" fill="${p.muted}">${USER} / portfolio</text>
  <text x="912" y="35" class="body" font-size="12" text-anchor="end" fill="${p.muted}">${xml(identity.location)}</text>
  <g class="rise">
    ${box(DESKTOP.panel.x, DESKTOP.panel.y, DESKTOP.panel.width, DESKTOP.panel.height, p.panel, p.border)}
    <rect x="${DESKTOP.panel.x}" y="${DESKTOP.panel.y}" width="${DESKTOP.panel.width}" height="72" fill="url(#sheen)"/>
    <text x="48" y="88" class="display" font-size="26" font-weight="600" fill="${p.text}">${xml(identity.name)}</text>
    <text x="48" y="118" class="body" font-size="14" fill="${p.text}">${xml(identity.line)}</text>
    <rect class="caret" x="196" y="104" width="6" height="15" rx="1" fill="${p.accent}"/>
    <text x="48" y="148" class="body" font-size="13" fill="${p.muted}">${xml(identity.tagline)}</text>
    <path d="M48 172H256" stroke="${p.border}"/>
    <text x="48" y="204" class="mono" font-size="11" fill="${p.muted}">FEATURED</text>
    <text x="48" y="232" class="body" font-size="13" fill="${p.text}">${xml(flagships.map((item) => item.repo).join(" · "))}</text>
    <text x="48" y="292" class="mono" font-size="11" fill="${p.muted}">ALSO SHIPPED</text>
    <text x="48" y="320" class="body" font-size="13" fill="${p.text}">${xml(secondary.map((item) => item.repo).join(" · "))}</text>
  </g>
  ${tileContent(grab, t.grab.x, t.grab.y, t.grab.width, t.grab.height, p, true)}
  ${tileContent(calder, t.calder.x, t.calder.y, t.calder.width, t.calder.height, p)}
  ${tileContent(iron, t.iron.x, t.iron.y, t.iron.width, t.iron.height, p)}
  ${tileContent(falcon, t.falcon.x, t.falcon.y, t.falcon.width, t.falcon.height, p)}
  ${tileContent(beam, t.beam.x, t.beam.y, t.beam.width, t.beam.height, p)}
</svg>`;
}

function mobile(p, id) {
  const [grab, calder, iron, falcon, beam] = [flagships[0], flagships[1], flagships[2], secondary[0], secondary[1]];
  const alt = xml(`${identity.name}. Featured: ${flagships.map((item) => item.repo).join(", ")}.`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MOBILE.width}" height="${MOBILE.height}" viewBox="0 0 ${MOBILE.width} ${MOBILE.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p)}
  <rect width="${MOBILE.width}" height="${MOBILE.height}" fill="${p.bg}"/>
  ${box(MOBILE.window.x, MOBILE.window.y, MOBILE.window.width, MOBILE.window.height, p.window, p.border, 16)}
  ${box(MOBILE.window.x, MOBILE.window.y, MOBILE.window.width, 40, p.chrome, p.border, 16)}
  ${trafficLights(28, 27)}
  <text x="78" y="31" class="mono" font-size="12" fill="${p.muted}">${USER}</text>
  <g class="rise">
    ${box(MOBILE.panel.x, MOBILE.panel.y, MOBILE.panel.width, MOBILE.panel.height, p.panel, p.border)}
    <text x="36" y="84" class="display" font-size="22" font-weight="600" fill="${p.text}">${xml(identity.name)}</text>
    <text x="36" y="112" class="body" font-size="13" fill="${p.text}">${xml(identity.line)}</text>
    <rect class="caret" x="168" y="98" width="5" height="14" rx="1" fill="${p.accent}"/>
    <text x="36" y="136" class="body" font-size="12" fill="${p.muted}">${xml(identity.tagline)}</text>
  </g>
  ${tileContent(grab, MOBILE.grab.x, MOBILE.grab.y, MOBILE.grab.width, MOBILE.grab.height, p, true)}
  ${tileContent(calder, MOBILE.calder.x, MOBILE.calder.y, MOBILE.calder.width, MOBILE.calder.height, p)}
  ${tileContent(iron, MOBILE.iron.x, MOBILE.iron.y, MOBILE.iron.width, MOBILE.iron.height, p)}
  ${tileContent(falcon, MOBILE.sec.x, MOBILE.sec.y, MOBILE.sec.width, MOBILE.sec.height, p)}
  ${tileContent(beam, MOBILE.sec.x + MOBILE.sec.step, MOBILE.sec.y, MOBILE.sec.width, MOBILE.sec.height, p)}
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

function pinCard(item, theme) {
  return `https://github-stats-extended.vercel.app/api/pin/?username=${USER}&repo=${item.repo}&hide_border=true&theme=${theme}`;
}

function renderReadme() {
  const skillsDark = "https://skillicons.dev/icons?i=swift%2Cgo%2Cts%2Cpython%2Crust%2Ccpp&theme=dark&perline=6";
  const skillsLight = "https://skillicons.dev/icons?i=swift%2Cgo%2Cts%2Cpython%2Crust%2Ccpp&theme=light&perline=6";
  const statsDark = `https://github-stats-extended.vercel.app/api?username=${USER}&show_icons=true&hide_border=true&theme=github_dark`;
  const statsLight = `https://github-stats-extended.vercel.app/api?username=${USER}&show_icons=true&hide_border=true&theme=github_light`;
  const langsDark = `https://github-stats-extended.vercel.app/api/top-langs/?username=${USER}&layout=compact&langs_count=6&hide_border=true&theme=github_dark`;
  const langsLight = `https://github-stats-extended.vercel.app/api/top-langs/?username=${USER}&layout=compact&langs_count=6&hide_border=true&theme=github_light`;

  const pinRows = flagships
    .map((item) => {
      const dark = pinCard(item, "github_dark");
      const light = pinCard(item, "github_light");
      return `<p align="center">
<a href="${repoUrl(item.repo)}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${dark}">
    <img src="${light}" alt="${item.repo} — ${item.stack}. ${item.purpose}" width="320">
  </picture>
</a>
</p>`;
    })
    .join("\n");

  return `<!-- Generated by scripts/render-profile.mjs. Edit that file, then run: node scripts/render-profile.mjs -->
<picture>
  <source media="(max-width: 700px) and (prefers-color-scheme: dark)" srcset="assets/${ASSETS.mobileDark}">
  <source media="(max-width: 700px)" srcset="assets/${ASSETS.mobileLight}">
  <source media="(prefers-color-scheme: dark)" srcset="assets/${ASSETS.desktopDark}">
  <source media="(prefers-color-scheme: light)" srcset="assets/${ASSETS.desktopLight}">
  <img alt="${identity.name} — ${identity.line}. Featured: ${flagships.map((item) => item.repo).join(", ")}." src="assets/${ASSETS.desktopLight}" width="100%">
</picture>

${identity.intro}

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${skillsDark}">
    <img src="${skillsLight}" alt="Swift, Go, TypeScript, Python, Rust, C++">
  </picture>
</p>

## Flagship repos

${pinRows}

## Selected work

${mdLanes()}

## Also shipping

${mdItems(shipping)}

## Now building

${mdItems(building)}

<details>
<summary>GitHub activity</summary>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${statsDark}">
    <img src="${statsLight}" alt="GitHub stats for ${USER}" height="160">
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${langsDark}">
    <img src="${langsLight}" alt="Top languages for ${USER}" height="160">
  </picture>
</p>

</details>

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
  if (!svg.includes("Batuhan") || !svg.includes("ScreenTextGrab") || !svg.includes("frostwall-beam")) {
    throw new Error(`${name} missing identity or featured work`);
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
  "## Flagship repos",
  "## Selected work",
  "### On the Mac",
  "## Now building",
  "deskward",
  "GitHub activity",
  "## Contact",
]) {
  if (!readme.includes(required)) throw new Error(`README missing ${required}`);
}
writeFileSync(join(root, "README.md"), readme);
console.log("wrote 4 profile SVGs and README.md");
