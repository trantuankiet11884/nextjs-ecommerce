import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumberWithDecimal = (number: number) => {
  const [int, decimal] = number.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : int;
};

export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");

const CURRENCY_FORMATTER = new Intl.NumberFormat("vi-VN", {
  currency: "VND",
  style: "currency",
  minimumFractionDigits: 3,
});

export function formatCurrency(amount: number | string) {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    throw new Error("Invalid amount value");
  }

  return CURRENCY_FORMATTER.format(numericAmount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("vi-VN");
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}
