"use client";

import { useState, useEffect, useRef } from "react";

export interface PerformanceMetrics {
  fps: number;
  memory: number | null;
}

export function usePerformanceMonitor(): PerformanceMetrics {
  const [fps, setFps] = useState<number>(60);
  const [memory, setMemory] = useState<number | null>(null);

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const updateMetrics = () => {
      frameCount.current += 1;
      const now = performance.now();
      const delta = now - lastTime.current;

      // Update FPS calculation every second
      if (delta >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / delta));
        frameCount.current = 0;
        lastTime.current = now;

        // Extract JS Heap memory if available (Chrome / Edge)
        if ("memory" in performance) {
          const perfMemory = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
          setMemory(Math.round(perfMemory.usedJSHeapSize / (1024 * 1024)));
        }
      }

      animationFrameId.current = requestAnimationFrame(updateMetrics);
    };

    animationFrameId.current = requestAnimationFrame(updateMetrics);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return { fps, memory };
}