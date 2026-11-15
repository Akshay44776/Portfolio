// Live GitHub Actions data for the Pipeline page.
// Uses the public REST API (no token needed for public repos; 60 requests/hour per visitor IP),
// so every response is cached in sessionStorage for a few minutes.

const RAW_REPO = import.meta.env.VITE_GITHUB_REPO || "";

export const REPO = RAW_REPO.trim();
export const repoConfigured =
  /^[\w.-]+\/[\w.-]+$/.test(REPO) && !REPO.includes("your-");

const TTL_MS = 5 * 60 * 1000;
const API = "https://api.github.com";

function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    return Date.now() - t < TTL_MS ? v : null;
  } catch {
    return null;
  }
}

function cacheSet(key, v) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v }));
  } catch {
    /* storage unavailable: skip caching */
  }
}

async function ghFetch(path, signal) {
  const res = await fetch(`${API}${path}`, {
    signal,
    headers: { Accept: "application/vnd.github+json" }
  });
  if (res.status === 403 || res.status === 429) {
    throw new Error("GitHub API rate limit reached. Try again later.");
  }
  if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
  return res.json();
}

function normalizeStatus(conclusion, status) {
  if (conclusion) return conclusion; // success | failure | cancelled | skipped | ...
  return status || "queued"; // in_progress | queued
}

function secondsBetween(a, b) {
  if (!a || !b) return null;
  const s = Math.round((new Date(b) - new Date(a)) / 1000);
  return s >= 0 ? s : null;
}

export async function fetchRuns(signal, limit = 10) {
  if (!repoConfigured) throw new Error("VITE_GITHUB_REPO is not set");
  const key = `gh-runs:${REPO}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const data = await ghFetch(`/repos/${REPO}/actions/runs?per_page=${limit}`, signal);
  const runs = (data.workflow_runs || []).map((r) => ({
    id: r.id,
    number: r.run_number,
    workflow: r.name || "workflow",
    branch: r.head_branch,
    commit: (r.head_sha || "").slice(0, 7),
    message: (r.head_commit?.message || "").split("\n")[0],
    event: r.event,
    conclusion: normalizeStatus(r.conclusion, r.status),
    durationSec: secondsBetween(r.run_started_at, r.updated_at),
    url: r.html_url,
    stages: null // loaded lazily via fetchRunStages
  }));
  cacheSet(key, runs);
  return runs;
}

// Steps worth showing as pipeline stages (hides runner bookkeeping steps).
const HIDDEN_STEP = /^(set up job|complete job|post |run actions\/)/i;

export async function fetchRunStages(runId, signal) {
  const key = `gh-stages:${REPO}:${runId}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const data = await ghFetch(`/repos/${REPO}/actions/runs/${runId}/jobs`, signal);
  const stages = [];
  for (const job of data.jobs || []) {
    for (const step of job.steps || []) {
      if (HIDDEN_STEP.test(step.name)) continue;
      stages.push({
        name: step.name.toLowerCase(),
        status: normalizeStatus(step.conclusion, step.status)
      });
    }
  }
  cacheSet(key, stages);
  return stages;
}
