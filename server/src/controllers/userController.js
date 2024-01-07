import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import fs from "fs";

import { generateToken } from "../utils/generateTokens.js";
import User from "../models/user.js";
import { LOG_LEVEL } from "../utils/enums.js";
import Logger from "../logger.js";
Logger.setLevel(LOG_LEVEL.DEBUG);

export const register = asyncHandler(async (req, res) => {
  const { userName, password, email, profile } = req.body;
  const emailExists = await User.exists({ email: email });
  if (emailExists) {
    res.status(400);
    console.log("exist ");
    throw new Error("Email already exist");
  }
  const user = new User({
    userName: userName,
    password: password,
    email: email,
    profile: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.avatar,
    },
  });
  await user.save();

  user.password = undefined;

  res.send({
    success: true,
    message: "User successfully created.",
    user: { user },
  });
});

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
    throw new Error("Password incorrect");
  }

  user.token = generateToken(user.id);

  res.json({
    success: true,
    message: "User successfully logged in.",
    user: user,
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).select("-password");
  res.status(200).json({
    success: true,
    data: user,
  });
});
