import { format, parseISO, getWeek, getYear, startOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale'

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'd MMMM yyyy', { locale: fr })
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'd MMM yyyy', { locale: fr })
  } catch {
    return dateStr
  }
}

export function getWeekNumber(date: Date = new Date()): number {
  return getWeek(date, { locale: fr, weekStartsOn: 1 })
}

export function getWeekYear(date: Date = new Date()): number {
  return getYear(date)
}

// Auto-determine A/B based on current week (week 1 = A, week 2 = B, alternating)
export function getAutoWeekType(date: Date = new Date()): 'A' | 'B' {
  const week = getWeek(date, { weekStartsOn: 1 })
  return week % 2 === 1 ? 'A' : 'B'
}

export function getWeekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 })
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}
