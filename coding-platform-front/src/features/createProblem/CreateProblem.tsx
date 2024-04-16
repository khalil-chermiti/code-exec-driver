import { useCreateProblem } from "./useCreateProblem";
import { CodeEditor } from "../../components/CodeEditor";
import { RichTextEditor } from "../../components/richTextEditor";

export const CreateProblem = () => {
  const { problem, handleProblemSubmit, setCodeTemplate, setDescription, setProblemName, setDriverCode } =
    useCreateProblem();

  return (
    <div className="container mb-5 p-0">
      {/* Set Problem Name */}
      <div className="row mb-3 mt-5">
        <h1 className="display-6">Problem name</h1>
        <input onChange={e => setProblemName(e.target.value)} type="text" className="form-control" id="name" />
      </div>

      {/* Add Problem Description */}
      <div className="row mt-5">
        <h1 className="display-6">Problem description</h1>
        <RichTextEditor description={problem.description} setDescription={setDescription} />
      </div>

      <div className="row mt-5">
        <div className="d-flex justify-content-between">
          <h1 className="display-6">code template</h1>

          <div className="dropdown">
            <button className="btn btn-dropdown dropdown-toggle" type="button">
              Language
            </button>
            <ul className="dropdown-menu">
              <li className="dropdown-item">javascript</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Code Template */}
      <CodeEditor initialCodeTemplate="" setCode={setCodeTemplate} />

      {/* Add Problem Driver Code */}
      <div className="row mt-5">
        <h1 className="display-6">Problem Driver Code</h1>
      </div>
      <CodeEditor initialCodeTemplate="" setCode={setDriverCode} />

      <button onClick={handleProblemSubmit} className="btn btn-primary mt-3" type="button">
        Create Problem
      </button>
    </div>
  );
};
