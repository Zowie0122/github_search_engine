import React from "react";

interface Props {
  message: string;
  className?: string;
}

const ErrorText: React.FC<Props> = ({ message, className }) => (
  <p className={`text-error ${className}`}>{message}</p>
);

export default ErrorText;
