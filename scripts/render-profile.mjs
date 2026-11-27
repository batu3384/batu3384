#!/usr/bin/env node
// Source of truth for github.com/batu3384 — SVGs + README.md
// Data: data/profile.json (refresh with scripts/fetch-profile-data.mjs)
// Run: node scripts/render-profile.mjs

import { mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets");
const USER = "batu3384";
const ASSETS = {
  desktopDark: "board-v17-dark.svg",
  desktopLight: "board-v17-light.svg",
  mobileDark: "board-v17-mobile-dark.svg",
  mobileLight: "board-v17-mobile-light.svg",
};

function loadData() {
  try {
    return JSON.parse(readFileSync(join(root, "data/profile.json"), "utf8"));
  } catch {
    throw new Error("data/profile.json missing — run: node scripts/fetch-profile-data.mjs");
  }
}
const data = loadData();

const identity = {
  name: "Batuhan Yüksel",
  role: "Software developer",
  focus: "macOS apps · CLI tools · application security",
  location: "Istanbul · MIS",
  stack: "Swift · Go · TypeScript · Rust · Python · C++",
  intro:
    "MIS graduate in Istanbul. I ship local-first software: macOS apps, CLI tools, and security workflows that keep data and reports on the machine.",
};

const HERO = "pi-gateway";

const catalog = [
  // `line` = SVG one-liner (layout cap). `summary` = README sentence. Same fact, two lengths.
  {
    repo: "pi-gateway",
    stack: "Shell",
    lane: "Terminal",
    line: "Production DNS and home-lab gateway on Raspberry Pi.",
    heroLine: "AdGuard + Unbound DNS-over-TLS, Caddy TLS proxy, Grafana monitoring, CrowdSec, encrypted backups — one pipeline.",
    summary:
      "Production DNS and home-lab gateway on Raspberry Pi. AdGuard and Unbound with DNS-over-TLS, Caddy reverse proxy, Grafana monitoring, CrowdSec, and encrypted 3-2-1 backups — deployed by a single make pipeline.",
  },
  {
    repo: "byteback",
    stack: "C++",
    lane: "AppSec",
    line: "C++17 forensic engine — NTFS, FAT, ext4, RAID.",
    summary:
      "Windows forensic imaging and data recovery. C++17 engine covers NTFS, FAT/exFAT, and ext4 metadata recovery, signature carving, and virtual RAID — strictly read-only on source media.",
  },
  {
    repo: "ironsentinel",
    stack: "Go",
    lane: "AppSec",
    line: "Guided AppSec missions, evidence-grade reports.",
    summary:
      "Local-first AppSec command center. Guided scan missions normalize findings into one model and export SARIF, CSV, and HTML evidence — no hosted control plane.",
  },
  {
    repo: "frostwall-beam",
    stack: "Rust",
    lane: "macOS",
    line: "E2E encrypted transfer — SPAKE2, NAT traversal.",
    summary:
      "End-to-end encrypted file transfer for LAN and internet. SPAKE2 pairing, XChaCha20-Poly1305 chunks, iroh NAT traversal, explicit receiver approval — no cloud account.",
  },
  {
    repo: "falcon-dm",
    stack: "Rust",
    lane: "macOS",
    line: "Multi-connection downloads, byte-exact crash resume.",
    summary:
      "Tauri download manager with a Rust engine: multi-connection byte ranges, byte-exact resume after crashes, HLS segment assembly, and a paired Chrome extension. No cloud queue, no telemetry.",
  },
  {
    repo: "ScreenTextGrab",
    stack: "Swift",
    lane: "macOS",
    line: "Menu-bar OCR — Apple Vision, fully on-device.",
    summary:
      "Notarized macOS menu-bar OCR app. Apple Vision runs on-device; modes for screen regions, subtitles, code, and tables, with automation through the `stg` CLI, URL scheme, and Shortcuts.",
  },
  {
    repo: "calder",
    stack: "TypeScript",
    lane: "Terminal",
    line: "Parallel AI CLI sessions in one governed workspace.",
    summary:
      "Electron workspace for parallel AI coding CLIs — Claude Code, Codex, Cursor, Antigravity. PTY-backed terminals, provider-aware launch and resume, session telemetry, and governance in one shell.",
  },
  {
    repo: "sift",
    stack: "Go",
    lane: "Terminal",
    line: "Review-first terminal cleaner, dry-run by default.",
    summary:
      "Review-first terminal cleaner for macOS and Windows. Typed Go core, dry-run by default, permission preflight, and audit history — destructive runs need explicit flags.",
  },
  {
    repo: "agent-atlas",
    stack: "Python",
    lane: "Tooling",
    line: "Open-web research capability layer for agents.",
    summary:
      "Capability layer that installs, health-checks, and routes open-web research tools for coding agents — ten channels, doctor diagnostics, end-to-end smoke tests.",
  },
  {
    repo: "codebase-audit",
    stack: "Python",
    lane: "Tooling",
    line: "Evidence-backed whole-repo audits for agents.",
    summary:
      "Agent Skill for whole-repo architecture audits. Phased review with measured, path:line-cited findings and drift detection — no auto-fixes by design.",
  },
  {
    repo: "deskward",
    stack: "Rust",
    lane: "Early",
    line: "Self-hosted remote desktop — Rust core, Flutter UI.",
    summary:
      "Self-hosted remote desktop platform. Rust core with ID and relay servers, Flutter client, Tailscale connectivity. Early stage; host agents are still rolling out.",
  },
  {
    repo: "duetto",
    stack: "TypeScript",
    lane: "Early",
    line: "Dual-caption Udemy player — translation, notes.",
    summary:
      "Chrome extension for Udemy: dual captions with Gemini translation, a term-lock glossary, timestamped notes, and precision playback controls.",
  },
];

const other = [
  {
    repo: "hexloom",
    summary: "FastAPI text-transformation studio — eleven encode/decode/validate methods, batch workflows, live deployment with OpenAPI docs.",
  },
  {
    repo: "jobcraft",
    summary: "Local-first job-search workspace for Turkey — multi-portal search, fit scoring, LaTeX CV and cover-letter pipeline, application tracking.",
  },
];

const academic = [
  {
    repo: "vetvision",
    summary: "Desktop app for dog-breed recognition with PDF export and optional Gemini reports.",
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
    summary: "Raspberry Pi line-following robot that stops on obstacles, with LED and buzzer alerts.",
  },
];

const lanes = [
  { heading: "Application security", key: "AppSec", label: "Application security" },
  { heading: "macOS", key: "macOS", label: "macOS" },
  { heading: "Terminal & systems", key: "Terminal", label: "Terminal & systems" },
  { heading: "Developer tooling", key: "Tooling", label: "Developer tooling" },
  { heading: "Early stage", key: "Early", label: "Early stage" },
];

// Modern SaaS palette: deep blue-tinted dark, single cyan accent, thin borders.
const palettes = {
  dark: {
    bg: "#0b1017",
    surface: "#121a26",
    ink: "#e8eef5",
    muted: "#8b98a9",
    rule: "#243145",
    accent: "#22d3ee",
  },
  light: {
    bg: "#ffffff",
    surface: "#f4f7fa",
    ink: "#0c1222",
    muted: "#5a6a7e",
    rule: "#d5dde6",
    accent: "#0e7490",
  },
};

const DESKTOP = { width: 960, pad: 36, header: 172 };
const MOBILE = { width: 400, pad: 22, header: 200 };

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
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function repoUrl(name) {
  return `https://github.com/${USER}/${name}`;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function fmtInt(n) {
  return n.toLocaleString("en-US");
}

function clip(text, maxChars) {
  const clean = String(text);
  if (clean.length <= maxChars) return clean;
  const cut = clean.slice(0, maxChars - 1);
  return cut.slice(0, cut.lastIndexOf(" ") + 1).trimEnd();
}

// ---- live-data helpers ---------------------------------------------------

function generatedStamp() {
  const d = new Date(data.generatedAt);
  const y = d.getUTCFullYear();
  const m = pad2(d.getUTCMonth() + 1);
  const day = pad2(d.getUTCDate());
  const hh = pad2(d.getUTCHours());
  const mm = pad2(d.getUTCMinutes());
  return `${y}-${m}-${day} ${hh}:${mm} UTC`;
}

function relativePush(iso) {
  const then = new Date(iso).getTime();
  const now = new Date(data.generatedAt).getTime();
  const days = Math.floor((now - then) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function contributionLevels() {
  const counts = data.contributions.days
    .map((d) => d.count)
    .filter((c) => c > 0)
    .sort((a, b) => a - b);
  const pick = (q) => counts[Math.min(counts.length - 1, Math.floor(counts.length * q))];
  return [pick(0.4), pick(0.7), pick(0.9)];
}

function heatLevel(count, thresholds) {
  if (count === 0) return 0;
  if (count <= thresholds[0]) return 1;
  if (count <= thresholds[1]) return 2;
  if (count <= thresholds[2]) return 3;
  return 4;
}

const LEVEL_OPACITY = [0, 0.3, 0.55, 0.8, 1];

function heatWeeks(maxColumns) {
  const days = data.contributions.days;
  const first = new Date(days[0].date + "T00:00:00Z");
  const offset = first.getUTCDay();
  const columns = [];
  let col = [];
  for (let i = 0; i < offset; i++) col.push(null);
  for (const day of days) {
    col.push(day);
    if (col.length === 7) {
      columns.push(col);
      col = [];
    }
  }
  if (col.length) {
    while (col.length < 7) col.push(null);
    columns.push(col);
  }
  return columns.slice(-maxColumns);
}

// ---- svg primitives ------------------------------------------------------

function defs(p) {
  return `<defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${p.bg}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="herowash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.10"/>
      <stop offset="55%" stop-color="${p.accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <style>
    .sans{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
  </style>`;
}

function field(p, w, h) {
  const left = Math.round(w * 0.78);
  return `<rect width="${w}" height="${h}" fill="${p.bg}"/>
  <circle cx="${left}" cy="80" r="220" fill="url(#glow)">
    <animate attributeName="cx" values="${left};${left - 60};${left}" dur="24s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="70;120;70" dur="29s" repeatCount="indefinite"/>
  </circle>`;
}

function caretX(pad, fontSize) {
  return pad + Math.round(identity.role.length * fontSize * 0.56) + 10;
}

function cursor(p, x, y) {
  return `<rect x="${x}" y="${y}" width="2" height="14" fill="${p.accent}">
    <animate attributeName="opacity" values="1;1;0;0" dur="1.15s" repeatCount="indefinite" calcMode="discrete"/>
  </rect>`;
}

// Straight scanline with a travelling bead — flatter and more product-like than the sine wave.
function scanRule(p, x, y, w) {
  const bead = 64;
  return `<g>
    <path d="M ${x} ${y} H ${x + w}" fill="none" stroke="${p.rule}" stroke-width="1"/>
    <path d="M ${x} ${y} H ${x + w}" fill="none" stroke="${p.accent}" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="${bead} ${w}" stroke-dashoffset="0">
      <animate attributeName="stroke-dashoffset" from="0" to="${-(w + bead)}" dur="3.6s" repeatCount="indefinite"/>
    </path>
  </g>`;
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
  if (!catalog.some((item) => item.repo === HERO)) throw new Error(`hero not in catalog: ${HERO}`);
  const heroItem = catalog.find((item) => item.repo === HERO);
  if (!heroItem.heroLine) throw new Error("hero item needs heroLine");
  for (const lane of lanes) {
    const rows = catalog.filter((item) => item.lane === lane.key && item.repo !== HERO);
    if (rows.length === 0) throw new Error(`lane has no projects besides the hero: ${lane.key}`);
  }
  for (const item of catalog) {
    if (item.line.length > 62) throw new Error(`board line too long: ${item.repo}`);
  }
  if (caretX(36, 15) > 400) throw new Error("role caret would overflow a mobile board");
  if (!data.contributions?.days?.length) throw new Error("profile data has no contribution days");
  if (!data.recent?.length) throw new Error("profile data has no recent repositories");
}

function header(p, width, spec) {
  const { pad, header: headerH } = spec;
  const mobile = width < 500;
  const innerR = width - pad;
  const stack = mobile
    ? `<text x="${pad}" y="162" class="mono" font-size="10" fill="${p.muted}">${xml(identity.stack)}</text>`
    : `<text x="${innerR}" y="52" class="mono" font-size="10" text-anchor="end" fill="${p.muted}">${xml(identity.stack)}</text>`;
  const status = `<text x="${innerR - 12}" y="${mobile ? 32 : 34}" class="mono" font-size="10" text-anchor="end" letter-spacing="1" fill="${p.muted}">PUBLIC / LOCAL-FIRST</text>
    <circle cx="${innerR}" cy="${mobile ? 28 : 30}" r="2.5" fill="${p.accent}"/>`;
  const caret = cursor(p, caretX(pad, 15), mobile ? 104 : 110);
  return `<g>
    <text x="${pad}" y="${mobile ? 32 : 34}" class="mono" font-size="11" letter-spacing="1.4" fill="${p.accent}">${xml(identity.location)}</text>
    ${status}
    ${stack}
    <text x="${pad}" y="${mobile ? 88 : 92}" class="sans" font-size="${mobile ? 31 : 44}" font-weight="700" letter-spacing="-1.2" fill="${p.ink}">${xml(identity.name)}</text>
    <text x="${pad}" y="${mobile ? 118 : 122}" class="sans" font-size="15" fill="${p.ink}">${xml(identity.role)}</text>
    ${caret}
    <text x="${pad}" y="${mobile ? 142 : 146}" class="sans" font-size="13" fill="${p.muted}">${xml(identity.focus)}</text>
    ${scanRule(p, pad, headerH - 8, innerR - pad)}
  </g>`;
}

// Typographic signal row: proof numbers, no cards.
function signalBar(p, width, spec, y) {
  const { pad } = spec;
  const mobile = width < 500;
  const inner = width - pad * 2;
  const metrics = [
    { value: fmtInt(data.contributions.total), label: "contributions · 12mo" },
    { value: fmtInt(data.contributions.activeDays), label: "active days" },
    { value: fmtInt(data.contributions.longestStreak), label: "longest streak · days" },
    { value: fmtInt(data.publicRepos), label: "public repos" },
  ];
  const parts = [];
  const baseY = y + (mobile ? 32 : 34);
  parts.push(`<path d="M ${pad} ${y} H ${width - pad}" fill="none" stroke="${p.rule}" stroke-width="1"/>`);
  if (mobile) {
    const colW = Math.floor(inner / 2);
    metrics.forEach((m, i) => {
      const cx = pad + (i % 2) * colW;
      const ry = baseY + Math.floor(i / 2) * 34;
      parts.push(`<text x="${cx}" y="${ry}" class="sans" font-size="17" font-weight="700" fill="${p.ink}">${xml(m.value)}</text>
      <text x="${cx + Math.round(String(m.value).length * 10.5) + 8}" y="${ry}" class="mono" font-size="8" letter-spacing="0.6" fill="${p.muted}">${xml(m.label.toUpperCase())}</text>`);
    });
    parts.push(`<path d="M ${pad} ${baseY + 34 + 12} H ${width - pad}" fill="none" stroke="${p.rule}" stroke-width="1"/>`);
    return { height: baseY + 34 + 12 + 14 - y, parts };
  }
  const colW = Math.floor(inner / metrics.length);
  metrics.forEach((m, i) => {
    const cx = pad + i * colW;
    parts.push(`<text x="${cx}" y="${baseY}" class="sans" font-size="23" font-weight="700" letter-spacing="-0.5" fill="${p.ink}">${xml(m.value)}</text>
    <text x="${cx}" y="${baseY + 17}" class="mono" font-size="9" letter-spacing="1.1" fill="${p.muted}">${xml(m.label.toUpperCase())}</text>`);
  });
  parts.push(`<path d="M ${pad} ${baseY + 30} H ${width - pad}" fill="none" stroke="${p.rule}" stroke-width="1"/>`);
  return { height: baseY + 30 + 14 - y, parts };
}

function heroCard(p, spec, y) {
  const { width, pad } = spec;
  const mobile = width < 500;
  const inner = width - pad * 2;
  const item = catalog.find((entry) => entry.repo === HERO);
  const h = mobile ? 188 : 148;
  const descWidth = mobile ? 44 : 96;
  const lines = [];
  {
    let cur = "";
    for (const word of item.heroLine.split(/\s+/)) {
      const next = cur ? `${cur} ${word}` : word;
      if (next.length > descWidth && cur) {
        lines.push(cur);
        cur = word;
      } else {
        cur = next;
      }
    }
    if (cur) lines.push(cur);
  }
  if (lines.length > (mobile ? 3 : 2)) throw new Error("hero description overflows the card");
  const body = lines
    .map((ln, i) => `<text x="${pad + 22}" y="${y + 78 + i * 17}" class="sans" font-size="${mobile ? 12 : 12.5}" fill="${p.muted}">${xml(ln)}</text>`)
    .join("\n    ");
  const chips = mobile
    ? "adguard · unbound · caddy · grafana · tailscale"
    : "adguard · unbound · caddy · grafana · crowdsec · tailscale · restic";
  return {
    height: h,
    svg: `<g data-featured="true">
    <rect x="${pad}" y="${y}" width="${inner}" height="${h}" rx="10" fill="${p.surface}" stroke="${p.rule}" stroke-width="1"/>
    <rect x="${pad}" y="${y}" width="${inner}" height="${h}" rx="10" fill="url(#herowash)"/>
    <rect x="${pad}" y="${y}" width="3" height="${h}" fill="${p.accent}"/>
    <text x="${pad + 22}" y="${y + 30}" class="mono" font-size="10" letter-spacing="1.4" fill="${p.accent}">FEATURED / PRODUCTION</text>
    <text x="${pad + inner - 20}" y="${y + 30}" class="mono" font-size="11" text-anchor="end" fill="${p.muted}">${xml(item.stack)}</text>
    <text x="${pad + 22}" y="${y + 58}" class="sans" font-size="${mobile ? 19 : 22}" font-weight="700" letter-spacing="-0.4" fill="${p.ink}">${xml(item.repo)}</text>
    ${body}
    <text x="${pad + 22}" y="${y + h - 16}" class="mono" font-size="${mobile ? 9 : 10}" fill="${p.muted}">${xml(chips)}</text>
  </g>`,
  };
}

function laneEyebrow(p, lane, x, y) {
  return `<g>
    <text x="${x}" y="${y}" class="mono" font-size="10" letter-spacing="1.6" fill="${p.accent}">${xml(lane.label.toUpperCase())}</text>
  </g>`;
}

function projectRow(item, index, x, y, w, p, mobile) {
  const idx = pad2(index);
  if (mobile) {
    return `<g>
    <text x="${x}" y="${y}" class="mono" font-size="10" fill="${p.accent}">${idx}</text>
    <text x="${x + 28}" y="${y}" class="sans" font-size="13" font-weight="600" fill="${p.ink}">${xml(item.repo)}</text>
    <text x="${x + 28}" y="${y + 17}" class="sans" font-size="11.5" fill="${p.muted}">${xml(clip(item.line, 56))}</text>
    <text x="${x + w}" y="${y}" class="mono" font-size="9" text-anchor="end" fill="${p.muted}">${xml(item.stack)}</text>
  </g>`;
  }
  return `<g>
    <text x="${x}" y="${y}" class="mono" font-size="10" fill="${p.accent}">${idx}</text>
    <text x="${x + 30}" y="${y}" class="sans" font-size="13.5" font-weight="600" fill="${p.ink}">${xml(item.repo)}</text>
    <text x="${x + 196}" y="${y}" class="sans" font-size="12" fill="${p.muted}">${xml(clip(item.line, 58))}</text>
    <text x="${x + w}" y="${y}" class="mono" font-size="10" text-anchor="end" fill="${p.muted}">${xml(item.stack)}</text>
  </g>`;
}

function layoutCatalog(p, spec, startY) {
  const { width, pad } = spec;
  const mobile = width < 500;
  const inner = width - pad * 2;
  let y = startY;
  let index = 2; // 01 is the hero
  const parts = [];

  parts.push(
    `<text x="${pad}" y="${y}" class="sans" font-size="${mobile ? 20 : 24}" font-weight="700" letter-spacing="-0.5" fill="${p.ink}">Selected work</text>
    <text x="${width - pad}" y="${y}" class="mono" font-size="10" text-anchor="end" letter-spacing="1.2" fill="${p.muted}">SYSTEM MAP / PUBLIC</text>`,
  );
  y += mobile ? 24 : 28;

  const hero = heroCard(p, spec, y);
  parts.push(hero.svg.replace(`${pad}`, `${pad}`));
  y += hero.height + (mobile ? 22 : 28);

  lanes.forEach((lane) => {
    const items = catalog.filter((item) => item.lane === lane.key && item.repo !== HERO);
    parts.push(laneEyebrow(p, lane, pad, y));
    parts.push(`<path d="M ${pad} ${y + 8} H ${width - pad}" fill="none" stroke="${p.rule}" stroke-width="1"/>`);
    y += mobile ? 26 : 24;
    const rowH = mobile ? 46 : 34;
    items.forEach((item, i) => {
      parts.push(projectRow(item, index++, pad, y + 14, inner, p, mobile));
      if (i < items.length - 1) {
        parts.push(`<path d="M ${pad} ${y + rowH - 6} H ${width - pad}" fill="none" stroke="${p.rule}" stroke-width="1" stroke-opacity="0.5"/>`);
      }
      y += rowH;
    });
    y += mobile ? 18 : 20;
  });

  return { height: y + pad - 16, parts };
}

// Contribution heatmap in the board's own palette — cyan opacity ramp, no GitHub green.
function activity(p, width, spec, startY) {
  const { pad } = spec;
  const mobile = width < 500;
  const inner = width - pad * 2;
  const parts = [];
  let y = startY + 6;

  parts.push(`<text x="${pad}" y="${y}" class="sans" font-size="${mobile ? 20 : 24}" font-weight="700" letter-spacing="-0.5" fill="${p.ink}">Activity</text>
  <text x="${width - pad}" y="${y}" class="mono" font-size="10" text-anchor="end" letter-spacing="1.2" fill="${p.muted}">${mobile ? "LAST 26 WEEKS" : "LAST 12 MONTHS"} / GRAPHQL</text>`);
  y += mobile ? 24 : 28;

  const maxCols = mobile ? 26 : 53;
  const step = mobile ? 13 : 16;
  const cell = mobile ? 10 : 13;
  const weeks = heatWeeks(maxCols);
  const gridW = weeks.length * step - (step - cell);
  const gx = pad + Math.max(0, Math.floor((inner - gridW) / 2));
  const thresholds = contributionLevels();

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const labelParts = [];
  let lastMonth = -1;
  let lastLabelX = -Infinity;
  weeks.forEach((week, ci) => {
    const first = week.find((d) => d);
    if (!first) return;
    const month = +first.date.slice(5, 7) - 1;
    const lx = gx + ci * step;
    if (month !== lastMonth && lx - lastLabelX >= 24) {
      lastMonth = month;
      lastLabelX = lx;
      labelParts.push(`<text x="${lx}" y="${y}" class="mono" font-size="8" fill="${p.muted}">${MONTHS[month]}</text>`);
    }
  });
  parts.push(`<g>${labelParts.join("")}</g>`);
  y += 8;

  const cells = [];
  weeks.forEach((week, ci) => {
    week.forEach((day, ri) => {
      if (!day) return;
      const level = heatLevel(day.count, thresholds);
      const fill = level === 0 ? p.surface : p.accent;
      const opacity = level === 0 ? "" : ` fill-opacity="${LEVEL_OPACITY[level]}"`;
      cells.push(
        `<rect x="${gx + ci * step}" y="${y + ri * step}" width="${cell}" height="${cell}" rx="2" fill="${fill}"${opacity}/>`,
      );
    });
  });
  parts.push(`<g data-heatmap="contributions">${cells.join("\n    ")}</g>`);
  y += 7 * step + 10;

  const legendCells = [0, 1, 2, 3, 4]
    .map((level, i) => {
      const fill = level === 0 ? p.surface : p.accent;
      const opacity = level === 0 ? "" : ` fill-opacity="${LEVEL_OPACITY[level]}"`;
      return `<rect x="${pad + 30 + i * 12}" y="${y - 8}" width="9" height="9" rx="2" fill="${fill}"${opacity}/>`;
    })
    .join("");
  parts.push(`<g>
    <text x="${pad}" y="${y}" class="mono" font-size="9" fill="${p.muted}">less</text>
    ${legendCells}
    <text x="${pad + 30 + 5 * 12 + 6}" y="${y}" class="mono" font-size="9" fill="${p.muted}">more</text>
    <text x="${width - pad}" y="${y}" class="mono" font-size="10" text-anchor="end" fill="${p.muted}">${xml(fmtInt(data.contributions.total))} contributions in the last year</text>
  </g>`);
  y += mobile ? 22 : 26;

  parts.push(`<text x="${pad}" y="${y}" class="mono" font-size="10" letter-spacing="1.2" fill="${p.accent}">ACTIVE NOW</text>`);
  y += 18;
  const recent = data.recent.slice(0, mobile ? 3 : 4);
  if (mobile) {
    recent.forEach((r, i) => {
      parts.push(`<text x="${pad}" y="${y + i * 18}" class="sans" font-size="12" font-weight="600" fill="${p.ink}">${xml(r.name)}</text>
      <text x="${width - pad}" y="${y + i * 18}" class="mono" font-size="10" text-anchor="end" fill="${p.muted}">${xml((r.language ?? "") + " · " + relativePush(r.pushedAt))}</text>`);
    });
    y += recent.length * 18 + 6;
  } else {
    const colW = Math.floor(inner / recent.length);
    recent.forEach((r, i) => {
      const cx = pad + i * colW;
      parts.push(`<text x="${cx}" y="${y}" class="sans" font-size="12" font-weight="600" fill="${p.ink}">${xml(r.name)}</text>
      <text x="${cx}" y="${y + 15}" class="mono" font-size="9" fill="${p.muted}">${xml((r.language ?? "") + " · pushed " + relativePush(r.pushedAt))}</text>`);
    });
    y += 36;
  }

  y += 8;
  const footerNote = mobile
    ? `generated ${xml(generatedStamp())} · github graphql · daily`
    : `generated ${xml(generatedStamp())} · data: github graphql · refreshed daily by actions`;
  const footerSrc = mobile
    ? ""
    : `<text x="${width - pad}" y="${y + 16}" class="mono" font-size="9" text-anchor="end" fill="${p.muted}">src: ${xml(USER)}/${xml(USER)}</text>`;
  parts.push(`<path d="M ${pad} ${y} H ${width - pad}" fill="none" stroke="${p.rule}" stroke-width="1"/>
  <text x="${pad}" y="${y + 16}" class="mono" font-size="9" fill="${p.muted}">${footerNote}</text>
  ${footerSrc}`);
  return { height: y + 16 + 18, parts };
}

function board(p, id, spec) {
  const { width, header: headerH } = spec;
  const mobile = width < 500;
  const signal = signalBar(p, width, spec, headerH + 4);
  const built = layoutCatalog(p, spec, headerH + 4 + signal.height + (mobile ? 16 : 22));
  const act = activity(p, width, spec, built.height + 8);
  const height = act.height + spec.pad - 6;
  const alt = xml(
    `${identity.name}, ${identity.role}. Selected work: ${catalog.map((item) => item.repo).join(", ")}. ${data.contributions.total} contributions in the last year.`,
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${alt}" data-mode="${id}">
  <title>${xml(identity.name)} — ${xml(identity.role)}</title>
  <desc>${xml(identity.intro)} Featured production system followed by a compact index of selected work and a live contribution heatmap.</desc>
  ${defs(p)}
  ${field(p, width, height)}
  ${header(p, width, spec)}
  ${signal.parts.join("\n  ")}
  ${built.parts.join("\n  ")}
  ${act.parts.join("\n  ")}
</svg>`;
}

function mdLaneSections() {
  return lanes
    .map((lane) => {
      const rows = catalog.filter((item) => item.lane === lane.key);
      const lines = rows
        .map((item) => `- **[${item.repo}](${repoUrl(item.repo)})** — ${html(item.summary)}`)
        .join("\n");
      return `### ${lane.heading}\n\n${lines}`;
    })
    .join("\n\n");
}

function mdNotes(rows) {
  return rows
    .map((item) => `- **[${item.repo}](${repoUrl(item.repo)})** — ${html(item.summary)}`)
    .join("\n");
}

function renderReadme() {
  const recent = data.recent
    .slice(0, 4)
    .map((r) => `[${r.name}](${repoUrl(r.name)})`)
    .join(" · ");
  return `<!-- Generated by scripts/render-profile.mjs. Edit that file, then run: node scripts/render-profile.mjs -->
<picture>
  <source media="(max-width: 700px) and (prefers-color-scheme: dark)" srcset="assets/${ASSETS.mobileDark}">
  <source media="(max-width: 700px)" srcset="assets/${ASSETS.mobileLight}">
  <source media="(prefers-color-scheme: dark)" srcset="assets/${ASSETS.desktopDark}">
  <source media="(prefers-color-scheme: light)" srcset="assets/${ASSETS.desktopLight}">
  <img alt="${html(identity.name)} — ${html(identity.role)}. Selected work: ${catalog.map((item) => item.repo).join(", ")}." src="assets/${ASSETS.desktopLight}" width="100%">
</picture>

Software developer in Istanbul. I build local-first software — macOS apps, terminal tools, and security workflows that keep data on the machine — plus the self-hosted infrastructure to run it on. Every project below is public and documented in its own repository.

## Selected work

${mdLaneSections()}

<details>
<summary>Other public repositories</summary>

${mdNotes(other)}

</details>

<details>
<summary>Academic work</summary>

${mdNotes(academic)}

</details>

## Activity

${fmtInt(data.contributions.total)} contributions across ${data.contributions.activeDays} active days in the last 12 months · longest streak ${data.contributions.longestStreak} days. Recent pushes: ${recent}.

<sub>Board and this section are regenerated daily from the GitHub GraphQL API — last run ${generatedStamp()}.</sub>

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
  if (!svg.includes('data-heatmap="contributions"')) throw new Error(`${name} is missing the heatmap`);
  if (!svg.includes("ACTIVE NOW")) throw new Error(`${name} is missing the active-now strip`);
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
if (!files[ASSETS.desktopDark].svg.includes("FEATURED / PRODUCTION")) {
  throw new Error("hero card missing its eyebrow");
}
if (!files[ASSETS.desktopDark].svg.includes('data-featured="true"')) {
  throw new Error("hero card is not rendered");
}

for (const [name, { svg, palette }] of Object.entries(files)) {
  if (!svg.includes("Batuhan") || !svg.includes("Selected work")) {
    throw new Error(`${name} missing identity or selected work`);
  }
  assertSvg(name, svg, palette);
  writeFileSync(join(outDir, name), svg);
}

const keep = new Set(Object.keys(files));
const generatedBoard = /^board-v\d+(?:-mobile)?-(?:dark|light)\.svg$/;
for (const name of readdirSync(outDir)) {
  if (generatedBoard.test(name) && !keep.has(name)) unlinkSync(join(outDir, name));
}

const readme = renderReadme();
for (const required of [
  "<picture>",
  "board-v17",
  "## Selected work",
  "### macOS",
  "pi-gateway",
  "deskward",
  "<details>",
  "## Activity",
  "## Contact",
]) {
  if (!readme.includes(required)) throw new Error(`README missing ${required}`);
}
if (readme.includes("<table")) throw new Error("README still uses HTML tables");
if (readme.includes("github-stats-extended")) throw new Error("README still has stats widgets");
if (readme.includes("github-snake")) throw new Error("README still has the snake widget");
if (readme.includes("skillicons.dev")) throw new Error("README still has skill icon widget");
writeFileSync(join(root, "README.md"), readme);
console.log("wrote 4 profile SVGs and README.md");
