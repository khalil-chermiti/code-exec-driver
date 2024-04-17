export const API_ENDPOINTS = {
  PISTON: {
    EXECUTE_CODE: process.env.PISTON_API!,
  },
  DB: {
    CONNECT: process.env.MONGO_URI,
    DB_NAME: process.env.MONGO_DB,
  },
  GET_PROBLEM: "/get-problem/:id",
  ADD_PROBLEM: "/add-problem",
  GET_PROBLEMS: "/get-problems",
  EXECUTE_CODE: "/execute",
  TEST_PROBLEM: "/test-problem"
};
