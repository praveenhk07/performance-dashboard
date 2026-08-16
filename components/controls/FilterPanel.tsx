"use client";

import React from "react";
import { useDashboardData } from "@/components/providers/DataProvider";

export const FilterPanel: React.FC = () => {
  const { filter, setFilter, isStreaming, setIsStreaming } = useDashboardData();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
      <div className="flex items-center space-x-3">
        <label className="text-xs font-semibold text-zinc-400">Category Filter:</label>
        <select
          value={filter.category}
          onChange={(e) => setFilter((prev) => ({ ...prev, category: e.target.value }))}
          className="bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Categories</option>
          <option value="CPU">CPU</option>
          <option value="Memory">Memory</option>
          <option value="Network">Network</option>
          <option value="Disk">Disk</option>
        </select>
      </div>

      <button
        onClick={() => setIsStreaming(!isStreaming)}
        className={`px-4 py-1.5 text-xs font-medium rounded transition-colors ${
          isStreaming
            ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
        }`}
      >
        {isStreaming ? "Pause Stream" : "Resume Stream"}
      </button>
    </div>
  );
};