import { FcCheckmark } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
import { testCaseResult } from "../types";

type TestCaseResultButtons = {
  selectedTestCaseIndex: number;
  testCaseResults: testCaseResult[];
  setTestCaseResultAtIndex: (idx: number) => void;
};

export const TestCaseResultButtons: React.FC<TestCaseResultButtons> = ({
  testCaseResults,
  selectedTestCaseIndex,
  setTestCaseResultAtIndex,
}) => {
  return (
    <div className="w-auto d-flex justify-content-start mb-2">
      {testCaseResults.map((result, index) => (
        <button
          style={{
            borderRadius: "3px",
            backgroundColor: result.executionResult === "passed" ? "#d5d7dd" : "#f8d7da",
          }}
          type="button"
          className={`btn btn-sm me-2 ${selectedTestCaseIndex === index ? "border" : ""}`}
          onClick={() => {
            setTestCaseResultAtIndex(index);
          }}
          key={index}
        >
          {result.executionResult === "passed" ? (
            <FcCheckmark size={20} style={{ marginRight: "3px", paddingBottom: "3px" }} />
          ) : (
            <FcCancel size={20} style={{ marginRight: "3px", paddingBottom: "3px" }} />
          )}
          <span className="mr-5">Case {index + 1}</span>
        </button>
      ))}
    </div>
  );
};
