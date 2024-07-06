import { pistonExecuteCodeApi } from "./pistonCodeExecutionApi.js";
import { PistonCodeExecutionResult, ResponseResult } from "./types.js";
import regression from "regression";

const measureExecutionTime = async (
  code: string,
  input: any,
): Promise<number> => {
  try {
    const start = process.hrtime();
    const pistonExecutionResponse: ResponseResult<PistonCodeExecutionResult> = await pistonExecuteCodeApi(
      code,
      input,
    );

    if (!pistonExecutionResponse.success) {
      throw new Error(pistonExecutionResponse.message || 'Code execution failed');
    }

    const end = process.hrtime(start);
    const executionTime = end[0] * 1000 + end[1] / 1000000;

    return executionTime;
  } catch (error: unknown) {
    console.error('Error measuring execution time:', error);
    throw new Error('Failed to measure execution time');
  }
};

const generateInput = (size: number): number[] => {
  try {
    return new Array(size).fill(0).map(() => Math.floor(Math.random() * size));
  } catch (error: unknown) {
    console.error('Error generating input:', error);
    throw new Error('Failed to generate input');
  }
};

const determineBigO = (inputSizes: number[], executionTimes: number[]): string => {
  // Ensure input sizes and execution times are non-empty and of the same length
  if (inputSizes.length === 0 || executionTimes.length === 0 || inputSizes.length !== executionTimes.length) {
    throw new Error('Invalid input: inputSizes and executionTimes must be non-empty arrays of the same length.');
  }

  // Transform input data into logarithmic values for regression analysis
  const data: Array<[number, number]> = inputSizes.map((size, index) => [Math.log(size), Math.log(executionTimes[index])]);

  // Perform linear regression on the transformed data
  const result = regression.linear(data);
  const slope = result.equation[0];

  // Determine complexity based on the slope
  if (slope < 0.5) return 'O(1)';
  if (slope < 1.5) return 'O(log n)';
  if (slope < 2.5) return 'O(n)';
  if (slope < 3.5) return 'O(n log n)';
  if (slope < 4.5) return 'O(n^2)';
  return 'O(n^k)';
};

export const estimateAlgorithmicComplexity = async (mergedCode: string): Promise<{ inputSizes: number[], executionTimes: number[], complexity: string } | { error: true, message: string }> => {
  try {
    const inputSizes = [10, 100, 1000, 10000, 100000]; 
    const executionTimesPromises: Promise<number>[] = [];

    // Measure execution times in parallel
    inputSizes.forEach(size => {
      const input = generateInput(size);
      const executionPromise = measureExecutionTime(mergedCode, input);
      executionTimesPromises.push(executionPromise);
    });

    const executionTimes = await Promise.all(executionTimesPromises);
    const complexity = determineBigO(inputSizes, executionTimes);

    return { inputSizes, executionTimes, complexity };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error estimating algorithmic complexity:', error.message);
      return { error: true, message: error.message };
    } else {
      console.error('Unknown error estimating algorithmic complexity:', error);
      return { error: true, message: 'Unknown error occurred' };
    }
  }
};

