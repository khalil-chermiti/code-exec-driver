import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ProblemListing = {
  id: string;
  name: string;
  description: string;
};

export const ListProblems = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<ProblemListing[]>([]);

  const getProblems = async () => {
    const response = await axios.get<ProblemListing[]>("http://localhost:3000/get-problems");
    setProblems(response.data);
  };

  useEffect(() => {
    getProblems();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-center text-center mt-5">
        <div>
          <h2 className="text-primary">Available Problems</h2>
          <p>Click on a problem to solve it.</p>
        </div>
      </div>
      <div className="grid">
        <div className="row justify-content-center mt-5 col-6 col-md-8 m-auto">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, idx) => (
                <tr key={idx}>
                  <th scope="row">{problem.id}</th>
                  <td>{problem.name}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => navigate(`/test/${problem.id}`)}>
                      Solve Problem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
