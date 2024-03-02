import { createRoom } from "@/app/api/rooms/room";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateRoomModal = ({ onClose }) => {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");

  const onCreateRoom = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    const roomReq = {
      room_name: roomName,
      user: user._id,
      token: user.token,
      access: true,
    };

    const res = await createRoom(JSON.stringify(roomReq));

    if (res.success) {
      onClose();

      router.push(`/room/${res.room._id}`);
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-4 rounded-lg">
        <form onSubmit={onCreateRoom}>
          <div>
            {" "}
            <label htmlFor="roomName" className="block mb-2 text-white">
              Room Name:
            </label>
            <input
              type="text"
              className="mb-4 text-white"
              required
              onChange={(e) => setRoomName(e.target.value)}
            />
            <button type="submit" className="bg-purple-400 ml-4">
              Create Room
            </button>
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white p-2 ml-2 hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
