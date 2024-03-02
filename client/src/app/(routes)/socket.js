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

  socket.on("updateRoomData", (data) => {
    console.log("User joined:", data);
    // Handle the data or trigger a state update in your component
  });

  socket.on("updateRooms", (data) => {
    console.log("User joined:", data);
    // Handle the data or trigger a state update in your component
  });
}

export function userJoined() {
  // socket = getSocket();

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
