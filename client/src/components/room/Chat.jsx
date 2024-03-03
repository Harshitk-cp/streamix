"use client";

import socket, {
  exitRoom,
  getSocket,
  sendNewMessage,
  userJoined,
} from "@/app/(routes)/socket";
import { createNewMessage, getMessages } from "@/app/api/rooms/messages";
import { getRoomFromId } from "@/app/api/rooms/room";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Chat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    getRoomMessages();
    joinRoom();

    // return () => {
    //   socket.off("updateRoomData", handleUpdateRoomData);
    //   socket.off("updateRooms", handleUpdateRooms);
    // };
  }, []);

  const joinRoom = async () => {
    try {
      userJoined();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessage();
    setNewMessage("");
  };

  const getRoomMessages = async () => {
    const authToken = localStorage.getItem("authToken");
    const roomReq = {
      roomId: "65d040adc3004b522d973095",
      token: authToken,
    };

    const res = await getMessages(JSON.stringify(roomReq));

    if (res.success) {
      setMessages(res.data);
    } else {
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const roomReq = {
      content: newMessage,
      user: { _id: user._id },
      room: { _id: "65d040adc3004b522d973095" },
      admin: true,
      //   token: user.token,
    };

    // const res = await createNewMessage(JSON.stringify(roomReq));

    // if (res.success) {
    //   console.log(res);
    sendNewMessage(roomReq);
    // } else {
    //   console.log("Failed to send message");
    // }
  };

  socket.on("updateRoomData", (data) => {
    // console.log("Room data updated:", data);
  });

  socket.on("updateRooms", (data) => {
    // console.log("Rooms updated:", data);
  });

  socket.on("receivedNewMessage", (data) => {
    setMessages([...messages, data]);
  });

  return (
    <div className="mx-20">
      <div
        style={{
          border: "1px solid #ccc",
          minHeight: "300px",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        {messages.map((message) => (
          <div key={message._id} className="mb-10 text-white">
            {/* <strong>{message.timestamp.toLocaleTimeString()}:</strong>{" "} */}
            {message.content}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 mr-5"
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "5px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
