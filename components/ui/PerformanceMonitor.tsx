"use client";

import React from "react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

export const PerformanceMonitor: React.FC<{ pointCount: number }> = ({ pointCount }) => {
  const { fps, memory } = usePerformanceMonitor();

  return (
    <div className="flex items-center space-x-6 px-4 py-2 bg-zinc-900/90 border border-zinc-800 rounded-lg text-xs font-mono">
      <div className="flex items-center space-x-2">
        <span className="text-zinc-500">FPS:</span>
        <span className={fps >= 50 ? "text-emerald-400" : fps >= 30 ? "text-amber-400" : "text-rose-400"}>
          {fps}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-zinc-500">HEAP:</span>
        <span className="text-cyan-400">{memory ? `${memory} MB` : "N/A"}</span>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-zinc-500">NODES:</span>
        <span className="text-purple-400">{pointCount.toLocaleString()} pts</span>
      </div>
    </div>
  );
};