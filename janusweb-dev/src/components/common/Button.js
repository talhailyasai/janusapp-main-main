import React from "react";

const Button = ({
  children,
  type,
  className,
  onClick,
  style,
  main,
  secondary,
  disabled,
}) => {
  const styles = {
    padding: "5px",
    width: "100px",
    borderRadius: "4px",
    border: "1px solid",
    fontSize: "12px",
    borderColor: main ? "transparent" : secondary ? "#ED7D31" : "transparent",
    color: main ? "white" : secondary ? "#ED7D31" : "white",
    backgroundColor: main ? "#ED7D31" : secondary ? "white" : "#ED7D31",
  };
  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
      style={{ ...styles, ...style }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
