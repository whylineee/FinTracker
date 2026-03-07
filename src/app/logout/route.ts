import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";

export async function GET(request: Request) {
  await clearAuthCookies();
  return NextResponse.redirect(new URL("/login", request.url));
}
