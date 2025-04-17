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

export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  } catch {
    return 'Invalid date';
  }
}; 