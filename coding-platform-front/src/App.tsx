import "./app.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateProblem } from "./features/createProblem/CreateProblem";
import { ListProblems } from "./features/listProblems/ListProblems";
import { SolveProblem } from "./features/SolveProblem/SolveProblem";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create" element={<CreateProblem />} />
        <Route path="/" element={<ListProblems />} />
        <Route path="/test/:problemId" element={<SolveProblem />} />
      </Routes>
    </BrowserRouter>
  );
};
