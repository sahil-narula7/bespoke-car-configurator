import { NextResponse, NextRequest } from "next/server";
import { createExcelBuffer, getSubmissions } from "@/lib/excel";
import { isAuthenticatedAdminRequest } from "@/lib/admin-auth";

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
      const submissions = await getSubmissions(date);
      return NextResponse.json({
        success: true,
        count: submissions.length,
        date: date || "all",
        submissions,
      });
    }

    // Return Excel file for download
    const downloadDate = date || new Date().toISOString().split("T")[0];
    const submissions = await getSubmissions(downloadDate);

    if (!submissions.length) {
      return NextResponse.json(
        { error: "No submissions found for the specified date." },
        { status: 404 },
      );
    }

    const fileBuffer = createExcelBuffer(submissions);
    const filename = `commission-submissions-${downloadDate}.xlsx`;

    return new NextResponse(new Uint8Array(fileBuffer), {
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

    const submissions = await getSubmissions();

    return NextResponse.json({
      success: true,
      submissionCount: submissions.length,
      filesCount: null,
      submissionsDir: null,
      files: [],
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
