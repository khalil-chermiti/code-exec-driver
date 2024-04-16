import { useState } from "react";
import { Problem } from "../../types";

export const useCreateProblem = () => {
  const [problem, setProblem] = useState<Problem>({
    name: "",
    description: "",
    code: "",
    driverCode: "",
  });

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
    console.log(problem);
    const res = await fetch("http://localhost:3000/add-problem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: problem.name,
        description: problem.description,
        code: problem.code,
        driverCode: problem.driverCode,
      }),
    });

    const data = await res.json();
    console.log(data);
  };

  return {
    problem,
    setDescription,
    setProblemName,
    setCodeTemplate,
    setDriverCode,
    handleProblemSubmit,
  };
};
