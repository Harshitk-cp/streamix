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
import { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";

const Chat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    const _user = JSON.parse(localStorage.getItem("user"));
    setUser(_user);
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
      // console.log(error);
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
    const roomReq = {
      content: newMessage,
      user: { _id: user._id, userName: user.userName },
      room: { _id: "65d040adc3004b522d973095" },
      admin: true,
    };

    sendNewMessage(roomReq);
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
    <div
      className=" w-full"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages
          .filter(
            (message) =>
              message.user?.userName !== null &&
              message.user?.userName !== undefined
          )
          .map((message) => (
            <div key={message._id} className="mb-10 text-white">
              <MessageItem
                message={message.content}
                createdAt={message.created_at}
                name={message.user?.userName || ""}
                isSelf={message.user?._id == user._id}
              />
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

const ResizableChat = () => {
  const [minWidth, maxWidth, defaultWidth] = [200, 500, 350];
  const [width, setWidth] = useState(defaultWidth);
  const isResized = useRef(false);

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      if (!isResized.current) {
        return;
      }

      setWidth((previousWidth) => {
        const newWidth = previousWidth - e.movementX / 2;

        const isWidthInRange = newWidth >= minWidth && newWidth <= maxWidth;

        return isWidthInRange ? newWidth : previousWidth;
      });
    });

    window.addEventListener("mouseup", () => {
      isResized.current = false;
    });
  }, []);

  return (
    <div className="flex">
      <div
        className="w-4 cursor-col-resize bg-blue-500"
        onMouseDown={() => {
          isResized.current = true;
        }}
      />
      <div
        style={{
          width: `${width / 16}rem`,
        }}
      >
        <Chat />
      </div>
    </div>
  );
};

export default ResizableChat;
