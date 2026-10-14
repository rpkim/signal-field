import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sf-admin";
const DAY = 60 * 60 * 24;

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "rpkimjay-signal-field-admin"
  );
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "rpkimjay";
}

export function signAdminToken(issuedAt = Date.now()) {
  const payload = `ok:${issuedAt}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !payload.startsWith("ok:")) return false;
  const issued = Number(payload.slice(3));
  if (!Number.isFinite(issued)) return false;
  // 30-day sessions
  if (Date.now() - issued > DAY * 1000 * 30) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminRequest(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

export function adminCookieOptions(token: string) {
  return {
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: DAY * 30,
    secure: process.env.NODE_ENV === "production",
  };
}
