import { Router } from "express";
import passport from "passport";

import { register, login, getUser } from "../controllers/userController.js";
import { customSocialAuthenticate } from "../middlewares/auth.js";
import { google } from "../config/socialAuthActions.js";

const router = Router();

router.route("/signup").post(register);

router.route("/login").post(login);

router
  .route("/:userId")
  .get(passport.authenticate("jwt", { session: false }), getUser);

// router.get("/google", customSocialAuthenticate("google"));

// /** Social Auth Callbacks */
// router.get(
//   "/google/redirect",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   google
// );

export default router;
