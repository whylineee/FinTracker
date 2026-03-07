import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getAccessToken } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
