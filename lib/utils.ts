import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function fmtViews(n: number): string {
  if (n >= 1_000_000) return (n/1_000_000).toFixed(2)+'M'
  if (n >= 1_000) return (n/1_000).toFixed(1)+'K'
  return String(n)
}
export function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})
}
