import { SettingKegiatanTypes } from "@/types/WebsiteTypes";
import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns";
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

export function getInitials(programStudi: string): string {
  return programStudi
    .split(" ")                         
    .map(word => word[0].toUpperCase()) 
    .join("");                          
}



const TZ = 'Asia/Jakarta'

function asDate(d: string | Date) {
  return d instanceof Date ? d : new Date(d)
}

function formatDate(isoOrDate: string | Date, tz = TZ) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(asDate(isoOrDate))
}

function formatTime(isoOrDate: string | Date, tz = TZ) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(asDate(isoOrDate))
}

type OutputItem = {
  id: string
  title: string
  date: string         
  time: string         
  location: string
  category: string
  description: string
}



export function convertKegiatan(data: SettingKegiatanTypes[], tz = TZ): OutputItem[] {
  return data.map((item) => {
    const start = asDate(item.WaktuMulai)
    const end = asDate(item.WaktuSelesai ? item.WaktuSelesai : new Date())

    const dateStart = formatDate(start, tz)
    const dateEnd = formatDate(end, tz)

    const date = format(dateStart, 'PPP') // atau `${dateStart} → ${dateEnd}` bila ingin rentang

    const time = `${formatTime(start, tz)} - ${formatTime(end, tz)}`

    return {
      id: item.SettingKegiatanId,
      title: item.Nama,
      date,
      time,
      location: item.Lokasi ?? '',
      category: item.NamaJenis,
      description: item.Deskripsi ?? '',
      _startDate: start,
    }
  }).sort((a, b) => a._startDate.getTime() - b._startDate.getTime()) 
    .map(({ _startDate, ...rest }) => rest)
}