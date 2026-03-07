import { type TxStatus } from "@/lib/django-api";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return usdFormatter.format(value);
}

export function formatSignedAmount(value: number, status: TxStatus): string {
  const base = usdFormatter.format(value);
  return status === "CREDIT" ? `+${base}` : `-${base}`;
}
