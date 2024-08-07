import crypto from "crypto";
import axios, { HttpStatusCode } from "axios";
import { API_ENDPOINTS } from "./config/apiEndpoints.js";
import { PistonCodeExecutionResult, ResponseResult } from "./types.js";

const PISTON_JAVASCRIPT_CONFIG = {
  language: "typescript",
  version: "5.0.3",

};

const generateRandomFileName = (ext: string) => {
  return crypto.randomBytes(10).toString("hex") + ext;
};

export const pistonExecuteCodeApi = async (code: string, input: any): Promise<ResponseResult<PistonCodeExecutionResult>> => {
  try {
    const response = await axios.post<PistonCodeExecutionResult>(API_ENDPOINTS.PISTON.EXECUTE_CODE, {
      language: PISTON_JAVASCRIPT_CONFIG.language,
      version: PISTON_JAVASCRIPT_CONFIG.version,
      files: [
        {
          name: generateRandomFileName(".ts"),
          content: code,
        },
      ],
      stdin: JSON.stringify(input),
    });

    return {
      success: true,
      message: "Code Execution Finished Successfully",
      status: HttpStatusCode.Ok,
      data: response.data,
    };
  } catch (error) {
    console.error("Error in pistonExecuteCodeApi:", error);
    
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: "Axios Error: " + error.message,
        status: error.response?.status || HttpStatusCode.InternalServerError,
      };
    } else {
      // General error handling
      return {
        success: false,
        message: "Unexpected Error",
        status: HttpStatusCode.InternalServerError,
      };
    }
  }
};

