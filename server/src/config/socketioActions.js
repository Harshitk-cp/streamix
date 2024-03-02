import Logger from "../logger.js";
import Message from "../models/Message.js";
import Room from "../models/Room.js";
import mongoose from "mongoose";

export const ADD_MESSAGE = async (data) => {
  const newMessage = await new Message({
    content: data.content,
    admin: data.admin ? true : false,
    user: data.user ? data.user._id : null,
    room: data.room._id,
  }).save();

  return Message.populate(newMessage, {
    path: "user",
    select: "username social handle image",
  });
};

export const GET_MESSAGES = async (data) => {
  return await Message.find({ room: data.room._id }).populate("user", [
    "username",
    "social",
    "handle",
    "image",
  ]);
};

export const CREATE_MESSAGE_CONTENT = (room, socketId) => {
  const user = room.previous.users.find((user) => user.socketId === socketId);

  return user && user.lookup.handle
    ? `${user.lookup.handle} has left ${room.updated.name}`
    : `Unknown User has left ${room.updated.name}`;
};

export const GET_ROOMS = async () => {
  return await Room.find({})
    .populate("user users.lookup", ["username", "social", "handle", "image"])
    .select("-password");
};

export const GET_ROOM_USERS = async (data) => {
  return await Room.findById(data.room._id)
    .populate("user users.lookup", ["username", "social", "handle", "image"])
    .select("-password");
};

export const UPDATE_ROOM_USERS = async (data) => {
  const room = await Room.findOne({ _id: data.room._id })
    .select("-password")
    .populate("users.lookup", ["username", "social", "handle", "image"]);

  if (room) {
    if (
      room.users &&
      !room.users.find((user) => user.lookup._id.toString() === data.user._id)
    ) {
      room.users.push({
        lookup: mongoose.Types.ObjectId.createFromHexString(data.user._id),
        socketId: data.socketId,
      });
      const updatedRoom = await room.save();
      return await Room.populate(updatedRoom, {
        path: "user users.lookup",
        select: "username social image handle",
      });
    } else {
      // Update user socket id if the user already exists
      const existingUser = room.users.find(
        (user) => user.lookup._id.toString() === data.user._id
      );
      if (existingUser.socketId != data.socketId) {
        existingUser.socketId = data.socketId;
        await room.save();
      }
      return await Room.populate(room, {
        path: "user users.lookup",
        select: "username social image handle",
      });
    }
  } else {
    return;
  }
};

export const FILTER_ROOM_USERS = async (data) => {
  const room = await Room.findById(
    mongoose.Types.ObjectId.createFromHexString(data.roomId)
  )
    .select("-password")
    .populate("users.lookup", ["username", "social", "handle", "image"]);
  if (room) {
    let previousUserState = Object.assign({}, room._doc);
    room.users = room.users.filter((user) => user.socketId !== data.socketId);
    const updatedRoom = await room.save();
    return {
      previous: previousUserState,
      updated: await Room.populate(updatedRoom, {
        path: "user users.lookup",
        select: "username social image handle",
      }),
    };
  }
};

export default {
  ADD_MESSAGE,
  GET_MESSAGES,
  CREATE_MESSAGE_CONTENT,
  GET_ROOMS,
  GET_ROOM_USERS,
  UPDATE_ROOM_USERS,
  FILTER_ROOM_USERS,
};
