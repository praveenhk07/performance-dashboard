import { NextResponse } from "next/server";
import {
  generateInitialDataset,
  generateDataBatch,
} from "@/lib/dataGenerator";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stream = searchParams.get("stream") === "true";

  // ------------------------------------------
  // NORMAL REQUEST
  // GET /api/data
  // ------------------------------------------
  if (!stream) {
    const data = generateInitialDataset(1000);

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  // ------------------------------------------
  // LIVE SSE STREAM
  // GET /api/data?stream=true
  // ------------------------------------------

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    start(controller) {
      let interval: ReturnType<typeof setInterval> | undefined;

      const sendBatch = () => {
        try {
          const batch = generateDataBatch(10);

          const chunk = `data: ${JSON.stringify(batch)}\n\n`;

          controller.enqueue(encoder.encode(chunk));
        } catch (error) {
          console.error("SSE stream error:", error);

          if (interval) {
            clearInterval(interval);
          }

          try {
            controller.close();
          } catch {
            // Controller may already be closed
          }
        }
      };

      // Send first batch immediately
      sendBatch();

      // Continue sending every 100ms
      interval = setInterval(sendBatch, 100);
    },

    cancel() {
      // Client closed the connection.
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}