import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";

import apiRoutes from "./routes/api.js";
import { notFound, errorHandler } from "./middlewares/error.js";
import { LOG_LEVEL } from "./utils/enums.js";
import Logger from "./logger.js";
config({ path: "./../.env" });
Logger.setLevel(LOG_LEVEL.DEBUG);

const app = express();

mongoose
  .connect(process.env.DB_URI, {})
  .then(() => Logger.info("server", `Connected to MongoDB`))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const route = "/api/v1";
app.use(route, apiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  Logger.info("server", `Running on port ${PORT}`);
});
