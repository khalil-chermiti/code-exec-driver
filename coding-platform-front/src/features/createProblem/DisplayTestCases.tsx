import React from "react";
import { TestCase } from "../../types";

type TestCasesProps = {
  testCases: TestCase[];
};

export const DisplayTestCases: React.FC<TestCasesProps> = ({ testCases }) => {
  return testCases.length === 0 ? (
    <p>No test cases added yet</p>
  ) : (
    testCases.map((testCase, index) => (
      <div key={index} className="d-flex flex-row mb-1">
        {testCase.input.map((input, index) => (
          <div key={index} className="flex-fill me-1">
            <input type="text" className="form-control" placeholder={input} disabled />
          </div>
        ))}
        <div className="flex-fill">
          <input type="text" className="form-control" placeholder={testCase.expected} disabled />
        </div>
      </div>
    ))
  );
};
