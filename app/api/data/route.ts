import { NextResponse } from "next/server";
import { generateDataBatch } from "@/lib/dataGenerator";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        try {
          const batch = generateDataBatch(10);
          const chunk = `data: ${JSON.stringify(batch)}\n\n`;
          controller.enqueue(encoder.encode(chunk));
        } catch {
          clearInterval(interval);
          controller.close();
        }
      }, 100);

      return () => clearInterval(interval);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}