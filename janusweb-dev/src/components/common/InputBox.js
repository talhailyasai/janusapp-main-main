import { Col, Form } from "@themesberg/react-bootstrap";

const InputBox = ({
  readonly,
  value,
  disabled,
  id,
  type,
  required = true,
  text,
  handleChange,
  handleFocus,
  handleBlur,
  defaultValue,
  mdCol,
  pattern,
  desc,
  addItem,
  ml,
  mb = addItem ? false : true,
  placeholder,
  infoTab,
  LabelClassName,
  inputClassName,
  inputStyle,
  ...props
}) => (
  <Col
    md={mdCol || 4}
    className={mb ? "mb-3" : ""}
    style={{ marginLeft: ml || "0rem", width: infoTab ? "90%" : "" }}
  >
    <Form.Group className="maintenance_sidepanel_input">
      {text && (
        <Form.Label
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            marginBottom: id === "contracted" ? "0rem" : "1px",
            color: "black",
          }}
          className={`${LabelClassName}`}
        >
          {text}
        </Form.Label>
      )}
      <Form.Control
        {...props}
        name={id}
        id={id}
        pattern={pattern}
        disabled={disabled}
        type={type || "text"}
        required={required}
        value={value}
        placeholder={placeholder || "-"}
        defaultValue={defaultValue || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        autoComplete="off"
        readOnly={readonly}
        style={
          inputStyle
            ? inputStyle
            : {
                backgroundColor: disabled ? "#D9D9D9" : "#e1e1e1",
                color: "black",
                fontWeight: "bold",
                height: "fit-content",
                border: "1px solid black",
              }
        }
        className={inputClassName}
      />
      <Form.Text style={{ color: "#898989" }}>{desc}</Form.Text>
    </Form.Group>
  </Col>
);
export default InputBox;
