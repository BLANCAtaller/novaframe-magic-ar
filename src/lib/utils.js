import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num) {
  if (!num && num !== 0) return "";
  return new Intl.NumberFormat('en-US').format(num);
}
