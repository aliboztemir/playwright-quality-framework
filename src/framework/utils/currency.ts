export function parseCurrencyAmount(formatted: string): number {
  const cleaned = formatted.replace(/[^0-9.,]/g, '').replace(',', '.');
  return parseFloat(cleaned);
}

export function formatAmount(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount);
}

export function amountsMatch(a: number, b: number, tolerance = 0.01): boolean {
  return Math.abs(a - b) <= tolerance;
}
