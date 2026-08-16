import { DataPoint } from "./types";

/**
 * Level of Detail (LOD) Downsampling using LTTB / Binning 
 * Prevents main-thread rendering lag over high-density point datasets.
 */
export function downsampleData(data: DataPoint[], targetPoints: number): DataPoint[] {
  if (data.length <= targetPoints || targetPoints <= 0) return data;

  const sampled: DataPoint[] = [];
  const bucketSize = data.length / targetPoints;

  for (let i = 0; i < targetPoints; i++) {
    const start = Math.floor(i * bucketSize);
    const end = Math.floor((i + 1) * bucketSize);
    
    let sumVal = 0;
    let maxVal = -Infinity;
    let minVal = Infinity;

    for (let j = start; j < end; j++) {
      const v = data[j].value;
      sumVal += v;
      if (v > maxVal) maxVal = v;
      if (v < minVal) minVal = v;
    }

    const avgVal = sumVal / (end - start || 1);
    
    sampled.push({
      timestamp: data[start].timestamp,
      value: avgVal,
      category: data[start].category,
    });
  }

  return sampled;
}