import React from "react";
import { Link as RouterLink, type LinkProps } from "react-router-dom";

const Link: React.FC<LinkProps & { className?: string }> = ({
  className,
  ...props
}) => <RouterLink {...props} className={`link-primary ${className}`} />;

export default Link;
