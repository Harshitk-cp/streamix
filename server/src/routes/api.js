import { Router } from "express";
import userRoutes from "./userRoutes.js";

const apiRouter = Router();

apiRouter.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

apiRouter.use("/users", userRoutes);

export default apiRouter;
