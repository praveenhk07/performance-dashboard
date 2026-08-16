"use client";

import React, { useRef, useEffect } from "react";
import { DataPoint } from "@/lib/types";
import { setupCanvasDPI } from "@/lib/canvasUtils";

export const BarChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const width = canvas.parentElement.clientWidth;
    const height = 240;
    const ctx = setupCanvasDPI(canvas, width, height);
    if (!ctx) return;

    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, width, height);

    const categories = ["CPU", "Memory", "Network", "Disk"];
    const averages = categories.map((cat) => {
      const items = data.filter((d) => d.category === cat);
      if (!items.length) return 0;
      return items.reduce((acc, curr) => acc + curr.value, 0) / items.length;
    });

    const barWidth = (width - 100) / categories.length;
    const maxVal = 100;

    categories.forEach((cat, idx) => {
      const val = averages[idx];
      const barHeight = (val / maxVal) * (height - 60);
      const x = 50 + idx * (barWidth + 10);
      const y = height - 30 - barHeight;

      ctx.fillStyle = "#10b981";
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "12px sans-serif";
      ctx.fillText(cat, x + barWidth / 4, height - 10);
      ctx.fillText(`${val.toFixed(1)}%`, x + barWidth / 4, y - 5);
    });
  }, [data]);

  return (
    <div className="w-full h-[240px] bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
      <canvas ref={canvasRef} />
    </div>
  );
};