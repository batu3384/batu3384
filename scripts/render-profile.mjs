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
  desktopDark: "hero-v10-dark.svg",
  desktopLight: "hero-v10-light.svg",
  mobileDark: "hero-v10-mobile-dark.svg",
  mobileLight: "hero-v10-mobile-light.svg",
  workDark: "work-v10-dark.svg",
  workLight: "work-v10-light.svg",
  workMobileDark: "work-v10-mobile-dark.svg",
  workMobileLight: "work-v10-mobile-light.svg",
};

const identity = {
  name: "Batuhan Yüksel",
  first: "Batuhan",
  last: "Yüksel",
  role: "Software developer",
  focus: "macOS applications · CLI tools · application security",
  location: "Istanbul · MIS",
  stack: ["Swift", "Go", "TypeScript", "Rust", "Python", "C++"],
  intro:
    "MIS graduate in Istanbul. I design and ship local-first software: macOS utilities, terminal tools, and security workflows with evidence you can inspect.",
};

const catalog = [
  {
    repo: "ScreenTextGrab",
    stack: "Swift",
    lane: "macOS",
    line: "On-device OCR for screen, PDFs, code, and tables.",
    summary:
      "Local-first menu bar OCR with Apple Vision — screen regions, PDFs, code, tables, and subtitles stay on device.",
  },
  {
    repo: "falcon-dm",
    stack: "Rust",
    lane: "macOS",
    line: "HTTP, HLS, and YouTube — native macOS, local queue.",
    summary:
      "macOS download manager with multi-thread HTTP, HLS, YouTube, and browser capture — Tauri/Rust, no cloud queue.",
  },
  {
    repo: "frostwall-beam",
    stack: "Rust",
    lane: "macOS",
    line: "Encrypted transfer with pairing and receiver approval.",
    summary:
      "Cross-platform encrypted file transfer on LAN or the internet — pairing codes, receiver approval, no cloud account.",
  },
  {
    repo: "calder",
    stack: "TypeScript",
    lane: "Terminal",
    line: "Parallel Claude Code, Codex, Cursor, and Antigravity.",
    summary:
      "Electron workspace for parallel Claude Code, Codex, Cursor, and Antigravity CLI sessions with telemetry and governance in one shell.",
  },
  {
    repo: "sift",
    stack: "Go",
    lane: "Terminal",
    line: "Review-first cleaner — preview before anything destructive.",
    summary:
      "Review-first terminal cleaner for macOS and Windows — typed Go core, preview step before destructive work.",
  },
  {
    repo: "ironsentinel",
    stack: "Go",
    lane: "AppSec",
    line: "Guided scans, runtime trust checks, evidence reports.",
    summary:
      "Local-first AppSec CLI and TUI for guided scans, runtime trust checks, and HTML / SARIF / CSV evidence exports.",
  },
  {
    repo: "byteback",
    stack: "C++",
    lane: "AppSec",
    line: "Windows forensic imaging and recovery, native engine.",
    summary:
      "Windows forensic imaging and file recovery with a native engine and an examiner-facing UI.",
  },
  {
    repo: "agent-atlas",
    stack: "Python",
    lane: "Tooling",
    line: "Installer and router for agent-safe open-web research.",
    summary: "Installer and router that gives AI agents controlled open-web search and research tools.",
  },
  {
    repo: "codebase-audit",
    stack: "Python",
    lane: "Tooling",
    line: "Whole-repo architecture audit with cited evidence.",
    summary:
      "Whole-repo architecture audit skill for Cursor, Claude Code, Codex, and Antigravity with cited evidence.",
  },
  {
    repo: "deskward",
    stack: "Rust",
    lane: "In progress",
    line: "Tailscale remote desktop — Rust core, Flutter client.",
    summary:
      "Tailscale-first remote desktop platform with a Rust core and Flutter client; host agents in phased rollout.",
  },
  {
    repo: "duetto",
    stack: "TypeScript",
    lane: "In progress",
    line: "Udemy: dual captions, notes, precision playback.",
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
  { heading: "macOS", key: "macOS", label: "MACOS" },
  { heading: "Terminal & CLI", key: "Terminal", label: "TERMINAL" },
  { heading: "Application security", key: "AppSec", label: "APPSEC" },
  { heading: "Developer tooling", key: "Tooling", label: "TOOLING" },
  { heading: "In progress", key: "In progress", label: "IN PROGRESS" },
];

const laneAccent = {
  macOS: { dark: "#7eb8c9", light: "#2f6f82" },
  Terminal: { dark: "#e0b15c", light: "#8a5a12" },
  AppSec: { dark: "#b7c2d0", light: "#445064" },
  Tooling: { dark: "#9bb384", light: "#4c6238" },
  "In progress": { dark: "#c4a3d4", light: "#6a4c7c" },
};

const palettes = {
  dark: {
    mode: "dark",
    bg: "#12100e",
    surface: "#1c1915",
    ink: "#f6efe2",
    muted: "#b3a794",
    faint: "#3a342c",
    rule: "#2e2922",
    copper: "#d4a05a",
    field: "#c48432",
    onField: "#1a140c",
    fieldMuted: "#3d2a12",
  },
  light: {
    mode: "light",
    bg: "#f4efe4",
    surface: "#fffaf1",
    ink: "#1a1612",
    muted: "#6d6458",
    faint: "#d5cbb8",
    rule: "#e2d8c6",
    copper: "#9a5a14",
    field: "#c48432",
    onField: "#1a140c",
    fieldMuted: "#5c3a10",
  },
};

const HERO = { width: 960, height: 360 };
const HERO_M = { width: 400, height: 560 };
const WORK = { width: 960 };
const WORK_M = { width: 400 };

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

function pad2(n) {
  return String(n).padStart(2, "0");
}

function wrapLines(text, maxChars, maxLines = 2) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const word of words) {
    if (word.length > maxChars) throw new Error(`word too long for wrap: ${word}`);
    const next = cur ? `${cur} ${word}` : word;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length <= maxLines) return lines;
  const clipped = lines.slice(0, maxLines);
  const last = clipped[maxLines - 1];
  clipped[maxLines - 1] = `${last.slice(0, Math.max(1, last.length - 1))}…`;
  return clipped;
}

function defs(p, gid, w, h) {
  return `<defs>
    <clipPath id="frame"><rect width="${w}" height="${h}" rx="22"/></clipPath>
    <pattern id="${gid}" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.65" fill="${p.copper}" fill-opacity="0.16"/>
    </pattern>
  </defs>
  <style>
    .display{font-family:Georgia,"Times New Roman",Times,serif}
    .sans{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
  </style>`;
}

function accent(lane, mode) {
  return laneAccent[lane][mode];
}

function stackPills(p, x, y) {
  const widths = { Swift: 58, Go: 40, TypeScript: 92, Rust: 52, Python: 70, "C++": 46 };
  let cursor = x;
  return identity.stack
    .map((lang) => {
      const w = widths[lang];
      const node = `<rect x="${cursor}" y="${y - 13}" width="${w}" height="22" rx="11" fill="${p.surface}"/>
    <text x="${cursor + w / 2}" y="${y + 3}" class="mono" font-size="11" text-anchor="middle" fill="${p.muted}">${xml(lang)}</text>`;
      cursor += w + 8;
      return node;
    })
    .join("\n    ");
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
  for (const item of catalog) {
    if (item.line.length > 64) throw new Error(`board line too long: ${item.repo}`);
  }
}

function heroDesktop(p, id) {
  const { width: w, height: h } = HERO;
  const split = 332;
  const featured = heroRepos.map(byRepo);
  const alt = xml(`${identity.name}, ${identity.role}. ${featured.map((item) => item.repo).join(", ")}.`);
  const rows = featured
    .map((item, i) => {
      const y = 96 + i * 42;
      return `<text x="${split + 36}" y="${y}" class="mono" font-size="11" fill="${p.copper}">${pad2(i + 1)}</text>
    <text x="${split + 64}" y="${y}" class="sans" font-size="15" font-weight="600" fill="${p.ink}">${xml(item.repo)}</text>
    <text x="${split + 64}" y="${y + 18}" class="sans" font-size="12" fill="${p.muted}">${xml(item.line)}</text>`;
    })
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p, "g", w, h)}
  <g clip-path="url(#frame)">
    <rect width="${w}" height="${h}" fill="${p.bg}"/>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <rect width="${split}" height="${h}" fill="${p.field}"/>
    <circle cx="${split}" cy="210" r="150" fill="${p.onField}" fill-opacity="0.08"/>
    <text x="36" y="48" class="mono" font-size="11" letter-spacing="2.8" fill="${p.fieldMuted}">SOFTWARE</text>
    <text x="36" y="142" class="display" font-size="44" fill="${p.onField}">${xml(identity.first)}</text>
    <text x="36" y="194" class="display" font-size="44" fill="${p.onField}">${xml(identity.last)}</text>
    <text x="36" y="236" class="sans" font-size="15" fill="${p.onField}">${xml(identity.role)}</text>
    <text x="36" y="328" class="mono" font-size="12" fill="${p.fieldMuted}">${xml(identity.location)}</text>
    <text x="${split + 36}" y="44" class="sans" font-size="13" fill="${p.ink}">${xml(identity.focus)}</text>
    <line x1="${split + 36}" y1="64" x2="${w - 28}" y2="64" stroke="${p.rule}" stroke-width="1"/>
    ${rows}
    <line x1="${split + 36}" y1="314" x2="${w - 28}" y2="314" stroke="${p.rule}" stroke-width="1"/>
    ${stackPills(p, split + 36, 332)}
  </g>
</svg>`;
}

function heroMobile(p, id) {
  const { width: w, height: h } = HERO_M;
  const band = 168;
  const featured = heroRepos.map(byRepo);
  const alt = xml(`${identity.name}. ${featured.map((item) => item.repo).join(", ")}.`);
  const rows = featured
    .map((item, i) => {
      const y = 214 + i * 58;
      const lines = wrapLines(item.line, 38, 2);
      const body = lines
        .map(
          (ln, li) =>
            `<text x="28" y="${y + 22 + li * 16}" class="sans" font-size="12" fill="${p.muted}">${xml(ln)}</text>`,
        )
        .join("\n    ");
      return `<text x="28" y="${y}" class="mono" font-size="11" fill="${p.copper}">${pad2(i + 1)}</text>
    <text x="56" y="${y}" class="sans" font-size="15" font-weight="600" fill="${p.ink}">${xml(item.repo)}</text>
    <text x="372" y="${y}" class="mono" font-size="11" text-anchor="end" fill="${p.muted}">${xml(item.stack)}</text>
    ${body}`;
    })
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p, "g", w, h)}
  <g clip-path="url(#frame)">
    <rect width="${w}" height="${h}" fill="${p.bg}"/>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <rect width="${w}" height="${band}" fill="${p.field}"/>
    <text x="24" y="36" class="mono" font-size="10" letter-spacing="2.2" fill="${p.fieldMuted}">SOFTWARE</text>
    <text x="24" y="86" class="display" font-size="32" fill="${p.onField}">${xml(identity.first)}</text>
    <text x="24" y="124" class="display" font-size="32" fill="${p.onField}">${xml(identity.last)}</text>
    <text x="24" y="152" class="sans" font-size="13" fill="${p.onField}">${xml(identity.role)} · ${xml(identity.location)}</text>
    ${rows}
    <text x="28" y="536" class="mono" font-size="11" fill="${p.muted}">${xml(identity.stack.join(" · "))}</text>
  </g>
</svg>`;
}

function tile(item, index, x, y, w, h, p, maxChars) {
  const color = accent(item.lane, p.mode);
  const clip = `t${index}`;
  const lines = wrapLines(item.line, maxChars, 2);
  const body = lines
    .map(
      (ln, i) =>
        `<text x="${x + 16}" y="${y + 70 + i * 16}" class="sans" font-size="12" fill="${p.muted}">${xml(ln)}</text>`,
    )
    .join("\n    ");
  return `<g>
    <clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/></clipPath>
    <g clip-path="url(#${clip})">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${p.surface}"/>
      <rect x="${x}" y="${y}" width="${w}" height="5" fill="${color}"/>
    </g>
    <text x="${x + 16}" y="${y + 32}" class="mono" font-size="11" fill="${color}">${pad2(index)}</text>
    <text x="${x + w - 16}" y="${y + 32}" class="mono" font-size="11" text-anchor="end" fill="${p.muted}">${xml(item.stack)}</text>
    <text x="${x + 16}" y="${y + 54}" class="sans" font-size="16" font-weight="600" fill="${p.ink}">${xml(item.repo)}</text>
    ${body}
  </g>`;
}

function layoutWork(p, width, mobile) {
  const pad = mobile ? 20 : 28;
  const gap = 12;
  const inner = width - pad * 2;
  let y = mobile ? 86 : 96;
  let index = 1;
  const parts = [];
  const tileH = mobile ? 112 : 118;
  const cols = mobile ? 1 : 2;
  const colW = (inner - gap * (cols - 1)) / cols;

  for (const lane of lanes) {
    const items = catalog.filter((item) => item.lane === lane.key);
    const color = accent(lane.key, p.mode);
    parts.push(
      `<text x="${pad}" y="${y}" class="mono" font-size="11" letter-spacing="2" fill="${color}">${lane.label}</text>`,
    );
    y += 14;
    for (let i = 0; i < items.length; i += cols) {
      const slice = items.slice(i, i + cols);
      const span = slice.length === 1 && !mobile ? inner : colW;
      for (let c = 0; c < slice.length; c++) {
        const x = pad + c * (colW + gap);
        parts.push(tile(slice[c], index++, x, y, span, tileH, p, span > 500 ? 72 : 44));
      }
      y += tileH + gap;
    }
    y += 10;
  }
  return { height: y + 8, parts };
}

function workSvg(p, id, mobile) {
  const width = mobile ? WORK_M.width : WORK.width;
  const built = layoutWork(p, width, mobile);
  const height = built.height;
  const pad = mobile ? 20 : 28;
  const alt = xml(`Selected work by ${identity.name}: ${catalog.map((item) => item.repo).join(", ")}.`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs(p, "g", width, height)}
  <g clip-path="url(#frame)">
    <rect width="${width}" height="${height}" fill="${p.bg}"/>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
    <text x="${pad}" y="${mobile ? 42 : 48}" class="display" font-size="${mobile ? 26 : 30}" fill="${p.ink}">Selected work</text>
    <text x="${width - pad}" y="${mobile ? 42 : 48}" class="mono" font-size="11" text-anchor="end" fill="${p.muted}">${catalog.length} repositories</text>
    ${built.parts.join("\n    ")}
  </g>
</svg>`;
}

function mdTable(items, startIndex) {
  const cell = (item, n) => `<td valign="top" width="50%">
<h3>${pad2(n)} · <a href="${repoUrl(item.repo)}">${item.repo}</a></h3>
<p><sub>${item.stack}</sub><br/>
${item.summary}</p>
</td>`;
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    const n = startIndex + i;
    const right = items[i + 1] ? cell(items[i + 1], n + 1) : `<td width="50%"></td>`;
    rows.push(`<tr>${cell(items[i], n)}${right}</tr>`);
  }
  return `<table width="100%">
${rows.join("\n")}
</table>`;
}

function mdSimple(rows) {
  return rows
    .map((item) => `- **[${item.repo}](${repoUrl(item.repo)})** — ${item.summary}`)
    .join("\n");
}

function picture(sources, alt, fallback) {
  const tags = sources
    .map((s) => `  <source media="${s.media}" srcset="assets/${s.src}">`)
    .join("\n");
  return `<picture>
${tags}
  <img alt="${alt}" src="assets/${fallback}" width="100%">
</picture>`;
}

function renderReadme() {
  const statsDark = `https://github-stats-extended.vercel.app/api?username=${USER}&show_icons=true&hide_border=true&theme=github_dark`;
  const statsLight = `https://github-stats-extended.vercel.app/api?username=${USER}&show_icons=true&hide_border=true&theme=github_light`;
  const langsDark = `https://github-stats-extended.vercel.app/api/top-langs/?username=${USER}&layout=compact&langs_count=6&hide_border=true&theme=github_dark`;
  const langsLight = `https://github-stats-extended.vercel.app/api/top-langs/?username=${USER}&layout=compact&langs_count=6&hide_border=true&theme=github_light`;

  let n = 1;
  const laneBlocks = lanes
    .map((lane) => {
      const rows = catalog.filter((item) => item.lane === lane.key);
      const table = mdTable(rows, n);
      n += rows.length;
      return `### ${lane.heading}\n\n${table}`;
    })
    .join("\n\n");

  return `<!-- Generated by scripts/render-profile.mjs. Edit that file, then run: node scripts/render-profile.mjs -->
${picture(
  [
    { media: "(max-width: 700px) and (prefers-color-scheme: dark)", src: ASSETS.mobileDark },
    { media: "(max-width: 700px)", src: ASSETS.mobileLight },
    { media: "(prefers-color-scheme: dark)", src: ASSETS.desktopDark },
    { media: "(prefers-color-scheme: light)", src: ASSETS.desktopLight },
  ],
  `${identity.name} — ${identity.role}. Selected repositories: ${heroRepos.join(", ")}.`,
  ASSETS.desktopLight,
)}

${identity.intro}

${picture(
  [
    { media: "(max-width: 700px) and (prefers-color-scheme: dark)", src: ASSETS.workMobileDark },
    { media: "(max-width: 700px)", src: ASSETS.workMobileLight },
    { media: "(prefers-color-scheme: dark)", src: ASSETS.workDark },
    { media: "(prefers-color-scheme: light)", src: ASSETS.workLight },
  ],
  `Selected work: ${catalog.map((item) => item.repo).join(", ")}.`,
  ASSETS.workLight,
)}

## Selected work

${laneBlocks}

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
  [ASSETS.desktopDark]: heroDesktop(palettes.dark, "dark"),
  [ASSETS.desktopLight]: heroDesktop(palettes.light, "light"),
  [ASSETS.mobileDark]: heroMobile(palettes.dark, "mdark"),
  [ASSETS.mobileLight]: heroMobile(palettes.light, "mlight"),
  [ASSETS.workDark]: workSvg(palettes.dark, "wdark", false),
  [ASSETS.workLight]: workSvg(palettes.light, "wlight", false),
  [ASSETS.workMobileDark]: workSvg(palettes.dark, "wmdark", true),
  [ASSETS.workMobileLight]: workSvg(palettes.light, "wmlight", true),
};

if (!files[ASSETS.mobileDark].includes("frostwall-beam")) {
  throw new Error("mobile hero dropped a featured repo");
}
if (!files[ASSETS.workDark].includes("duetto") || !files[ASSETS.workDark].includes("MACOS")) {
  throw new Error("work board missing catalog coverage");
}

for (const [name, svg] of Object.entries(files)) {
  if (!svg.includes("Batuhan") && !svg.includes("Selected work")) {
    throw new Error(`${name} missing identity or selected work`);
  }
  if (svg.includes("…")) throw new Error(`${name} clipped text with ellipsis`);
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
  "hero-v10",
  "work-v10",
  "## Selected work",
  "### macOS",
  "### Terminal & CLI",
  "### Application security",
  "### Developer tooling",
  "### In progress",
  "<table",
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
console.log("wrote 8 profile SVGs and README.md");
