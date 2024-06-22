"use client";

import { getRooms } from "@/app/api/rooms/room";
import { useEffect, useState } from "react";
import JoinRoomModal from "./JoinRoomModal";
import CreateRoomModal from "./CreateRoomModel";
import { initializeSocket } from "@/app/(routes)/socket";
import { Sidebar } from "../../app/(dashboard)/u/[username]/_components/sidebar";
import { Container } from "../../app/(dashboard)/u/[username]/_components/container";

export default function DashBoard() {
  const [joinRoomModalVisible, setJoinRoomModalVisible] = useState(false);
  const [createRoomModalVisible, setCreateRoomModalVisible] = useState(false);
  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    _getRooms();
    initSocket();
  }, []);

  const initSocket = async () => {
    initializeSocket();
  };

  const _getRooms = async () => {
    const authToken = localStorage.getItem("authToken");
    const roomReq = {
      token: authToken,
    };

    const res = await getRooms(JSON.stringify(roomReq));

    if (res.success) {
      setRoomData(res.rooms);
    } else {
      // console.log(res.error);
    }
  };

  const openJoinRoomModal = () => {
    setJoinRoomModalVisible(true);
  };

  const closeJoinRoomModal = () => {
    setJoinRoomModalVisible(false);
  };

  const openCreateRoomModal = () => {
    setCreateRoomModalVisible(true);
  };

  const closeCreateRoomModal = () => {
    setCreateRoomModalVisible(false);
  };

  return (
    <>
      <div className="bg-gray-800 shadow-lg p-4 text-white absolute left-0 top-0 bottom-0 z-10">
        <button
          onClick={openJoinRoomModal}
          className="bg-transparent hover:bg-transparent"
        >
          Join Room
        </button>
        <button
          onClick={openCreateRoomModal}
          className="bg-transparent hover:bg-transparent"
        >
          Create Room
        </button>
      </div>
      <div className="flex h-full pt-20">
        <Sidebar />
        <Container>
          <div className="ml-64">
            {" "}
            {joinRoomModalVisible && (
              <JoinRoomModal onClose={closeJoinRoomModal} />
            )}
            {createRoomModalVisible && (
              <CreateRoomModal onClose={closeCreateRoomModal} />
            )}
            <div className="grid grid-cols-3 gap-4 p-4">
              {roomData.map((room) => (
                <div key={room._id} className="bg-white p-4 border">
                  <p>{room.name}</p>
                  <p>{room._id}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </>
    // <div>
    //   <div className="bg-gray-800 shadow-lg p-4 text-white absolute left-0 top-0 bottom-0 z-10">
    //     <button
    //       onClick={openJoinRoomModal}
    //       className="bg-transparent hover:bg-transparent"
    //     >
    //       Join Room
    //     </button>
    //     <button
    //       onClick={openCreateRoomModal}
    //       className="bg-transparent hover:bg-transparent"
    //     >
    //       Create Room
    //     </button>
    //   </div>
    //   <div>
    //     <Sidebar />

    //     <div className="ml-64">
    //       {" "}
    //       {joinRoomModalVisible && (
    //         <JoinRoomModal onClose={closeJoinRoomModal} />
    //       )}
    //       {createRoomModalVisible && (
    //         <CreateRoomModal onClose={closeCreateRoomModal} />
    //       )}
    //       <div className="grid grid-cols-3 gap-4 p-4">
    //         {roomData.map((room) => (
    //           <div key={room._id} className="bg-white p-4 border">
    //             <p>{room.name}</p>
    //             <p>{room._id}</p>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
