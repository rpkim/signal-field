import { NextResponse } from "next/server";
import { adminPassword, isAdminRequest } from "@/lib/adminAuth";

export async function GET() {
  if (!adminPassword()) {
    return NextResponse.json({ ok: false, error: "ADMIN_PASSWORD is not set" }, { status: 503 });
  }
  return NextResponse.json({ ok: await isAdminRequest() });
}
