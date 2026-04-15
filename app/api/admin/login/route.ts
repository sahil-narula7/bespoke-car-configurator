import { NextRequest, NextResponse } from "next/server";
import {
  createOwnerSessionToken,
  getOwnerSessionCookieName,
  ownerLoginEnabled,
  validateOwnerCredentials,
} from "@/lib/admin-auth";

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as LoginBody;
    const username = payload.username?.trim() || "";
    const password = payload.password || "";

    if (!ownerLoginEnabled()) {
      return NextResponse.json(
        {
          error:
            "Owner login is not configured. Set OWNER_PASSWORD (and optionally OWNER_USERNAME).",
        },
        { status: 500 },
      );
    }

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    if (!validateOwnerCredentials(username, password)) {
      return NextResponse.json({ error: "Invalid owner credentials." }, { status: 401 });
    }

    const sessionToken = createOwnerSessionToken(username);
    const response = NextResponse.json({ success: true });

    response.cookies.set(getOwnerSessionCookieName(), sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Owner login error:", error);
    return NextResponse.json({ error: "Unable to process login right now." }, { status: 500 });
  }
}
