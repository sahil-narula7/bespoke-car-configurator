import { NextResponse } from "next/server";

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

    return NextResponse.json(
      {
        ok: true,
        message: "Commission request received",
        receivedAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to process your request right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
