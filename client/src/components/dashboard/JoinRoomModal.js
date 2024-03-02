import { userJoined } from "@/app/(routes)/socket";
import { getRoomFromId } from "@/app/api/rooms/room";
import { useRouter } from "next/navigation";
import { useState } from "react";

const JoinRoomModal = ({ onClose }) => {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  const joinRoom = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");
    const roomReq = {
      roomId: roomId,
      token: authToken,
    };

    const res = await getRoomFromId(JSON.stringify(roomReq));

    if (res.success) {
      onClose();

      userJoined();

      router.push(`/room/${res.room._id}`);
    } else {
      setError("No room with given code found.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-gray-800 p-4 rounded-lg">
        <form onSubmit={joinRoom}>
          <label className="block mb-2 text-white">Paste your code here:</label>
          <div>
            <input
              type="text"
              className="mb-4 text-white"
              required
              onChange={(e) => setRoomId(e.target.value)}
            />

            <button type="submit" className="bg-purple-400 ml-4">
              Join Room
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

export default JoinRoomModal;
