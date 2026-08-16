import { useState, useMemo } from "react";

interface VirtualizationOptions {
  itemHeight: number;
  viewportHeight: number;
  totalCount: number;
}

export function useVirtualization({ itemHeight, viewportHeight, totalCount }: VirtualizationOptions) {
  const [scrollTop, setScrollTop] = useState(0);

  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const visibleCount = Math.ceil(viewportHeight / itemHeight);
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
    const end = Math.min(totalCount, start + visibleCount + 4);
    const offset = start * itemHeight;

    return { startIndex: start, endIndex: end, offsetY: offset };
  }, [scrollTop, itemHeight, viewportHeight, totalCount]);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return { startIndex, endIndex, offsetY, onScroll, totalHeight: totalCount * itemHeight };
}