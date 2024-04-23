import { useEffect, useState } from "react";

export const useSavedRoom = () => {
  const [room, setRoom] = useState("");

  useEffect(() => {
    const _user = JSON.parse(localStorage.getItem("user"));
    const authToken = localStorage.getItem("authToken");

    const _getRoomById = async () => {
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

    _getRoomById();
  }, []);

  return room;
};
