const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL ?? "http://127.0.0.1:8000";

export type TxStatus = "CREDIT" | "DEBIT";

export type Wallet = {
  id: number;
  ownerName: string;
  balance: number;
};

export type Budget = {
  id: number;
  name: string;
  currentAmount: number;
  targetAmount: number;
  progressPercent: number;
};

export type Transaction = {
  id: number;
  name: string;
  type: string;
  txDate: string;
  status: TxStatus;
  amount: number;
};

export type CardActivity = {
  id: number;
  label: string;
  value: number;
  txDate: string;
};

export type DashboardOverview = {
  wallet: Wallet;
  budgets: Budget[];
  transactionsCount: number;
  recentTransactions: Transaction[];
  cardActivity: CardActivity[];
};

async function djangoFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${DJANGO_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
  if (!response.ok) {
    throw new Error(`DJANGO_API_ERROR_${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getDashboardOverview(token: string): Promise<DashboardOverview> {
  return djangoFetch<DashboardOverview>("/api/dashboard/overview/", token);
}

export async function listTransactions(token: string): Promise<Transaction[]> {
  return djangoFetch<Transaction[]>("/api/transactions/", token);
}

export async function createTransaction(
  token: string,
  payload: { name: string; type: string; txDate: string; status: TxStatus; amount: number },
) {
  return djangoFetch<Transaction>("/api/transactions/", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createBudget(
  token: string,
  payload: { name: string; currentAmount: number; targetAmount: number },
) {
  return djangoFetch<Budget>("/api/budgets/", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
