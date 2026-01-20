export function getNowIso(): string {
  return new Date(Date.now()).toISOString();
}
