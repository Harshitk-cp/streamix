import { Router } from "express";
import userRoutes from "./userRoutes.js";
import roomRoutes from "./roomRoutes.js";
import messageRoues from "./messageRoutes.js";

const apiRouter = Router();

apiRouter.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

apiRouter.use("/users", userRoutes);
apiRouter.use("/room", roomRoutes);
apiRouter.use("/messages", messageRoues);
apiRouter.use("/ingres", messageRoues);

export default apiRouter;
