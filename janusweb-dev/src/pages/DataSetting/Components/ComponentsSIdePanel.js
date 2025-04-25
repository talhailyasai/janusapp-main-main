import { Form, Table } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";

import Button from "components/common/Button";
import { useTranslation } from "react-i18next";
import InputBoxDropDown from "components/common/InputBoxDropDown";
import { GetSearchUSystems } from "lib/USystemsLib";
import CustomModal from "components/common/Modals/customModal";
import TextAreaBox from "components/common/TextArea";

const ComponentsSidePanel = ({
  handleSubmit,
  close,
  initalVal,
  newTask,
  handleClose,
}) => {
  const [modifyProperty, setModifyProperty] = useState(initalVal);
  const [systemCodeChange, setSystemCodeChange] = useState();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(null);
  const [state, setState] = useState(null);
  const [text, setText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [size, setSize] = useState("lg");
  const [theme, setTheme] = useState("dark");

  const { value: systemCodeData } = GetSearchUSystems(
    systemCodeChange || undefined,
    {},
    [systemCodeChange]
  );
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModifyProperty((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  const handleUsystemChange = (value) => {
    setModifyProperty((prev) => ({
      ...prev,
      u_system: value.toUpperCase(),
    }));
  };

  const getBody = (
    <TextAreaBox
      mdCol={12}
      stylesTrue={false}
      rows={9}
      id={state}
      value={text?.toUpperCase()}
      handleChange={(e) => {
        setText(e.target.value.toUpperCase());
      }}
    />
  );

  const tableBody = (
    <div>
      <Form.Control
        type="text"
        placeholder={t("common.pages.search")}
        // onChange={(e) => handleCompChangeTable(e.target.value)}
        style={{ width: "17rem", marginBottom: "1rem" }}
      />
      <div
        style={{
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <Table bordered hover>
          <thead>
            <tr>
              <th></th>
              <th>{t("property_page.system_code")}</th>
              <th>{t("common.pages.Name")}</th>
            </tr>
          </thead>

          <tbody>
            {state == "system_code" &&
              systemCodeData?.map((elem, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        style={{ transform: "scale(1.2)" }}
                        checked={elem?._id == selectedRow?._id ? true : false}
                        onChange={() => handleCheckRow(elem)}
                      />
                    </td>
                    <td>{elem?.system_code}</td>
                    <td>{elem?.system_name}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    </div>
  );

  const handleCheckRow = (elem) => {
    if (selectedRow?._id == elem?._id) {
      setSelectedRow(null);
    } else {
      setSelectedRow(elem);
    }
  };
  const handleTableSubmit = () => {
    if (!selectedRow) return;
    setModifyProperty((prev) => ({
      ...prev,
      u_system: selectedRow?.system_code,
    }));
    setOpen(false);
    setSelectedRow(null);
  };
  const handleSubmitText = () => {
    setModifyProperty((prev) => ({
      ...prev,
      [state]: text,
    }));
    setOpen(false);
  };

  useEffect(() => {
    console.log("modifyProperty", modifyProperty);
  }, [modifyProperty]);
  return (
    <div>
      <Form
        onSubmit={(e) => {
          handleSubmit(e, modifyProperty);
        }}
      >
        <SidePanel>
          <SidePanelHeader>
            {initalVal?._id ? t("common.pages.modify") : t("common.pages.new")}{" "}
            {t("property_page.components")}
          </SidePanelHeader>
          <SidePanelBody>
            <div className="activity-input-container">
              <Form.Group>
                <Form.Label>{t("data_settings.component_code")}</Form.Label>
                <Form.Control
                  name="u_component_abbreviation"
                  type="text"
                  required={true}
                  placeholder={"-"}
                  onChange={handleChange}
                  value={
                    modifyProperty?.u_component_abbreviation ||
                    initalVal?.u_component_abbreviation?.toUpperCase()
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("data_settings.component_name")}</Form.Label>
                <Form.Control
                  name="u_component_name"
                  type="text"
                  required={true}
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.u_component_name}
                />
              </Form.Group>
              <InputBoxDropDown
                mdCol={12}
                value={modifyProperty?.u_system}
                text={
                  <div style={{ display: "flex", columnGap: "176px" }}>
                    <div>{t("property_page.system_code")}</div>
                    {/* {sidePanel && ( */}
                    <span
                      class="material-symbols-outlined text-black"
                      style={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "27px",
                      }}
                      onClick={() => {
                        setState("system_code");
                        setTitle(
                          `${
                            t("common.pages.search") +
                            " " +
                            t("property_page.system_code")
                          }`
                        );
                        setTheme("dark");
                        setSize("xl");
                        let element = systemCodeData?.find(
                          (el) => el?.system_code == modifyProperty?.u_system
                        );
                        if (element) setSelectedRow(element);
                        setOpen(true);
                      }}
                    >
                      more_horiz
                    </span>
                    {/* )} */}
                  </div>
                }
                id={"u_system"}
                handleSubmit={(value) => setSystemCodeChange(value)}
                handleChange={(e) => handleUsystemChange(e.target.value)}
                result={(handleClose) =>
                  systemCodeData?.map((item) => (
                    <li
                      onClick={() => {
                        handleUsystemChange(item?.system_code);
                        handleClose();
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {item.system_code +
                        " " +
                        item.system_name.split(" ").slice(0, 3).join(" ")}
                    </li>
                  ))
                }
              />
              {/* <Form.Group>
              <Form.Label>System</Form.Label>
              <Form.Control
                name="u_system"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.u_system}
              />
            </Form.Group> */}
              <Form.Group>
                <Form.Label>
                  {t("data_settings.interval_attendance")}
                </Form.Label>
                <Form.Control
                  as="select"
                  name="attendance_interval_value"
                  // required={required}
                  value={modifyProperty?.attendance_interval_value}
                  onChange={handleChange}
                  className="dropdown-icon"
                >
                  <option value="" defaultChecked>
                    -
                  </option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]?.map((option) => (
                    <option value={option}>{option}</option>
                  ))}
                </Form.Control>
                {/* <Form.Control
                  name="attendance_interval_value"
                  type="text"
                  required={true}
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.attendance_interval}
                /> */}
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  {t("property_page.attendance_interval_unit")}
                </Form.Label>
                <Form.Control
                  as="select"
                  name="attendance_interval_unit"
                  value={modifyProperty?.attendance_interval_unit}
                  onChange={handleChange}
                  className="dropdown-icon"
                >
                  <option value="" defaultChecked>
                    -
                  </option>
                  {["DAY", "WEEKS", "MONTH", "YEAR"]?.map((option) => (
                    <option value={option}>{option}</option>
                  ))}
                </Form.Control>
                {/* <Form.Control
                  name="attendance_interval_unit"
                  type="text"
                  required={true}
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.attendance_interval_unit}
                /> */}
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("data_settings.time_attendance")}</Form.Label>
                <Form.Control
                  name="attendance_budget_time"
                  type="Number"
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.attendance_budget_time}
                />
              </Form.Group>
              <Form.Group>
                {/* <Form.Control
                  name="attendance_text"
                  type="text"
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.textAttendance}
                /> */}
                <div className="col-md-12">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Form.Label>
                      {t("data_settings.text_attandance")}
                    </Form.Label>
                    {/* {sidePanel && ( */}
                    <span
                      class="material-symbols-outlined text-black"
                      style={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "27px",
                      }}
                      onClick={() => {
                        setState("attendance_text");
                        setTitle(`${t("common.sidebar.attendance")} Text`);
                        setSize("lg");
                        setTheme("light");
                        setOpen(true);
                        setText(modifyProperty?.attendance_text);
                      }}
                    >
                      more_horiz
                    </span>
                    {/* )} */}
                  </div>
                  <div
                    className="component-activity-details"
                    style={{
                      backgroundColor: "rgb(245, 248, 251)",
                      padding: "0",
                      color: "black",
                      fontWeight: "bold",
                      height: "fit-content",
                      border: "1px solid black",
                      marginTop: 0,
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <TextAreaBox
                        // {...defaultProps}
                        required={false}
                        mdCol={12}
                        stylesTrue={false}
                        rows={3}
                        id={"attendance_text"}
                        onChange={handleChange}
                        value={modifyProperty?.attendance_text}
                        name="attendance_text"
                      />
                    </div>
                  </div>
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("data_settings.interval_maint")} </Form.Label>
                <Form.Control
                  name="maintenance_interval_value"
                  type="text"
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.maintenance_interval}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  {t("property_page.maintenance_interval_unit")}
                </Form.Label>
                <Form.Control
                  name="maintenance_interval_unit"
                  type="text"
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.maintenance_interval_unit}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("data_settings.time_maint")}</Form.Label>
                <Form.Control
                  name="maintenance_budget_time"
                  type="number"
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.maintenance_budget_time}
                />
              </Form.Group>
              <Form.Group>
                {/* <Form.Control
                  name="maintenance_text"
                  type="text"
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.maintenance_text}
                /> */}
                <div className="col-md-12">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Form.Label>{t("data_settings.text_maint")}</Form.Label>
                    {/* {sidePanel && ( */}
                    <span
                      class="material-symbols-outlined text-black"
                      style={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "27px",
                      }}
                      onClick={() => {
                        setState("maintenance_text");
                        setTitle(`${t("common.sidebar.maintainence")} Text`);
                        setSize("lg");
                        setTheme("light");
                        setOpen(true);
                        setText(modifyProperty?.maintenance_text);
                      }}
                    >
                      more_horiz
                    </span>
                    {/* )} */}
                  </div>
                  <div
                    className="component-activity-details"
                    style={{
                      backgroundColor: "rgb(245, 248, 251)",
                      padding: "0",
                      color: "black",
                      fontWeight: "bold",
                      height: "fit-content",
                      border: "1px solid black",
                      marginTop: 0,
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <TextAreaBox
                        // {...defaultProps}
                        required={false}
                        mdCol={12}
                        stylesTrue={false}
                        rows={3}
                        id={"maintenance_text"}
                        onChange={handleChange}
                        value={modifyProperty?.maintenance_text}
                        name="maintenance_text"
                      />
                    </div>
                  </div>
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("data_settings.interval_clean")}</Form.Label>
                <Form.Control
                  name="intervalClean"
                  type="text"
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.intervalClean}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("data_settings.time_clean")}</Form.Label>
                <Form.Control
                  name="cleaning_budget_time"
                  type="number"
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.timeClean}
                />
              </Form.Group>
              <Form.Group>
                {/* <Form.Label>{t("data_settings.text_clean")}</Form.Label> */}
                {/* <Form.Control
                  name="cleaning_text"
                  type="text"
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.textClean}
                /> */}

                <div className="col-md-12">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Form.Label>{t("data_settings.text_clean")}</Form.Label>
                    {/* {sidePanel && ( */}
                    <span
                      class="material-symbols-outlined text-black"
                      style={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "27px",
                      }}
                      onClick={() => {
                        setState("cleaning_text");
                        setTitle(t("data_settings.text_clean"));
                        setSize("lg");
                        setTheme("light");
                        setOpen(true);
                        setText(modifyProperty?.cleaning_text);
                      }}
                    >
                      more_horiz
                    </span>
                    {/* )} */}
                  </div>
                  <div
                    className="component-activity-details"
                    style={{
                      backgroundColor: "rgb(245, 248, 251)",
                      padding: "0",
                      color: "black",
                      fontWeight: "bold",
                      height: "fit-content",
                      border: "1px solid black",
                      marginTop: 0,
                    }}
                  >
                    <div className="d-flex justify-content-between">
                      <TextAreaBox
                        // {...defaultProps}
                        required={false}
                        mdCol={12}
                        stylesTrue={false}
                        rows={3}
                        id={"cleaning_text"}
                        onChange={handleChange}
                        value={modifyProperty?.cleaning_text}
                        name="cleaning_text"
                      />
                    </div>
                  </div>
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("common.pages.attributes")}</Form.Label>
                <Form.Control
                  name="attributes"
                  type="text"
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.attributes}
                />
              </Form.Group>
            </div>
          </SidePanelBody>
          <SidePanelFooter>
            <Button main type="submit">
              {t("planning_page.submit")}
            </Button>
            <Button
              secondary
              type="button"
              onClick={() => {
                handleClose();
                close();
              }}
            >
              {t("planning_page.cancel")}
            </Button>
          </SidePanelFooter>
        </SidePanel>
      </Form>
      <CustomModal
        theme={theme}
        open={open}
        setOpen={setOpen}
        title={title}
        cancelText={t("property_page.cancel")}
        okText={t("property_page.submit")}
        handleOk={state == "system_code" ? handleTableSubmit : handleSubmitText}
        body={state == "system_code" ? tableBody : getBody}
        size={size}
      />
    </div>
  );
};

export default ComponentsSidePanel;
