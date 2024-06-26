import rateLimit from "express-rate-limit";

export const rateLimiterFactory = () =>
  rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });
