"use client";
import { UrlCard } from "./_components/url-card";
import { KeyCard } from "./_components/key-card";
import { ConnectModal } from "./_components/connect-modal";
import { useEffect, useState } from "react";
import { getRoomFromId } from "@/app/api/rooms/room";

const KeysPage = () => {
  const [room, setRoom] = useState({});

  useEffect(() => {
    _getRoomById();
  }, []);

  const _getRoomById = async () => {
    const _user = JSON.parse(localStorage.getItem("user"));
    const authToken = localStorage.getItem("authToken");

    try {
      const roomReq = {
        roomId: _user.room,
        token: authToken,
      };
      const _room = await getRoomFromId(JSON.stringify(roomReq));
      setRoom(_room.room);
    } catch (error) {
      // console.log(error);
    }
  };

  if (!room) {
    throw new Error("Room not found");
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Keys & URLs</h1>
        <ConnectModal />
      </div>
      <div className="space-y-4">
        <UrlCard value={room.serverUrl} />
        <KeyCard value={room.streamKey} />
      </div>
    </div>
  );
};

export default KeysPage;
