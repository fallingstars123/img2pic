export function quantileApprox(x: Float32Array, q: number, sampleMax = 200_000): number {
  const n = x.length;
  if (n === 0) return 0;

  const step = Math.max(1, Math.floor(n / sampleMax));
  const sample: number[] = [];
  for (let i = 0; i < n; i += step) sample.push(x[i]!);

  sample.sort((a, b) => a - b);
  const idx = Math.min(sample.length - 1, Math.max(0, Math.floor(q * (sample.length - 1))));
  return sample[idx] ?? 0;
}