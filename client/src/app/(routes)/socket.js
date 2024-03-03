import { io } from "socket.io-client";

let socket = getSocket();

export function initializeSocket() {
  socket.on("connection", () => {
    console.log("Connected to the server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from the server");
  });

  socket.on("connect_error", (error) => {
    console.error("WebSocket connection error:", error);
  });
}

export function userJoined() {
  socket.emit("userJoined", {
    room: {
      _id: "65d040adc3004b522d973095",
    },
    user: {
      _id: "65c53ba6ed3ed3d5527f5fa6",
    },
    content: "new user added",
  });
}

export function sendNewMessage(data) {
  socket.emit("newMessage", data);
}

export function exitRoom() {
  socket.emit("userJoined", {
    room: {
      _id: "65d040adc3004b522d973095",
    },
    user: {
      _id: "65c53ba6ed3ed3d5527f5fa6",
    },
    content: "new user added",
  });
}

export function getSocket() {
  return io("ws://localhost:8000", {
    transports: ["websocket"],
  });
}

export default socket;
