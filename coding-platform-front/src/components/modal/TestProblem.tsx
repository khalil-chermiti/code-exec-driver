import React from "react";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { CodeSubmitResultView, TestCaseResult } from "../../types";

type ModalProps = {
  isToggle: boolean;
  handleToggle: () => void;
  clearTestCasesResult: () => void;
  testCasesResultView: CodeSubmitResultView;
  testCaseToDisplay: TestCaseResult | null;
  setTestCaseToDisplay: (testCase: TestCaseResult | null) => void;
};

export const TestProblem: React.FC<ModalProps> = ({
  isToggle,
  testCaseToDisplay,
  testCasesResultView,

  handleToggle,
  clearTestCasesResult,
  setTestCaseToDisplay,
}) => {
  return (
    <>
      <div
        className={`modal modal-xl fade ${isToggle ? "show" : ""}`}
        style={{ display: isToggle ? "block" : "none" }}
        id="exampleModal"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title h5" id="exampleModalLabel">
                Test Cases
              </h1>
              <button
                type="button"
                onClick={() => {
                  setTestCaseToDisplay(null);
                  clearTestCasesResult();
                  handleToggle();
                }}
                className="btn-close"
              >
                <span className="visually-hidden">Close</span>
              </button>
            </div>
            <div className="modal-body">
              {/* Render Test Cases Results Button */}
              {testCasesResultView.codeSubmitResult === "success" &&
                testCasesResultView.testCases.map((testCase, index) => (
                  <button
                    style={{
                      borderRadius: "3px",
                      backgroundColor: testCase.executionResult === "passed" ? "#d5d7dd" : "#f8d7da",
                    }}
                    type="button"
                    className={`btn btn-sm me-2 mb-1`}
                    key={index}
                    onClick={() => {
                      setTestCaseToDisplay(testCase);
                    }}
                  >
                    {testCase.executionResult === "passed" ? (
                      <FcCheckmark size={20} style={{ marginRight: "3px", paddingBottom: "3px" }} />
                    ) : (
                      <FcCancel size={20} style={{ marginRight: "3px", paddingBottom: "3px" }} />
                    )}
                    <span className="mr-5">Case {index + 1}</span>
                  </button>
                ))}

              {/* Render Error */}
              {testCasesResultView.codeSubmitResult === "exception" && (
                <div className={`alert alert-danger`} role="alert" style={{ borderRadius: "5px" }}>
                  <pre
                    style={{
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    }}
                    className={`text-danger`}
                  >
                    {testCasesResultView.errorMessage}
                  </pre>
                </div>
              )}

              {/* Render Test Case To Display */}
              {testCaseToDisplay && (
                <fieldset
                  disabled
                  className="p-2 mt-2"
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                >
                  {testCaseToDisplay.input.map((input, index) => {
                    return (
                      <div className="mb-1" key={index}>
                        <label htmlFor="disabledTextInput" className="form-label">
                          Input {index + 1}
                        </label>
                        <input
                          style={{ borderRadius: "5px" }}
                          type="text"
                          id="disabledTextInput"
                          className="form-control"
                          value={JSON.stringify(input)}
                          readOnly
                        />
                      </div>
                    );
                  })}
                  <div className="mb-1">
                    <label htmlFor="disabledTextInput" className="form-label">
                      Expected
                    </label>
                    <input
                      style={{ borderRadius: "5px" }}
                      type="text"
                      id="disabledTextInput"
                      className="form-control"
                      value={testCaseToDisplay.expected}
                      readOnly
                    />
                  </div>
                  <div className="mb-1">
                    <label htmlFor="disabledTextInput" className="form-label">
                      Output
                    </label>
                    <input
                      style={{ borderRadius: "5px" }}
                      type="text"
                      id="disabledTextInput"
                      className="form-control"
                      value={testCaseToDisplay.output}
                      readOnly
                    />
                  </div>
                </fieldset>
              )}

              {testCasesResultView.codeSubmitResult === "initial" && (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
