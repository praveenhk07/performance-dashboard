"use client";

import React, { useRef, useEffect } from "react";
import { DataPoint } from "@/lib/types";
import { setupCanvasDPI } from "@/lib/canvasUtils";

export const ScatterPlot: React.FC<{ data: DataPoint[] }> = ({ data }) => {
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

    const padding = 30;
    const plotW = width - padding * 2;
    const plotH = height - padding * 2;

    data.forEach((pt, i) => {
      const x = padding + (i / (data.length || 1)) * plotW;
      const y = height - padding - (pt.value / 100) * plotH;

      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [data]);

  return (
    <div className="w-full h-[240px] bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
      <canvas ref={canvasRef} />
    </div>
  );
};