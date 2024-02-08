import { Router } from "express";
import passport from "passport";

import {
  getRoom,
  getRoomFromId,
  createRoom,
  verifyRoom,
  deleteRoom,
  updateRoom,
  removeUser,
  removeAllUser,
} from "../controllers/roomController.js";
import { checkCreateRoomFields } from "../middlewares/auth.js";

const router = Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

router.route("/").get(authenticateJWT, getRoom);

router.route("/:room_id").get(authenticateJWT, getRoomFromId);

router.route("/").post([authenticateJWT, checkCreateRoomFields], createRoom);

router.route("/verify").post(authenticateJWT, verifyRoom);

router.route("/:room_name").delete(authenticateJWT, deleteRoom);

router.route("/update/name").put(authenticateJWT, updateRoom);

router.route("/remove/users").put(authenticateJWT, removeUser);

router.route("/remove/users/all").put(authenticateJWT, removeAllUser);

export default router;
