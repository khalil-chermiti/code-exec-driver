import { FetchedProblem,  testCaseResult } from "../types";
export const fetchProblemMock: FetchedProblem = {
  _id: "1",
  codeTemplates: [
    {
      language: "javascript",
      code: "This is a code template",
    },
  ],
  name: "Problem 1",
  description: "This is a problem description",
  testCases: [
    {
      input: ["1", "2", "3"],
      output: "6",
    },
    {
      input: ["4", "5", "6"],
      output: "15",
    },
  ],
};

export const testCaseResultsMock: testCaseResult[] = [
  {
    input: ["3", "3"],
    output: "6",
    expected: "6",
    executionResult: "passed",
  },
  {
    input: ["4", "5"],
    output: "15",
    expected: "9",
    executionResult: "failed",
  },
];
