import React, { useEffect, useState } from "react";
import InputBox from "components/common/InputBox";
import {
  Button,
  Col,
  Form,
  Overlay,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "@themesberg/react-bootstrap";
import TextAreaBox from "components/common/TextArea";
import InputDropdown from "components/common/InputDropdown";
import { useTranslation } from "react-i18next";
import { GetSearchUSystems } from "lib/USystemsLib";
import InputBoxDropDown from "components/common/InputBoxDropDown";
import api from "api";
import Modal from "components/PlanningPage/MaintainancePage/components/Report/ActivitesYear/DeleteModal";
import "./MainData.css";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import CustomModal from "components/common/Modals/customModal";

const ChangeIntervalUnit = (unit, value) => {
  const singularValue = value == "1" ? true : false;
  if (singularValue) {
    switch (unit) {
      case "D":
        return "Day";
      case "V":
        return "Week";
      case "M":
        return "Month";
      case "Å":
        return "Year";
      default:
        return "";
    }
  }
  switch (unit) {
    case "D":
      return "Days";
    case "V":
      return "Weeks";
    case "M":
      return "Months";
    case "Å":
      return "Years";
    default:
      return "";
  }
};

const MainData = ({
  defaultProps,
  mdCol,
  sidePanel,
  modifyComponent,
  setModifyComponent,
  activityData,
  setSelectedActivity,
  handleChangeAction,
}) => {
  const { t } = useTranslation();
  //     Name Field option State
  const [allUComps, setAllUComps] = useState([]);
  const [dupUComps, setDupUComps] = useState([]);
  const [dupCodeData, setDupCodeData] = useState([]);

  const [UComp, setUComp] = useState(null);

  const { propertyChange, buildingChange, windowDimension } =
    usePropertyContextCheck();

  // Delete Modal State
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(null);
  const [state, setState] = useState(null);
  const [text, setText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [size, setSize] = useState("lg");
  const [theme, setTheme] = useState("dark");

  const [populateData, setPopulateData] = useState(false);

  const [systemCodeChange, setSystemCodeChange] = useState();
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState(null);

  const { value: systemCodeData } = GetSearchUSystems(
    systemCodeChange || undefined,
    {},
    [systemCodeChange]
  );

  const handleSelectSystemItem = (item) => {
    defaultProps.handleChange({
      target: { name: "u_system", value: item.system_code },
    });
  };

  useEffect(() => {
    setDupCodeData(systemCodeData);
  }, [systemCodeData, open]);

  const getUComponents = async () => {
    if (dupUComps?.length === 0) {
      try {
        let uComponents = await api.get("/u_components");

        // let all_u_Comps = uComponents?.data?.map((el) => {
        //   return {
        //     ...el,
        //     name: el?.u_component_abbreviation,
        //     value: el?._id,
        //   };
        // });
        setAllUComps(uComponents?.data);
        setDupUComps(uComponents?.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const selectComponent = (elem) => {
    if (
      modifyComponent.attendance_lastest_date ||
      modifyComponent.attendance_interval_value ||
      modifyComponent.attendance_text
    ) {
      setShow(true);
    } else {
      setPopulateData(true);
    }
    setUComp(elem);
    setModifyComponent((prev) => ({
      ...prev,
      name: elem?.u_component_abbreviation,
      long_name: elem?.u_component_name || elem?.long_name,
      u_system: elem?.u_system,
    }));
  };

  function DateInput(days, unit) {
    const today = new Date();
    if (unit === "D") {
      today.setDate(today.getDate() + days);
    } else if (unit === "V") {
      let weeks = days * 7;
      today.setDate(today.getDate() + weeks);
    } else if (unit === "M") {
      today.setMonth(today.getMonth() + days);
    } else if (unit === "Å") {
      today.setFullYear(today.getFullYear() + days);
    }
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const currentDate = `${year}-${month}-${day}`;
    return currentDate;
  }

  const handleChangeIntervels = (e, type) => {
    let updatedComp = {
      ...modifyComponent,
      [e.target.name]: e.target.value.toUpperCase(),
    };
    let {
      attendance_interval_value,
      attendance_interval_unit,
      attendance_lastest_date,

      maintenance_interval_unit,
      maintenance_interval_value,
    } = updatedComp;
    if (type === "attendance") {
      setModifyComponent({
        ...updatedComp,
        attendance_next_date: DateInput(
          parseInt(attendance_interval_value),
          attendance_interval_unit
        ),
      });
    } else {
      setModifyComponent({
        ...updatedComp,
        maintenance_next_date: DateInput(
          parseInt(maintenance_interval_value),
          maintenance_interval_unit
        ),
      });
    }
  };

  const handleUCompConfirmationModal = () => {
    if (populateData) {
      let clickComponent = dupUComps?.find((el) => el?._id === UComp?._id);
      let {
        attendance_interval_value,
        attendance_interval_unit,
        attendance_text,
        maintenance_interval_unit,
        maintenance_interval_value,
        maintenance_text,
      } = clickComponent;
      let atv = parseInt(attendance_interval_value);
      let mtv = parseInt(maintenance_interval_value);
      setModifyComponent((prev) => ({
        ...prev,
        attendance_interval_value,
        attendance_interval_unit,
        attendance_text,
        attendance_lastest_date: DateInput(0),
        attendance_next_date: DateInput(
          atv ? atv : 0,
          attendance_interval_unit
        ),

        maintenance_interval_value,
        maintenance_interval_unit,
        maintenance_text,
        maintenance_lastest_date: DateInput(0),
        maintenance_next_date: DateInput(
          mtv ? mtv : 0,
          maintenance_interval_unit
        ),
      }));
      // defaultProps.handleChange({
      //   target: { name: "attendance_interval_value", value: 4 },
      // });
      setPopulateData(false);
      setShow(false);
    }
  };

  // Delete Modal Function
  const deleteModalClose = () => {
    setShow(false);
  };

  const handleCompChange = (text, p) => {
    const filteredComps = dupUComps?.filter((el) =>
      el?.u_component_abbreviation?.toLowerCase()?.includes(text?.toLowerCase())
    );

    if (filteredComps.length === 0) {
      setAllUComps([]);
    }
    setAllUComps(filteredComps);
  };

  const handleCompChangeLongName = (text, p) => {
    const filteredComps = dupUComps?.filter((el) =>
      el?.u_component_name?.toLowerCase()?.includes(text?.toLowerCase())
    );

    if (filteredComps.length === 0) {
      setAllUComps([]);
    }
    setAllUComps(filteredComps);
  };

  const handleCompChangeTable = (text, p) => {
    setSearchValue(text?.toUpperCase());
    if (state == "comp_name") {
      setAllUComps(
        dupUComps?.filter((el) =>
          el?.u_component_abbreviation
            ?.toLowerCase()
            ?.includes(text?.toLowerCase())
        )
      );
    } else if (state == "comp_long_name") {
      setAllUComps(
        dupUComps?.filter((el) =>
          el?.u_component_name?.toLowerCase()?.includes(text?.toLowerCase())
        )
      );
    } else if (state == "system_code") {
      //debugger;
      setDupCodeData(
        systemCodeData?.filter((el) =>
          el?.system_code?.toLowerCase()?.includes(text?.toLowerCase())
        )
      );
    }
  };

  const getAllUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let allprofileUser = await api.get(`/users/adminId/${user?._id}`);
      setUsers(allprofileUser?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUComponents();
    getAllUser();
  }, []);

  useEffect(() => {
    handleUCompConfirmationModal();
  }, [populateData]);

  const handleCheckRow = (elem) => {
    if (selectedRow?._id == elem?._id) {
      setSelectedRow(null);
    } else {
      setSelectedRow(elem);
    }
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

  useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  const tableBody = (
    <div>
      <Form.Control
        type="text"
        placeholder={t("common.pages.search")}
        onChange={(e) => handleCompChangeTable(e.target.value)}
        style={{ width: "17rem", marginBottom: "1rem" }}
        value={searchValue?.toUpperCase()}
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
              {state !== "system_code" && (
                <th>{t("property_page.Abbreviation")}</th>
              )}
              <th>{t("property_page.system_code")}</th>
              <th>{t("common.pages.Name")}</th>
              {state !== "system_code" && (
                <th>{t("planning_page.technical_life")}</th>
              )}
            </tr>
          </thead>

          <tbody>
            {state !== "system_code" &&
              allUComps.length > 0 &&
              allUComps?.map((elem, index) => {
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
                    <td>{elem?.u_component_abbreviation}</td>
                    <td>{elem?.u_system}</td>
                    <td>{elem?.u_component_name}</td>
                    <td>{elem?.technical_life}</td>
                  </tr>
                );
              })}
            {state == "system_code" &&
              dupCodeData?.map((elem, index) => {
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

  const handleSubmit = () => {
    setModifyComponent((prev) => ({
      ...prev,
      [state]: text,
    }));
    setOpen(false);
  };

  const handleTableSubmit = () => {
    if (!selectedRow) return;
    if (state == "comp_name" || state == "comp_long_name") {
      selectComponent(selectedRow);
    }
    if (state == "system_code") {
      setModifyComponent((prev) => ({
        ...prev,
        u_system: selectedRow?.system_code,
      }));
    }
    setOpen(false);
    setSelectedRow(null);
  };
  // console.log({ dupCodeData });
  return (
    <>
      <div className="d-flex flex-wrap flex-xl-nowrap">
        <Row>
          <InputBox
            mdCol={mdCol ?? 4}
            {...defaultProps}
            name="component_code"
            text={
              t("property_page.component_code") + t("property_page.Barcode")
            }
            id={"component_code"}
            desc={sidePanel ? t("property_page.enter_component") : false}
            pattern="[a-zA-Z0-9]{6}"
            value={modifyComponent?.component_code}
            required={true}
          />
          <InputBox
            mdCol={mdCol ?? 4}
            {...defaultProps}
            text={t("property_page.property_number")}
            // required={true}
            // disabled={newTask ? false : true}
            id={"property_code"}
            value={propertyChange}
            // value={modifyComponent.property_code}
            disabled
          />
          <InputBox
            mdCol={mdCol ?? 4}
            {...defaultProps}
            text={t("property_page.building_number")}
            // required={true}
            // disabled={newTask ? false : true}
            id={"building_number"}
            // value={modifyComponent.building_number}
            value={buildingChange}
            disabled
          />
          <InputBoxDropDown
            {...defaultProps}
            // mdCol={12}
            required={true}
            mdCol={mdCol ?? 4}
            defaultValue={modifyComponent?.name ? modifyComponent?.name : ""}
            value={modifyComponent?.name}
            checkDropdown={sidePanel}
            matchedResults={allUComps}
            text={
              <div style={{ display: "flex", columnGap: "220px" }}>
                <div>{t("property_page.name")}</div>
                {sidePanel && (
                  <span
                    class="material-symbols-outlined text-black"
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "27px",
                    }}
                    onClick={() => {
                      setState("comp_name");
                      setTitle(
                        `${
                          t("common.pages.search") +
                          " " +
                          t("common.pages.component") +
                          " " +
                          t("common.pages.abbreviation")
                        }`
                      );
                      setSize("xl");
                      setTheme("dark");
                      setAllUComps(dupUComps);
                      let element = allUComps?.find(
                        (comp) =>
                          comp.u_component_abbreviation == modifyComponent?.name
                      );
                      if (element) setSelectedRow(element);
                      setOpen(true);
                    }}
                  >
                    more_horiz
                  </span>
                )}
              </div>
            }
            id={"name"}
            handleSubmit={handleCompChange}
            result={(handleClose) =>
              allUComps?.map((item) => (
                <li
                  onClick={() => {
                    selectComponent(item);
                    handleClose();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.u_component_abbreviation}
                </li>
              ))
            }
          />

          <InputBoxDropDown
            {...defaultProps}
            required={true}
            mdCol={mdCol ?? 4}
            defaultValue={
              modifyComponent?.long_name ? modifyComponent?.long_name : ""
            }
            value={modifyComponent?.long_name}
            checkDropdown={sidePanel}
            matchedResults={allUComps}
            text={
              <div style={{ display: "flex", columnGap: "186px" }}>
                <div>{t("property_page.long_name")}</div>
                {sidePanel && (
                  <span
                    class="material-symbols-outlined text-black"
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "27px",
                    }}
                    onClick={() => {
                      setState("comp_long_name");
                      setTitle(
                        `${
                          t("common.pages.search") +
                          " " +
                          t("common.pages.component") +
                          " " +
                          t("common.pages.name")
                        }`
                      );
                      setSize("xl");
                      setTheme("dark");
                      setAllUComps(dupUComps);
                      let element = allUComps?.find(
                        (comp) =>
                          comp.u_component_name == modifyComponent?.long_name
                      );
                      if (element) setSelectedRow(element);
                      setOpen(true);
                    }}
                  >
                    more_horiz
                  </span>
                )}
              </div>
            }
            id={"long_name"}
            handleSubmit={(text) => handleCompChangeLongName(text, "sub")}
            result={(handleClose) =>
              allUComps?.map((item) => (
                <li
                  onClick={() => {
                    selectComponent(item);
                    handleClose();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.u_component_name}
                </li>
              ))
            }
          />
          <InputBoxDropDown
            {...defaultProps}
            required={true}
            mdCol={mdCol ?? 4}
            value={modifyComponent?.u_system}
            checkDropdown={sidePanel}
            matchedResults={dupCodeData}
            text={
              <div style={{ display: "flex", columnGap: "176px" }}>
                <div>{t("property_page.system_code")}</div>
                {sidePanel && (
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
                        (el) => el?.system_code == modifyComponent?.u_system
                      );
                      if (element) setSelectedRow(element);
                      setOpen(true);
                    }}
                  >
                    more_horiz
                  </span>
                )}
              </div>
            }
            id={"u_system"}
            handleSubmit={(text) => setSystemCodeChange(text)}
            result={(handleClose) =>
              systemCodeData?.map((item) => (
                <li
                  onClick={() => {
                    handleSelectSystemItem(item);
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

          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("property_page.location")}
            // required={true}
            id={"position_of_code"}
            value={modifyComponent?.position_of_code}
          />
          {sidePanel ? (
            <Col md={sidePanel ? 12 : mdCol}>
              <Form.Group className="responsible">
                <Form.Label className="maindata_resposible resposible_user">
                  {t("property_page.responsible_user")}
                </Form.Label>
                <Form.Select
                  value={modifyComponent?.responsible_user?.toLowerCase() || ""}
                  id={"responsible_user"}
                  onChange={(e) => {
                    defaultProps.handleChange({
                      target: {
                        name: "responsible_user",
                        value: e.target.value,
                      },
                    });
                  }}
                  className="main_data_form_select"
                >
                  <option value={""} disabled>
                    -
                  </option>
                  {users?.map((elem) => {
                    return (
                      <option value={elem?.email?.toLowerCase()}>
                        {elem?.email}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
          ) : (
            <InputBox
              // {...defaultProps}
              text={t("property_page.responsible_user")}
              id={"responsible_user"}
              value={modifyComponent?.responsible_user || ""}
              disabled={true}
              mdCol={mdCol}
              className={`main_data_form_select select-no-arrow`}
            />
          )}

          {/* <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("property_page.responsible_user")}
            id={"changed_by"}
            value={modifyComponent.changed_by}
          /> */}
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("property_page.contract")}
            id={"contracted"}
            value={modifyComponent?.contracted}
          />
        </Row>
        {!sidePanel && (
          <div
            style={{
              maxWidth: "900px",
              minWidth: "400px",
              margin: "0 20px ",
            }}
          >
            <label
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                color: "black",
              }}
            >
              {t("property_page.activities")}
            </label>
            <div
              className="component-activity-details mainData_activites maindata_activities"
              style={{
                backgroundColor: "rgb(245, 248, 251)",
                color: "black",
                fontWeight: "bold",
                border: "1px solid black",
                marginTop: 0,
              }}
            >
              <Table bordered>
                <thead>
                  {
                    activityData?.map((item) => (
                      <OverlayTrigger
                        overlay={
                          <Tooltip className="maindata_property">
                            <p className="activites_date activites_mainData">
                              {item?.date &&
                                new Date(item?.date)
                                  .toISOString()
                                  .substring(0, 10)}
                            </p>
                            <p className="activites_date activites_mainData">
                              {item?.activity}
                            </p>
                            <p className="activites_date activites_mainData">
                              {item?.user}{" "}
                            </p>
                          </Tooltip>
                        }
                      >
                        <tr onClick={() => setSelectedActivity(item)}>
                          <>
                            <th>
                              {item?.date &&
                                new Date(item?.date)
                                  .toISOString()
                                  .substring(0, 10)}
                            </th>
                            <th>
                              {item?.activity?.length > 9
                                ? item?.activity?.substring(0, 9)
                                : item?.activity}
                            </th>
                            <th>
                              {" "}
                              {item?.user?.length > 6
                                ? `${item?.user?.substring(0, 6)}...`
                                : item?.user}
                            </th>
                          </>
                        </tr>
                      </OverlayTrigger>
                      /* <div>
               <span
                 style={{ cursor: "pointer" }}
                 className="material-symbols-outlined maindata_activites_edit"
                 onClick={() => handleChangeAction("modify_activity")}
               >
                 edit
               </span>
               <span
                 style={{ cursor: "pointer" }}
                 className="material-symbols-outlined maindata_activites_edit"
                 onClick={() => handleChangeAction("delete_activity")}
               >
                 delete
               </span>
             </div> */
                    ))
                    //  {/* </div> */}
                  }
                </thead>
              </Table>
            </div>
          </div>
        )}
      </div>
      <Row
        style={{
          flexDirection: sidePanel || windowDimension < 1400 ? "column" : "row",
        }}
      >
        <Col className={sidePanel ? " m-0 border-0" : "mt-5"}>
          <label
            className="mt-2 text-center bg-dark text-light rounded"
            style={{ fontSize: "17px", width: "100%" }}
          >
            {t("property_page.attendance")}
          </label>
          <Row className="mt-3">
            <InputBox
              {...defaultProps}
              handleChange={(e) => handleChangeIntervels(e, "attendance")}
              mdCol={6}
              type={"number"}
              text={t("property_page.interval_value")}
              id={"attendance_interval_value"}
              value={modifyComponent?.attendance_interval_value}
            />
            <InputDropdown
              {...defaultProps}
              handleChange={(e) => handleChangeIntervels(e, "attendance")}
              options={[
                { value: "D", label: t("property_page.days") },
                { value: "V", label: t("property_page.Weeks") },
                { value: "M", label: t("property_page.Months") },
                { value: "Å", label: t("property_page.Years") },
              ]}
              mdCol={6}
              text={t("property_page.interval_unit")}
              id={"attendance_interval_unit"}
              value={modifyComponent?.attendance_interval_unit}
            />
            <InputBox
              {...defaultProps}
              mdCol={6}
              type={"date"}
              text={t("property_page.last")}
              id={"attendance_lastest_date"}
              value={modifyComponent?.attendance_lastest_date}
            />
            <InputBox
              {...defaultProps}
              mdCol={6}
              text={t("property_page.next")}
              id={"attendance_next_date"}
              type={"date"}
              value={modifyComponent?.attendance_next_date}
            />
            <div className="col-md-12">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "black",
                  }}
                >
                  {t("property_page.text")}
                </label>

                {sidePanel && (
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
                      setText(modifyComponent?.attendance_text);
                    }}
                  >
                    more_horiz
                  </span>
                )}
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
                    {...defaultProps}
                    mdCol={12}
                    stylesTrue={false}
                    rows={3}
                    id={"attendance_text"}
                    value={modifyComponent?.attendance_text}
                  />
                </div>
              </div>
            </div>
          </Row>
        </Col>
        <Col className={sidePanel ? " m-0 border-0" : "mt-5"}>
          <label
            className="mt-2 text-center bg-dark text-light rounded"
            style={{ fontSize: "17px", width: "100%" }}
          >
            {t("property_page.maintainence")}
          </label>
          <Row className="mt-3">
            <InputBox
              {...defaultProps}
              handleChange={(e) => handleChangeIntervels(e, "maintenance")}
              mdCol={6}
              text={t("property_page.interval_value")}
              type={"number"}
              id={"maintenance_interval_value"}
              value={modifyComponent?.maintenance_interval_value}
            />
            <InputDropdown
              {...defaultProps}
              handleChange={(e) => handleChangeIntervels(e, "maintenance")}
              mdCol={6}
              options={[
                { value: "D", label: t("property_page.days") },
                { value: "V", label: t("property_page.Weeks") },
                { value: "M", label: t("property_page.Months") },
                { value: "Å", label: t("property_page.Years") },
              ]}
              text={t("property_page.interval_unit")}
              id={"maintenance_interval_unit"}
              value={modifyComponent?.maintenance_interval_unit}
            />
            <InputBox
              {...defaultProps}
              mdCol={6}
              type={"date"}
              text={t("property_page.last")}
              id={"maintenance_lastest_date"}
              value={modifyComponent?.maintenance_lastest_date}
            />

            {/*  */}
            <InputBox
              {...defaultProps}
              mdCol={6}
              text={t("property_page.next")}
              id={"maintenance_next_date"}
              value={modifyComponent?.maintenance_next_date}
              type={"date"}
            />
            <div className="col-md-12">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "black",
                  }}
                >
                  {t("property_page.text")}
                </label>
                {sidePanel && (
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
                      setOpen(true);
                      setTheme("light");
                      setText(modifyComponent?.maintenance_text);
                    }}
                  >
                    more_horiz
                  </span>
                )}
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
                    {...defaultProps}
                    mdCol={12}
                    stylesTrue={false}
                    rows={3}
                    id={"maintenance_text"}
                    value={modifyComponent?.maintenance_text}
                  />
                </div>
              </div>
            </div>
          </Row>
        </Col>
        <Col className={sidePanel ? " m-0 border-0" : "mt-5"}>
          <label
            className="mt-2 text-center bg-dark text-light rounded"
            style={{ fontSize: "17px", width: "100%" }}
          >
            {t("property_page.cleaning")}
          </label>
          <Row className="mt-3">
            <InputBox
              {...defaultProps}
              mdCol={6}
              text={t("property_page.interval_value")}
              type={"number"}
              id={"cleaning_interval_value"}
              value={modifyComponent?.cleaning_interval_value}
            />
            <InputDropdown
              {...defaultProps}
              mdCol={6}
              options={[
                { value: "D", label: t("property_page.days") },
                { value: "V", label: t("property_page.Weeks") },
                { value: "M", label: t("property_page.Months") },
                { value: "Å", label: t("property_page.Years") },
              ]}
              text={t("property_page.interval_unit")}
              id={"cleaning_interval_unit"}
              value={modifyComponent?.cleaning_interval_unit}
            />
            <InputBox
              {...defaultProps}
              mdCol={6}
              type={"date"}
              text={t("property_page.last")}
              id={"cleaning_lastest_date"}
              value={modifyComponent?.cleaning_lastest_date}
            />
            <InputBox
              {...defaultProps}
              mdCol={6}
              type={"date"}
              text={t("property_page.next")}
              id={"cleaning_next_date"}
              value={modifyComponent?.cleaning_next_date}
            />
            <div className="col-md-12">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "black",
                  }}
                >
                  {t("property_page.text")}
                </label>
                {sidePanel && (
                  <span
                    class="material-symbols-outlined text-black"
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "27px",
                    }}
                    onClick={() => {
                      setState("cleaning_text");
                      setTitle(`${t("property_page.cleaning")} Text`);
                      setOpen(true);
                      setText(modifyComponent?.cleaning_text);
                      setTheme("light");
                    }}
                  >
                    more_horiz
                  </span>
                )}
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
                    {...defaultProps}
                    mdCol={12}
                    stylesTrue={false}
                    rows={3}
                    id={"cleaning_text"}
                    value={modifyComponent?.cleaning_text}
                  />
                </div>
              </div>
            </div>
          </Row>
        </Col>
        <Col className={sidePanel ? " m-0 border-0" : "mt-5"}>
          <label
            className="mt-2 text-center bg-dark text-light rounded"
            style={{ fontSize: "17px", width: "100%" }}
          >
            {t("property_page.inspection")}
          </label>
          <Row className="mt-3">
            <InputBox
              {...defaultProps}
              mdCol={6}
              text={t("property_page.interval_value")}
              type={"number"}
              id={"inspection_interval"}
              value={modifyComponent?.inspection_interval_value}
            />
            <InputDropdown
              {...defaultProps}
              mdCol={6}
              options={[
                { value: "D", label: t("property_page.days") },
                { value: "V", label: t("property_page.Weeks") },
                { value: "M", label: t("property_page.Months") },
                { value: "Å", label: t("property_page.Years") },
              ]}
              text={t("property_page.interval_unit")}
              id={"inspection_interval_unit"}
              value={modifyComponent?.inspection_interval_unit}
            />
            <InputBox
              {...defaultProps}
              mdCol={6}
              type={"date"}
              text={t("property_page.last")}
              id={"inspection_lastest_date"}
              value={modifyComponent?.inspection_lastest_date}
            />
            <InputBox
              {...defaultProps}
              mdCol={6}
              text={t("property_page.next")}
              type={"date"}
              id={"inspection_next_date"}
              value={modifyComponent?.inspection_next_date}
            />
            <div className="col-md-12">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "black",
                  }}
                >
                  {t("property_page.text")}
                </label>
                {sidePanel && (
                  <span
                    class="material-symbols-outlined text-black"
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "27px",
                    }}
                    onClick={() => {
                      setState("inspection_text");
                      setTitle(`${t("common.sidebar.inspection")} Text`);
                      setOpen(true);
                      setTheme("light");
                      setText(modifyComponent?.inspection_text);
                    }}
                  >
                    more_horiz
                  </span>
                )}
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
                    {...defaultProps}
                    stylesTrue={false}
                    mdCol={12}
                    rows={3}
                    id={"inspection_text"}
                    value={modifyComponent?.inspection_text}
                  />
                </div>
              </div>
            </div>
          </Row>
        </Col>
      </Row>
      {/*  Modal */}
      {show && (
        <Modal
          deleteModalClose={deleteModalClose}
          show={show}
          propertyModal={true}
          setPopulateData={setPopulateData}
        />
      )}
      <CustomModal
        theme={theme}
        open={open}
        setOpen={setOpen}
        title={title}
        cancelText={t("property_page.cancel")}
        okText={t("property_page.submit")}
        handleOk={
          state == "comp_name" ||
          state == "comp_long_name" ||
          state == "system_code"
            ? handleTableSubmit
            : handleSubmit
        }
        body={
          state == "comp_name" ||
          state == "comp_long_name" ||
          state == "system_code"
            ? tableBody
            : getBody
        }
        size={size}
      />
    </>
  );
};

export default MainData;
