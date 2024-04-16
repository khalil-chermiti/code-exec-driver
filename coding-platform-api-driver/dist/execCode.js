import axios from "axios";
import crypto from "crypto";
export const executeCode = async (language, code, args) => {
    const randomString = crypto.randomBytes(30).toString("hex");
    const fileName = randomString + languageVersion.javascript.extension;
    const response = await axios.post("http://localhost:2000/api/v2/execute", {
        language: "typescript",
        version: "5.0.3",
        files: [
            {
                name: fileName,
                content: code,
            },
        ],
        args: args,
    });
    return response.data;
};
const languageVersion = {
    javascript: {
        extension: ".js",
        verison: "5.0.3",
    },
};
