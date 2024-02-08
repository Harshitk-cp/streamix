import { Router } from "express";
import passport from "passport";

import { getMessages, newMessage } from "../controllers/messageController.js";
import { checkCreateRoomFields } from "../middlewares/auth.js";

const router = Router();
const authenticateJWT = passport.authenticate("jwt", { session: false });

router.route("/:room_id").get(authenticateJWT, getMessages);

router.route("/").get(authenticateJWT, newMessage);

export default router;
