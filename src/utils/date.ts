export function getNowIso(): string {
  return new Date(Date.now()).toISOString();
}

export function formatDate(dateString: string): string {
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  return dateFormatter.format(new Date(dateString));
}
