#!/usr/bin/env node
// Fetches live GitHub data for the profile board -> data/profile.json
// Auth: GITHUB_TOKEN env (CI), falls back to `gh auth token` locally.
// Run: node scripts/fetch-profile-data.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const USER = "batu3384";

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim();
  } catch {
    throw new Error("no GITHUB_TOKEN env and `gh auth token` failed");
  }
}

const QUERY = `query($login:String!){
  user(login:$login){
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
    repositories(first:100, privacy:PUBLIC, ownerAffiliations:OWNER, orderBy:{field:PUSHED_AT,direction:DESC}){
      totalCount
      nodes {
        name pushedAt isArchived isFork
        primaryLanguage { name }
        languages(first:8, orderBy:{field:SIZE,direction:DESC}){ edges { size node { name } } }
      }
    }
  }
}`;

async function main() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      authorization: `bearer ${token()}`,
      "content-type": "application/json",
      "user-agent": `${USER}-profile-readme`,
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USER } }),
  });
  if (!res.ok) throw new Error(`graphql http ${res.status}`);
  const payload = await res.json();
  if (payload.errors) throw new Error(`graphql: ${payload.errors[0].message}`);
  const user = payload.data.user;

  const days = user.contributionsCollection.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => a.date.localeCompare(b.date));

  const activeDays = days.filter((d) => d.contributionCount > 0).length;
  let longestStreak = 0;
  let run = 0;
  for (const d of days) {
    run = d.contributionCount > 0 ? run + 1 : 0;
    longestStreak = Math.max(longestStreak, run);
  }
  const bestDay = days.reduce((a, b) => (b.contributionCount > a.contributionCount ? b : a));

  const repos = user.repositories.nodes.filter((r) => !r.isFork);
  const bytes = new Map();
  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      bytes.set(edge.node.name, (bytes.get(edge.node.name) ?? 0) + edge.size);
    }
  }
  const totalBytes = [...bytes.values()].reduce((a, b) => a + b, 0);
  const sorted = [...bytes.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 5);
  const restBytes = sorted.slice(5).reduce((a, [, v]) => a + v, 0);
  const languages = top.map(([name, size]) => ({
    name,
    share: +(100 * (size / totalBytes)).toFixed(1),
  }));
  if (restBytes > 0) {
    languages.push({ name: "Other", share: +(100 * (restBytes / totalBytes)).toFixed(1) });
  }

  const recent = repos
    .filter((r) => r.name !== USER && !r.isArchived)
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt))
    .slice(0, 4)
    .map((r) => ({
      name: r.name,
      pushedAt: r.pushedAt,
      language: r.primaryLanguage?.name ?? null,
    }));

  const data = {
    generatedAt: new Date().toISOString(),
    contributions: {
      total: user.contributionsCollection.contributionCalendar.totalContributions,
      activeDays,
      longestStreak,
      bestDay: { date: bestDay.date, count: bestDay.contributionCount },
      days: days.map((d) => ({ date: d.date, count: d.contributionCount })),
    },
    publicRepos: user.repositories.totalCount,
    languages,
    recent,
  };
  mkdirSync(join(root, "data"), { recursive: true });
  writeFileSync(join(root, "data/profile.json"), JSON.stringify(data, null, 2) + "\n");
  console.log(
    `wrote data/profile.json — ${data.contributions.total} contributions, ${activeDays} active days, streak ${longestStreak}, ${data.publicRepos} repos`,
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
