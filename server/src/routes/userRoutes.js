import { Router } from "express";
import { register, login, getUser } from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.js";

const router = Router();

router.route("/signup").post(register);

router.route("/login").post(login);

router.route("/:userId").get(authMiddleware, getUser);

export default router;
