"use client";

import { useEffect, useRef, useState } from "react";
import { DataPoint } from "@/lib/types";

const MAX_POINTS = 10000;

export function useDataStream(isStreaming: boolean) {
  const [data, setData] = useState<DataPoint[]>([]);
  const bufferRef = useRef<DataPoint[]>([]);

  // Hydrate seed data
  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          bufferRef.current = res.data;
          setData(res.data);
        }
      })
      .catch(console.error);
  }, []);

  // Process live stream
  useEffect(() => {
    if (!isStreaming) return;

    const eventSource = new EventSource("/api/data?stream=true");

    eventSource.onmessage = (event) => {
      try {
        const incoming: DataPoint[] = JSON.parse(event.data);
        const updated = [...bufferRef.current, ...incoming];

        // Maintain fixed memory ceiling via sliding window
        bufferRef.current =
          updated.length > MAX_POINTS
            ? updated.slice(updated.length - MAX_POINTS)
            : updated;

        setData(bufferRef.current);
      } catch (err) {
        console.error("Failed to parse SSE batch:", err);
      }
    };

    return () => eventSource.close();
  }, [isStreaming]);

  return { data, totalCount: data.length };
}