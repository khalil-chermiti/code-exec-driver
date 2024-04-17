type testCaseFailed = {
  executionResult: "failed";
  input: string[];
  expected: string;
  output: string;
};

type testCasePassed = {
  executionResult: "passed";
  input: string[];
  expected: string;
  output: string;
};

type testCaseException = {
  executionResult: "exception";
  input: string[];
  expected: string;
  errorMessage: string;
  output: "";
};

export type testCaseResult = testCaseFailed | testCasePassed | testCaseException;

export type TestCase = {
  input: string[];
  expected: string;
};

export type Problem = {
  name: string;
  description: string;
  code: string;
  driverCode: string;
};

export type CodeTemplate = {
  language: string;
  code: string;
};

export type TestCases = {
  input: string[];
  output: string;
};

export type TestCaseDisplay = {
  input: string[];
  output: string;
  expected?: string;
};

export type TestCasesTab = {
  testCases: TestCase[];
  selectedTestCaseIndex: number;
  testCaseToDisplay: TestCase;
};

export type TestCasesResultsTab =
  | {
      show: "TEST_RESULTS";
      testCaseResults: testCaseResult[];
      testCaseResultToDisplay: TestCaseDisplay;
      selectedTestCaseResultIndex: number;
    }
  | {
      show: "ERROR";
      errorMessage: string;
    }
  | {
      show: "NO_RESULTS";
    };

export type Tab = "TEST_CASES" | "TEST_RESULTS";

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

export type FetchedProblem = {
  id: string;
  name: string;
  description: string;
  code: string;
};

export type TestCaseFailed = {
  executionResult: "failed";
  input: string[];
  expected: string;
  output: string;
};

export type TestCasePassed = {
  executionResult: "passed";
  input: string[];
  expected: string;
  output: string;
};

export type TestCaseResult = TestCaseFailed | TestCasePassed;

export type CodeSubmitResultView =
  | {
      codeSubmitResult: "initial";
    }
  | {
      codeSubmitResult: "success";
      testCases: TestCaseResult[];
    }
  | {
      codeSubmitResult: "exception";
      errorMessage: string;
    };

export type CodeSubmitResultResponse =
  | {
      codeSubmitResult: "success";
      testCases: TestCaseResult[];
    }
  | {
      codeSubmitResult: "exception";
      errorMessage: string;
    };
