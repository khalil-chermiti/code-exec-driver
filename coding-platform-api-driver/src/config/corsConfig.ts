import cors from "cors";

export const corsConfigFactory = () => {
  const origin = process.env.CORS_ORIGIN || "http://localhost:5173";
  return cors({
    origin: [origin , "http://localhost:5000"],
    credentials: true,
  });
};
