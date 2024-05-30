import cors from "cors";

const origins = ["http://localhost:3000", "http://localhost:5000" , "http://localhost:3001"];

export const corsConfigFactory = () => {
  return cors({
    origin: origins,
    credentials: true,
  });
};
