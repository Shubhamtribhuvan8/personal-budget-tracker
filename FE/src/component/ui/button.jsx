import React from "react";
import { ArrowRight } from "react-icons/fi"; // Make sure to install react-icons package

const Button = ({
  size = "md",
  variant = "primary",
  className = "",
  children,
  onClick,
}) => {
  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-2 px-5 text-base",
    lg: "py-3 px-6 text-lg",
  };

  const variantClasses = {
    primary: "bg-[#001B79] hover:bg-gray-800 text-white",
    secondary: "bg-white text-[#001B79] border-[#001B79] hover:bg-gray-200",
  };

  return (
    <button
      onClick={onClick}
      className={`font-bold rounded ${sizeClasses[size]} ${variantClasses[variant]} ${className} flex items-center`}
    >
      {children}
    </button>
  );
};

export default Button;
