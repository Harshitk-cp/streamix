import {
  IngressAudioEncodingPreset,
  IngressInput,
  IngressClient,
  IngressVideoEncodingPreset,
  RoomServiceClient,
} from "livekit-server-sdk";

import { TrackSource } from "livekit-server-sdk";

import Room from "../models/Room.js";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL);

export const resetIngress = async (hostIdentity) => {
  const ingresses = await ingressClient.listIngress({
    roomName: hostIdentity,
  });

  const rooms = await roomService.listRooms([hostIdentity]);

  for (const room of rooms) {
    await roomService.deleteRoom(room.name);
  }

  for (const ingress of ingresses) {
    if (ingress.ingressId) {
      await ingressClient.deleteIngress(ingress.ingressId);
    }
  }
};

export const createIngress = async (selfId, selfName, roomId) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("Room not found");
  }

  await resetIngress(selfId);

  const options = {
    name: selfName,
    roomName: selfId,
    participantName: selfName,
    participantIdentity: selfId,
  };

  options.video = {
    source: TrackSource.CAMERA,
    preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
  };
  options.audio = {
    source: TrackSource.MICROPHONE,
    preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
  };

  const ingress = await ingressClient.createIngress(
    IngressInput.RTMP_INPUT,
    options
  );

  if (!ingress || !ingress.url || !ingress.streamKey) {
    return Error("Failed to create ingress");
  }

  room.ingressId = ingress.ingressId;
  room.serverUrl = ingress.url;
  room.streamKey = ingress.streamKey;
  await room.save();

  return ingress;
};
