#!/usr/bin/env node
// Source of truth for github.com/batu3384 — SVGs + README.md
// Run: node scripts/render-profile.mjs

import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets");
const USER = "batu3384";
const SNAKE = {
  light: `https://raw.githubusercontent.com/${USER}/${USER}/output/github-snake.svg`,
  dark: `https://raw.githubusercontent.com/${USER}/${USER}/output/github-snake-dark.svg`,
};
const ASSETS = {
  desktopDark: "hero-v9-dark.svg",
  desktopLight: "hero-v9-light.svg",
  mobileDark: "hero-v9-mobile-dark.svg",
  mobileLight: "hero-v9-mobile-light.svg",
};

const identity = {
  name: "Batuhan Yüksel",
  role: "Software developer",
  focus: "macOS applications · CLI tools · application security",
  location: "Istanbul · MIS",
  stack: "Swift · Go · TypeScript · Rust · Python · C++",
  intro:
    "MIS graduate based in Istanbul. I design and ship local-first software: macOS utilities, terminal tools, and security workflows with evidence-backed outputs.",
};

const catalog = [
  {
    repo: "ScreenTextGrab",
    stack: "Swift",
    lane: "macOS",
    heroLine: "Menu bar OCR with on-device Vision — screen, PDFs, code, tables.",
    summary:
      "Local-first menu bar OCR with Apple Vision — screen regions, PDFs, code, tables, and subtitles stay on device.",
  },
  {
    repo: "falcon-dm",
    stack: "Rust",
    lane: "macOS",
    heroLine: "macOS download manager — HTTP, HLS, YouTube, local queue.",
    summary:
      "macOS download manager with multi-thread HTTP, HLS, YouTube, and browser capture — Tauri/Rust, no cloud queue.",
  },
  {
    repo: "frostwall-beam",
    stack: "Rust",
    lane: "macOS",
    heroLine: "Encrypted LAN or internet transfers — pairing codes and approval.",
    summary:
      "Cross-platform encrypted file transfer on LAN or the internet — pairing codes, receiver approval, no cloud account.",
  },
  {
    repo: "calder",
    stack: "TypeScript",
    lane: "Terminal",
    heroLine: "Parallel AI coding CLIs — Claude Code, Codex, Cursor, Antigravity.",
    summary:
      "Electron workspace for parallel Claude Code, Codex, Cursor, and Antigravity CLI sessions with telemetry and governance in one shell.",
  },
  {
    repo: "sift",
    stack: "Go",
    lane: "Terminal",
    summary:
      "Review-first terminal cleaner for macOS and Windows — typed Go core, preview step before destructive work.",
  },
  {
    repo: "ironsentinel",
    stack: "Go",
    lane: "AppSec",
    heroLine: "AppSec CLI — guided scans, trust checks, SARIF / HTML reports.",
    summary:
      "Local-first AppSec CLI and TUI for guided scans, runtime trust checks, and HTML / SARIF / CSV evidence exports.",
  },
  {
    repo: "byteback",
    stack: "C++",
    lane: "AppSec",
    summary:
      "Windows forensic imaging and file recovery with a native engine and an examiner-facing UI.",
  },
  {
    repo: "agent-atlas",
    stack: "Python",
    lane: "Tooling",
    summary: "Installer and router that gives AI agents controlled open-web search and research tools.",
  },
  {
    repo: "codebase-audit",
    stack: "Python",
    lane: "Tooling",
    summary:
      "Whole-repo architecture audit skill for Cursor, Claude Code, Codex, and Antigravity with cited evidence.",
  },
  {
    repo: "deskward",
    stack: "Rust",
    lane: "In progress",
    summary:
      "Tailscale-first remote desktop platform with a Rust core and Flutter client; host agents in phased rollout.",
  },
  {
    repo: "duetto",
    stack: "TypeScript",
    lane: "In progress",
    summary:
      "Chrome extension for Udemy with dual captions, translation, notes, and precision playback controls.",
  },
];

const other = [
  {
    repo: "hexloom",
    summary: "FastAPI studio for encoding, decoding, and validating structured payloads.",
  },
  {
    repo: "jobcraft",
    summary: "Local-first job-search workspace for Turkey with Cursor and Claude Code.",
  },
];

const academic = [
  {
    repo: "vetvision",
    summary:
      "Desktop assistant for dog breed recognition, PDF export, and optional Gemini-backed reports.",
  },
  {
    repo: "fast-express-kds",
    summary: "Cargo operations dashboard with branch analytics, personnel scoring, and forecasting.",
  },
  {
    repo: "sisler-bulvari-cafe-system",
    summary: "Digital ordering prototype for Sisler Bulvarı Sanat Kafe.",
  },
  {
    repo: "autonomous-line-following-robot",
    summary: "Raspberry Pi line-following robot with obstacle stop, LEDs, and buzzer alerts.",
  },
];

const heroRepos = ["ScreenTextGrab", "calder", "ironsentinel", "falcon-dm", "frostwall-beam"];

const lanes = [
  { heading: "macOS", key: "macOS" },
  { heading: "Terminal & CLI", key: "Terminal" },
  { heading: "Application security", key: "AppSec" },
  { heading: "Developer tooling", key: "Tooling" },
  { heading: "In progress", key: "In progress" },
];

const palettes = {
  dark: {
    bg: "#0d1117",
    panel: "#161b22",
    row: "#0d1117",
    text: "#f0f6fc",
    muted: "#8b949e",
    border: "#30363d",
    accent: "#58a6ff",
  },
  light: {
    bg: "#ffffff",
    panel: "#f6f8fa",
    row: "#ffffff",
    text: "#1f2328",
    muted: "#59636e",
    border: "#d0d7de",
    accent: "#0969da",
  },
};

const DESKTOP = {
  width: 960,
  height: 388,
  pad: 24,
  rowH: 48,
};

const MOBILE = {
  width: 400,
  height: 640,
  pad: 18,
  rowH: 74,
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

function byRepo(name) {
  const item = catalog.find((row) => row.repo === name);
  if (!item) throw new Error(`missing project: ${name}`);
  return item;
}

function heroText(item) {
  return item.heroLine ?? item.summary;
}

function box(x, y, w, h, fill, border, rx = 10) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${border}"/>`;
}

function assertLayout() {
  if (!/^[a-z0-9-]+$/i.test(USER)) throw new Error(`unsafe GitHub username: ${USER}`);
  for (const item of [...catalog, ...other, ...academic]) {
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(item.repo)) {
      throw new Error(`unsafe repository name: ${item.repo}`);
    }
  }
  for (const name of heroRepos) byRepo(name);
  for (const lane of lanes) {
    const rows = catalog.filter((item) => item.lane === lane.key);
    if (rows.length === 0) throw new Error(`lane has no projects: ${lane.key}`);
  }
  for (const item of heroRepos.map(byRepo)) {
    if (!item.heroLine) throw new Error(`hero repo missing heroLine: ${item.repo}`);
    if (item.heroLine.length > 78) throw new Error(`heroLine too long: ${item.repo}`);
  }
}

function defs() {
  return `<style>
    .display,.body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif}
    .mono{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace}
  </style>`;
}

function heroRow(item, x, y, w, p) {
  return `<g>
    ${box(x, y, w, DESKTOP.rowH - 8, p.row, p.border, 8)}
    <text x="${x + 16}" y="${y + 22}" class="body" font-size="15" font-weight="600" fill="${p.accent}">${xml(item.repo)}</text>
    <text x="${x + w - 16}" y="${y + 22}" class="mono" font-size="11" text-anchor="end" fill="${p.muted}">${xml(item.stack)}</text>
    <text x="${x + 16}" y="${y + 42}" class="body" font-size="12" fill="${p.muted}">${xml(heroText(item))}</text>
  </g>`;
}

function desktop(p, id) {
  const x = DESKTOP.pad;
  const w = DESKTOP.width - DESKTOP.pad * 2;
  const headerH = 100;
  const rows = heroRepos.map(byRepo);
  const alt = xml(
    `${identity.name}, ${identity.role}. ${rows.map((item) => item.repo).join(", ")}.`,
  );

  const rowBlocks = rows
    .map((item, i) => heroRow(item, x, headerH + 16 + i * DESKTOP.rowH, w, p))
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${DESKTOP.width}" height="${DESKTOP.height}" viewBox="0 0 ${DESKTOP.width} ${DESKTOP.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs()}
  <rect width="${DESKTOP.width}" height="${DESKTOP.height}" fill="${p.bg}"/>
  ${box(x, DESKTOP.pad, w, headerH, p.panel, p.border)}
  <text x="${x + 20}" y="${DESKTOP.pad + 36}" class="display" font-size="28" font-weight="600" fill="${p.text}">${xml(identity.name)}</text>
  <text x="${x + 20}" y="${DESKTOP.pad + 62}" class="body" font-size="14" fill="${p.text}">${xml(identity.role)} · ${xml(identity.focus)}</text>
  <text x="${x + w - 20}" y="${DESKTOP.pad + 36}" class="mono" font-size="12" text-anchor="end" fill="${p.muted}">${xml(identity.location)}</text>
  <text x="${x + w - 20}" y="${DESKTOP.pad + 62}" class="mono" font-size="11" text-anchor="end" fill="${p.muted}">${xml(identity.stack)}</text>
  ${rowBlocks}
</svg>`;
}

function mobile(p, id) {
  const x = MOBILE.pad;
  const w = MOBILE.width - MOBILE.pad * 2;
  const headerH = 118;
  const rows = heroRepos.map(byRepo);
  const alt = xml(`${identity.name}. ${rows.map((item) => item.repo).join(", ")}.`);

  const rowBlocks = rows
    .map((item, i) => {
      const y = headerH + 10 + i * MOBILE.rowH;
      return `<g>
        ${box(x, y, w, MOBILE.rowH - 10, p.row, p.border, 8)}
        <text x="${x + 14}" y="${y + 28}" class="body" font-size="16" font-weight="600" fill="${p.accent}">${xml(item.repo)}</text>
        <text x="${x + 14}" y="${y + 50}" class="mono" font-size="11" fill="${p.muted}">${xml(item.stack)}</text>
        <text x="${x + 14}" y="${y + 68}" class="body" font-size="12" fill="${p.muted}">${xml(heroText(item))}</text>
      </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MOBILE.width}" height="${MOBILE.height}" viewBox="0 0 ${MOBILE.width} ${MOBILE.height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs()}
  <rect width="${MOBILE.width}" height="${MOBILE.height}" fill="${p.bg}"/>
  ${box(x, MOBILE.pad, w, headerH, p.panel, p.border)}
  <text x="${x + 14}" y="${MOBILE.pad + 34}" class="display" font-size="22" font-weight="600" fill="${p.text}">${xml(identity.name)}</text>
  <text x="${x + 14}" y="${MOBILE.pad + 58}" class="body" font-size="13" fill="${p.text}">${xml(identity.role)}</text>
  <text x="${x + 14}" y="${MOBILE.pad + 80}" class="body" font-size="12" fill="${p.muted}">${xml(identity.focus)}</text>
  <text x="${x + 14}" y="${MOBILE.pad + 102}" class="mono" font-size="11" fill="${p.muted}">${xml(identity.location)}</text>
  ${rowBlocks}
</svg>`;
}

function mdLane(lane) {
  const rows = catalog.filter((item) => item.lane === lane.key);
  return `### ${lane.heading}\n\n${rows
    .map(
      (item) =>
        `**[${item.repo}](${repoUrl(item.repo)})** · ${item.stack}  \n${item.summary}`,
    )
    .join("\n\n")}`;
}

function mdSimple(rows) {
  return rows
    .map((item) => `- **[${item.repo}](${repoUrl(item.repo)})** — ${item.summary}`)
    .join("\n");
}

function renderReadme() {
  const statsDark = `https://github-stats-extended.vercel.app/api?username=${USER}&show_icons=true&hide_border=true&theme=github_dark`;
  const statsLight = `https://github-stats-extended.vercel.app/api?username=${USER}&show_icons=true&hide_border=true&theme=github_light`;
  const langsDark = `https://github-stats-extended.vercel.app/api/top-langs/?username=${USER}&layout=compact&langs_count=6&hide_border=true&theme=github_dark`;
  const langsLight = `https://github-stats-extended.vercel.app/api/top-langs/?username=${USER}&layout=compact&langs_count=6&hide_border=true&theme=github_light`;

  return `<!-- Generated by scripts/render-profile.mjs. Edit that file, then run: node scripts/render-profile.mjs -->
<picture>
  <source media="(max-width: 700px) and (prefers-color-scheme: dark)" srcset="assets/${ASSETS.mobileDark}">
  <source media="(max-width: 700px)" srcset="assets/${ASSETS.mobileLight}">
  <source media="(prefers-color-scheme: dark)" srcset="assets/${ASSETS.desktopDark}">
  <source media="(prefers-color-scheme: light)" srcset="assets/${ASSETS.desktopLight}">
  <img alt="${identity.name} — ${identity.role}. Selected repositories: ${heroRepos.join(", ")}." src="assets/${ASSETS.desktopLight}" width="100%">
</picture>

${identity.intro}

## Selected work

${lanes.map(mdLane).join("\n\n")}

<details>
<summary>Other public repositories</summary>

${mdSimple(other)}

</details>

<details>
<summary>Academic work</summary>

${mdSimple(academic)}

</details>

<details>
<summary>Activity</summary>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${SNAKE.dark}">
    <source media="(prefers-color-scheme: light)" srcset="${SNAKE.light}">
    <img alt="GitHub contribution activity" src="${SNAKE.light}" width="100%">
  </picture>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${statsDark}">
    <img src="${statsLight}" alt="GitHub profile statistics" height="160">
  </picture>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${langsDark}">
    <img src="${langsLight}" alt="Repository language breakdown" height="160">
  </picture>
</p>

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
  if (!svg.includes("Batuhan") || !svg.includes("ScreenTextGrab") || !svg.includes("calder")) {
    throw new Error(`${name} missing identity or selected work`);
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
  "## Selected work",
  "### macOS",
  "### Terminal & CLI",
  "### Application security",
  "### Developer tooling",
  "### In progress",
  "deskward",
  "<details>",
  "## Contact",
]) {
  if (!readme.includes(required)) throw new Error(`README missing ${required}`);
}
if (readme.includes("Calder workspace")) throw new Error("README still has Calder screenshot block");
if (readme.includes("skillicons.dev")) throw new Error("README still has skill icon widget");
if (readme.includes("Flagship repos")) throw new Error("README still has pin card section");
writeFileSync(join(root, "README.md"), readme);
console.log("wrote 4 profile SVGs and README.md");
