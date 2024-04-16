import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { executeCode } from "./execCode.js";
import { ProblemModel } from "./model/problemSchema.js";
import { JsCodeDriverFactory } from "./drivers/jsDriver.js";
import { CodeSubmitResult, TestCaseResult } from "./types.js";

mongoose.connect("mongodb://root:root@127.0.0.1:27017/", {
  dbName: "code-driver",
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err: any) => {
  console.log("Error connecting to MongoDB", err);
});

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/add-problem", async (req: Request, res: Response) => {
  const problem = await ProblemModel.create(req.body);
  return res.json("Problem added successfully : " + problem);
});

app.get("/get-problems", async (req: Request, res: Response) => {
  const problems = await ProblemModel.find();
  const data = problems.map(problem => {
    return {
      id: problem._id,
      name: problem.name,
      description: problem.description,
    };
  });
  return res.json(data);
});

app.get("/get-problem/:id", async (req: Request, res: Response) => {
  const problem = await ProblemModel.findById(req.params.id);
  console.log(problem);
  return res.json({
    id: problem?._id,
    name: problem?.name,
    description: problem?.description,
    code: problem?.code,
  });
});

app.post("/execute", async (req: Request, res: Response<CodeSubmitResult | string>) => {
  const problemId = req.body.problemId;
  const code = req.body.code;

  const problem = await ProblemModel.findById(problemId);

  if (!problem) return res.json("Problem not found");

  const mergedCode = JsCodeDriverFactory(code, problem.driverCode)();

  const execResponse = await executeCode(mergedCode);

  if (execResponse.compile.code !== 0) {
    return res.status(200).json({
      codeSubmitResult: "exception",
      errorMessage: execResponse.compile.stdout,
    });
  }

  if (execResponse.run.code !== 0) {
    return res.status(200).json({
      codeSubmitResult: "exception",
      errorMessage: execResponse.run.stdout,
    });
  }

  const resultAsJson = JSON.parse(execResponse.run.stdout);

  return res.json({
    codeSubmitResult: "success",
    testCases: resultAsJson as TestCaseResult[],
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
