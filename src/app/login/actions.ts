"use server";

import { redirect } from "next/navigation";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth";

const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL ?? "http://127.0.0.1:8000";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!username || !password) {
    redirect("/login?error=missing");
  }

  let response: Response;
  try {
    response = await fetch(`${DJANGO_BASE_URL}/api/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });
  } catch {
    redirect("/login?error=backend");
  }

  if (!response.ok) {
    redirect("/login?error=invalid");
  }

  const data = (await response.json()) as { access?: string; refresh?: string };
  if (!data.access || !data.refresh) {
    redirect("/login?error=backend");
  }

  await setAuthCookies(data.access, data.refresh);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearAuthCookies();
  redirect("/login");
}
