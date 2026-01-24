import { format, isValid, parse } from 'date-fns';

const DATE_STRING_FORMAT = 'yyyy-MM-dd';
const TIME_STRING_FORMAT = "yyyy-MM-dd'T'HH:mm:ssxxx";

/** Represents an ISO 8601 TimeString */
export type TimeString = string & { readonly __timeStringBrand: unique symbol };

/** Represents an ISO 8601 DateString */
export type DateString = string & { readonly __dateStringBrand: unique symbol };

export function isDateString(value: string): value is DateString {
  const parsed = parse(value, DATE_STRING_FORMAT, new Date());
  return isValid(parsed) && format(parsed, DATE_STRING_FORMAT) === value;
}

export function isTimeString(value: string): value is TimeString {
  const parsed = parse(value, TIME_STRING_FORMAT, new Date());
  return isValid(parsed) && format(parsed, TIME_STRING_FORMAT) === value;
}

export function convertToDateString(date: Date): DateString {
  const dateString = format(date, DATE_STRING_FORMAT);

  if (!isDateString(dateString)) {
    throw new Error('Formatted date is not a valid DateString');
  }

  return dateString;
}

export function convertToTimeString(date: Date): TimeString {
  const timeString = format(date, TIME_STRING_FORMAT);

  if (!isTimeString(timeString)) {
    throw new Error('Formatted date is not a valid DateString');
  }

  return timeString;
}

export function getNowIsoWithOffset(): string {
  return format(new Date(), TIME_STRING_FORMAT);
}
