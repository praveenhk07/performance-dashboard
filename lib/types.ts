export interface DataPoint {
  timestamp: number;
  value: number;
  category: "CPU" | "Memory" | "Network" | "Disk";
  metadata?: Record<string, string | number>;
}

export type TimeRange = "1m" | "5m" | "1h" | "all";

export interface DataFilter {
  category: string;
  minValue: number;
  maxValue: number;
  timeRange: TimeRange;
}

export interface PerformanceMetrics {
  fps: number;
  memory: number; // in MB
  renderTime: number; // in ms
  dataPointCount: number;
}