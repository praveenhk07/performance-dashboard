"use client";

import React from "react";
import { useDashboardData } from "@/components/providers/DataProvider";
import { TimeRange } from "@/lib/types";

export const TimeRangeSelector: React.FC = () => {
  const { timeRange, setTimeRange } = useDashboardData();
  const ranges: TimeRange[] = ["1m", "5m", "1h", "all"];

  return (
    <div className="flex space-x-1 bg-zinc-950 p-1 rounded border border-zinc-800">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => setTimeRange(range)}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            timeRange === range
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {range.toUpperCase()}
        </button>
      ))}
    </div>
  );
};