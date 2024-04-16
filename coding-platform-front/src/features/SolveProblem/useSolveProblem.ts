import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type FetchedProblem = {
  id: string;
  name: string;
  description: string;
  code: string;
};

type TestCaseFailed = {
  executionResult: "failed";
  input: { input: string }[];
  expected: string;
  output: string;
};

type TestCasePassed = {
  executionResult: "passed";
  input: { input: string }[];
  expected: string;
  output: string;
};

type TestCaseResult = TestCaseFailed | TestCasePassed;

type CodeSubmitResultView =
  | {
      codeSubmitResult: "initial";
    }
  | {
      codeSubmitResult: "success";
      testCases: TestCaseResult[];
    }
  | {
      codeSubmitResult: "exception";
      errorMessage: string;
    };

type CodeSubmitResultResponse =
  | {
      codeSubmitResult: "success";
      testCases: TestCaseResult[];
    }
  | {
      codeSubmitResult: "exception";
      errorMessage: string;
    };

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
    fetch("http://localhost:3000/get-problem/" + problemId)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setCode(data.code);
        setProblem(data);
      });
  };

  const submitCode = async () => {
    const res = await fetch("http://localhost:3000/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        problemId,
      }),
    });

    const data = (await res.json()) as CodeSubmitResultResponse;

    if (data.codeSubmitResult === "exception") {
      setException(data.errorMessage);
    }

    if (data.codeSubmitResult === "success") {
      setTestCases(data.testCases);
    }

    console.log(data);
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
