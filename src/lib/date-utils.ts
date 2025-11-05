import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  isAfter,
  isBefore,
  isWithinInterval,
} from 'date-fns';

export function getMonthRange(date: Date = new Date()) {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

export function getLast12Months(): Date[] {
  const months: Date[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    months.push(subMonths(now, i));
  }
  
  return months;
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMM yyyy');
}

export function formatMonthShort(date: Date): string {
  return format(date, 'MMM');
}

export function isDateInRange(date: Date, start?: Date, end?: Date): boolean {
  if (!start && !end) return true;
  if (start && !end) return isAfter(date, start) || date.getTime() === start.getTime();
  if (!start && end) return isBefore(date, end) || date.getTime() === end.getTime();
  
  return isWithinInterval(date, { start: start!, end: end! });
}

export function serializeDate(date: Date): string {
  return date.toISOString();
}

export function deserializeDate(dateString: string): Date {
  return new Date(dateString);
}

