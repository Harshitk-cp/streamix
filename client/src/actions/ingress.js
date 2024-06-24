"use server";
import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";
import axios from "axios";
import { revalidatePath } from "next/cache";

export const createIngress = async () => {
  const self = await getSelf();

  try {
    const response = await axios.post(
      `${process.env.STREAMIX_API_URL}createIngress?roomId=${self.id}&roomName=${self.username}`,
      {}
    );

    const ingress = response.data.data;

    console.log("Ingress: ", ingress.ingressId);

    if (!ingress || !ingress.url || !ingress.streamKey) {
      throw new Error("Failed to create ingress");
    }

    await db.stream.update({
      where: { userId: self.id },
      data: {
        ingressId: ingress.ingressId,
        serverUrl: ingress.url,
        streamKey: ingress.streamKey,
      },
    });

    revalidatePath(`/u/${self.username}/keys`);
  } catch (error) {
    console.error("Error creating ingress: ", error);
    throw error;
  }
};
