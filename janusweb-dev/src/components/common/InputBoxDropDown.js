import React, { useEffect, useState } from "react";
import InputBox from "./InputBox";

const InputBoxDropDown = ({
  value,
  disabled,
  id,
  type,
  required = true,
  text,
  handleChange,
  defaultValue,
  mdCol,
  result,
  handleSubmit,
  ulClass,
  mb,
  top,
  right,
  inputMdCol,
  ml,
  placeholder,
  readonly = false,
  LabelClassName,
  matchedResults,
  checkDropdown,
  ulStyle,
}) => {
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeInput = (event) => {
    if (readonly) return;
    handleChange(event);
    handleSubmit(event.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (checkDropdown && value) {
      if (!matchedResults || matchedResults?.length === 0) {
        setShowResults(false);
      } else {
        setShowResults(true);
      }
    } else {
      setShowResults(true);
    }
  };
  useEffect(() => {
    // console.log("matchedResults", matchedResults);
    if (checkDropdown && value && isFocused) {
      if (!matchedResults || matchedResults?.length === 0) {
        setShowResults(false);
      } else {
        setShowResults(true);
      }
    }
  }, [value, matchedResults]);
  const handleClose = () => {
    setIsFocused(false);
    setShowResults(false);
  };

  const defaultUlStyle = {
    zIndex: 10,
    position: "absolute",
    resize: "vertical",
    height: "9rem",
    maxHeight: "none",
  };
  return (
    <div
      className={`col-md-${mdCol || 2} position-relative`}
      style={{ marginLeft: ml || "0rem" }}
    >
      <div className="position-relative">
        <InputBox
          name={id}
          mdCol={inputMdCol || 12}
          mb={mb}
          disabled={disabled}
          type={type || "text"}
          required={required}
          value={typeof value === "number" ? value : value}
          defaultValue={defaultValue}
          text={text}
          id={id}
          handleChange={handleChangeInput}
          handleFocus={handleFocus}
          ml={ml}
          placeholder={placeholder || "-"}
          className="maintenance_input"
          readonly={readonly && readonly}
          LabelClassName={LabelClassName}
        />
        <span
          className={`material-symbols-outlined position-absolute ${
            disabled ? "d-none" : ""
          }`}
          style={{
            top: top
              ? top
              : mdCol === 12
              ? "50%"
              : mdCol === 11
              ? "51%"
              : mdCol === 10
              ? "25%"
              : mdCol === 2
              ? "50%"
              : "51%",
            right: right
              ? right
              : mdCol === 12
              ? "5%"
              : mdCol === 11
              ? "6%"
              : mdCol === 10
              ? "25%"
              : mdCol === 2
              ? "5%"
              : "6%",
          }}
        >
          expand_more
        </span>
      </div>
      {showResults && (
        <>
          <ul
            className={`input-box-dropdown-result px-2 rounded py-1 ${
              ulClass && ulClass
            }`}
            style={{
              ...defaultUlStyle,
              ...(ulStyle || {}),
            }}
            id="batch_editing_dropdown_menu"
          >
            {result(handleClose)}
          </ul>
          <div
            className="sidepanel-overlay"
            style={{ background: "none", zIndex: 1 }}
            onClick={handleClose}
          />
        </>
      )}
    </div>
  );
};

export default InputBoxDropDown;
