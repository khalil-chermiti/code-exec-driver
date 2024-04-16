import mongoose from "mongoose";
const codeTemplate = new mongoose.Schema({
    language: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
});
const testCases = new mongoose.Schema({
    input: {
        type: [String],
        required: true,
    },
    expected: {
        type: String,
        required: true,
    },
});
const problemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    codeTemplates: [codeTemplate],
    testCases: [testCases],
});
export const ProblemModel = mongoose.model("problem", problemSchema);
