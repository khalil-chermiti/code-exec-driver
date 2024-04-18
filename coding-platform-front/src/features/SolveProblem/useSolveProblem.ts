import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CodeSubmitResultResponse,
  CodeSubmitResultView,
  FetchedProblem,
  ResponseResult,
  TestCaseResult,
} from "../../types";

export const useSolveProblem = () => {
  const { problemId } = useParams();
  const [code, setCode] = useState<string>("");

  const [testCaseToDisplay, setTestCaseToDisplay] = useState<TestCaseResult | null>(null);

  const [codeSubmitResult, setCodeSubmitResult] = useState<CodeSubmitResultView>({
    codeSubmitResult: "initial",
  });

  const setTestCases = (testCases: TestCaseResult[]) => {
    setCodeSubmitResult({ codeSubmitResult: "success", testCases });
  };

  const setException = (errorMessage: string) => {
    setCodeSubmitResult({ codeSubmitResult: "exception", errorMessage });
  };

  const [problem, setProblem] = useState<FetchedProblem>({
    id: "",
    name: "",
    description: "",
    code: "",
  });

  const getProblem = async () => {
    const fetchedProblem = (
      await axios.get<ResponseResult<FetchedProblem>>(`http://localhost:3000/get-problem/${problemId}`)
    ).data;

    if (fetchedProblem.success) {
      setCode(fetchedProblem.data.code);
      setProblem(fetchedProblem.data);
    } else {
    }
  };

  const submitCode = async () => {
    setTestCases([]);
    setTestCaseToDisplay(null);

    const res = (
      await axios.post<ResponseResult<CodeSubmitResultResponse>>("http://localhost:3000/execute", {
        code,
        problemId,
      })
    ).data;

    if (res.success) {
      if (res.data.codeSubmitResult === "exception") {
        console.log(res.data.errorMessage);
        setException(res.data.errorMessage);
      }

      if (res.data.codeSubmitResult === "success") {
        setTestCases(res.data.testCases);
        console.log(res.data);
        setTestCaseToDisplay(res.data.testCases[0]);
      }
    }
  };

  useEffect(() => {
    getProblem();
  }, []);

  return {
    code,
    problem,
    codeSubmitResult,
    testCaseToDisplay,

    setCode,
    submitCode,
    setTestCaseToDisplay,
  };
};
