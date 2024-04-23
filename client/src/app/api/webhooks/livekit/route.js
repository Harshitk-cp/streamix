import { WebhookReceiver } from "livekit-server-sdk";
import { headers } from "next/headers";
import { livekitWebhook } from "../../rooms/room";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export async function POST(req, res) {
  try {
    const body = await req.text();
    const headerPayload = headers();
    const authorization = headerPayload.get("Authorization");
    if (!authorization) {
      return new Response("No authorization header", { status: 400 });
    }
    const event = receiver.receive(body, authorization, true);

    if ((await event).event === "ingress_started") {
      const req = {
        ingressId: (await event).ingressInfo.ingressId,
        isLive: true,
      };
      await livekitWebhook(JSON.stringify(req));
    }

    if ((await event).event === "ingress_ended") {
      const req = {
        ingressId: (await event).ingressInfo.ingressId,
        isLive: false,
      };
      await livekitWebhook(JSON.stringify(req));
    }

    return new Response("success", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
