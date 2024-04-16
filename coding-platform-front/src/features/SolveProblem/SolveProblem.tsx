import { useSolveProblem } from "./useSolveProblem";
import { CodeEditor } from "../../components/CodeEditor";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { FcCancel, FcCheckmark } from "react-icons/fc";

export const SolveProblem = () => {
  const { code, problem, setCode, submitCode, codeSubmitResult, testCaseToDisplay, setTestCaseToDisplay } =
    useSolveProblem();

  return (
    <div>
      <div
        className="w-auto d-flex justify-content-between align-items-center p-1"
        style={{
          backgroundColor: "#f0f0f0",
          borderRadius: "3px",
          minHeight: "5vh",
        }}
      >
        <span></span>

        <p className="display-6">{problem?.name}</p>

        <span></span>
      </div>
      <PanelGroup direction="horizontal">
        <Panel
          style={{
            overflow: "scroll",
            overflowX: "hidden",
            height: "90vh",
            margin: "2px",
            backgroundColor: "#f0f0f0",
            borderRadius: "3px",
            padding: "10px",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: problem?.description }}></div>
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <PanelGroup direction="vertical">
            {/* Code Editor */}
            <Panel
              style={{
                margin: "2px",
                backgroundColor: "white",
                height: `${codeSubmitResult.codeSubmitResult === "initial" ? "90vh" : "45vh"}`,
                flex: `${codeSubmitResult.codeSubmitResult === "initial" ? "9" : "5"}`,
                overflow: "hidden",
                overflowX: "hidden",
                border: "2px solid #f0f0f0",
                borderRadius: "3px",
                padding: "5px",
              }}
            >
              <CodeEditor
                initialCodeTemplate={code}
                setCode={value => {
                  if (value && value.length > 0) setCode(value);
                }}
              />
            </Panel>
            <PanelResizeHandle />

            <Panel
              style={{
                overflow: "scroll",
                overflowX: "hidden",
                // height: "45vh",
                height: `${codeSubmitResult.codeSubmitResult === "initial" ? "0vh" : "45vh"}`,
                flex: `${codeSubmitResult.codeSubmitResult === "initial" ? "1" : "5"}`,
                margin: "2px",
                backgroundColor: "#f0f0f0",
                borderRadius: "3px",
                padding: "10px",
              }}
            >
              <div className="w-auto d-flex justify-content-end align-items-center mb-2">
                <button
                  onClick={submitCode}
                  className="btn btn-success"
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    borderRadius: "3px",
                  }}
                >
                  Submit
                </button>
              </div>

              <div className="border-top border-light border-1 my-2"></div>

              <div className="mb-2">
                {/* Render Test Cases Results Button */}
                {codeSubmitResult.codeSubmitResult === "success" &&
                  codeSubmitResult.testCases.map((testCase, index) => (
                    <button
                      style={{
                        borderRadius: "3px",
                        backgroundColor: testCase.executionResult === "passed" ? "#d5d7dd" : "#f8d7da",
                      }}
                      type="button"
                      className={`btn btn-sm me-2`}
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
              </div>

              {/* Render Error */}
              {codeSubmitResult.codeSubmitResult === "exception" && (
                <div className={`alert alert-danger`} role="alert" style={{ borderRadius: "5px" }}>
                  <pre
                    style={{
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    }}
                    className={`text-danger`}
                  >
                    {codeSubmitResult.errorMessage}
                  </pre>
                </div>
              )}

              {/* Render Test Case To Display */}
              {testCaseToDisplay && (
                <fieldset
                  disabled
                  className="p-2"
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
                          value={input.input}
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
                  {typeof testCaseToDisplay.output === "string" && (
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
                  )}
                </fieldset>
              )}
            </Panel>
            <PanelResizeHandle />
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};
