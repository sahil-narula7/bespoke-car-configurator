import { NextResponse } from "next/server";
import { addCommissionToExcel, type CommissionData } from "@/lib/excel";

type CommissionPayload = {
  name?: string;
  email?: string;
  phone?: string;
  desiredCar?: string;
  investmentRange?: string;
  message?: string;
};

const isValidEmail = (value: string) => /.+@.+\..+/.test(value);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CommissionPayload;

    const name = payload.name?.trim() ?? "";
    const email = payload.email?.trim() ?? "";
    const phone = payload.phone?.trim() ?? "";
    const desiredCar = payload.desiredCar?.trim() ?? "";
    const investmentRange = payload.investmentRange?.trim() ?? "";
    const message = payload.message?.trim() ?? "";

    if (!name || !email || !phone || !desiredCar || !investmentRange || !message) {
      return NextResponse.json(
        { error: "Please complete all required fields before submitting." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid private email address." },
        { status: 400 },
      );
    }

    // Save submission to Excel file
    const submissionData: CommissionData = {
      name,
      email,
      phone,
      desiredCar,
      investmentRange,
      message,
      submittedAt: new Date().toISOString(),
    };

    try {
      addCommissionToExcel(submissionData);
      console.log("✓ Commission submitted and saved to Excel");
    } catch (excelError) {
      console.error("Failed to save submission to Excel:", excelError);
      // Continue anyway - don't fail the request if Excel save fails
    }

    const receivedAt = new Date().toISOString();
    return NextResponse.json(
      {
        ok: true,
        message: "Commission request received",
        receivedAt,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Commission submission error:", error);
    return NextResponse.json(
      { error: "Unable to process your request right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
