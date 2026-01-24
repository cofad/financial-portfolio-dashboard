/** Represents an ISO 8601 DateString */
export type DateString = string & { readonly __dateStringBrand: unique symbol };

export function isDateString(value: string): value is DateString {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
