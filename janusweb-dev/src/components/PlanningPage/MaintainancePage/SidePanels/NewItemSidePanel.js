import React, { useEffect, useState } from "react";
import DisabledInputBox from "components/common/InputBox";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";
import { CreateNewPlanning, EditPlanningById } from "lib/PlanningLib";
import CheckBox from "components/common/CheckBox";
import { usePlanningContextCheck } from "context/SidebarContext/PlanningContextCheck";
import InputBoxDropDown from "components/common/InputBoxDropDown";
import { GetSingleMaintainceItemByArticleCode } from "lib/MaintainceItemLib";
import { GetSearchUSystems } from "lib/USystemsLib";
import Button from "components/common/Button";
import { useTranslation } from "react-i18next";
import {
  Col,
  Dropdown,
  Form,
  Row,
  Spinner,
  Table,
} from "@themesberg/react-bootstrap";
import { FaCaretDown } from "react-icons/fa";
// import plan_icon from "assets/img/report/plan_dropdown.png";
// import akut_icon from "assets/img/report/akut_dropdown.png";
// import efter_icon from "assets/img/report/efter_dropdown.png";
// import beslu_icon from "assets/img/report/Beslu_dropdown.png";
// import Utford_icon from "assets/img/report/utford_dropdown.png";
import api from "api";
import { useHistory } from "react-router-dom";
import CustomModal from "components/common/Modals/customModal";
import Loader from "components/common/Loader";
import { toast } from "react-toastify";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

const NewItemPlanningModal = ({
  close,
  newItem,
  handleClose,
  modifyItem,
  id,
  defaultValue = {},
}) => {
  const history = useHistory();
  const [data, setData] = useState(defaultValue);
  const [articleCodeChange, setArticleCodeChange] = useState();
  const [systemCodeChange, setSystemCodeChange] = useState();

  const {
    setSettingsFormData: setMaintenanceSetting,
    settingsFormData: maintenanceSetting,
  } = usePropertyContextCheck();

  const [checkBoxState, setCheckBoxState] = useState(true);

  const [planCount, setPlanCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingDelay = 300;
  // Status State
  const [status, setStatus] = useState(null);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(null);
  const [state, setState] = useState(null);
  const [text, setText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [size, setSize] = useState("lg");
  const { value: articleCodeData, loading: isLoading } =
    GetSingleMaintainceItemByArticleCode(articleCodeChange || undefined, {}, [
      articleCodeChange,
    ]);

  const [allArticleCodeData, setAllArticleCodeData] = useState([]);
  const [allSystemCodeData, setAllSystemCodeData] = useState([]);
  const { value: systemCodeData, loading: isSystemCodeLoading } =
    GetSearchUSystems(systemCodeChange || undefined, {}, [systemCodeChange]);

  useEffect(() => {
    setAllArticleCodeData(articleCodeData);
    setAllSystemCodeData(systemCodeData);
  }, [articleCodeData, systemCodeData]);

  const { buildingChange, planningChange, setReloadCreateEdit } =
    usePlanningContextCheck();

  // console.log("modifyItem data", data, modifyItem);
  useEffect(() => {
    if (defaultValue?.status) {
      setStatus(defaultValue?.status);
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (status) {
      data.status = status;
    } else {
      data.status = "Planerad";
    }
    const user = JSON.parse(localStorage.getItem("user"))?._id;
    data.total_cost = data?.price_per_unit * data.quantity || 0;
    if (newItem) {
      // Create Api
      let values = [
        {
          ...data,
          building_code: buildingChange,
          property_code: planningChange,
        },
      ];
      await CreateNewPlanning({
        body: JSON.stringify({ data: values, user, multiple: checkBoxState }),
      }).then((res) => {
        // history.push("/maintainence");
        // window.location.reload();
        handleClose && handleClose();
      });
    } else if (modifyItem) {
      // Create Api
      await EditPlanningById(id, {
        body: JSON.stringify({
          ...data,
        }),
      }).then((res) => {
        // window.location.reload();
        handleClose && handleClose();
      });
    }
    setStatus(null);
    setLoading(false);
    setReloadCreateEdit(true);
    handleClose && handleClose();
  };
  const handleSelectArticleItem = (item) => {
    setData({
      ...data,
      article: item.article,
      maintenance_activity: item.maintenance_activity,
      technical_life: item.technical_life,
      u_system: item.u_system,
      unit: item.unit,
      price_per_unit: parseInt(item.price_per_unit),
      total_cost: (
        (parseInt(item.quantity) || 0) * parseInt(item.price_per_unit)
      ).toLocaleString(),
      quantity: !isNaN(parseInt(item.default_amount))
        ? parseInt(item.default_amount)
        : "",
    });
  };
  const handleSelectSystemItem = (item) => {
    setData({
      ...data,
      u_system: item.system_code,
    });
  };

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setData({ ...data, [e.target.name]: e.target.checked });
    } else if (e.target.name === "text") {
      setData({ ...data, [e.target.name]: e.target.value });
    } else {
      setData({ ...data, [e.target.name]: e.target.value.toUpperCase() });
    }
  };
  const defaultProps = {
    handleChange: handleChange,
    required: true,
  };
  const { t } = useTranslation();

  const getMaintenanceSetting = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      let res = await api.get(`/maintenance_settings/${user._id}`);
      setMaintenanceSetting(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCalculatePlan = () => {
    let currYear = new Date().getFullYear();
    let startYear = parseInt(data?.start_year) || currYear;
    let technical_life = parseInt(data?.technical_life) || 0;
    // console.log("technical_life", technical_life,"startyear", startYear, maintenanceSetting?.plan_duration);
    let planYearsInterval =
      parseInt(maintenanceSetting?.plan_start_year) +
        parseInt(maintenanceSetting?.plan_duration) || 0;
    const planStartYear = parseInt(maintenanceSetting?.plan_start_year) || 2016;
    // console.log("startYear_Duration", planYearsInterval);
    let count = 0;
    if (
      maintenanceSetting?.plan_start_year &&
      maintenanceSetting?.plan_duration
    ) {
      if (technical_life === 0) {
        count = 1;
      } else {
        for (
          let year = startYear;
          year <= planYearsInterval;
          year += technical_life
        ) {
          if (year >= planStartYear) {
            count++;
          }
        }
      }
    }
    setPlanCount(count);
  };

  // useEffect(() => {
  //   getMaintenanceSetting();
  // }, []);
  useEffect(() => {
    handleCalculatePlan();
  }, [data?.start_year, data?.technical_life]);

  const handleCheckRow = (elem) => {
    if (selectedRow?._id == elem?._id) {
      setSelectedRow(null);
    } else {
      setSelectedRow(elem);
    }
  };

  const handleCompChange = (text) => {
    if (state === "article_code") {
      setArticleCodeChange(text);
    } else {
      setSystemCodeChange(text);
    }
    setIsTyping(true);
  };
  // console.log({ articleCodeData });

  const handleTableSubmit = () => {
    if (!selectedRow) return;
    if (state == "article_code") {
      handleSelectArticleItem(selectedRow);
      setOpen(false);
      setSelectedRow(null);
    } else if (state == "system_code") {
      handleSelectSystemItem(selectedRow);
      setOpen(false);
      setSelectedRow(null);
    }
  };
  useEffect(() => {
    if (
      open &&
      state === "article_code" &&
      (articleCodeData?.length === 0 || !articleCodeData)
    ) {
      setArticleCodeChange("");
    } else if (
      open &&
      state === "system_code" &&
      (systemCodeData?.length === 0 || !systemCodeData)
    ) {
      setSystemCodeChange("");
    }
  }, [open]);
  const tableBody = (
    <div>
      <div
        style={{
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        {state == "article_code" ? (
          <>
            <Form.Control
              type="text"
              placeholder={t("common.pages.search")}
              onChange={(e) => handleCompChange(e.target.value)}
              value={articleCodeChange}
              style={{
                width: "17rem",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            />
            {isLoading ? (
              <div>
                <Loader style={{ height: "100px" }} />
              </div>
            ) : (
              <Table bordered hover>
                <thead>
                  <tr>
                    <th></th>
                    <th>{t("planning_page.article")}</th>
                    <th>{t("planning_page.maintainence_activity")}</th>
                    <th>{t("common.pages.System")}</th>
                    <th>{t("planning_page.unit")}</th>
                    <th>{t("planning_page.technical_life")}</th>
                  </tr>
                </thead>
                <tbody>
                  {allArticleCodeData?.length > 0 &&
                    allArticleCodeData?.map((elem, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              style={{ transform: "scale(1.2)" }}
                              checked={
                                elem?._id == selectedRow?._id ? true : false
                              }
                              onChange={() => handleCheckRow(elem)}
                            />
                          </td>
                          <td>{elem?.article}</td>
                          <td>{elem?.maintenance_activity}</td>
                          <td>{elem?.u_system}</td>
                          <td>{elem?.unit}</td>
                          <td>{elem?.technical_life}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            )}
          </>
        ) : (
          <>
            <Form.Control
              type="text"
              placeholder={t("common.pages.search")}
              onChange={(e) => handleCompChange(e.target.value)}
              value={systemCodeChange}
              style={{
                width: "17rem",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            />
            <Table bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th>{t("common.pages.System")}</th>
                  <th>{t("common.pages.name")}</th>
                  {/* <th></th> */}
                </tr>
              </thead>

              <tbody>
                {allSystemCodeData?.length > 0 &&
                  allSystemCodeData?.map((elem, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            style={{ transform: "scale(1.2)" }}
                            checked={
                              elem?._id == selectedRow?._id ? true : false
                            }
                            onChange={() => handleCheckRow(elem)}
                          />
                        </td>
                        <td>{elem?.system_code}</td>
                        <td>{elem?.system_name}</td>
                        {/* <td>{elem?.system_code + " " + elem?.system_name}</td> */}
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <SidePanel>
        <SidePanelHeader>
          {newItem ? t("planning_page.add_new") : t("planning_page.change")}
          {" " + t("planning_page.maintenance_item")}
        </SidePanelHeader>
        <SidePanelBody>
          <div className="activity-input-container maintenance_item_sidepanel_main">
            <InputBoxDropDown
              {...defaultProps}
              className=""
              mdCol={12}
              defaultValue={newItem ? "" : data?.article}
              value={data?.article}
              text={
                <div style={{ display: "flex", columnGap: "180px" }}>
                  <div>{t("planning_page.article_code")}</div>
                  <span
                    class="material-symbols-outlined text-black"
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "27px",
                    }}
                    onClick={() => {
                      setState("article_code");
                      setTitle(
                        `${
                          t("common.pages.search") +
                          " " +
                          t("planning_page.article_code")
                        }`
                      );
                      setSize("xl");
                      // console.log(articleCodeData);
                      let element = articleCodeData?.find(
                        (comp) => comp.article == data?.article
                      );
                      if (element) {
                        setSelectedRow(element);
                        setAllArticleCodeData(articleCodeData);
                      }
                      setOpen(true);
                    }}
                  >
                    more_horiz
                  </span>
                </div>
              }
              id={"article"}
              handleSubmit={(text) => setArticleCodeChange(text)}
              result={(handleClose) =>
                allArticleCodeData?.map((item) => (
                  <li
                    onClick={() => {
                      handleSelectArticleItem(item);
                      handleClose();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {item.article +
                      " " +
                      item.maintenance_activity.substring(0, 20)}
                    {item.maintenance_activity.length > 20 ? "..." : ""}
                  </li>
                ))
              }
            />
            <DisabledInputBox
              {...defaultProps}
              mdCol={12}
              type={"number"}
              required={false}
              defaultValue={newItem ? "" : data?.technical_life}
              value={data?.technical_life}
              text={t("planning_page.technical_life")}
              id={"technical_life"}
            />
            <InputBoxDropDown
              {...defaultProps}
              mdCol={12}
              defaultValue={newItem ? "" : data?.u_system}
              value={data?.u_system}
              text={
                <div style={{ display: "flex", columnGap: "180px" }}>
                  <div>{t("planning_page.system_code")}</div>
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
                          t("planning_page.system_code")
                        }`
                      );
                      setSize("xl");
                      // console.log(systemCodeData);
                      let element = systemCodeData?.find(
                        (comp) => comp.system_code == data?.u_system
                      );
                      if (element) {
                        setSelectedRow(element);
                        setAllSystemCodeData(systemCodeData);
                      }
                      setOpen(true);
                    }}
                  >
                    more_horiz
                  </span>
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
            <DisabledInputBox
              {...defaultProps}
              mdCol={12}
              type={"number"}
              defaultValue={newItem ? "" : data?.quantity || "-"}
              value={data?.quantity || "-"}
              text={t("planning_page.quantity")}
              id={"quantity"}
            />
            <DisabledInputBox
              {...defaultProps}
              mdCol={12}
              defaultValue={newItem ? "" : data?.unit}
              value={data?.unit}
              text={t("planning_page.unit")}
              id={"unit"}
            />
            <DisabledInputBox
              {...defaultProps}
              mdCol={12}
              type={"number"}
              defaultValue={newItem ? "" : data?.price_per_unit || "-"}
              value={data?.price_per_unit}
              text={t("planning_page.unit_cost")}
              id={"price_per_unit"}
            />
            <DisabledInputBox
              {...defaultProps}
              mdCol={12}
              type={"number"}
              defaultValue={
                newItem
                  ? ""
                  : data?.price_per_unit && data?.quantity
                  ? data.price_per_unit * data.quantity
                  : data?.total_cost || "-"
              }
              value={(() => {
                const calculated =
                  data?.price_per_unit && data?.quantity
                    ? data.price_per_unit * data.quantity
                    : data?.total_cost;

                return calculated || "-";
              })()}
              text={t("planning_page.total_cost")}
              id={"total_cost"}
            />
            <DisabledInputBox
              {...defaultProps}
              mdCol={12}
              type={"number"}
              // handleFocus={() => {
              //   if (!data.start_year) {
              //     setData((prev) => ({
              //       ...prev,
              //       start_year: maintenanceSetting?.plan_start_year
              //         ? maintenanceSetting?.plan_start_year
              //         : new Date().getFullYear(),
              //     }));
              //   }
              // }}
              handleBlur={(e) => {
                const inputYear = parseInt(e.target.value);
                const minYear = parseInt(maintenanceSetting?.plan_start_year);
                const maxYear =
                  minYear + parseInt(maintenanceSetting?.plan_duration);

                if (inputYear < minYear || inputYear > maxYear) {
                  toast.info(
                    t("planning_page.start_year_must_be_between", {
                      minYear,
                      maxYear,
                    })
                  );
                  // Reset to min year if below min, max year if above max
                  const validYear =
                    inputYear < minYear || inputYear > minYear
                      ? minYear
                      : minYear;
                  setData((prev) => ({
                    ...prev,
                    start_year: validYear,
                  }));
                }
              }}
              value={data?.start_year}
              min={"1900"}
              max={"2100"}
              text={t("planning_page.start_year")}
              id={"start_year"}
            />
            <div className="maintenance_plan_checkBox_main">
              <Form.Check
                type="checkbox"
                id="checkboxId"
                checked={checkBoxState}
                onChange={() => setCheckBoxState(!checkBoxState)}
                className="plan_checkbox"
              />
              <span className="maintenance_plan_checkBox_text">
                {" "}
                {t(`planning_page.This will add `)} {planCount}{" "}
                {t(`planning_page.items to the plan`)}
              </span>
            </div>
            <DisabledInputBox
              {...defaultProps}
              mdCol={12}
              type={"number"}
              required={false}
              defaultValue={newItem ? "" : data?.previous_year}
              value={data?.previous_year}
              min={new Date().getFullYear() - 100}
              max={new Date().getFullYear() + 100}
              text={t("planning_page.previous_year")}
              id={"previous_year"}
            />
            <div>
              <Dropdown className="dropdown_year">
                <Dropdown.Toggle className="activites_year_dropdown activtesYear_dropdown_btn activites_dropdown">
                  <div className="status_color_main">
                    {status === "Planerad" ? (
                      <div className="plan_color_div dropdown_icon plan_color"></div>
                    ) : status === "Akut" ? (
                      <div className="plan_color_div dropdown_icon akut_color"></div>
                    ) : status === "Eftersatt" ? (
                      <div className="plan_color_div dropdown_icon efter_color"></div>
                    ) : status === "Beslutad" ? (
                      <div className="plan_color_div dropdown_icon beslu_color"></div>
                    ) : status === "Utförd" ? (
                      <div className="plan_color_div dropdown_icon utford_color"></div>
                    ) : (
                      <div className="plan_color_div dropdown_icon plan_color"></div>
                    )}
                    {status
                      ? t(`common.pages.${status}`)
                      : t(`common.pages.Planerad`)}
                  </div>
                  <FaCaretDown />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => setStatus("Planerad")}
                    className="plan_main"
                  >
                    <div className="plan_color_div dropdown_icon plan_color"></div>
                    {t(`common.pages.Planerad`)}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setStatus("Akut")}
                    className="plan_main"
                  >
                    <div className="plan_color_div dropdown_icon akut_color"></div>
                    {t(`common.pages.Akut`)}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setStatus("Eftersatt")}
                    className="plan_main"
                  >
                    <div className="plan_color_div dropdown_icon efter_color"></div>
                    {t(`common.pages.Eftersatt`)}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setStatus("Beslutad")}
                    className="plan_main"
                  >
                    <div className="plan_color_div dropdown_icon beslu_color"></div>
                    {t(`common.pages.Beslutad`)}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setStatus("Utförd")}
                    className="plan_main"
                  >
                    <div className="plan_color_div dropdown_icon utford_color"></div>
                    {t(`common.pages.Utförd`)}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="d-flex w-100 justify-content-between inspect_main">
              <CheckBox
                {...defaultProps}
                onChange={handleChange}
                text={t("planning_page.inspect")}
                required={false}
                id={"inspection_flag"}
                value={data?.inspection_flag}
                defaultChecked={newItem ? false : data?.inspection_flag}
              />
              <CheckBox
                {...defaultProps}
                onChange={handleChange}
                text={t("planning_page.risk")}
                required={false}
                id={"risk_flag"}
                value={data?.risk_flag}
                defaultChecked={newItem ? false : data?.risk_flag}
              />
              <CheckBox
                {...defaultProps}
                onChange={handleChange}
                text={t("planning_page.project")}
                required={false}
                id={"project_flag"}
                value={data?.project_flag}
                defaultChecked={newItem ? false : data?.project_flag}
              />
            </div>
            <div className="d-flex invest_main">
              <div style={{ flex: "1 0 40%" }}>
                <CheckBox
                  {...defaultProps}
                  onChange={handleChange}
                  text={t("planning_page.investment")}
                  required={false}
                  id={"invest_flag"}
                  value={data?.invest_flag}
                  defaultChecked={newItem ? false : data?.invest_flag}
                />
              </div>

              <div
                className="d-flex align-items-center justify-content-center mx-2"
                style={{ height: "103px" }}
              >
                <DisabledInputBox
                  {...defaultProps}
                  mdCol={4}
                  required={false}
                  id={"invest_percentage"}
                  value={data?.invest_percentage}
                  defaultChecked={newItem ? "" : data?.invest_percentage}
                  addItem={true}
                />
                <span className="mx-2">{t("planning_page.percent")}</span>
              </div>
            </div>
            <div className="d-flex invest_main">
              <div style={{ flex: "1 0 40%" }}>
                <CheckBox
                  {...defaultProps}
                  text={t("planning_page.energy_savings")}
                  onChange={handleChange}
                  required={false}
                  id={"energy_flag"}
                  value={data?.energy_flag}
                  defaultChecked={newItem ? false : data?.energy_flag}
                />
              </div>

              <div
                className="d-flex align-items-center justify-content-center mx-2"
                style={{ height: "103px" }}
              >
                <DisabledInputBox
                  {...defaultProps}
                  mdCol={4}
                  required={false}
                  id={"energy_save_percentage"}
                  value={data?.energy_save_percentage}
                  defaultChecked={newItem ? "" : data?.energy_save_percentage}
                  addItem={true}
                />
                <span className="mx-2">{t("planning_page.percent")}</span>
              </div>
            </div>
            <div className="inspect_main">
              Text
              <textarea
                {...defaultProps}
                required={false}
                onChange={handleChange}
                defaultValue={newItem ? "" : data?.text}
                value={data?.text}
                className="form-control"
                id="text"
                name="text"
                rows="3"
              ></textarea>
            </div>
          </div>
        </SidePanelBody>
        <SidePanelFooter>
          <Button main type="submit">
            {loading ? (
              <Spinner
                animation="border"
                size="sm"
                className="comp_pkg_spinner"
              />
            ) : (
              t("planning_page.submit")
            )}
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
      <CustomModal
        theme={"dark"}
        open={open}
        setOpen={setOpen}
        title={title}
        cancelText={t("property_page.cancel")}
        okText={t("property_page.submit")}
        handleOk={handleTableSubmit}
        body={tableBody}
        size={size}
      />
    </form>
  );
};

export default NewItemPlanningModal;
