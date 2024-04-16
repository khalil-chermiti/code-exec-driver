import mongoose from "mongoose";

export type CodeTemplate = {
  language: string;
  code: string;
};

export type TestCases = {
  input: string[];
  expected: string;
};

export type Problem = {
  name: string;
  description: string;
  codeTemplate: string;
  driverCode: string;
};

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  code: {
    type: String,
    required: true,
  },

  driverCode: {
    type: String,
    required: true,
  },

  type: String,
});

export const ProblemModel = mongoose.model("problem", problemSchema);
