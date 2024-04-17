import React from "react";
import "./codeEditorStyling.css";
import { Editor } from "@monaco-editor/react";

type CodeEditorProps = {
  setCode: (code: string) => void;
  initialCodeTemplate: string;
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ setCode, initialCodeTemplate }) => {
  return (
    <div className="row mt-1" style={{ border: "1px solid #ccc" }}>
      <Editor
        options={{
          minimap: { enabled: false, showSlider: "mouseover" },
        }}
        onChange={code => {
          if (code) setCode(code);
        }}
        value={initialCodeTemplate}
        height="100vh"
        language="javascript"
      />
    </div>
  );
};
