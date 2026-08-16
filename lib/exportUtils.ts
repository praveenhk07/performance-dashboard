import { DataPoint } from "./types";

/**
 * Downloads current buffered state as a CSV file.
 */
export function exportToCSV(data: DataPoint[], filename = "stream-snapshot.csv") {
  if (!data.length) return;

  const headers = ["Timestamp,Category,Value\n"];
  const rows = data.map((d) => `${d.timestamp},${d.category},${d.value}`);
  const blob = new Blob([headers.concat(rows.join("\n")).join("")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}