import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { executeCode } from "./execCode.js";
import { ProblemModel } from "./model/problemSchema.js";
mongoose.connect("mongodb://root:root@127.0.0.1:27017/", {
    dbName: "odc",
});
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
    console.log("Error connecting to MongoDB", err);
});
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.post("/add-problem", async (req, res) => {
    const problem = await ProblemModel.create(req.body);
    return res.json("Problem added successfully : " + problem);
});
app.get("/get-problems", async (req, res) => {
    const problems = await ProblemModel.find();
    const data = problems.map((problem) => {
        return {
            id: problem._id,
            name: problem.name,
            description: problem.description,
        };
    });
    return res.json(data);
});
app.get("/get-problem/:id", async (req, res) => {
    const problem = await ProblemModel.findById(req.params.id);
    return res.json(problem);
});
async function* getTestCasesResult(language, code, testCases) {
    const results = await Promise.all(testCases.map(async (testCase) => {
        const res = await executeCode(language, code, testCase.input);
        if (res.compile.code !== 0) {
            return {
                executionResult: "exception",
                input: testCase.input,
                expected: testCase.expected,
                errorMessage: res.compile.stdout,
            };
        }
        if (res.run.code !== 0) {
            return {
                executionResult: "exception",
                input: testCase.input,
                expected: testCase.expected,
                errorMessage: res.run.stderr,
            };
        }
        if (res.run.output.trim() === testCase.expected.trim()) {
            return {
                executionResult: "passed",
                input: testCase.input,
                expected: testCase.expected,
                output: res.run.output,
            };
        }
        return {
            executionResult: "failed",
            input: testCase.input,
            output: res.run.output,
            expected: testCase.expected,
        };
    }));
    yield* results;
}
app.post("/execute", async (req, res) => {
    const problemId = req.body.problemId;
    const code = req.body.code;
    const language = req.body.language;
    const problem = await ProblemModel.findById(problemId);
    if (!problem) {
        return res.json("Problem not found");
    }
    let result = [];
    const testCasesResult = getTestCasesResult(language, code, problem.testCases);
    for await (const res of testCasesResult) {
        result.push(res);
    }
    return res.json(result);
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
