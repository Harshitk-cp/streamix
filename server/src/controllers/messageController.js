import Message from "../models/Message.js";
import asyncHandler from "express-async-handler";
import { createErrorObject } from "../middlewares/auth.js";

/**
 * @description GET /api/messages/:room_id
 */
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ room: req.params.room_id });

  if (messages) {
    return res.status(200).json(messages);
  } else {
    return res.status(404).json({ error: "No messages found" });
  }
});

/**
 * @description POST /api/messages/
 */
export const newMessage = asyncHandler(async (req, res) => {
  let errors = [];

  if (!req.body.content) {
    errors.push({ param: "no_content", msg: "Message cannot be empty" });
    return res.json({ errors: createErrorObject(errors) });
  }

  const newMessage = new Message({
    content: req.body.content,
    admin: req.body.admin ? true : false,
    user: req.user.id,
    room: req.body.roomId,
  }).save();

  return res.status(200).json(newMessage);
});
