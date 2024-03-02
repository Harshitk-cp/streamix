import passport from "passport";
import asyncHandler from "express-async-handler";

import Room from "../models/Room.js";
import { createErrorObject } from "../middlewares/auth.js";
import { LOG_LEVEL } from "../utils/enums.js";
import Logger from "../logger.js";
Logger.setLevel(LOG_LEVEL.DEBUG);

/**
 * @description GET /room
 */
export const getRoom = asyncHandler(async (req, res) => {
  const rooms = await Room.find({})
    .populate("user", ["handle"])
    .populate("users.lookup", ["handle"])
    .select("-password")
    .exec();

  if (rooms) {
    return res.status(200).json({ success: true, rooms: rooms });
  } else {
    return res.status(404).json({ error: "No Rooms Found" });
  }
});

/**
 * @description GET /room/:room_id
 */
export const getRoomFromId = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.room_id);

  if (room) {
    return res.status(200).json({ success: true, room: room });
  } else {
    return res.status(404).json({ error: `No room with given ID was found` });
  }
});

/**
 * @description POST /room
 */
export const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ name: req.body.room_name }).exec();
  if (room) {
    if (room.name === req.body.room_name) {
      return res.json({ error: "Roomname already taken" });
    }
  } else {
    const newRoom = new Room({
      name: req.body.room_name,
      user: req.user.id,
      access: req.body.password ? false : true,
      password: req.body.password,
    });

    if (newRoom.access === false) {
      newRoom.accessIds.push(req.user.id);
    }

    try {
      const savedRoom = await newRoom.save();
      const populatedRoom = await Room.populate(savedRoom, {
        path: "user",
        select: "username",
      });

      return res.status(200).json({ success: true, room: populatedRoom });
    } catch (err) {
      Logger.error("ROOM ROUTE", err);
      return res.json(err);
    }
  }
});

/**
 * @description POST /room/verify
 */
export const verifyRoom = asyncHandler(async (req, res) => {
  if (!req.body.password === true) {
    return res.json({
      errors: createErrorObject([
        {
          param: "password_required",
          msg: "Password is required",
        },
      ]),
    });
  }

  const room = await Room.findOne({ name: req.body.room_name }).exec();

  if (room) {
    const verified = await room.isValidPassword(req.body.password);

    if (verified === true) {
      room.accessIds.push(req.user.id);
      await room.save();
      return res.status(200).json({ success: true });
    } else {
      return res.json({
        errors: createErrorObject([
          {
            param: "invalid_password",
            msg: "Invalid Password",
          },
        ]),
      });
    }
  } else {
    return res
      .status(404)
      .json({ errors: `No room with name ${req.params.room_name} found` });
  }
});

/**
 * @description DELETE /room/:room_name
 */
export const deleteRoom = asyncHandler(async (req, res) => {
  try {
    const room = await Room.findOneAndDelete({ name: req.params.room_id })
      .populate("user", ["username"])
      .select("-password")
      .lean();

    if (room) {
      return res.status(200).json(room);
    } else {
      return res.status(404).json({
        errors: `No room with name ${req.params.room_id} found, You will now be redirected`,
      });
    }
  } catch (err) {
    return res.status(404).json(err);
  }
});

/**
 * @description PUT /room/update/:room_id
 */
export const updateRoom = asyncHandler(async (req, res) => {
  req
    .check("new_room_name")
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage("New Room Name must be between 3 and 20 characters");

  let errors = req.validationErrors();

  if (errors.length > 0) {
    return res.send({
      errors: createErrorObject(errors),
    });
  }

  const room = await Room.findOneAndUpdate(
    { name: req.body.room_name },
    { name: req.body.new_room_name },
    { fields: { password: 0 }, new: true }
  )
    .populate("user", ["username"])
    .populate("users.lookup", ["username"]);

  if (room) {
    return res.status(200).json(room);
  } else {
    return res
      .status(404)
      .json({ errors: `No room with name ${req.params.room_name} found` });
  }
});

/**
 * @description PUT /room/remove/users
 */
export const removeUser = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.body.room_id);

  if (room) {
    if (room.users.find((user) => user.lookup.toString() === req.user.id)) {
      room.users = room.users.filter(
        (user) => user.lookup.toString() !== req.user.id
      );
      await room.save();
    }
    const returnRoom = await Room.populate(room, {
      path: "user users.lookup",
      select: "username social image handle",
    });
    return res.status(200).json(returnRoom);
  } else {
    return res
      .status(404)
      .json({ errors: `No room with name ${req.params.room_name} found` });
  }
});

/**
 * @description PUT /room/remove/users/:id/all
 */
export const removeAllUser = asyncHandler(async (req, res) => {
  await Room.updateMany({ $pull: { users: { $in: [req.body.user_id] } } });

  const rooms = await Room.find({})
    .populate("user", ["username"])
    .populate("users.lookup", ["username"])
    .select("-password")
    .exec();

  if (rooms) {
    return res.status(200).json(rooms);
  } else {
    return res.status(404).json({ error: "No Rooms Found" });
  }
});
