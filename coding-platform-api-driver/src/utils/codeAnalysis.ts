import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { pistonExecuteCodeApi } from "../pistonCodeExecutionApi.js";
import { ResponseResult, PistonCodeExecutionResult } from "../types.js";

// export const saveToFile = (code: string, fileName: string): string => {
//   try {
//     console.log("code", code);
//     console.log("file", fileName);
    
//     // Get the directory path of the current module
//     const currentDir = path.dirname(new URL(import.meta.url).pathname);
//     console.log("current", currentDir);

//     // Construct the file path relative to the module directory
//     const filePath = path.join(currentDir, "..", "..", "src", "codeSubmissions", fileName);
//     console.log("path", filePath);

//     console.log("filepath", filePath);
//     fs.writeFileSync(filePath, code);
    
//     return filePath;
//   } catch (error) {
//     console.error("Error saving file:", error);
//     throw error; 
//   }
// };

// export const runCoverage = (code: string): Promise<string> => {
//   try {
//     console.log("codeaaaaaaaaa", code);

//     const codeFilePath = saveToFile(code, "submittedCode.ts");
//     console.log("wiw", codeFilePath);
    
  
//     return new Promise((resolve, reject) => {
//       exec(`nyc --reporter=json mocha ${codeFilePath}`, (error, stdout, stderr) => {
//         if (error) {
//           reject(stderr);
//           console.log("eeee", codeFilePath);
//           console.log("kkkkk", codeFilePath);
//         } else {
//           resolve(stdout);
//           console.log("vvvvv", codeFilePath);
//           console.log("dffdfdf", stdout);
//         }
//       });
//       console.log("bbbbb", codeFilePath);
//     });
//   } catch (error) {
//     console.error("Error running code coverage:", error);
//     throw error; 
//   }
  
// };

// export const analyzeComplexity = (code: string): Promise<string> => {
//   try {
//     console.log("code", code);

//     const codeFilePath = saveToFile(code, "submittedCode.ts");
//     console.log("aaaaaaaa", codeFilePath);
  
//     return new Promise((resolve, reject) => {
//       exec(`plato -r -d report ${codeFilePath}`, (error, stdout, stderr) => {
//         if (error) {
//           reject(stderr);
//         } else {
//           resolve(stdout);
//         }
//       });
//     });
//   } catch (error) {
//     console.error("Error analyzing complexity :", error);
//     throw error; 
//   }
  
// };

export const executeCodeWithMetrics = async (mergedCode: string): Promise<any> => {
  const start = process.hrtime();

  const pistonExecutionResponse: ResponseResult<PistonCodeExecutionResult> = await pistonExecuteCodeApi(mergedCode);

  const end = process.hrtime(start);
  const executionTime = end[0] * 1000 + end[1] / 1000000; 

  if (!pistonExecutionResponse.success) {
    return {
      codeSubmitResult: "exception",
      errorMessage: pistonExecutionResponse.message,
      executionTime,
    };
  }

  const compileCode = pistonExecutionResponse.data.compile.code;
  const runCode = pistonExecutionResponse.data.run.code;

  let result;
  if (compileCode !== 0) {
    result = {
      codeSubmitResult: "exception",
      errorMessage: pistonExecutionResponse.data.compile.stdout,
      executionTime,
    };
  } else if (runCode !== 0) {
    result = {
      codeSubmitResult: "exception",
      errorMessage: pistonExecutionResponse.data.run.stdout || "No Returned Value!",
      executionTime,
    };
  } else {
    try {
      const resultAsJson = JSON.parse(pistonExecutionResponse.data.run.stdout);
      result = {
        codeSubmitResult: "success",
        testCases: resultAsJson,
        executionTime,
      };
    } catch (e) {
      result = {
        codeSubmitResult: "exception",
        errorMessage: "Problem while executing your code",
        executionTime,
      };
    }
  }

  return result;
};
