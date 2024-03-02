import {
  ADD_MESSAGE,
  GET_MESSAGES,
  UPDATE_ROOM_USERS,
  GET_ROOMS,
  GET_ROOM_USERS,
} from "../config/socketioActions.js";

export const joinRoom = async (socket, data) => {
  socket.join(data.room._id);

  socket.emit(
    "updateRoomData",
    JSON.stringify({
      messages: GET_MESSAGES(data),
      room: UPDATE_ROOM_USERS(data),
    })
  );

  /** Get Room to update the user list for all other clients */
  socket.broadcast
    .to(data.room._id)
    .emit("updateUserList", JSON.stringify(await GET_ROOM_USERS(data)));

  /** Emit an event to all clients in the roomlist view except the sender */
  socket.emit(
    "updateRooms",
    JSON.stringify({
      room: await GET_ROOMS(),
    })
  );

  /** Emit back the message */
  socket.broadcast.to(data.room._id).emit(
    "receivedNewMessage",
    JSON.stringify(
      await ADD_MESSAGE({
        room: data.room,
        user: false,
        content: data.content,
        admin: data.admin,
      })
    )
  );
};
