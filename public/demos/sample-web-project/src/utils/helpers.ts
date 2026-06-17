export function formatDate(date: Date): string {
  return date.toISOString().replace("T", " ").slice(0, 19);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
