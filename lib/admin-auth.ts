import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

type SessionPayload = {
  u: string;
  exp: number;
};

const OWNER_SESSION_COOKIE = "owner_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function getSessionSecret(): string {
  return process.env.AUTH_SESSION_SECRET || process.env.ADMIN_TOKEN || "local-dev-secret";
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function getOwnerUsername(): string {
  return process.env.OWNER_USERNAME || "owner";
}

function getOwnerPassword(): string {
  return process.env.OWNER_PASSWORD || process.env.ADMIN_TOKEN || "";
}

export function ownerLoginEnabled(): boolean {
  return getOwnerPassword().length > 0;
}

export function getOwnerSessionCookieName(): string {
  return OWNER_SESSION_COOKIE;
}

export function validateOwnerCredentials(username: string, password: string): boolean {
  const expectedUsername = getOwnerUsername();
  const expectedPassword = getOwnerPassword();

  if (!expectedPassword) {
    return false;
  }

  return safeEqual(username, expectedUsername) && safeEqual(password, expectedPassword);
}

export function createOwnerSessionToken(username: string): string {
  const payload: SessionPayload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyOwnerSessionToken(token: string | undefined): boolean {
  if (!token) {
    return false;
  }

  const [encodedPayload, providedSignature] = token.split(".");
  if (!encodedPayload || !providedSignature) {
    return false;
  }

  const expectedSignature = sign(encodedPayload);
  if (!safeEqual(providedSignature, expectedSignature)) {
    return false;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;
    return typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function isAuthenticatedAdminRequest(request: NextRequest): boolean {
  const adminToken = process.env.ADMIN_TOKEN;
  const authHeader = request.headers.get("authorization");

  // Keep bearer-token auth for scripts/automation.
  if (adminToken && authHeader === `Bearer ${adminToken}`) {
    return true;
  }

  const cookieValue = request.cookies.get(OWNER_SESSION_COOKIE)?.value;
  if (verifyOwnerSessionToken(cookieValue)) {
    return true;
  }

  // Development fallback: no configured credentials means open access.
  if (!adminToken && !ownerLoginEnabled()) {
    return true;
  }

  return false;
}
