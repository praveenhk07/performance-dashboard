import "@/app/globals.css";

export const metadata = {
  title: "Performance Monitoring Dashboard",
  description: "High-throughput 60 FPS Canvas Streaming Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}