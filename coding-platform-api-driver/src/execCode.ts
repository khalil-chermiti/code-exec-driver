import axios from "axios";
import crypto from "crypto";
import { CodeExecutionResult } from "./types.js";

export const executeCode = async (code: string) => {
  const randomString = crypto.randomBytes(30).toString("hex");
  const fileName = randomString + languageVersion.javascript.extension;

  const response = await axios.post<CodeExecutionResult>(
    "http://localhost:2000/api/v2/execute",
    {
      language: "typescript",
      version: "5.0.3",
      files: [
        {
          name: fileName,
          content: code,
        },
      ],
    },
  );

  return response.data;
};

const languageVersion = {
  javascript: {
    extension: ".js",
    version: "5.0.3",
  },
};
