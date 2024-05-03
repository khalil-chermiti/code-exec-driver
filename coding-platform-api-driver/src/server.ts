import "dotenv/config";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import { logger } from "./config/logger.js";
import { problemRouter } from "./ProblemRouter.js";
import { connectToDB } from "./config/db.config.js";
import { corsConfigFactory } from "./config/corsConfig.js";
import { rateLimiterFactory } from "./config/rateLimiter.js";
import { GlobalErrorHandler } from "./config/globalErrorHandler.js";

const app = express();

app.use(rateLimiterFactory());
app.use(corsConfigFactory());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(problemRouter);
app.use(GlobalErrorHandler);

const bootstrapServer = async () => {
  await connectToDB();

  app.listen(process.env.PORT, () => {
    logger.info("Server is running on port " + process.env.PORT + " 🚀");
  });
};

bootstrapServer();
