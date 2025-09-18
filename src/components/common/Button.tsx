import React from "react";

type Props = {
  type?: "button" | "submit" | "reset";
  onClick: () => void;
  onMouseEnter?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

const Button: React.FC<Props> = ({
  type = "button",
  onClick,
  onMouseEnter,
  onFocus,
  disabled = false,
  children,
  className,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`btn-primary ${className}`}
    onMouseEnter={onMouseEnter}
    onFocus={onFocus}
  >
    {children}
  </button>
);

export default Button;
