import { format, startOfMonth, endOfMonth, subMonths, isAfter, isBefore, parseISO } from 'date-fns'

export function formatDate(date: Date | string, formatStr: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function getMonthRange(monthsAgo: number = 0): { start: Date; end: Date } {
  const date = subMonths(new Date(), monthsAgo)
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  }
}

export function getCurrentMonthRange(): { start: Date; end: Date } {
  return getMonthRange(0)
}

export function getLast6MonthsLabels(): string[] {
  const labels: string[] = []
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    labels.push(format(date, 'MMM'))
  }
  return labels
}

export function isDateInRange(date: Date, start?: Date, end?: Date): boolean {
  if (start && isBefore(date, start)) return false
  if (end && isAfter(date, end)) return false
  return true
}

export function serializeDate(date: Date): string {
  return date.toISOString()
}

export function deserializeDate(dateStr: string): Date {
  return parseISO(dateStr)
}

