export type PistonCodeExecutionResult = {
  version: string;

  compile: {
    code: number;
    signal: string;
    output: string;
    stderr: string;
    stdout: string;
  };

  run: {
    code: number;
    signal: string;
    output: string;
    stderr: string;
    stdout: string;
  };
};

type TestCaseFailed = {
  executionResult: "failed";
  input: string[];
  expected: string;
  output: string;
};

type TestCasePassed = {
  executionResult: "passed";
  input: string[];
  expected: string;
  output: string;
};

type TestCaseException = {
  executionResult: "exception";
  errorMessage: string;
};

export type TestCaseResult = TestCaseFailed | TestCasePassed | TestCaseException;

export type CodeSubmitResult =
  | {
      codeSubmitResult: "success";
      testCases: TestCaseResult[];
    }
  | {
      codeSubmitResult: "exception";
      errorMessage: string;
    };

export type ProblemViewModel = {
  id: string;
  name: string;
  description: string;
  code: string;
};

type SuccessResponse<T> = {
  data: T;
  message: string;
  status: number;
  success: true;
};

type ErrorResponse = {
  message: string;
  status: number;
  success: false;
};

/** this generic type is used to define the response of an api call
 * it takes a generic type T which is the type of the data returned by the api
 */
export type ResponseResult<T> = SuccessResponse<T> | ErrorResponse;
