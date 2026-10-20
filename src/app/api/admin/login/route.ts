import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminPassword,
  passwordMatches,
  signAdminToken,
} from "@/lib/adminAuth";

export async function POST(req: Request) {
  if (!adminPassword()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set" },
      { status: 503 }
    );
  }
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (!body.password || !passwordMatches(body.password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: signAdminToken(),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
