import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import fs from "fs";
import { v4 } from "uuid";

import { generateToken } from "../utils/generateTokens.js";
import User from "../models/user.js";
import { LOG_LEVEL } from "../utils/enums.js";
import Logger from "../logger.js";
import { AccessToken } from "livekit-server-sdk";
import Room from "../models/Room.js";
Logger.setLevel(LOG_LEVEL.DEBUG);

/**
 * @description POST /users/signup
 */
export const register = asyncHandler(async (req, res) => {
  const { userName, password, email, profile } = req.body;
  const emailExists = await User.exists({ email: email });
  if (emailExists) {
    res.status(400);
    throw new Error("Email already exist");
  }
  const room = new Room({
    name: `${userName} room`,
  });
  await room.save();

  const user = new User({
    userName: userName,
    password: password,
    email: email,
    profile: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.avatar,
    },
    room: room,
  });
  await user.save();

  room.user = user._id;
  room.save();

  user.password = undefined;

  res.send({
    success: true,
    message: "User successfully created.",
    user: { user },
  });
});

/**
 * @description POST /users/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const passwordMatching = await bcrypt.compare(password, user.password);

  if (!passwordMatching) {
    res.status(400);
    throw new Error("Incorrect Password ");
  }

  user.token = generateToken(user.id);

  res.json({
    success: true,
    message: "User successfully logged in.",
    user: user,
  });
});

/**
 * @description GET /users/id/:userId
 */
export const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).select("-password");
  console.log(user);
  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @description GET /users/name/:userName
 */
export const getUserByName = asyncHandler(async (req, res) => {
  const userName = req.params.userName;
  try {
    const user = await User.findOne({ userName: userName }).select("-password");

    const room = await Room.findById(user.room);
    const userWithRoom = { ...user.toJSON(), room };
    res.status(200).json({
      success: true,
      data: userWithRoom,
    });
  } catch (e) {
    console.log(e);
  }
});

/**
 * @description POST /users/createToken
 */
export const createViewerToken = asyncHandler(async (req, res) => {
  console.log(req.body);
  const host = await User.findById(req.body.hostId);
  if (!host) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  let self = {
    id: req.body.selfId,
    username: req.body.selfName,
  };

  if (!req.body.selfId) {
    const id = v4();
    const username = `guest#${Math.floor(Math.random() * 1000)}`;
    self = { id, username };
  }

  const isHost = req.body.selfId === req.body.hostId;

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: isHost ? `host-${self.id}` : self.id,
      name: self.username,
    }
  );

  token.addGrant({
    room: host.id,
    roomJoin: true,
    canPublish: false,
    canPublishData: true,
  });

  return res
    .status(200)
    .json({ success: true, token: await Promise.resolve(token.toJwt()) });
});
