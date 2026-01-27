export function isMobile(): boolean {
  return window.matchMedia('(max-width: 639px)').matches;
}
