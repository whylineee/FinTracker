"use server";

import { redirect } from "next/navigation";

const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL ?? "http://127.0.0.1:8000";

function getFirstErrorMessage(payload: Record<string, unknown>) {
  const firstValue = Object.values(payload)[0];
  if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
    return firstValue[0];
  }
  if (typeof firstValue === "string") {
    return firstValue;
  }
  return null;
}

export async function registerAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

  if (!username || !password || !confirmPassword) {
    redirect("/register?error=missing");
  }

  if (password !== confirmPassword) {
    redirect("/register?error=password_mismatch");
  }

  let response: Response;
  try {
    response = await fetch(`${DJANGO_BASE_URL}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, confirmPassword }),
      cache: "no-store",
    });
  } catch {
    redirect("/register?error=backend");
  }

  if (!response.ok) {
    let message = "";
    try {
      const payload = (await response.json()) as Record<string, unknown>;
      message = getFirstErrorMessage(payload) ?? "";
    } catch {
      message = "";
    }

    if (message.toLowerCase().includes("username")) {
      redirect("/register?error=username");
    }

    redirect("/register?error=invalid");
  }

  redirect("/login?registered=1");
}
