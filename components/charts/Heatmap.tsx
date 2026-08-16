"use client";

import React, { useRef, useEffect } from "react";
import { DataPoint } from "@/lib/types";
import { setupCanvasDPI } from "@/lib/canvasUtils";

export const Heatmap: React.FC<{ data: DataPoint[] }> = ({ data }) => {
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

    const cols = 40;
    const rows = 10;
    const cellW = width / cols;
    const cellH = height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dataIdx = (r * cols + c) % (data.length || 1);
        const val = data[dataIdx]?.value || 0;
        const alpha = Math.min(1, Math.max(0.1, val / 100));

        ctx.fillStyle = `rgba(147, 51, 234, ${alpha})`;
        ctx.fillRect(c * cellW, r * cellH, cellW - 1, cellH - 1);
      }
    }
  }, [data]);

  return (
    <div className="w-full h-[240px] bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
      <canvas ref={canvasRef} />
    </div>
  );
};