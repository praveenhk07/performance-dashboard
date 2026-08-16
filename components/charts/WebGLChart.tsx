"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { DataPoint } from "@/lib/types";
import { setupCanvasDPI } from "@/lib/canvasUtils";

interface HoverInfo {
  x: number;
  y: number;
  point: DataPoint | null;
}

interface ZoomBounds {
  startIndex: number;
  endIndex: number;
}

export const WebGLChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  // Zoom and Pan state tracking
  const [zoomBounds, setZoomBounds] = useState<ZoomBounds | null>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const [dragSelection, setDragSelection] = useState<{ start: number; current: number } | null>(null);

  // Active dataset window (entire dataset or zoomed slice)
  const activeData = React.useMemo(() => {
    if (!zoomBounds || !data.length) return data;
    const start = Math.max(0, zoomBounds.startIndex);
    const end = Math.min(data.length, zoomBounds.endIndex);
    return data.slice(start, end);
  }, [data, zoomBounds]);

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const width = canvas.parentElement.clientWidth;
    const height = 240;
    const ctx = setupCanvasDPI(canvas, width, height);
    if (!ctx) return;

    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, width, height);

    if (activeData.length < 2) return;

    const padding = 20;
    const drawW = width - padding * 2;
    const drawH = height - padding * 2;

    // Direct Line Rendering
    ctx.beginPath();
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 1;

    const step = Math.max(1, Math.floor(activeData.length / drawW));

    for (let i = 0; i < activeData.length; i += step) {
      const pt = activeData[i];
      const x = padding + (i / (activeData.length - 1)) * drawW;
      const y = height - padding - (pt.value / 100) * drawH;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Render Drag Selection Overlay Box
    if (dragSelection) {
      const boxLeft = Math.min(dragSelection.start, dragSelection.current);
      const boxWidth = Math.abs(dragSelection.current - dragSelection.start);
      ctx.fillStyle = "rgba(6, 182, 212, 0.2)";
      ctx.strokeStyle = "rgba(6, 182, 212, 0.8)";
      ctx.fillRect(boxLeft, 0, boxWidth, height);
      ctx.strokeRect(boxLeft, 0, boxWidth, height);
    }

    // Render Crosshairs
    if (hoverInfo && hoverInfo.point && !dragSelection) {
      ctx.strokeStyle = "rgba(244, 244, 245, 0.4)";
      ctx.setLineDash([4, 4]);

      ctx.beginPath();
      ctx.moveTo(hoverInfo.x, 0);
      ctx.lineTo(hoverInfo.x, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, hoverInfo.y);
      ctx.lineTo(width, hoverInfo.y);
      ctx.stroke();

      ctx.setLineDash([]);
    }
  }, [activeData, hoverInfo, dragSelection]);

  // Mouse Handlers for Drag-to-Zoom
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    isDragging.current = true;
    dragStartX.current = mouseX;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !activeData.length) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging.current && dragStartX.current !== null) {
      setDragSelection({ start: dragStartX.current, current: mouseX });
      setHoverInfo(null);
    } else {
      const padding = 20;
      const drawW = rect.width - padding * 2;
      const clampedX = Math.max(padding, Math.min(rect.width - padding, mouseX));

      const pct = (clampedX - padding) / drawW;
      const index = Math.round(pct * (activeData.length - 1));
      const point = activeData[index] || null;

      setHoverInfo({ x: mouseX, y: mouseY, point });
    }
  };

  const handleMouseUp = () => {
    if (isDragging.current && dragSelection && data.length) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const padding = 20;
        const drawW = rect.width - padding * 2;

        const leftX = Math.min(dragSelection.start, dragSelection.current);
        const rightX = Math.max(dragSelection.start, dragSelection.current);

        // Calculate zoom ratio indices
        const startPct = Math.max(0, (leftX - padding) / drawW);
        const endPct = Math.min(1, (rightX - padding) / drawW);

        const currentLength = activeData.length;
        const startIndex = Math.floor(startPct * currentLength);
        const endIndex = Math.ceil(endPct * currentLength);

        if (endIndex - startIndex > 5) {
          setZoomBounds({ startIndex, endIndex });
        }
      }
    }

    isDragging.current = false;
    dragStartX.current = null;
    setDragSelection(null);
  };

  const handleResetZoom = useCallback(() => {
    setZoomBounds(null);
  }, []);

  return (
    <div className="relative w-full h-[240px] bg-zinc-900/50 rounded-lg p-2 border border-zinc-800 select-none">
      {/* Reset Zoom HUD Button */}
      {zoomBounds && (
        <button
          onClick={handleResetZoom}
          className="absolute top-3 right-3 z-20 px-2.5 py-1 text-[11px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded hover:bg-cyan-500/30 transition-colors"
        >
          Reset Zoom
        </button>
      )}

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setHoverInfo(null);
        }}
        className="cursor-crosshair w-full h-full"
      />

      {/* Crosshair Tooltip */}
      {hoverInfo && hoverInfo.point && !dragSelection && (
        <div
          className="absolute z-10 pointer-events-none bg-zinc-950/90 border border-zinc-700 px-3 py-1.5 rounded text-[11px] font-mono shadow-xl"
          style={{
            left: Math.min(hoverInfo.x + 10, (canvasRef.current?.clientWidth || 300) - 140),
            top: Math.max(10, hoverInfo.y - 40),
          }}
        >
          <div className="text-cyan-400 font-bold">{hoverInfo.point.category}</div>
          <div className="text-emerald-400">Val: {hoverInfo.point.value.toFixed(2)}</div>
          <div className="text-zinc-500">
            {new Date(hoverInfo.point.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};