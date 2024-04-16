export type CodeExecutionResult = {
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
