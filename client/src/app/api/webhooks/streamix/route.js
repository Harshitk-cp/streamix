import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { event } = body;

  if (event.event === "ingress_started") {
    await db.stream.update({
      where: {
        ingressId: event.ingressId,
      },
      data: {
        isLive: true,
      },
    });
  }

  if (event.event === "ingress_ended") {
    await db.stream.update({
      where: {
        ingressId: event.ingressId,
      },
      data: {
        isLive: false,
      },
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
