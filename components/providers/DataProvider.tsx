"use client";

import React, { createContext, useContext, useState } from "react";
import { DataFilter, DataPoint, TimeRange } from "@/lib/types";
import { useDataStream } from "@/hooks/useDataStream";

interface DataContextType {
  data: DataPoint[];
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  filter: DataFilter;
  setFilter: React.Dispatch<React.SetStateAction<DataFilter>>;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: React.ReactNode;
  initialData?: DataPoint[]; // ✅ added
}

export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  initialData = [],
}) => {
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("1m");
  const [filter, setFilter] = useState<DataFilter>({
    category: "ALL",
    minValue: 0,
    maxValue: 100,
    timeRange: "1m",
  });

  // If streaming, use live data; otherwise fallback to initialData
  const { data: streamData } = useDataStream(isStreaming);
  const data = isStreaming ? streamData : initialData;

  return (
    <DataContext.Provider
      value={{
        data,
        isStreaming,
        setIsStreaming,
        filter,
        setFilter,
        timeRange,
        setTimeRange,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDashboardData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDashboardData must be used within DataProvider");
  }
  return context;
};
