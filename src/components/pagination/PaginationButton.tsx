import React from "react";
import Button from "../common/Button";

type Props = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

const PaginationButton: React.FC<Props> = ({
  onClick,
  disabled = false,
  children,
}) => (
  <Button onClick={onClick} disabled={disabled}>
    {children}
  </Button>
);

export default PaginationButton;
