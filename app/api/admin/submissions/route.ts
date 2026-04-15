import { NextResponse, NextRequest } from "next/server";
import { getExcelFilePath, getSubmissionsDir, getSubmissions } from "@/lib/excel";
import { isAuthenticatedAdminRequest } from "@/lib/admin-auth";
import * as fs from "fs";
import * as path from "path";

/**
 * GET /api/admin/submissions - Download Excel file or get submissions list
 * Query params:
 * - date: specific date in YYYY-MM-DD format (optional)
 * - format: 'json' for JSON response, 'file' for Excel download (default: 'file')
 */
export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticatedAdminRequest(request)) {
      return NextResponse.json(
        { error: "Unauthorized access. Please login as owner or provide a valid admin token." },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date") || undefined;
    const format = searchParams.get("format") || "file";

    if (format === "json") {
      // Return submissions as JSON
      const submissions = getSubmissions(date);
      return NextResponse.json({
        success: true,
        count: submissions.length,
        date: date || "all",
        submissions,
      });
    }

    // Return Excel file for download
    const filePath = date
      ? path.join(getSubmissionsDir(), `commission-submissions-${date}.xlsx`)
      : getExcelFilePath();

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "No submissions found for the specified date." },
        { status: 404 },
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    const filename = path.basename(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Admin submissions error:", error);
    return NextResponse.json(
      { error: "Unable to retrieve submissions at this time." },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/test - Test Excel functionality (development only)
 */
export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticatedAdminRequest(request)) {
      return NextResponse.json(
        { error: "Unauthorized access. Please login as owner or provide a valid admin token." },
        { status: 401 },
      );
    }

    const submissions = getSubmissions();
    const submissionsDir = getSubmissionsDir();
    const files = fs.readdirSync(submissionsDir).filter((f) => f.endsWith(".xlsx"));

    return NextResponse.json({
      success: true,
      submissionCount: submissions.length,
      filesCount: files.length,
      submissionsDir,
      files,
      recentSubmissions: submissions.slice(-5),
    });
  } catch (error) {
    console.error("Admin test error:", error);
    return NextResponse.json(
      { error: "Unable to perform test at this time." },
      { status: 500 },
    );
  }
}
