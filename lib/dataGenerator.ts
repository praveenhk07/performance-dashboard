import { DataPoint } from "./types";

// Extract the literal union directly from DataPoint
export const CATEGORIES: DataPoint["category"][] = [
  "CPU",
  "Memory",
  "Network",
  "Disk",
];

let globalStep = 0;

function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateInitialDataset(count = 1000): DataPoint[] {
  const baseTimestamp = 1700000000000;
  const data: DataPoint[] = [];

  for (let i = 0; i < count; i++) {
    globalStep++;
    const noise = pseudoRandom(i) * 6 - 3;
    data.push({
      timestamp: baseTimestamp + i * 100,
      value: Math.sin(i / 50) * 35 + 50 + noise,
      category: CATEGORIES[i % CATEGORIES.length],
    });
  }

  return data;
}

export function generateDataBatch(count = 5): DataPoint[] {
  const now = Date.now();
  const batch: DataPoint[] = [];

  for (let i = 0; i < count; i++) {
    globalStep++;
    const noise = Math.random() * 6 - 3;
    batch.push({
      timestamp: now + i * 20,
      value: Math.sin(globalStep / 50) * 35 + 50 + noise,
      category: CATEGORIES[globalStep % CATEGORIES.length],
    });
  }

  return batch;
}