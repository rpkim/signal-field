import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  adminPassword,
  signAdminToken,
} from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { password?: string };
    if (!body.password || body.password !== adminPassword()) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    const token = signAdminToken();
    const res = NextResponse.json({ ok: true });
    const opts = adminCookieOptions(token);
    res.cookies.set(opts);
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
