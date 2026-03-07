"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { createBudget, createTransaction, type TxStatus } from "@/lib/django-api";

function parseAmount(value: FormDataEntryValue | null): number {
  const raw = Number(value);
  if (!Number.isFinite(raw) || raw <= 0) {
    return 0;
  }
  return Math.round(raw);
}

export async function addTransactionAction(formData: FormData) {
  const token = await getAccessToken();
  if (!token) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const txDate = String(formData.get("txDate") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "DEBIT") as TxStatus;
  const amount = parseAmount(formData.get("amount"));

  if (!name || !type || !txDate || amount <= 0) {
    return;
  }

  const status: TxStatus = statusRaw === "CREDIT" ? "CREDIT" : "DEBIT";
  try {
    await createTransaction(token, {
      name,
      type,
      txDate,
      status,
      amount,
    });
  } catch {
    redirect("/login");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/chart");
  revalidatePath("/dashboard/transactions");
}

export async function addBudgetAction(formData: FormData) {
  const token = await getAccessToken();
  if (!token) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  const amount = parseAmount(formData.get("amount"));
  const total = parseAmount(formData.get("total"));

  if (!name || amount < 0 || total <= 0) {
    return;
  }

  try {
    await createBudget(token, {
      name,
      currentAmount: amount,
      targetAmount: total,
    });
  } catch {
    redirect("/login");
  }

  revalidatePath("/dashboard");
}
