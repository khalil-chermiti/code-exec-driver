import mongoose from "mongoose";
import { API_ENDPOINTS } from "./apiEndpoints.js";
import { logger } from "./logger.js";

mongoose.connection.on("connected", () => {
  logger.info("Connected to MongoDB successfully 🍃");
});

mongoose.connection.on("error", (err: any) => {
  logger.error("Error connecting to MongoDB : ", err);
});

export const connectToDB = async () => {
  mongoose.connect(API_ENDPOINTS.DB.CONNECT!, {
    dbName: API_ENDPOINTS.DB.DB_NAME,
  });
};
