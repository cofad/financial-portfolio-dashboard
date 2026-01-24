import { isDateString, type DateString } from '@/types/date-string';
import { format, isDate } from 'date-fns';

export function getNowIso(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function convertToDateString(date: Date): DateString {
  if (!isDate(date)) {
    throw new Error('Input is not a valid Date object');
  }

  const dateString = format(date, 'yyyy-MM-dd');

  if (!isDateString(dateString)) {
    throw new Error('Formatted date is not a valid DateString');
  }

  return dateString;
}

export function formatDate(dateString: string): string {
  const hasTime = /T\d{2}:\d{2}/.test(dateString);
  const date = hasTime ? new Date(dateString) : new Date(`${dateString}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: hasTime ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  return dateFormatter.format(date);
}
