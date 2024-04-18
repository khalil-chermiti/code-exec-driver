import axios from "axios";
import { useState } from "react";
import { CodeSubmitResultResponse, CodeSubmitResultView, Problem, ResponseResult, TestCaseResult } from "../../types";

export const useCreateProblem = () => {
  const [testCasesResult, setTestCasesResult] = useState<CodeSubmitResultView>({
    codeSubmitResult: "initial",
  });

  const [problem, setProblem] = useState<Problem>({
    name: "",
    description: "",
    code: "// write your code here",
    driverCode: "// write your code here",
  });

  const [solution, setSolution] = useState<string>("// write your solution here");

  const [testCaseToDisplay, setTestCaseToDisplay] = useState<TestCaseResult | null>(null);

  const setDescription = (description: string) => {
    setProblem(prev => ({ ...prev, description }));
  };

  const setProblemName = (name: string) => {
    setProblem(prev => ({ ...prev, name }));
  };

  const setCodeTemplate = (code: string) => {
    setProblem(prev => ({ ...prev, code }));
  };

  const setDriverCode = (driverCode: string) => {
    setProblem(prev => ({ ...prev, driverCode }));
  };

  const handleProblemSubmit = async () => {
    const res = (
      await axios.post("http://localhost:3000/add-problem", {
        name: problem.name,
        description: problem.description,
        code: problem.code,
        driverCode: problem.driverCode,
      })
    ).data;

    if (res.success) {
      alert("Problem added successfully");
    } else {
      alert("Error adding problem");
    }
  };

  const executeCode = async () => {
    const res = (
      await axios.post<ResponseResult<CodeSubmitResultResponse>>(`http://localhost:3000/test-problem`, {
        code: solution,
        driver: problem.driverCode,
      })
    ).data;
    console.log(res);

    if (res.success)
      switch (res.data.codeSubmitResult) {
        case "exception":
          setTestCasesResult({ codeSubmitResult: "exception", errorMessage: res.data.errorMessage });
          break;
        case "success":
          setTestCasesResult({ codeSubmitResult: "success", testCases: res.data.testCases });
          setTestCaseToDisplay(res.data.testCases[0]);
          break;
      }
    else setTestCasesResult({ codeSubmitResult: "exception", errorMessage: res.message });
  };

  return {
    problem,
    solution,
    testCasesResult,
    testCaseToDisplay,

    executeCode,
    setSolution,
    setDriverCode,
    setDescription,
    setProblemName,
    setCodeTemplate,
    setTestCasesResult,
    handleProblemSubmit,
    setTestCaseToDisplay,
  };
};
