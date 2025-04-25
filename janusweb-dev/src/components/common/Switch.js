import React, { useState } from "react";
import Switch from "react-switch";
import "./style.css";

const SwitchExample = ({ checked, onChange, text, disabled }) => {
  return (
    <div className="switch_style">
      <Switch
        onChange={onChange}
        checked={checked}
        color="black"
        height={20}
        width={40}
        disabled={disabled}
      />
      <span>{text}</span>
    </div>
  );
};

export default SwitchExample;
