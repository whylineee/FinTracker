export type DashboardNavItem = {
  href: string;
  label: string;
  shortLabel: string;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { href: "/dashboard", label: "My Wallet", shortLabel: "Wallet" },
  { href: "/dashboard/cards", label: "My Card", shortLabel: "Card" },
  { href: "/dashboard/chart", label: "Finance Chart", shortLabel: "Chart" },
  { href: "/dashboard/transactions", label: "Recent Transactions", shortLabel: "Txns" },
];
