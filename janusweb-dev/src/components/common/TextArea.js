import { Col, Form } from "@themesberg/react-bootstrap";

const TextAreaBox = ({
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
  rows,
  stylesTrue = true,
  styles = {},
  ...props
}) => (
  <Col md={mdCol || 4} className="mb-3">
    <Form.Group>
      {text && (
        <Form.Label
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            marginBottom: "1px",
            color: "black",
          }}
        >
          {text}
        </Form.Label>
      )}
      <Form.Control
        as={"textarea"}
        {...props}
        name={id}
        id={id}
        disabled={disabled}
        type={type || "text"}
        required={required}
        value={value}
        placeholder={"-"}
        defaultValue={defaultValue || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        rows={rows}
        style={{
          backgroundColor:
            stylesTrue && (disabled ? "rgb(195, 195, 195)" : "#e1e1e1"),
          color: stylesTrue && "black",
          fontWeight: stylesTrue && "bold",
          height: stylesTrue && "fit-content",
          border: stylesTrue && "1px solid black",
          ...styles,
        }}
      />
    </Form.Group>
  </Col>
);
export default TextAreaBox;
