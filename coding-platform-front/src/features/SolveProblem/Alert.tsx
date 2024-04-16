import React from "react";

type AlertProps = {
  message: string;
  type: "success" | "danger" | "warning" | "info";
};

export const Alert: React.FC<AlertProps> = ({ message, type }) => {
  return (
    <div className={`alert alert-${type}`} role="alert" style={{ borderRadius: "5px" }}>
      <pre
        style={{
          lineHeight: "1.5",
        }}
        className={`text-${type}`}
      >
        {message}
      </pre>
    </div>
  );
};
