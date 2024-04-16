type DisplayTestCaseProps = {
  testCaseToDisplay: {
    input: string[];
    expected: string;
    output?: string;
  };
};

export const DisplayTestCase: React.FC<DisplayTestCaseProps> = ({ testCaseToDisplay }) => {
  return (
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
              value={input}
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
  );
};
