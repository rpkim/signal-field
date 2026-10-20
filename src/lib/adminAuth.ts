import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sf-admin";
const DAY = 60 * 60 * 24;

export function adminPassword() {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.trim() ? value : null;
}

function sign(payload: string) {
  const key = adminPassword();
  if (!key) return "";
  return createHmac("sha256", key).update(payload).digest("hex");
}

function sameSecret(input: string, expected: string) {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function passwordMatches(input: string) {
  const expected = adminPassword();
  if (!expected) return false;
  return sameSecret(input, expected);
}

export function signAdminToken(issuedAt = Date.now()) {
  const payload = `ok:${issuedAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined | null) {
  if (!token || !adminPassword()) return false;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payload.startsWith("ok:") || !sig) return false;
  const issued = Number(payload.slice(3));
  if (!Number.isFinite(issued) || Date.now() - issued > DAY * 1000 * 30) return false;
  const expected = sign(payload);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminRequest() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}
