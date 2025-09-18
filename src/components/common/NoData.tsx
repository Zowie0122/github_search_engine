import React from "react";

interface Props {
  message?: string;
  className?: string;
}

const NoData: React.FC<Props> = ({ message = "No data found", className }) => (
  <p className={`${className}`}>{message}</p>
);

export default NoData;
