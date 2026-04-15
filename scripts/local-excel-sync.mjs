#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import * as XLSX from "xlsx";

const API_URL = process.env.SUBMISSIONS_API_URL;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const OWNER_EXCEL_PATH = expandHome(
  process.env.OWNER_EXCEL_PATH || "~/Downloads/owner-commission-submissions.xlsx",
);
const STATE_FILE = expandHome(
  process.env.SYNC_STATE_FILE || "~/.commission-sync-state.json",
);
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS || 30000);

const REQUIRED_FIELDS = [
  "name",
  "email",
  "phone",
  "desiredCar",
  "investmentRange",
  "message",
  "submittedAt",
];

function expandHome(value) {
  if (!value || !value.startsWith("~/")) {
    return value;
  }
  return path.join(os.homedir(), value.slice(2));
}

function ensureParentDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readState() {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      return { processedHashes: [] };
    }
    const raw = fs.readFileSync(STATE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.processedHashes)) {
      return { processedHashes: [] };
    }
    return parsed;
  } catch {
    return { processedHashes: [] };
  }
}

function writeState(state) {
  ensureParentDir(STATE_FILE);
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}

function normalizeSubmission(input) {
  const normalized = {
    submittedAt: String(input.submittedAt || ""),
    name: String(input.name || ""),
    email: String(input.email || ""),
    phone: String(input.phone || ""),
    desiredCar: String(input.desiredCar || ""),
    investmentRange: String(input.investmentRange || ""),
    message: String(input.message || ""),
  };

  return normalized;
}

function getSubmissionHash(submission) {
  const payload = REQUIRED_FIELDS.map((key) => `${key}:${submission[key]}`).join("|");
  return crypto.createHash("sha256").update(payload).digest("hex");
}

async function fetchSubmissions() {
  if (!API_URL) {
    throw new Error(
      "Missing SUBMISSIONS_API_URL. Example: https://your-site.com/api/admin/submissions?format=json",
    );
  }

  const headers = {};
  if (ADMIN_TOKEN) {
    headers.Authorization = `Bearer ${ADMIN_TOKEN}`;
  }

  const response = await fetch(API_URL, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch submissions (${response.status}): ${body}`);
  }

  const data = await response.json();
  if (!data || !Array.isArray(data.submissions)) {
    throw new Error("Invalid API response. Expected JSON with a submissions array.");
  }

  return data.submissions.map(normalizeSubmission);
}

function readLocalRows() {
  if (!fs.existsSync(OWNER_EXCEL_PATH)) {
    return [];
  }

  const fileBuffer = fs.readFileSync(OWNER_EXCEL_PATH);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) {
    return [];
  }

  return XLSX.utils.sheet_to_json(sheet, { defval: "" }).map(normalizeSubmission);
}

function writeLocalRows(rows) {
  ensureParentDir(OWNER_EXCEL_PATH);

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: [
      "submittedAt",
      "name",
      "email",
      "phone",
      "desiredCar",
      "investmentRange",
      "message",
    ],
  });

  worksheet["!cols"] = [
    { wch: 22 },
    { wch: 20 },
    { wch: 30 },
    { wch: 16 },
    { wch: 20 },
    { wch: 20 },
    { wch: 48 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Commissions");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  fs.writeFileSync(OWNER_EXCEL_PATH, buffer);
}

function uniqueByHash(rows) {
  const seen = new Set();
  const output = [];

  for (const row of rows) {
    const hash = getSubmissionHash(row);
    if (seen.has(hash)) {
      continue;
    }
    seen.add(hash);
    output.push(row);
  }

  return output;
}

async function syncOnce() {
  const state = readState();
  const processedSet = new Set(state.processedHashes || []);

  const remoteRows = await fetchSubmissions();
  const newRows = remoteRows.filter((row) => !processedSet.has(getSubmissionHash(row)));

  if (newRows.length === 0) {
    console.log("No new submissions.");
    return;
  }

  const localRows = readLocalRows();
  const mergedRows = uniqueByHash([...localRows, ...newRows]);

  // Keep deterministic order for readability (oldest first).
  mergedRows.sort((a, b) =>
    String(a.submittedAt || "").localeCompare(String(b.submittedAt || "")),
  );

  writeLocalRows(mergedRows);

  const nextHashes = new Set(processedSet);
  for (const row of remoteRows) {
    nextHashes.add(getSubmissionHash(row));
  }

  // Bound state file growth.
  const boundedHashes = Array.from(nextHashes).slice(-50000);
  writeState({ processedHashes: boundedHashes });

  console.log(`Added ${newRows.length} new submission(s) to ${OWNER_EXCEL_PATH}`);
}

async function runWatchMode() {
  console.log(`Watching for new submissions every ${POLL_INTERVAL_MS}ms`);
  await syncOnce().catch((error) => {
    console.error(error.message || error);
  });

  setInterval(() => {
    syncOnce().catch((error) => {
      console.error(error.message || error);
    });
  }, POLL_INTERVAL_MS);
}

const watchMode = process.argv.includes("--watch");

if (watchMode) {
  runWatchMode();
} else {
  syncOnce().catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
