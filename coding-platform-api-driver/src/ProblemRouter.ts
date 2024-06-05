import { HttpStatusCode } from "axios";
import express, { Request, Response } from "express";
import { ProblemModel } from "./model/problemSchema.js";
import { API_ENDPOINTS } from "./config/apiEndpoints.js";
import { JsCodeDriverFactory } from "./drivers/jsDriver.js";
import { pistonExecuteCodeApi } from "./pistonCodeExecutionApi.js";
import { executeCodeWithMetrics, runCoverage, analyzeComplexity } from "./utils/codeAnalysis.js"; 


import {
  CodeSubmitResult,
  ProblemViewModel,
  ResponseResult,
  TestCaseResult,
} from "./types.js";
import { isValidObjectId } from "mongoose";

export const problemRouter = express.Router();

problemRouter.post(
  API_ENDPOINTS.ADD_PROBLEM,
  async (req: Request, res: Response<ResponseResult<ProblemViewModel>>) => {
    try {
      const problem = await ProblemModel.create(req.body);
      return res.json({
        success: true,
        message: "Problem Created Successfully",
        status: HttpStatusCode.Ok,
        data: {
          id: problem._id.toString(),
          name: problem.name,
          description: problem.description,
          code: problem.code,
          driverCode: problem.driverCode,
        },
      });
    } catch {
      return res.status(HttpStatusCode.BadRequest).json({
        success: false,
        message: "Error while creating problem",
        status: HttpStatusCode.BadRequest,
      });
    }
  },
);

problemRouter.get(
  API_ENDPOINTS.GET_PROBLEMS,
  async (_: Request, res: Response<ResponseResult<ProblemViewModel[]>>) => {
    try {
      const problems = await ProblemModel.find();
      const problemsList: ProblemViewModel[] = problems.map((problem) => {
        return {
          id: problem._id.toString(),
          name: problem.name,
          code: problem.code,
          description: problem.description,
          driverCode: problem.driverCode,
        };
      });

      return res.json({
        success: true,
        status: HttpStatusCode.Ok,
        message: "Fetched All Available Problems Successfully",
        data: problemsList,
      });
    } catch {
      return res.json({
        success: false,
        message: "Failed To Fetch Problems List",
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
);

problemRouter.get(
  API_ENDPOINTS.GET_PROBLEM,
  async (req: Request, res: Response<ResponseResult<ProblemViewModel>>) => {
    if (!req.params.id)
      return res.status(HttpStatusCode.BadRequest).json({
        success: false,
        status: HttpStatusCode.BadRequest,
        message: "Please Provide Problem's Id",
      });

    try {
      const problem = await ProblemModel.findById(req.params.id);

      if (!problem)
        return res.status(HttpStatusCode.BadRequest).json({
          success: false,
          status: HttpStatusCode.BadRequest,
          message: "Unable To Find Problem With The Specified Id",
        });

      return res.status(HttpStatusCode.Ok).json({
        success: true,
        status: HttpStatusCode.Ok,
        message: "Problem Fetched Successfully",
        data: {
          id: problem._id.toString(),
          name: problem.name,
          code: problem.code,
          description: problem.description,
          driverCode: problem.driverCode,
        },
      });
    } catch {
      return res.status(HttpStatusCode.InternalServerError).json({
        success: false,
        message: "Failed To Fetch Problems",
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
);
("");

problemRouter.post(
  API_ENDPOINTS.EXECUTE_CODE,
  async (req: Request, res: Response<ResponseResult<CodeSubmitResult>>) => {
    const problemId = req.body.problemId;
    const code = req.body.code;
    

    if (!problemId || !code) {
      return res.status(HttpStatusCode.BadRequest).json({
        success: false,
        status: HttpStatusCode.BadRequest,
        message: "Please provide problem Id and code to execute",
      });
    }

    let problem;
    try {
      problem = await ProblemModel.findById(problemId);
      if (!problem) {
        return res.status(HttpStatusCode.BadRequest).json({
          success: false,
          status: HttpStatusCode.BadRequest,
          message: "The Problem you are trying to fetch does not exist",
        });
      }
    } catch (error) {
      return res.status(HttpStatusCode.InternalServerError).json({
        success: false,
        status: HttpStatusCode.InternalServerError,
        message: "Something went wrong! Please try again",
      });
    }



    const mergedCode = JsCodeDriverFactory(code, problem.driverCode)();

    try {
      const performanceReport = await executeCodeWithMetrics(mergedCode);

      if (performanceReport.codeSubmitResult === "exception") {
        return res.status(HttpStatusCode.Ok).json({
          success: true,
          status: HttpStatusCode.Ok,
          message: "Code Execution Successfully Finished",
          data: performanceReport,
        });
      }
      

      // const coverageReport = await runCoverage(code);

      // console.log("bbbbbbbb", coverageReport);

      // const complexityReport = await analyzeComplexity(code);

      // console.log("cccccccccc", complexityReport);
      
      

      // const fullReport = {
      //   performance: performanceReport,
      //   coverage: JSON.parse(coverageReport),
      //   complexity: JSON.parse(complexityReport),
      // };

      return res.status(HttpStatusCode.Ok).json({
        success: true,
        status: HttpStatusCode.Ok,
        message: "Code Execution and Analysis Successfully Finished",
        data: {
          codeSubmitResult: "success",
          testCases: performanceReport.testCases as TestCaseResult[],
          performanceReport: performanceReport,
          // coverageReport: JSON.parse(coverageReport),
          // complexityReport: JSON.parse(complexityReport),
        },
      });
    } catch (e) {
      return res.status(HttpStatusCode.InternalServerError).json({
        success: false,
        message: "Problem while executing your code",
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
);

problemRouter.post(
  API_ENDPOINTS.TEST_PROBLEM,
  async (req: Request, res: Response<ResponseResult<CodeSubmitResult>>) => {
    const code = req.body.code;
    const driver = req.body.driver;

    if (!code || !driver)
      return res.status(HttpStatusCode.BadRequest).json({
        success: false,
        status: HttpStatusCode.BadRequest,
        message: "Please provide code and code driver ",
      });

    const mergedCode = JsCodeDriverFactory(code, driver)();

    const pistonExecutionResponse = await pistonExecuteCodeApi(mergedCode);

    if (pistonExecutionResponse.success === false)
      return res.status(HttpStatusCode.InternalServerError).json({
        success: false,
        message: pistonExecutionResponse.message,
        status: HttpStatusCode.InternalServerError,
      });

    if (pistonExecutionResponse.data.compile.code !== 0) {
      return res.status(200).json({
        success: true,
        status: HttpStatusCode.Ok,
        message: "Code Execution Successfully Finished",
        data: {
          codeSubmitResult: "exception",
          errorMessage: pistonExecutionResponse.data.compile.stdout,
        },
      });
    }

    if (pistonExecutionResponse.data.run.code !== 0) {
      return res.status(200).json({
        success: true,
        status: HttpStatusCode.Ok,
        message: "Code Execution Successfully Finished",
        data: {
          codeSubmitResult: "exception",
          errorMessage:
            pistonExecutionResponse.data.run.stdout || "No Returned Value!",
        },
      });
    }

    try {
      const resultAsJson = JSON.parse(pistonExecutionResponse.data.run.stdout);

      return res.status(200).json({
        success: true,
        status: HttpStatusCode.Ok,
        message: "Code Execution Successfully Finished",
        data: {
          codeSubmitResult: "success",
          testCases: resultAsJson as TestCaseResult[],
          performanceReport: "success",
        },
      });
    } catch (e) {
      return res.json({
        success: false,
        message:
          "STDOUT is not a valid JSON " +
          pistonExecutionResponse.data.run.stdout,
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
);

problemRouter.put(
  API_ENDPOINTS.UPDATE_PROBLEM,
  async (req: Request, res: Response<ResponseResult<ProblemViewModel>>) => {
    if (!req.params.id)
      return res.status(HttpStatusCode.BadRequest).json({
        success: false,
        status: HttpStatusCode.BadRequest,
        message: "Please Provide Problem's Id",
      });

    if (
      !req.body.name ||
      !req.body.code ||
      !req.body.description ||
      !req.body.driverCode
    ) {
      return res.status(HttpStatusCode.BadRequest).json({
        success: false,
        status: HttpStatusCode.BadRequest,
        message:
          "Please Provide Problem's Name, Code, Description and Driver Code",
      });
    }

    try {
      const problem = await ProblemModel.findById(req.params.id);

      if (!problem)
        return res.status(HttpStatusCode.BadRequest).json({
          success: false,
          status: HttpStatusCode.BadRequest,
          message: "Unable To Find Problem With The Specified Id",
        });

      const updatedProblem = await ProblemModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          code: req.body.code,
          description: req.body.description,
          driverCode: req.body.driverCode,
        },
        {
          new: true,
        },
      );

      if (updatedProblem)
        return res.status(HttpStatusCode.Ok).json({
          success: true,
          status: HttpStatusCode.Ok,
          message: "Problem Updated Successfully",
          data: {
            id: updatedProblem._id.toString(),
            name: updatedProblem.name,
            code: updatedProblem.code,
            description: updatedProblem.description,
            driverCode: updatedProblem.driverCode,
          },
        });
    } catch (e) {
      return res.status(HttpStatusCode.InternalServerError).json({
        success: false,
        message: "Failed To Fetch Problems",
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
);

problemRouter.post(
  API_ENDPOINTS.SEARCH_PROBLEM,
  async (
    req: Request,
    res: Response<ResponseResult<{ id: string; name: string }[]>>,
  ) => {
    if (!req.body.search)
      return res.status(HttpStatusCode.BadRequest).json({
        success: false,
        status: HttpStatusCode.BadRequest,
        message: "Please Provide Search Query",
      });

    try {
      const problems = await ProblemModel.find({
        name: { $regex: req.body.search, $options: "i" },
      });

      const problemsList = problems.map((problem) => {
        return {
          id: problem._id.toString(),
          name: problem.name,
        };
      });

      return res.json({
        success: true,
        status: HttpStatusCode.Ok,
        message:
          "Fetched All Available Problems With The Search Query " +
          req.body.search +
          " Successfully",
        data: problemsList,
      });
    } catch {
      return res.json({
        success: false,
        message: "Failed To Fetch Problems List",
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
);

problemRouter.post(
  API_ENDPOINTS.SEARCH_PROBLEMS_BY_IDS,
  async (req: Request, res: Response<ResponseResult<ProblemViewModel[]>>) => {
    if (!req.body.ids || Array.isArray(req.body.ids) === false)
      return res.status(HttpStatusCode.BadRequest).json({
        success: false,
        status: HttpStatusCode.BadRequest,
        message: "Please Provide Array Of Problem Ids",
      });

    try {
      const problems = await ProblemModel.find({
        _id: { $in: req.body.ids },
      });

      // make sure all ids are valid
      const nonExistingIds = problems.filter(
        (problem) => !req.body.ids.includes(problem._id.toString()),
      );

      if (nonExistingIds.length > 0)
        return res.status(HttpStatusCode.BadRequest).json({
          success: false,
          status: HttpStatusCode.BadRequest,
          message:
            "Some of the ids are invalid" +
            nonExistingIds.map((problem) => problem._id.toString()).join(", "),
        });

      const problemsList: ProblemViewModel[] = problems.map((problem) => {
        return {
          id: problem._id.toString(),
          name: problem.name,
          description: problem.description,
          code: problem.code,
          driverCode: problem.driverCode,
        };
      });

      return res.json({
        success: true,
        status: HttpStatusCode.Ok,
        message:
          "Fetched All Available Problems With The Search Query " +
          req.body.ids +
          " Successfully",
        data: problemsList,
      });
    } catch {
      return res.json({
        success: false,
        message: "Failed To Fetch Problems List",
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
);

problemRouter.post(
  API_ENDPOINTS.GET_PROBLEMS_BY_IDS,
  async (req: Request, res: Response<ResponseResult<ProblemViewModel[]>>) => {
    if (!req.body.ids || Array.isArray(req.body.ids) === false)
      return res.status(HttpStatusCode.BadRequest).json({
        success: false,
        status: HttpStatusCode.BadRequest,
        message: "Please Provide Array Of Problem Ids",
      });

    try {
      const problems = await ProblemModel.find({
        _id: { $in: req.body.ids },
      });

      // make sure all ids are valid
      const problemsList = problems.map((problem) => {
        return {
          id: problem._id.toString(),
          name: problem.name,
          code: problem.code,
          driverCode: problem.driverCode,
          description: problem.description,
        };
      });

      return res.json({
        success: true,
        status: HttpStatusCode.Ok,
        message:
          "Fetched All Available Problems With The Search Query " +
          req.body.ids +
          " Successfully",
        data: problemsList,
      });
    } catch {
      return res.json({
        success: false,
        message: "Failed To Fetch Problems List",
        status: HttpStatusCode.InternalServerError,
      });
    }
  },
);
