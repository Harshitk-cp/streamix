import mongoose from "mongoose";
import Logger from "../logger.js";
import { config } from "dotenv";

config({ path: "./../.env" });
mongoose.Promise = global.Promise;

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI, {})
    .then(() => Logger.info("server", `Connected to MongoDB`))
    .catch((error) => console.log(error));
};

export default connectDB;
