export function formatPercent(value: number, precision = 2): string {
  return `${value.toFixed(precision)}%`;
}
