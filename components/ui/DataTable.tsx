"use client";

import React from "react";
import { DataPoint } from "@/lib/types";

export const DataTable: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  const displayData = data.slice(-50).reverse();

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden font-mono text-xs">
      <div className="grid grid-cols-3 bg-zinc-950 px-4 py-2 font-semibold text-zinc-400 border-b border-zinc-800">
        <div>TIMESTAMP</div>
        <div>CATEGORY</div>
        <div>VALUE</div>
      </div>
      <div className="max-h-[200px] overflow-y-auto divide-y divide-zinc-800/50">
        {displayData.map((pt, idx) => (
          <div key={idx} className="grid grid-cols-3 px-4 py-1.5 text-zinc-300 hover:bg-zinc-800/30">
            <span>{new Date(pt.timestamp).toLocaleTimeString()}</span>
            <span className="text-cyan-400">{pt.category}</span>
            <span className="text-emerald-400">{pt.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};