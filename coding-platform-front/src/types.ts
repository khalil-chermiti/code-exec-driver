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

export type FetchedProblem = {
  _id: string;
  name: string;
  description: string;
  codeTemplates: CodeTemplate[];
  testCases: TestCases[];
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
