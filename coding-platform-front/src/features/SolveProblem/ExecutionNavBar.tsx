import { Tab, testCaseResult } from "../types";

type ExecutionNavBarProps = {
  tab: Tab;
  testCaseResults: testCaseResult[];

  handleCodeSubmit: () => void;
  setTestCaseAtIndex: (idx: number) => void;
  setTab: (value: Tab) => void;
  setTestCaseResultAtIndex: (idx: number) => void;
};

export const ExecutionNavBar: React.FC<ExecutionNavBarProps> = ({
  tab,
  testCaseResults,

  setTab,
  handleCodeSubmit,
  setTestCaseAtIndex,
  setTestCaseResultAtIndex,
}) => {
  return (
    <>
      <div>
        <button
          onClick={() => {
            setTab("TEST_CASES");
            setTestCaseAtIndex(0);
          }}
          type="button"
          className={
            tab === "TEST_CASES"
              ? "btn btn-secondary btn-sm me-1"
              : "btn btn-primary btn-sm me-1"
          }
          style={{
            borderRadius: "3px",
          }}
        >
          Test Cases
        </button>
        <button
          style={{
            borderRadius: "3px",
          }}
          onClick={() => {
            setTab("TEST_RESULTS");
            if (testCaseResults.length > 0) setTestCaseResultAtIndex(0);
          }}
          type="button"
          className={
            tab === "TEST_CASES"
              ? "btn btn-primary btn-sm"
              : "btn btn-secondary btn-sm"
          }
        >
          Test Results
        </button>
      </div>

      <button
        onClick={() => {
          handleCodeSubmit();
        }}
        className="btn btn-success btn-sm"
        style={{
          borderRadius: "3px",
        }}
      >
        Submit
      </button>
    </>
  );
};
