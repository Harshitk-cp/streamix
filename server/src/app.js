import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";
import connectDB from "./db/mongoose.js";
import passport from "passport";

import apiRoutes from "./routes/api.js";
import { notFound, errorHandler } from "./middlewares/error.js";
import { LOG_LEVEL } from "./utils/enums.js";
import Logger from "./logger.js";
import initSocketIO from "./socketIO.js";
import { createServer } from "http";
import configurePassport from "./config/passport.js";

config({ path: "./../.env" });
configurePassport(passport);
Logger.setLevel(LOG_LEVEL.DEBUG);

connectDB();

const route = "/api/v1";
const app = express();
const httpServer = createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(route, apiRoutes);
app.use(notFound);
app.use(errorHandler);

initSocketIO(httpServer);

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  Logger.info("server", `Running on port ${PORT}`);
});
