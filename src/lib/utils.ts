import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function replaceItemAtIndex<T>(arr: T[], index: number, newValue: T): T[] {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

export function removeItemAtIndex<T>(arr: T[], index: number): T[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function truncateText(text: string, length: number = 15): string {
  return text.length > length ? text.slice(0, length) + "..." : text;
}


export function formatDateToIndonesian(isoDateTime: string): string {
  const dateObject = new Date(isoDateTime);

  if (isNaN(dateObject.getTime())) {
    console.error(`Invalid date string provided: ${isoDateTime}`);
    return "Tanggal Tidak Valid";
  }
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const formattedDate = dateObject.toLocaleDateString('id-ID', options);

  return formattedDate;
}
