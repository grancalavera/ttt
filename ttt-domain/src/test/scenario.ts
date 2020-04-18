export const narrow = <T extends unknown>(scenarios: T[]) => (
  start?: number,
  end?: number
): T[] => (start === undefined ? scenarios : scenarios.slice(start, end));
