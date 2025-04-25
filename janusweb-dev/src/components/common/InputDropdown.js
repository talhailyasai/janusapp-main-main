import { Col, Form } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import "./style.css";
const InputDropdown = ({
  value,
  disabled,
  id,
  required = true,
  text,
  handleChange,
  handleFocus,
  handleBlur,
  defaultValue,
  mdCol,
  desc,
  options,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Col md={mdCol || 4} className="mb-3">
      <Form.Group>
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
        <Form.Control
          as="select"
          {...props}
          name={id}
          id={id}
          disabled={disabled}
          required={required}
          value={value}
          defaultValue={defaultValue || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={`dropdown-icon ${disabled ? "select-no-arrow" : ""}`}
          style={{
            backgroundColor: disabled ? "#d9d9d9" : "#e1e1e1",
            color: "black",
            fontWeight: "bold",
            height: "fit-content",
            border: "1px solid black",
          }}
        >
          <option value="" defaultChecked>
            {t("property_page.None")}
          </option>
          {options?.map((option) => (
            <option
              key={option?.value ? option.value : option}
              value={option?.value ? option.value : option}
            >
              {option?.label ? option.label : option}
            </option>
          ))}
        </Form.Control>
        <Form.Text style={{ color: "#898989" }}>{desc}</Form.Text>
      </Form.Group>
    </Col>
  );
};

export default InputDropdown;
