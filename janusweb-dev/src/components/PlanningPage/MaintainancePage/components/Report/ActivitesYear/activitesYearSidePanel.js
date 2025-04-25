import {
  Col,
  Dropdown,
  Form,
  FormCheck,
  Row,
  Table,
} from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";
import Button from "components/common/Button";
import api from "api";
import { FaCaretDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CustomModal from "components/common/Modals/customModal";
import Loader from "components/common/Loader";
import { GetSingleMaintainceItemByArticleCode } from "lib/MaintainceItemLib";

const ActivitesYearSidePanel = ({
  handleSubmit,
  close,
  initalValue,
  isCopyItems,
  handleClose,
}) => {
  const [modifyProperty, setModifyProperty] = useState(initalValue);

  // properties State
  const [properties, setProperties] = useState(null);

  const [buildings, setBuildings] = useState(null);

  const [dupBuildings, setDupBuildings] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [articleCodeChange, setArticleCodeChange] = useState();
  const [allArticleCodeData, setAllArticleCodeData] = useState([]);
  const { t } = useTranslation();
  const { value: articleCodeData, loading: isLoading } =
    GetSingleMaintainceItemByArticleCode(articleCodeChange || undefined, {}, [
      articleCodeChange,
    ]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAllArticleCodeData(articleCodeData);
  }, [articleCodeData]);
  const handleChange = (e) => {
    setModifyProperty((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === "quantity") {
      setModifyProperty((prev) => ({
        ...prev,
        total_cost: e.target.value * modifyProperty.price_per_unit,
      }));
    }
    if (e.target.name === "price_per_unit") {
      setModifyProperty((prev) => ({
        ...prev,
        total_cost: e.target.value * modifyProperty.quantity,
      }));
    }
    if (e.target.name === "total_cost") {
      setModifyProperty((prev) => ({
        ...prev,
        price_per_unit: 0,
        quantity: 0,
      }));
    }
    if (
      e.target.name === "start_year" &&
      modifyProperty?.start_year.length === 0
    ) {
      setModifyProperty((prev) => ({
        ...prev,
        start_year: new Date().getFullYear(),
      }));
    }
  };

  const handleChangeStatus = (value) => {
    setModifyProperty((prev) => ({
      ...prev,
      status: value,
    }));
  };
  const handleFlagsChange = (e) => {
    setModifyProperty((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const getProperties = async () => {
    try {
      let res = await api.get(`/properties`);
      setProperties(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBuildings = async () => {
    try {
      let res = await api.get(`/buildings`);
      let filteredBuildings = res?.data?.filter((elem) => {
        return (
          elem?.property_code?.property_code === modifyProperty?.property_code
        );
      });

      setBuildings(filteredBuildings);
      setDupBuildings(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const propertyChange = async (e) => {
    try {
      setModifyProperty((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
      let selectedProperty = e.target.value;
      let filteredBuildings = dupBuildings.filter((elem) => {
        return elem?.property_code?.property_code === selectedProperty;
      });
      setBuildings(filteredBuildings);
    } catch (error) {
      console.log(error);
    }
  };

  const flagHandle = (flag) => {
    if (flag === "true" || flag === true) {
      return true;
    } else if (flag === "false" || flag === false || flag === "") {
      return false;
    }
  };
  useEffect(() => {
    getProperties();
    getBuildings();
  }, []);

  useEffect(() => {
    if (isCopyItems) {
      setModifyProperty({
        ...modifyProperty,
        total_cost: modifyProperty?.quantity * modifyProperty?.unit,
      });
    }
  }, []);
  const handleCheckRow = (elem) => {
    if (selectedRow?._id == elem?._id) {
      setSelectedRow(null);
    } else {
      setSelectedRow(elem);
    }
  };
  const handleTableSubmit = () => {
    if (!selectedRow) return;
    // console.log({ selectedRow });
    setModifyProperty({
      ...modifyProperty,
      article: selectedRow?.article,
      maintenance_activity: selectedRow?.maintenance_activity,
      technical_life: selectedRow?.technical_life,
      u_system: selectedRow?.u_system,
      unit: selectedRow?.unit,
      price_per_unit: parseInt(selectedRow?.price_per_unit),
      total_cost:
        (parseInt(selectedRow?.quantity) ||
        !isNaN(parseInt(selectedRow?.default_amount))
          ? parseInt(selectedRow?.default_amount)
          : 0) * parseInt(selectedRow?.price_per_unit),
      quantity: !isNaN(parseInt(selectedRow?.default_amount))
        ? parseInt(selectedRow?.default_amount)
        : "",
    });
    setOpen(false);
    setSelectedRow(null);
  };

  const tableBody = (
    <div>
      <div
        style={{
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <Form.Control
          type="text"
          placeholder={t("common.pages.search")}
          onChange={(e) => setArticleCodeChange(e.target.value)}
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
                          checked={elem?._id == selectedRow?._id ? true : false}
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
      </div>
    </div>
  );

  return (
    <>
      <Form
        onSubmit={(e) => {
          let flagsObj = {
            inspection_flag: flagHandle(modifyProperty?.inspection_flag),
            risk_flag: flagHandle(modifyProperty?.risk_flag),
            project_flag: flagHandle(modifyProperty?.project_flag),
            invest_flag: flagHandle(modifyProperty?.invest_flag),
            energy_flag: flagHandle(modifyProperty?.energy_flag),
          };
          let updatedObj = {
            ...modifyProperty,
            maintenance_activity:
              modifyProperty?.maintenance_activity?.toUpperCase(),
            ...flagsObj,
          };
          // setModifyProperty();
          handleSubmit(e, updatedObj, isCopyItems);
        }}
        className="activity-form-panel"
      >
        <SidePanel>
          <SidePanelHeader>
            {isCopyItems ? t("planning_page.copy") : t("planning_page.edit")}{" "}
            {t("planning_page.maintenance_item")}
          </SidePanelHeader>
          <SidePanelBody>
            <div className="activity-input-container">
              <Row style={{ marginBottom: "0.5rem" }}>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("common.pages.property")}</Form.Label>
                    <Form.Select
                      // as="select"
                      name="property_code"
                      placeholder={"-"}
                      onChange={propertyChange}
                      value={modifyProperty?.property_code}
                      disabled={!isCopyItems && true}
                    >
                      {properties?.map((el) => {
                        return (
                          <option value={el?.property_code}>{el?.name}</option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("common.pages.building")}</Form.Label>
                    <Form.Select
                      name="building_code"
                      // as="select"
                      placeholder={"-"}
                      onChange={handleChange}
                      value={modifyProperty?.building_code}
                      disabled={!isCopyItems && true}
                    >
                      {buildings?.map((el) => {
                        return (
                          <option value={el?.building_code}>{el?.name}</option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("planning_page.position")}</Form.Label>
                    <Form.Control
                      name="position"
                      type="text"
                      placeholder={"-"}
                      onChange={handleChange}
                      value={modifyProperty?.position}
                      disabled={!isCopyItems && true}
                      className="position_input"
                    />
                  </Form.Group>
                </Col>
                <Col lg={3}></Col>
              </Row>
              <Row style={{ marginBottom: "0.5rem" }}>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("planning_page.article_code")}</Form.Label>
                    <div className="position-relative">
                      <span
                        class="material-symbols-outlined text-black position-absolute"
                        style={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "27px",
                          top: "-30px",
                          right: "0px",
                        }}
                        onClick={() => {
                          // console.log(articleCodeData);
                          let element = articleCodeData?.find(
                            (comp) => comp.article == modifyProperty?.article
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

                      <Form.Control
                        name="article"
                        type="text"
                        placeholder={"-"}
                        onChange={handleChange}
                        value={modifyProperty?.article}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("common.pages.Activity")}</Form.Label>
                    <Form.Control
                      name="maintenance_activity"
                      type="text"
                      placeholder={"-"}
                      onChange={handleChange}
                      value={modifyProperty?.maintenance_activity}
                      style={{ textTransform: "uppercase" }}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("planning_page.interval")}</Form.Label>
                    <Form.Control
                      name="technical_life"
                      type="text"
                      placeholder={"-"}
                      onChange={handleChange}
                      value={modifyProperty?.technical_life}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("planning_page.system_code")}</Form.Label>
                    <Form.Control
                      name="u_system"
                      type="text"
                      placeholder={"-"}
                      onChange={handleChange}
                      value={modifyProperty?.u_system}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3}></Col>
              </Row>
              <Row style={{ marginBottom: "0.5rem" }}>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("planning_page.quantity")}</Form.Label>
                    <Form.Control
                      name="quantity"
                      type="number"
                      placeholder={"-"}
                      onChange={handleChange}
                      value={modifyProperty?.quantity}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("planning_page.unit")}</Form.Label>
                    <Form.Control
                      name="unit"
                      type="text"
                      placeholder={"-"}
                      onChange={handleChange}
                      value={modifyProperty?.unit}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("planning_page.unit_cost")}</Form.Label>
                    <Form.Control
                      name="price_per_unit"
                      type="number"
                      placeholder={"-"}
                      onChange={handleChange}
                      value={modifyProperty?.price_per_unit}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("planning_page.total_cost")}</Form.Label>
                    <Form.Control
                      name="total_cost"
                      type="number"
                      placeholder={"-"}
                      onChange={handleChange}
                      value={modifyProperty?.total_cost}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row style={{ marginBottom: "0.5rem" }}>
                <Col lg={3}>
                  <Form.Label>Status</Form.Label>
                  <Dropdown className="status_dropdown activites_year_Property">
                    <Dropdown.Toggle className="activites_year_dropdown activtesYear_dropdown_btn color-badge">
                      {modifyProperty?.status === "Planerad" ? (
                        <div className="plan_color_div dropdown_icon plan_color"></div>
                      ) : modifyProperty?.status === "Akut" ? (
                        <div className="plan_color_div dropdown_icon akut_color"></div>
                      ) : modifyProperty?.status === "Eftersatt" ? (
                        <div className="plan_color_div dropdown_icon efter_color"></div>
                      ) : modifyProperty?.status === "Beslutad" ? (
                        <div className="plan_color_div dropdown_icon beslu_color"></div>
                      ) : modifyProperty?.status === "Utförd" ? (
                        <div className="plan_color_div dropdown_icon utford_color"></div>
                      ) : null}
                      {modifyProperty?.status
                        ? t(`common.pages.${modifyProperty?.status}`)
                        : t("common.pages.choose")}
                      <FaCaretDown style={{ marginLeft: "0.4rem" }} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        className="plan_main"
                        onClick={() => handleChangeStatus("Planerad")}
                      >
                        <div className="plan_color_div dropdown_icon plan_color"></div>{" "}
                        {t("common.pages.Planerad")}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleChangeStatus("Akut")}
                        className="plan_main"
                      >
                        <div className="plan_color_div dropdown_icon akut_color"></div>
                        {t("common.pages.Akut")}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleChangeStatus("Eftersatt")}
                        className="plan_main"
                      >
                        <div className="plan_color_div dropdown_icon efter_color"></div>
                        {t("common.pages.Eftersatt")}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleChangeStatus("Beslutad")}
                        className="plan_main"
                      >
                        <div className="plan_color_div dropdown_icon beslu_color"></div>
                        {t("common.pages.Beslutad")}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleChangeStatus("Utförd")}
                        className="plan_main"
                      >
                        <div className="plan_color_div dropdown_icon utford_color"></div>
                        {t("common.pages.Utförd")}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  {/* <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    name="status"
                    type="text"
                    placeholder={"-"}
                    onChange={handleChange}
                    value={modifyProperty?.status}
                  />
                </Form.Group> */}
                </Col>
                <Col lg={3}>
                  {modifyProperty?.status === "Utförd" && (
                    <Form.Group className="activites_year_Property">
                      <Form.Label>{t("planning_page.real_cost")}</Form.Label>
                      <Form.Control
                        name="real_cost"
                        type="number"
                        placeholder={"-"}
                        onChange={handleChange}
                        value={modifyProperty?.real_cost}
                      />
                    </Form.Group>
                  )}
                </Col>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("planning_page.start_year")}</Form.Label>
                    <Form.Control
                      name="start_year"
                      type="number"
                      placeholder={"-"}
                      onChange={handleChange}
                      value={modifyProperty?.start_year}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className="activites_year_Property">
                    <Form.Label>{t("planning_page.previous_year")}</Form.Label>
                    <Form.Control
                      name="previous_year"
                      type="number"
                      placeholder={"-"}
                      onChange={handleChange}
                      value={modifyProperty?.previous_year}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="Inspect_checkbox_main">
                <Form.Check type="checkbox">
                  <FormCheck.Label
                    htmlFor="defaultCheck5"
                    className="mb-0 year_side_panel_checkbox"
                  >
                    {t("planning_page.inspect")}
                  </FormCheck.Label>
                  <FormCheck.Input
                    id="defaultCheck5"
                    className="me-2 maintainence_flags"
                    name="inspection_flag"
                    checked={modifyProperty?.inspection_flag}
                    onChange={handleFlagsChange}
                  />
                </Form.Check>
                <Form.Check type="checkbox">
                  <FormCheck.Label
                    htmlFor="defaultCheck5"
                    className="mb-0 year_side_panel_checkbox"
                  >
                    {t("planning_page.risk")}
                  </FormCheck.Label>{" "}
                  <FormCheck.Input
                    id="defaultCheck5"
                    className="me-2 maintainence_flags"
                    name="risk_flag"
                    checked={modifyProperty?.risk_flag}
                    onChange={handleFlagsChange}
                  />
                </Form.Check>
                <Form.Check type="checkbox">
                  <FormCheck.Label
                    htmlFor="defaultCheck5"
                    className="mb-0 year_side_panel_checkbox"
                  >
                    {t("planning_page.project")}
                  </FormCheck.Label>{" "}
                  <FormCheck.Input
                    id="defaultCheck5"
                    className="me-2 maintainence_flags"
                    name="project_flag"
                    checked={modifyProperty?.project_flag}
                    onChange={handleFlagsChange}
                  />
                </Form.Check>
                <Form.Check
                  type="checkbox"
                  className="activites_year_invest_main"
                >
                  <FormCheck.Label
                    htmlFor="defaultCheck5"
                    className="mb-0 year_side_panel_checkbox"
                  >
                    {t("planning_page.investment")}
                  </FormCheck.Label>{" "}
                  <div className="activitesYearInvestmentPercent">
                    <FormCheck.Input
                      id="defaultCheck5"
                      className="me-2 energy_savings_percent"
                      name="invest_flag"
                      checked={modifyProperty?.invest_flag}
                      onChange={handleFlagsChange}
                    />
                    <Form.Group className="activitesYearInvestmentPercent">
                      <Form.Control
                        name="invest_percentage"
                        type="text"
                        placeholder={"-"}
                        onChange={handleChange}
                        value={modifyProperty?.invest_percentage}
                      />
                      <Form.Label style={{ marginTop: "9%" }}>%</Form.Label>
                    </Form.Group>
                  </div>
                </Form.Check>
                <Form.Check
                  type="checkbox"
                  className="activites_year_invest_main"
                >
                  <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">
                    {t("planning_page.energy_savings")}
                  </FormCheck.Label>
                  <div className="activitesYearInvestmentPercent">
                    <FormCheck.Input
                      id="defaultCheck5"
                      className="me-2 energy_savings_percent"
                      name="energy_flag"
                      checked={modifyProperty?.energy_flag}
                      onChange={handleFlagsChange}
                    />
                    <Form.Group className="activitesYearInvestmentPercent">
                      <Form.Control
                        name="energy_save_percentage"
                        type="text"
                        placeholder={"-"}
                        onChange={handleChange}
                        value={modifyProperty?.energy_save_percentage}
                      />
                      <Form.Label style={{ marginTop: "9%" }}>%</Form.Label>
                    </Form.Group>
                  </div>
                </Form.Check>
              </div>
              <Form.Group>
                <Form.Label>Text</Form.Label>
                <Form.Control
                  name="text"
                  as="textarea"
                  rows={6}
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.text}
                />
              </Form.Group>
            </div>
          </SidePanelBody>
          <SidePanelFooter>
            <Button main type="submit" className="activites_submit_btn">
              {t("planning_page.submit")}{" "}
              {isCopyItems
                ? t("planning_page.copy")
                : t("planning_page.change")}
            </Button>
            <Button
              secondary
              className="activites_submit_btn"
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
        theme={"dark"}
        open={open}
        setOpen={setOpen}
        title={`${
          t("common.pages.search") + " " + t("planning_page.article_code")
        }`}
        cancelText={t("property_page.cancel")}
        okText={t("property_page.submit")}
        handleOk={handleTableSubmit}
        body={tableBody}
        size={"xl"}
      />
    </>
  );
};

export default ActivitesYearSidePanel;
