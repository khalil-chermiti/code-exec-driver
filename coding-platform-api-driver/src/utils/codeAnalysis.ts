import { pistonExecuteCodeApi } from "../pistonCodeExecutionApi.js";
import { ResponseResult, PistonCodeExecutionResult } from "../types.js";
import { estimateAlgorithmicComplexity } from "../algorithmicComplexity.js";

export const executeCodeWithMetrics = async (mergedCode: string, input: any): Promise<any> => {
  const start = process.hrtime();

  const pistonExecutionResponse: ResponseResult<PistonCodeExecutionResult> = await pistonExecuteCodeApi(mergedCode, input);

  const end = process.hrtime(start);
  const executionTime = end[0] * 1000 + end[1] / 1000000;

  if (!pistonExecutionResponse.success) {
    return {
      codeSubmitResult: 'exception',
      errorMessage: pistonExecutionResponse.message,
      executionTime,
    };
  }

  const compileCode = pistonExecutionResponse.data.compile.code;
  const runCode = pistonExecutionResponse.data.run.code;

  let result;
  if (compileCode !== 0) {
    result = {
      codeSubmitResult: 'exception',
      errorMessage: pistonExecutionResponse.data.compile.stdout,
      executionTime,
    };
  } else if (runCode !== 0) {
    result = {
      codeSubmitResult: 'exception',
      errorMessage: pistonExecutionResponse.data.run.stdout || 'No Returned Value!',
      executionTime,
    };
  } else {
    try {
      const resultAsJson = JSON.parse(pistonExecutionResponse.data.run.stdout);
      const algorithmicComplexity = await estimateAlgorithmicComplexity(mergedCode);
      console.log("algorithmic Complexity:", JSON.stringify(algorithmicComplexity, null, 2));

      result = {
        codeSubmitResult: 'success',
        testCases: resultAsJson,
        executionTime,
        performanceReport: {
          complexity: algorithmicComplexity,
        }
      };
    } catch (e) {
      if (e instanceof Error) {
        result = {
          codeSubmitResult: 'exception',
          errorMessage: e.message,
          executionTime,
        };
      } else {
        result = {
          codeSubmitResult: 'exception',
          errorMessage: 'Unknown error',
          executionTime,
        };
      }
    }
  }

  return result;
};
