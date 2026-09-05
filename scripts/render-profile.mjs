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
  desktopDark: "board-v12-dark.svg",
  desktopLight: "board-v12-light.svg",
  mobileDark: "board-v12-mobile-dark.svg",
  mobileLight: "board-v12-mobile-light.svg",
};

const identity = {
  name: "Batuhan Yüksel",
  role: "Software developer",
  focus: "macOS applications · CLI tools · application security",
  location: "Istanbul · MIS",
  stack: "Swift · Go · TypeScript · Rust · Python · C++",
  intro:
    "MIS graduate in Istanbul. I design and ship local-first software: macOS utilities, terminal tools, and security workflows with evidence you can inspect.",
};

const catalog = [
  // `line` = SVG one-liner (layout cap). `summary` = README sentence. Same fact, two lengths.
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

const lanes = [
  { heading: "macOS", key: "macOS", label: "macOS" },
  { heading: "Terminal & CLI", key: "Terminal", label: "Terminal" },
  { heading: "Application security", key: "AppSec", label: "Application security" },
  { heading: "Developer tooling", key: "Tooling", label: "Developer tooling" },
  { heading: "In progress", key: "In progress", label: "In progress" },
];

// One accent. GitHub canvas so the board sits on the profile instead of a sticker.
const palettes = {
  dark: {
    bg: "#0d1117",
    surface: "#161b22",
    ink: "#f0f3f6",
    muted: "#8b949e",
    rule: "#30363d",
    accent: "#d4a05a",
  },
  light: {
    bg: "#ffffff",
    surface: "#f6f8fa",
    ink: "#1f2328",
    muted: "#59636e",
    rule: "#d0d7de",
    accent: "#9a5a14",
  },
};

const DESKTOP = { width: 960, pad: 36, gap: 14, tileH: 108, header: 168 };
const MOBILE = { width: 400, pad: 22, gap: 12, tileH: 108, header: 210 };

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function html(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function repoUrl(name) {
  return `https://github.com/${USER}/${name}`;
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
  if (lines.length > maxLines) {
    throw new Error(`text overflow (${lines.length}/${maxLines}): ${text}`);
  }
  return lines;
}

function defs() {
  return `<style>
    .display{font-family:Georgia,"Times New Roman",Times,serif}
    .sans{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
  </style>`;
}

// ponytail: SMIL has no prefers-reduced-motion in GitHub <img> sandbox. Ceiling = always-moving instrument. Upgrade: a static twin SVG if we ever need an off switch.
function scopePoints(x, y, w, h) {
  const n = 56;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const env = 0.7 + 0.3 * Math.sin(t * Math.PI);
    const py =
      y +
      h / 2 +
      Math.sin(t * Math.PI * 4) * (h / 2 - 4) * env +
      Math.sin(t * Math.PI * 13) * 2;
    pts.push({ x: +(x + t * w).toFixed(2), y: +py.toFixed(2) });
  }
  return pts;
}

function polyline(pts) {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  const d = `M ${pts.map((pt) => `${pt.x} ${pt.y}`).join(" L ")}`;
  return { d, len: Math.ceil(len) };
}

function scope(p, x, y, w, h) {
  const innerX = x + 8;
  const innerY = y + 6;
  const innerW = w - 16;
  const innerH = h - 12;
  const { d, len } = polyline(scopePoints(innerX, innerY, innerW, innerH));
  const bead = Math.max(36, Math.round(len * 0.12));
  const cycle = bead + len;
  const mid = y + h / 2;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${p.surface}" stroke="${p.rule}"/>
    <line x1="${innerX}" y1="${mid}" x2="${innerX + innerW}" y2="${mid}" stroke="${p.rule}" stroke-width="1"/>
    <path d="${d}" fill="none" stroke="${p.accent}" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${p.accent}" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="${bead} ${len}" stroke-dashoffset="0">
      <animate attributeName="stroke-dashoffset" from="0" to="${-cycle}" dur="2.8s" repeatCount="indefinite"/>
    </path>
  </g>`;
}

function cursor(p, x, y) {
  return `<rect x="${x}" y="${y}" width="7" height="13" fill="${p.accent}">
    <animate attributeName="opacity" values="1;1;0;0" dur="1.15s" repeatCount="indefinite" calcMode="discrete"/>
  </rect>`;
}

function sweep(p, x1, x2, y1, y2) {
  return `<line x1="${x1}" x2="${x1}" y1="${y1}" y2="${y2}" stroke="${p.accent}" stroke-width="1.2" stroke-opacity="0.28">
    <animate attributeName="x1" values="${x1};${x2};${x1}" dur="7s" repeatCount="indefinite"/>
    <animate attributeName="x2" values="${x1};${x2};${x1}" dur="7s" repeatCount="indefinite"/>
  </line>`;
}

function drawRule(p, x1, x2, y) {
  const span = x2 - x1;
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${p.rule}" stroke-width="1" stroke-dasharray="${span}" stroke-dashoffset="0">
    <animate attributeName="stroke-dashoffset" from="${span}" to="0" dur="1.3s" fill="freeze"/>
  </line>`;
}

function paletteHexes(p) {
  return new Set(Object.values(p).map((v) => v.toLowerCase()));
}

function assertLayout() {
  if (!/^[a-z0-9-]+$/i.test(USER)) throw new Error(`unsafe GitHub username: ${USER}`);
  for (const item of [...catalog, ...other, ...academic]) {
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(item.repo)) {
      throw new Error(`unsafe repository name: ${item.repo}`);
    }
  }
  for (const lane of lanes) {
    const rows = catalog.filter((item) => item.lane === lane.key);
    if (rows.length === 0) throw new Error(`lane has no projects: ${lane.key}`);
  }
  for (const item of catalog) {
    if (item.line.length > 62) throw new Error(`board line too long: ${item.repo}`);
  }
  const probe = polyline(scopePoints(0, 0, 240, 40));
  if (probe.len < 240) throw new Error("scope path shorter than width — motion bead will look broken");
}

function header(p, width, spec) {
  const { pad, header: headerH } = spec;
  const mobile = width < 500;
  const innerR = width - pad;
  const stack = mobile
    ? `<text x="${pad}" y="164" class="mono" font-size="11" fill="${p.muted}">${xml(identity.stack)}</text>`
    : `<text x="${innerR}" y="44" class="mono" font-size="11" text-anchor="end" fill="${p.muted}">${xml(identity.stack)}</text>`;
  const instrument = mobile
    ? scope(p, pad, 174, width - pad * 2, 26)
    : scope(p, 640, 70, innerR - 640, 70);
  const caret = mobile ? cursor(p, pad + 148, 107) : cursor(p, pad + 168, 111);
  return `<g>
    ${sweep(p, pad, innerR, 52, headerH - 14)}
    <text x="${pad}" y="44" class="mono" font-size="11" fill="${p.accent}">${xml(identity.location)}</text>
    ${stack}
    <text x="${pad}" y="${mobile ? 88 : 92}" class="display" font-size="${mobile ? 28 : 38}" fill="${p.ink}">${xml(identity.name)}</text>
    <text x="${pad}" y="${mobile ? 118 : 124}" class="sans" font-size="15" fill="${p.ink}">${xml(identity.role)}</text>
    ${caret}
    <text x="${pad}" y="${mobile ? 142 : 148}" class="sans" font-size="13" fill="${p.muted}">${xml(identity.focus)}</text>
    ${instrument}
    ${drawRule(p, pad, innerR, headerH - 8)}
  </g>`;
}

function tile(item, index, x, y, w, h, p, maxChars) {
  const lines = wrapLines(item.line, maxChars, 2);
  const body = lines
    .map(
      (ln, i) =>
        `<text x="${x + 16}" y="${y + 68 + i * 16}" class="sans" font-size="12" fill="${p.muted}">${xml(ln)}</text>`,
    )
    .join("\n    ");
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${p.surface}" stroke="${p.rule}"/>
    <text x="${x + 16}" y="${y + 28}" class="mono" font-size="11" fill="${p.accent}">${pad2(index)}</text>
    <text x="${x + w - 16}" y="${y + 28}" class="mono" font-size="11" text-anchor="end" fill="${p.muted}">${xml(item.stack)}</text>
    <text x="${x + 16}" y="${y + 50}" class="sans" font-size="16" font-weight="600" fill="${p.ink}">${xml(item.repo)}</text>
    ${body}
  </g>`;
}

function layoutCatalog(p, spec, startY) {
  const { width, pad, gap, tileH } = spec;
  const mobile = width < 500;
  const inner = width - pad * 2;
  const cols = mobile ? 1 : 2;
  const colW = (inner - gap * (cols - 1)) / cols;
  let y = startY;
  let index = 1;
  const parts = [];

  parts.push(
    `<text x="${pad}" y="${y}" class="display" font-size="${mobile ? 22 : 24}" fill="${p.ink}">Selected work</text>`,
  );
  y += mobile ? 22 : 26;

  for (const lane of lanes) {
    const items = catalog.filter((item) => item.lane === lane.key);
    parts.push(
      `<text x="${pad}" y="${y + 14}" class="mono" font-size="11" fill="${p.muted}">${xml(lane.label)}</text>`,
    );
    y += 26;
    for (let i = 0; i < items.length; i += cols) {
      const slice = items.slice(i, i + cols);
      const span = slice.length === 1 && !mobile ? inner : colW;
      for (let c = 0; c < slice.length; c++) {
        const x = pad + c * (colW + gap);
        parts.push(tile(slice[c], index++, x, y, span, tileH, p, span > 500 ? 70 : 42));
      }
      y += tileH + gap;
    }
    y += 8;
  }
  return { height: y + pad - 8, parts };
}

function board(p, id, spec) {
  const { width, header: headerH } = spec;
  const built = layoutCatalog(p, spec, headerH + 28);
  const height = built.height;
  const alt = xml(
    `${identity.name}, ${identity.role}. Selected work: ${catalog.map((item) => item.repo).join(", ")}.`,
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${alt}" data-mode="${id}">
  ${defs()}
  <rect width="${width}" height="${height}" fill="${p.bg}"/>
  ${header(p, width, spec)}
  ${built.parts.join("\n  ")}
</svg>`;
}

function mdList() {
  let n = 1;
  return lanes
    .map((lane) => {
      const rows = catalog.filter((item) => item.lane === lane.key);
      const items = rows
        .map((item) => {
          const line = `**${pad2(n++)} · [${item.repo}](${repoUrl(item.repo)})** · ${html(item.stack)}  \n${html(item.summary)}`;
          return line;
        })
        .join("\n\n");
      return `### ${lane.heading}\n\n${items}`;
    })
    .join("\n\n");
}

function mdSimple(rows) {
  return rows
    .map((item) => `- **[${item.repo}](${repoUrl(item.repo)})** — ${html(item.summary)}`)
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
  <img alt="${html(identity.name)} — ${html(identity.role)}. Selected work: ${catalog.map((item) => item.repo).join(", ")}." src="assets/${ASSETS.desktopLight}" width="100%">
</picture>

${html(identity.intro)}

## Selected work

${mdList()}

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

function assertSvg(name, svg, p) {
  if (!/^<svg\b[\s\S]*<\/svg>$/.test(svg)) throw new Error(`${name} is not a complete SVG`);
  if ((svg.match(/<svg\b/g) || []).length !== 1) throw new Error(`${name} has invalid SVG nesting`);
  if (/<script\b|javascript:| on[a-z]+\s*=/i.test(svg)) {
    throw new Error(`${name} contains executable SVG content`);
  }
  if (!svg.includes('role="img"') || !svg.includes("aria-label=")) {
    throw new Error(`${name} is missing accessible image metadata`);
  }
  if (svg.includes("undefined")) throw new Error(`${name} leaked undefined into markup`);
  if (svg.includes("…")) throw new Error(`${name} clipped text with ellipsis`);
  if (!svg.includes("<animate")) throw new Error(`${name} has no SMIL motion`);
  const allowed = paletteHexes(p);
  const hexes = svg.match(/#[0-9a-fA-F]{6}/g) ?? [];
  for (const hex of hexes) {
    if (!allowed.has(hex.toLowerCase())) {
      throw new Error(`${name} used off-palette color ${hex}`);
    }
  }
}

assertLayout();
mkdirSync(outDir, { recursive: true });

const files = {
  [ASSETS.desktopDark]: { svg: board(palettes.dark, "dark", DESKTOP), palette: palettes.dark },
  [ASSETS.desktopLight]: { svg: board(palettes.light, "light", DESKTOP), palette: palettes.light },
  [ASSETS.mobileDark]: { svg: board(palettes.dark, "mdark", MOBILE), palette: palettes.dark },
  [ASSETS.mobileLight]: { svg: board(palettes.light, "mlight", MOBILE), palette: palettes.light },
};

if (!files[ASSETS.desktopDark].svg.includes("ScreenTextGrab") || !files[ASSETS.desktopDark].svg.includes("duetto")) {
  throw new Error("board dropped catalog coverage");
}

for (const [name, { svg, palette }] of Object.entries(files)) {
  if (!svg.includes("Batuhan") || !svg.includes("Selected work")) {
    throw new Error(`${name} missing identity or selected work`);
  }
  assertSvg(name, svg, palette);
  writeFileSync(join(outDir, name), svg);
}

const keep = new Set(Object.keys(files));
for (const name of readdirSync(outDir)) {
  if (name.endsWith(".svg") && !keep.has(name)) unlinkSync(join(outDir, name));
}

const readme = renderReadme();
for (const required of [
  "<picture>",
  "board-v12",
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
if (readme.includes("<table")) throw new Error("README still uses HTML tables");
if (readme.includes("Calder workspace")) throw new Error("README still has Calder screenshot block");
if (readme.includes("skillicons.dev")) throw new Error("README still has skill icon widget");
if (readme.includes("Flagship repos")) throw new Error("README still has pin card section");
writeFileSync(join(root, "README.md"), readme);
console.log("wrote 4 profile SVGs and README.md");
