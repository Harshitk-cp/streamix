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
  createNewIngress,
  livekitWebhook,
  getRoomFromName,
} from "../controllers/roomController.js";
import { checkCreateRoomFields } from "../middlewares/auth.js";

const router = Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

router.route("/").get(getRoom);

router.route("/:room_id").get(authenticateJWT, getRoomFromId);

router.route("/name/:roomName").get(getRoomFromName);

router.route("/").post([authenticateJWT], createRoom);

router.route("/verify").post(authenticateJWT, verifyRoom);

router.route("/:room_id").delete(authenticateJWT, deleteRoom);

router.route("/update/:room_id").put(authenticateJWT, updateRoom);

router.route("/remove/users").put(authenticateJWT, removeUser);

router.route("/remove/users/all").put(authenticateJWT, removeAllUser);

router.route("/createIngress").post(authenticateJWT, createNewIngress);

router.route("/webhooks/livekit").post(livekitWebhook);

export default router;
