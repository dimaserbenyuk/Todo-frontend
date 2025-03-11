"use client";

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn – объединяет и мерджит классы tailwind.
 * Пример:
 * cn("bg-red-500", "text-white", { "p-4": isActive })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
