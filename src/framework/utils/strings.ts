export function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function extractReference(text: string): string | null {
  const match = text.match(/S\d{5}/);
  return match ? match[0] : null;
}
