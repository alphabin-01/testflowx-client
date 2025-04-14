import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const xApiKeyHeader = (value: string) => {
  return {
    'X-API-Key': value
  }
}