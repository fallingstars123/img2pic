export function reflect101(i: number, n: number): number {
  // valid indices: [0..n-1]
  if (n <= 1) return 0;
  while (i < 0 || i >= n) {
    if (i < 0) i = -i;
    if (i >= n) i = 2 * n - 2 - i;
  }
  return i;
}