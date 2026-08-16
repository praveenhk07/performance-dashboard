import { DataPoint } from "./types";

const CATEGORIES = ["CPU", "Memory", "Network", "Disk"];

/**
 * Generates an initial historical block of points.
 */
export function generateInitialDataset(count = 10000): DataPoint[] {
  const now = Date.now();
  const data: DataPoint[] = [];

  for (let i = 0; i < count; i++) {
    data.push({
      timestamp: now - (count - i) * 100,
      value: Math.sin(i / 50) * 35 + 50 + (Math.random() * 10 - 5),
      category: CATEGORIES[i % CATEGORIES.length] as typeof CATEGORIES[number],
    });
  }

  return data;
}

/**
 * Generates continuous real-time streaming batches for SSE / API polling.
 */
export function generateDataBatch(count = 10): DataPoint[] {
  const now = Date.now();
  const batch: DataPoint[] = [];

  for (let i = 0; i < count; i++) {
    batch.push({
      timestamp: now,
      value: Math.floor(Math.random() * 80) + 10,
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    });
  }

  return batch;
}