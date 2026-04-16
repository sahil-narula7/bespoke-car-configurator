import { getStore } from "@netlify/blobs";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

export type CommissionData = {
  name: string;
  email: string;
  phone: string;
  desiredCar: string;
  investmentRange: string;
  message: string;
  submittedAt: string;
};

const BLOB_STORE_NAME = "commission-submissions";
const BLOB_KEY = "submissions";

function hasBlobRuntime(): boolean {
  return Boolean(process.env.NETLIFY_BLOBS_CONTEXT);
}

function getBlobStore() {
  if (!hasBlobRuntime()) {
    return null;
  }

  try {
    return getStore(BLOB_STORE_NAME);
  } catch (error) {
    console.error("Unable to initialize Netlify Blobs store:", error);
    return null;
  }
}

/**
 * Get the path to the submissions directory for local development.
 */
export function getSubmissionsDir(): string {
  const dir = path.join(process.cwd(), "submissions");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Get the Excel file path for the current date in local development.
 */
export function getExcelFilePath(): string {
  const submissionsDir = getSubmissionsDir();
  const today = new Date().toISOString().split("T")[0];
  return path.join(submissionsDir, `commission-submissions-${today}.xlsx`);
}

function isSameDate(submission: CommissionData, date: string): boolean {
  return submission.submittedAt?.startsWith(date) ?? false;
}

function buildWorkbookBuffer(rows: CommissionData[]): Buffer {
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

  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_col(col) + "1";
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  }

  worksheet["!cols"] = [
    { wch: 20 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 40 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Commissions");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

function readLocalRows(date?: string): CommissionData[] {
  const submissionsDir = getSubmissionsDir();

  if (date) {
    const filePath = path.join(submissionsDir, `commission-submissions-${date}.xlsx`);
    if (!fs.existsSync(filePath)) {
      return [];
    }

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      return XLSX.utils.sheet_to_json<CommissionData>(worksheet, { defval: "" });
    } catch (error) {
      console.error("Error reading local Excel file:", error);
      return [];
    }
  }

  const files = fs.readdirSync(submissionsDir);
  const allSubmissions: CommissionData[] = [];

  for (const file of files) {
    if (!file.endsWith(".xlsx")) {
      continue;
    }

    try {
      const filePath = path.join(submissionsDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<CommissionData>(worksheet, { defval: "" });
      allSubmissions.push(...data);
    } catch (error) {
      console.error(`Error reading local file ${file}:`, error);
    }
  }

  return allSubmissions;
}

async function readBlobRows(): Promise<CommissionData[]> {
  const store = getBlobStore();
  if (!store) {
    return [];
  }

  try {
    const rows = (await store.get(BLOB_KEY, { type: "json" })) as CommissionData[] | null;
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    console.error("Error reading blob submissions:", error);
    return [];
  }
}

async function writeBlobRows(rows: CommissionData[]): Promise<void> {
  const store = getBlobStore();
  if (!store) {
    throw new Error("Netlify Blobs store is not available in this runtime.");
  }

  await store.setJSON(BLOB_KEY, rows);
}

/**
 * Add a commission submission to the persisted submission store.
 */
export async function addCommissionToExcel(data: CommissionData): Promise<void> {
  const store = getBlobStore();

  if (store) {
    const rows = await readBlobRows();
    rows.push(data);
    await writeBlobRows(rows);
    console.log(`✓ Commission saved to Netlify Blobs (${rows.length} total)`);
    return;
  }

  const filePath = getExcelFilePath();
  let rows: CommissionData[] = [];

  if (fs.existsSync(filePath)) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const existingData = XLSX.utils.sheet_to_json<CommissionData>(worksheet, { defval: "" });
      if (Array.isArray(existingData) && existingData.length > 0) {
        rows = existingData;
      }
    } catch (readError) {
      console.error("Error reading existing local Excel file:", readError);
      rows = [];
    }
  }

  rows.push(data);
  const buffer = buildWorkbookBuffer(rows);
  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Commission saved to Excel: ${filePath}`);
}

/**
 * Get all submissions for a specific date or all dates.
 */
export async function getSubmissions(date?: string): Promise<CommissionData[]> {
  const store = getBlobStore();

  if (store) {
    const rows = await readBlobRows();
    return date ? rows.filter((submission) => isSameDate(submission, date)) : rows;
  }

  return readLocalRows(date);
}

/**
 * Create an Excel workbook buffer from submission rows.
 */
export function createExcelBuffer(rows: CommissionData[]): Buffer {
  return buildWorkbookBuffer(rows);
}
