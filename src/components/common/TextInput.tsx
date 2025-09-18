import React from "react";

type Props = {
  type?: "text" | "number";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const TextInput: React.FC<Props> = ({
  type = "text",
  value,
  placeholder = "",
  onChange,
  className,
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`input-primary ${className}`}
  />
);

export default TextInput;
