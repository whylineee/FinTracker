import { cookies } from "next/headers";

export const ACCESS_COOKIE = "ft_access";
export const REFRESH_COOKIE = "ft_refresh";

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value ?? null;
}

export async function setAuthCookies(access: string, refresh: string) {
  const cookieStore = await cookies();
  const common = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  cookieStore.set(ACCESS_COOKIE, access, { ...common, maxAge: 60 * 60 * 8 });
  cookieStore.set(REFRESH_COOKIE, refresh, { ...common, maxAge: 60 * 60 * 24 * 7 });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}
