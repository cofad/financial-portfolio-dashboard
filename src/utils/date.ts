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
  const parsedDate = parse(value, TIME_STRING_FORMAT, new Date());
  return isValid(parsedDate);
}

export function convertToDateString(date: Date): DateString {
  const dateString = format(date, DATE_STRING_FORMAT);

  if (!isDateString(dateString)) {
    throw new Error('Formatted date is not a valid DateString');
  }

  return dateString;
}

export function convertToTimeString(timeString: string): TimeString {
  if (!isTimeString(timeString)) {
    throw new Error('Formatted date is not a valid TimeString');
  }

  return timeString;
}

export function getNowIsoWithOffset(): string {
  return format(new Date(), TIME_STRING_FORMAT);
}
