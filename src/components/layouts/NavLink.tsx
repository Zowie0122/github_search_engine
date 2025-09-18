import React from "react";
import { NavLink as RouterNavLink, type NavLinkProps } from "react-router-dom";

const NavLink: React.FC<NavLinkProps & { className?: string }> = ({
  className,
  ...props
}) => <RouterNavLink {...props} className={`nav-default ${className}`} />;

export default NavLink;
