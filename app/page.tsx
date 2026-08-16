import { generateInitialDataset } from "@/lib/dataGenerator";
import { DataProvider } from "@/components/providers/DataProvider";
import DashboardContent from "@/components/DashboardContent"; // Move UI tree to Client Component

export default async function DashboardPage() {
  // Server-side generation for SSR requirement
  const initialData = generateInitialDataset(10000);

  return (
    <DataProvider initialData={initialData}>
      <DashboardContent />
    </DataProvider>
  );
}