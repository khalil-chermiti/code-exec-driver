import React from "react";
import { TestCases } from "../types";

type TestCaseButtonsProps = {
  testCases: TestCases[];
  currentTestCaseIndex: number;
  setTestCaseAtIndex: (idx: number) => void;
};
export const TestCasesButtons: React.FC<TestCaseButtonsProps> = ({
  testCases,
  setTestCaseAtIndex,
  currentTestCaseIndex,
}) => {
  return (
    <div className="w-auto d-flex justify-content-start mb-2">
      {testCases.map((_, index) => {
        return (
          <button
            style={{ borderRadius: "3px", backgroundColor: "#d5d7dd" }}
            type="button"
            className={`btn btn-sm me-2 ${currentTestCaseIndex === index ? "border" : ""}`}
            onClick={() => {
              setTestCaseAtIndex(index);
            }}
            key={index}
          >
            Case {index + 1}
          </button>
        );
      })}
    </div>
  );
};
