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

/**
 * Get the path to the submissions directory
 */
export function getSubmissionsDir(): string {
  const dir = path.join(process.cwd(), "submissions");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Get the Excel file path for the current date
 */
export function getExcelFilePath(): string {
  const submissionsDir = getSubmissionsDir();
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  return path.join(submissionsDir, `commission-submissions-${today}.xlsx`);
}

/**
 * Add a commission submission to the Excel file
 */
export function addCommissionToExcel(data: CommissionData): void {
  try {
    const filePath = getExcelFilePath();
    let rows: CommissionData[] = [];

    // Load existing data if file exists
    if (fs.existsSync(filePath)) {
      try {
        const fileBuffer = fs.readFileSync(filePath);
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const existingData = XLSX.utils.sheet_to_json<CommissionData>(worksheet, {
          defval: "",
        });
        if (Array.isArray(existingData) && existingData.length > 0) {
          rows = existingData;
        }
      } catch (readError) {
        console.error("Error reading existing Excel file:", readError);
        rows = [];
      }
    }

    // Add new row
    rows.push(data);

    // Create new worksheet with all data (XLSX will auto-create headers)
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Style the header row
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

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 }, // submittedAt
      { wch: 20 }, // name
      { wch: 25 }, // email
      { wch: 15 }, // phone
      { wch: 20 }, // desiredCar
      { wch: 20 }, // investmentRange
      { wch: 40 }, // message
    ];

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Commissions");

    // Write to file using proper Node.js method
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    fs.writeFileSync(filePath, buffer);
    console.log(`✓ Commission saved to Excel: ${filePath}`);
  } catch (error) {
    console.error("Error saving commission to Excel:", error);
    throw error;
  }
}

/**
 * Get all submissions for a specific date or all dates
 */
export function getSubmissions(date?: string): CommissionData[] {
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
      return XLSX.utils.sheet_to_json<CommissionData>(worksheet);
    } catch (error) {
      console.error("Error reading Excel file:", error);
      return [];
    }
  }

  // Get all files
  const files = fs.readdirSync(submissionsDir);
  const allSubmissions: CommissionData[] = [];

  for (const file of files) {
    if (file.endsWith(".xlsx")) {
      try {
        const filePath = path.join(submissionsDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json<CommissionData>(worksheet);
        allSubmissions.push(...data);
      } catch (error) {
        console.error(`Error reading file ${file}:`, error);
      }
    }
  }

  return allSubmissions;
}
