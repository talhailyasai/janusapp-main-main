import React from "react";

const CheckBox = ({
  type,
  text,
  id,
  checked,
  value,
  defaultChecked,
  onChange,
}) => {
  return (
    <div className="d-flex flex-column">
      {text && (
        <label htmlFor={id} style={{ whiteSpace: "nowrap" }}>
          {text}
        </label>
      )}
      <input
        onChange={onChange}
        name={id}
        value={value}
        defaultChecked={defaultChecked}
        className="form-check-input"
        type={type || "checkbox"}
        id={id}
        checked={checked}
      />
    </div>
  );
};

export default CheckBox;
