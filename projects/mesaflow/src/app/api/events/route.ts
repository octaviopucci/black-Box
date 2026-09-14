import { subscribe } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const establishmentId = url.searchParams.get("establishmentId");
  if (!establishmentId) {
    return new Response("establishmentId required", { status: 400 });
  }

  const encoder = new TextEncoder();
  let unsub: (() => void) | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      send({ type: "connected" });
      unsub = subscribe(establishmentId, (event) => send(event));
      heartbeat = setInterval(() => send({ type: "ping" }), 25000);
    },
    cancel() {
      if (heartbeat) clearInterval(heartbeat);
      unsub?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
