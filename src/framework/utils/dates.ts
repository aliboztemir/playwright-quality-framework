export function todayIso(): string {
  return new Date().toISOString().split('T')[0]!;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
