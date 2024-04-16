type CreateTestCaseProps = {
  numberOfInputs: number;
  output: string;

  incrementNumberOfInputs: () => void;
  decrementNumberOfInputs: () => void;

  setTestCaseInput: (index: number, output: string) => void;
  setTestCaseOutput: (output: string) => void;

  addNewTestCase: () => void;
};
export const CreateTestCase: React.FC<CreateTestCaseProps> = ({
  numberOfInputs,
  output,
  incrementNumberOfInputs,
  decrementNumberOfInputs,
  setTestCaseOutput,
  setTestCaseInput,
  addNewTestCase,
}) => {
  return (
    <>
      <div className="row">
        <h1 className="display-6 mt-5">New test case</h1>
        <div className="d-flex flex-row align-items-center mb-3">
          <p className="mb-0">Number of input arguments: </p>
          <div className="quantity-selector quantity-selector-sm ms-3">
            <input
              type="number"
              className="form-control"
              aria-live="polite"
              data-bs-step="counter"
              name="number"
              title="number"
              value={numberOfInputs}
              onChange={() => {}}
              min="1"
              max="5"
              step="1"
            />
            <button
              onClick={decrementNumberOfInputs}
              type="button"
              className="btn btn-icon btn-outline-secondary btn-sm"
              aria-describedby="inputQuantitySelectorSm"
              data-bs-step="down"
            >
              <span className="visually-hidden">Step down</span>
            </button>
            <button
              onClick={incrementNumberOfInputs}
              type="button"
              className="btn btn-icon btn-outline-secondary btn-sm"
              aria-describedby="inputQuantitySelectorSm"
              data-bs-step="up"
            >
              <span className="visually-hidden">Step up</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <form>
          <div className="d-flex flex-row">
            {Array.from({ length: numberOfInputs }).map((_, index) => (
              <div key={index} className="flex-fill me-1">
                <input
                  onChange={e => setTestCaseInput(index, e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Input"
                />
              </div>
            ))}
            <div className="flex-fill me-1">
              <input
                onChange={e => setTestCaseOutput(e.target.value)}
                value={output}
                type="text"
                className="form-control"
                placeholder="Output"
              />
            </div>
            <div className="" style={{ minWidth: "fit-content" }}>
              <button onClick={addNewTestCase} type="reset" className="btn btn-primary">
                Add test case
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
