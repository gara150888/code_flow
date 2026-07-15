import { stream as streamGPT } from "@/module/gpt/v1";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const encoder = new TextEncoder();

  const responseStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamMessage(message)) {
          if (chunk) {
            controller.enqueue(encoder.encode(chunk));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function* streamMessage(message: string) {
  const generator = streamGPT(message);
  for await (const chunk of generator) {
    yield chunk;
  }
}
