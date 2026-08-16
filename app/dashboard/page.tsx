"use client";

import React from "react";
import { DataProvider, useDashboardData } from "@/components/providers/DataProvider";
import { WebGLChart } from "@/components/charts/WebGLChart";
import { BarChart } from "@/components/charts/BarChart";
import { ScatterPlot } from "@/components/charts/ScatterPlot";
import { Heatmap } from "@/components/charts/Heatmap";
import { FilterPanel } from "@/components/controls/FilterPanel";
import { TimeRangeSelector } from "@/components/controls/TimeRangeSelector";
import { DataTable } from "@/components/ui/DataTable";
import { PerformanceMonitor } from "@/components/ui/PerformanceMonitor";

function DashboardContent() {
  const { data, filter } = useDashboardData();

  const filteredData = React.useMemo(() => {
    if (filter.category === "ALL") return data;
    return data.filter((d) => d.category === filter.category);
  }, [data, filter.category]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Header & Real-time HUD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            Performance Monitoring Dashboard
          </h1>
          <p className="text-xs text-zinc-400">
            High-throughput 60 FPS real-time Canvas streaming engine
          </p>
        </div>
        <PerformanceMonitor pointCount={filteredData.length} />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <FilterPanel />
        </div>
        <TimeRangeSelector />
      </div>

      {/* 4 Canvas Chart Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <span className="text-xs font-mono text-zinc-400">REALTIME WEBGL STREAM (DRAG TO ZOOM)</span>
          <WebGLChart data={filteredData} />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono text-zinc-400">CATEGORY AVERAGES</span>
          <BarChart data={filteredData} />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono text-zinc-400">DISTRIBUTION SCATTER</span>
          <ScatterPlot data={filteredData} />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono text-zinc-400">INTENSITY HEATMAP</span>
          <Heatmap data={filteredData} />
        </div>
      </div>

      {/* Virtualized Data Grid */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-zinc-400">VIRTUALIZED RAW STREAM INSPECTOR</span>
        <DataTable data={filteredData} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
}