import { Router } from "express";
import passport from "passport";

import {
  register,
  login,
  getUser,
  createViewerToken,
  getUserByName,
} from "../controllers/userController.js";

const router = Router();

router.route("/signup").post(register);

router.route("/login").post(login);

router.route("/id/:userId").get(getUser);

router.route("/name/:userName").get(getUserByName);

router.route("/createToken").post(createViewerToken);

// router.get("/google", customSocialAuthenticate("google"));

// /** Social Auth Callbacks */
// router.get(
//   "/google/redirect",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   google
// );

export default router;
