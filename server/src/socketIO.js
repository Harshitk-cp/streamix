import { Server } from "socket.io";
import Logger from "./logger.js";
import mongoose from "mongoose";
import {
  ADD_MESSAGE,
  UPDATE_ROOM_USERS,
  GET_ROOMS,
  GET_ROOM_USERS,
  FILTER_ROOM_USERS,
  CREATE_MESSAGE_CONTENT,
} from "./config/socketioActions.js";
import { joinRoom } from "./helpers/socketEvents.js";

let userTypings = {};

const initSocketIO = (httpServer) => {
  const io = new Server(httpServer, {
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    Logger.info("socket", `User connected: ${socket.id}`);
    let currentRoomId = null;

    socket.on("disconnect", async () => {
      Logger.info("socket", `User disconnected: ${socket.id}`);

      if (currentRoomId) {
        /** Filter through users and remove user from user list in that room */
        const roomState = await FILTER_ROOM_USERS({
          roomId: currentRoomId,
          socketId: socket.id,
        });

        socket.broadcast.to(currentRoomId).emit(
          "updateUserList",
          JSON.stringify(
            await GET_ROOM_USERS({
              room: {
                _id: mongoose.Types.ObjectId.createFromHexString(currentRoomId),
              },
            })
          )
        );

        socket.broadcast.emit(
          "updateRooms",
          JSON.stringify({
            room: await GET_ROOMS(),
          })
        );

        socket.broadcast.to(currentRoomId).emit(
          "receivedNewMessage",
          JSON.stringify(
            await ADD_MESSAGE({
              room: { _id: roomState.previous._id },
              user: null,
              content: CREATE_MESSAGE_CONTENT(roomState, socket.id),
              admin: true,
            })
          )
        );
      }
    });

    socket.on("userJoined", (data) => {
      currentRoomId = data.room._id;
      data.socketId = socket.id;
      joinRoom(socket, data);
    });

    socket.on("exitRoom", (data) => {
      currentRoomId = null;
      socket.leave(data.room._id, async () => {
        socket.to(data.room._id).emit(
          "updateRoomData",
          JSON.stringify({
            room: data.room,
          })
        );

        /** Update room list count */
        socket.broadcast.emit(
          "updateRooms",
          JSON.stringify({
            room: await GET_ROOMS(),
          })
        );

        io.to(data.room._id).emit("receivedUserExit", data.room);

        /** Send Exit Message back to room */
        socket.broadcast
          .to(data.room._id)
          .emit("receivedNewMessage", JSON.stringify(await ADD_MESSAGE(data)));
      });
    });

    socket.on("userTyping", (data) => {
      if (!userTypings[data.room._id]) {
        userTypings[data.room._id] = [];
      } else {
        if (!userTypings[data.room._id].includes(data.user.handle)) {
          userTypings[data.room._id].push(data.user.handle);
        }
      }

      socket.broadcast
        .to(data.room._id)
        .emit("receivedUserTyping", JSON.stringify(userTypings[data.room._id]));
    });

    socket.on("removeUserTyping", (data) => {
      if (userTypings[data.room._id]) {
        if (userTypings[data.room._id].includes(data.user.handle)) {
          userTypings[data.room._id] = userTypings[data.room._id].filter(
            (handle) => handle !== data.user.handle
          );
        }
      }

      socket.broadcast
        .to(data.room._id)
        .emit("receivedUserTyping", JSON.stringify(userTypings[data.room._id]));
    });

    socket.on("roomDeleted", async (data) => {
      io.to(data.room._id).emit("receivedNewMessage", JSON.stringify(data));
      io.to(data.room._id).emit("roomDeleted", JSON.stringify(data));
      io.emit("roomListUpdated", JSON.stringify(data));
    });

    socket.on("roomAdded", async (data) => {
      io.emit("roomAdded", JSON.stringify(data));
    });

    socket.on("roomUpdateEvent", async (data) => {
      io.in(data.room._id).emit("roomUpdated", JSON.stringify(data));
      io.emit("roomNameUpdated", JSON.stringify(data));
    });

    socket.on("reconnectUser", (data) => {
      currentRoomId = data.room._id;
      data.socketId = socket.id;
      if (socket.request.headers.referer.split("/").includes("room")) {
        socket.join(currentRoomId, async () => {
          socket.emit("reconnected");
          await UPDATE_ROOM_USERS(data);
        });
      }
    });
  });

  return io;
};

export default initSocketIO;
