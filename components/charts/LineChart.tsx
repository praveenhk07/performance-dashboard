"use client";

import React, { useRef, useEffect } from "react";
import { DataPoint } from "@/lib/types";
import { setupCanvasDPI, drawLineChart } from "@/lib/canvasUtils";

export const LineChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const width = canvas.parentElement.clientWidth;
    const height = 240;
    const ctx = setupCanvasDPI(canvas, width, height);
    if (!ctx) return;

    // Convert DataPoint array into Float64Array for fast Canvas iteration
    const flatData = new Float64Array(data.length * 2);
    let minVal = Infinity;
    let maxVal = -Infinity;

    for (let i = 0; i < data.length; i++) {
      flatData[i * 2] = data[i].timestamp;
      flatData[i * 2 + 1] = data[i].value;
      if (data[i].value < minVal) minVal = data[i].value;
      if (data[i].value > maxVal) maxVal = data[i].value;
    }

    drawLineChart(ctx, flatData, width, height, minVal, maxVal);
  }, [data]);

  return (
    <div className="w-full h-[240px] bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
      <canvas ref={canvasRef} />
    </div>
  );
};