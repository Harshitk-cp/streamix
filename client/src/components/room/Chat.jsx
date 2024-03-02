"use client";

import socket, { getSocket, userJoined } from "@/app/(routes)/socket";
import { getRoomFromId } from "@/app/api/rooms/room";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Chat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    joinRoom();
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

    const newMessageObject = {
      id: new Date().getTime(),
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessageObject]);
    setNewMessage("");
  };

  socket.on("updateRoomData", (data) => {
    console.log("Room data updated:", data);
  });

  socket.on("updateRooms", (data) => {
    console.log("Rooms updated:", data);
  });

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <div
        style={{
          border: "1px solid #ccc",
          minHeight: "300px",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        {messages.map((message) => (
          <div key={message.id} className="mb-10 text-white">
            <strong>{message.timestamp.toLocaleTimeString()}:</strong>{" "}
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
