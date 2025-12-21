function detrend1d(x: Float32Array, win: number): Float32Array {
  let w = Math.max(3, win | 0);
  if ((w & 1) === 0) w += 1;

  const half = w >> 1;
  const sm = new Float32Array(x.length);

  // simple moving average with reflect borders
  for (let i = 0; i < x.length; i++) {
    let acc = 0;
    for (let t = -half; t <= half; t++) {
      let j = i + t;
      if (j < 0) j = -j;
      if (j >= x.length) j = 2 * x.length - 2 - j;
      acc += x[j]!;
    }
    sm[i] = acc / w;
  }

  const y = new Float32Array(x.length);
  let mean = 0;
  for (let i = 0; i < x.length; i++) {
    y[i] = x[i]! - sm[i]!;
    mean += y[i]!;
  }
  mean /= x.length;
  for (let i = 0; i < x.length; i++) y[i]! -= mean;
  return y;
}

function autocorrScore(x: Float32Array, lag: number): number {
  const n = x.length - lag;
  if (n <= 10) return -1e9;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i++) {
    const a = x[i]!;
    const b = x[i + lag]!;
    dot += a * b;
    na += a * a;
    nb += b * b;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
}

export function detectPixelSize(energyU8: Uint8Array, width: number, height: number, minS: number, maxS: number): number {
  // projections
  const px = new Float32Array(width);
  const py = new Float32Array(height);

  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    const row = y * width;
    for (let x = 0; x < width; x++) {
      const v = energyU8[row + x];
      px[x] += v;
      rowSum += v;
    }
    py[y] = rowSum;
  }

  const pxDt = detrend1d(px, Math.min(401, Math.max(31, ((width / 10) | 0) * 2 + 1)));
  const pyDt = detrend1d(py, Math.min(401, Math.max(31, ((height / 10) | 0) * 2 + 1)));

  let bestS = minS;
  let best = -1e9;
  for (let s = minS; s <= maxS; s++) {
    const sx = autocorrScore(pxDt, s);
    const sy = autocorrScore(pyDt, s);
    const score = sx + sy;
    if (score > best) {
      best = score;
      bestS = s;
    }
  }
  return bestS;
}

function smooth1dBox(x: Float32Array, win: number): Float32Array {
  const w = Math.max(1, win | 0);
  if (w <= 1) return x;
  const half = (w >> 1);
  const out = new Float32Array(x.length);

  for (let i = 0; i < x.length; i++) {
    let acc = 0;
    let cnt = 0;
    for (let t = -half; t <= half; t++) {
      const j = i + t;
      if (j >= 0 && j < x.length) {
        acc += x[j];
        cnt++;
      }
    }
    out[i] = acc / cnt;
  }
  return out;
}

export function detectPeaks1d(
  profile: Float32Array,
  gapSize: number,
  gapTolerance: number,
  minThresholdRatio: number,
  windowSize: number
): number[] {
  let maxV = 0;
  for (let i = 0; i < profile.length; i++) maxV = Math.max(maxV, profile[i]);
  if (maxV <= 0) return [];

  const threshold = minThresholdRatio * maxV;

  const w = Math.max(5, windowSize > 0 ? windowSize : Math.max(gapSize, 5));
  const step = Math.max(1, (gapSize / 2) | 0);

  const detected = new Set<number>();

  for (let start = 0; start <= profile.length - w; start += step) {
    const end = start + w;
    let localMax = -1e18;
    let localIdx = 0;
    for (let i = start; i < end; i++) {
      const v = profile[i];
      if (v > localMax) {
        localMax = v;
        localIdx = i;
      }
    }
    if (localMax < threshold) continue;

    const p = localIdx;
    const leftOk = p <= 0 || profile[p] > profile[p - 1];
    const rightOk = p >= profile.length - 1 || profile[p] > profile[p + 1];
    if (leftOk && rightOk) detected.add(p);
  }

  const peaks = Array.from(detected).sort((a, b) => a - b);
  if (peaks.length === 0) return [];

  // refine in neighborhood
  const refined: number[] = [];
  const rad = Math.max(1, (gapSize / 4) | 0);
  for (const p of peaks) {
    const s = Math.max(0, p - rad);
    const e = Math.min(profile.length, p + rad + 1);
    let best = -1e18;
    let bestIdx = p;
    for (let i = s; i < e; i++) {
      if (profile[i] > best) {
        best = profile[i];
        bestIdx = i;
      }
    }
    refined.push(bestIdx);
  }
  refined.sort((a, b) => a - b);

  // spacing filter
  const filtered: number[] = [refined[0]];
  for (let i = 1; i < refined.length; i++) {
    const p = refined[i];
    const last = filtered[filtered.length - 1];
    const spacing = p - last;
    if (Math.abs(spacing - gapSize) <= gapTolerance) filtered.push(p);
    else if (spacing > gapSize + gapTolerance) filtered.push(p);
  }
  return filtered;
}

export function detectGridLines(
  energyU8: Uint8Array,
  width: number,
  height: number,
  gapSize: number,
  gapTolerance: number,
  minEnergy: number,
  smoothWin: number,
  windowSize: number
): { xLines: number[]; yLines: number[] } {
  const xProf = new Float32Array(width);
  const yProf = new Float32Array(height);

  for (let y = 0; y < height; y++) {
    const row = y * width;
    let sum = 0;
    for (let x = 0; x < width; x++) {
      const v = energyU8[row + x];
      xProf[x] += v;
      sum += v;
    }
    yProf[y] = sum;
  }

  const xSm = smooth1dBox(xProf, smoothWin);
  const ySm = smooth1dBox(yProf, smoothWin);

  return {
    xLines: detectPeaks1d(xSm, gapSize, gapTolerance, minEnergy, windowSize),
    yLines: detectPeaks1d(ySm, gapSize, gapTolerance, minEnergy, windowSize),
  };
}

function medianGap(lines: number[], fallback: number): number {
  if (lines.length < 2) return fallback;
  const gaps: number[] = [];
  for (let i = 0; i < lines.length - 1; i++) gaps.push(lines[i + 1] - lines[i]);
  gaps.sort((a, b) => a - b);
  return gaps[(gaps.length / 2) | 0];
}

export function interpolateLines(lines: number[], limit: number, fallbackGap: number): number[] {
  if (lines.length === 0) return [];
  const typical = medianGap(lines, fallbackGap);

  const all: number[] = [...lines];

  // before
  if (lines[0] > typical) {
    const numBefore = Math.max(1, Math.round(lines[0] / typical) - 1);
    for (let k = 1; k <= numBefore; k++) {
      all.push((k * lines[0] / (numBefore + 1)) | 0);
    }
  }

  // gaps
  for (let i = 0; i < lines.length - 1; i++) {
    const a = lines[i], b = lines[i + 1];
    const gap = b - a;
    if (gap > typical * 1.5) {
      const numMissing = Math.max(1, Math.round(gap / typical) - 1);
      for (let k = 1; k <= numMissing; k++) all.push(a + ((k * gap / (numMissing + 1)) | 0));
    }
  }

  // after
  if (lines[lines.length - 1] < limit - typical) {
    const remain = limit - lines[lines.length - 1];
    const numAfter = Math.max(1, Math.round(remain / typical) - 1);
    for (let k = 1; k <= numAfter; k++) all.push(lines[lines.length - 1] + ((k * remain / (numAfter + 1)) | 0));
  }

  return Array.from(new Set(all)).sort((x, y) => x - y);
}

export function completeEdges(
  allLines: number[],
  limit: number,
  typicalGap: number,
  gapTolerance: number
): number[] {
  let lines = [...allLines].sort((a, b) => a - b);

  if (lines.length === 0) return [0, limit - 1];

  // extend left
  if (lines[0] > 0) {
    let x = lines[0];
    const edge: number[] = [];
    while (x > 0) {
      x -= typicalGap;
      if (x >= 0) edge.push(x);
    }
    lines = Array.from(new Set([...edge, ...lines])).sort((a, b) => a - b);
  }

  // extend right
  if (lines[lines.length - 1] < limit - 1) {
    let x = lines[lines.length - 1];
    const edge: number[] = [];
    while (x < limit - 1) {
      x += typicalGap;
      if (x < limit) edge.push(x);
    }
    lines = Array.from(new Set([...lines, ...edge])).sort((a, b) => a - b);
  }

  // filter by tolerance rule（近似你 Python 的过滤）
  const filtered: number[] = [lines[0]];
  for (let i = 1; i < lines.length; i++) {
    const spacing = lines[i] - lines[i - 1];
    if (Math.abs(spacing - typicalGap) <= gapTolerance || spacing > typicalGap + gapTolerance) {
      filtered.push(lines[i]);
    }
  }

  // ensure edges
  const out = Array.from(new Set(filtered)).sort((a, b) => a - b);
  if (out[0] !== 0) out.unshift(0);
  if (out[out.length - 1] !== limit - 1) out.push(limit - 1);
  return out;
}