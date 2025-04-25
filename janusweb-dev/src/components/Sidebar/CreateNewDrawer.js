import {
  Button,
  Col,
  Dropdown,
  Form,
  Modal,
  Row,
} from "@themesberg/react-bootstrap";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Drawer from "react-modern-drawer";
import { AiOutlineClose } from "react-icons/ai";
import api from "api";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { usePlanningContextCheck } from "context/SidebarContext/PlanningContextCheck";
import { toast } from "react-toastify";
import useWindowDimensions from "../../utils/getWindowDimensions";

const CreateNewDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openPropModal, setOpenPropModal] = useState(false);
  const [showBuilding, setShowBuilding] = useState(false);
  const [planTask, setPlanTask] = useState(false);
  const [userSelectProp, setUserSelectProp] = useState(null);
  const [properties, setProperties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const { setPlanningChange, setBuildingChange: setBuildingChangePlanning } =
    usePlanningContextCheck();
  const location = useLocation();
  const history = useHistory();
  const { width } = useWindowDimensions();

  const {
    setBuildingChange,
    setComponentChange,
    propertyChange,
    setProperty,
    setPropertyChange,
    setBuildingObj,
    isCollapsed,
  } = usePropertyContextCheck();

  const getBuildings = async () => {
    try {
      let selectedProp = properties.find(
        (elem) => elem.property_code === userSelectProp
      );
      let res = await api.get(`/buildings/${selectedProp._id}`);
      setBuildings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userSelectProp && (showBuilding || planTask)) {
      getBuildings();
    }
  }, [userSelectProp]);

  useEffect(() => {
    isOpen && getAllProperty();

    // setBuildingChange(null);
    // setComponentChange(null);
  }, [isOpen]);

  const getAllProperty = async () => {
    try {
      let res = await api.get(`/properties/all/unassign`);
      setProperties(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
    if (window.location.pathname === "/useraccounts") {
      history.push(`/`);
    }
  };
  const handleShow = () => setOpenPropModal(true);

  const navigateToPage = (route) => {
    if (route === "property") {
      toggleDrawer();
      setBuildingChange(null);
      setComponentChange(null);
      history.push(`/property?tab=addNewProperty`);
    } else if (route === "building") {
      setComponentChange(null);
      handleShow();
    } else if (route === "component") {
      setShowBuilding(true);
      handleShow();
    } else if (route === "maintainence") {
      setPlanTask(true);
      handleShow();
    } else if (route === "report") {
      localStorage.setItem("activeTabIdPlanningMaintainance", "report");
      history.push(`/maintainence?createReport=true`);
    } else if (route === "userAccount") {
      toggleDrawer();
      history.push(`/useraccounts?tab=addNewUserAccount`);
    } else if (route === "imports") {
      toggleDrawer();
      history.push("/imports");
    }
  };

  const handleClose = () => {
    setShowBuilding(false);
    setUserSelectProp(null);
    setSelectedBuilding(null);
    setPlanTask(false);
    setOpenPropModal(false);
  };

  const selectProperty = async () => {
    if (showBuilding) {
      if (!selectedBuilding) {
        return toast("Please select a building!", { type: "error" });
      }
      let selectedProp = properties.find(
        (elem) => elem.property_code === userSelectProp
      );
      localStorage.setItem("property", userSelectProp);
      localStorage.setItem("propertyObj", JSON.stringify(selectedProp));
      setProperty(selectedProp);
      setPropertyChange(selectedProp.property_code);
      localStorage.setItem("building", selectedBuilding);
      let selectedBuild = buildings.find(
        (elem) => elem.building_code === selectedBuilding
      );
      localStorage.setItem("buildingObj", JSON.stringify(selectedBuild));
      setBuildingChange(selectedBuilding);
      setBuildingObj(selectedBuild);
      handleClose();
      toggleDrawer();
      history.push(
        `/property?tab=addNewComp&&selectProperty=${userSelectProp}&&selectBuilding=${selectedBuilding}`
      );
    } else if (planTask) {
      if (userSelectProp && selectedBuilding) {
        localStorage.setItem(
          "activeTabIdPlanningMaintainance",
          "create_edit_plan"
        );
        localStorage.setItem("planning_property_code", userSelectProp);
        localStorage.setItem("planning_building_code", selectedBuilding);
        setPlanningChange(userSelectProp);
        setBuildingChangePlanning(selectedBuilding);
        handleClose();
        history.push(`/maintainence?tab=addNewMaintenance`);
      } else {
        return toast("Please Select Property and Building!", {
          type: "error",
        });
      }
    } else {
      localStorage.setItem("property", userSelectProp);
      let selectedProp = properties.find(
        (elem) => elem.property_code === userSelectProp
      );
      setProperty(selectedProp);
      setPropertyChange(selectedProp.property_code);
      localStorage.setItem("propertyObj", JSON.stringify(selectedProp));
      handleClose();
      toggleDrawer();
      history.push(
        `/property?tab=addNewBuilding&&selectProperty=${userSelectProp}&&selectPropId=${selectedProp?._id}`
      );
    }
  };
  return (
    <>
      <Dropdown className="create_user_home_btn" onClick={toggleDrawer}>
        <Dropdown.Toggle
          as={Button}
          style={{
            padding: isCollapsed ? "7px" : "7px 28px",
            borderRadius: "33px",
            fontSize: "14px",
            width: isCollapsed ? "40px" : "auto",
            minWidth: isCollapsed ? "40px" : "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          variant="secondary"
          className="text-light d-flex align-items-center"
        >
          <span className="material-symbols-outlined">add</span>
          {!isCollapsed && (
            <span className="ms-2">{t("common.sidebar.create_new")}</span>
          )}
        </Dropdown.Toggle>
      </Dropdown>
      {/* // Drawer */}

      <Drawer
        open={isOpen}
        direction="left"
        size={width >= 500 ? 500 : 330}
        className="drwaer_text_main"
      >
        <div className="create_new_drawer_heading_main">
          <p className="drawer_create_new_heading">
            {t("common.pages.create_new")}
          </p>
          <AiOutlineClose
            className="drawer_close_icon"
            onClick={toggleDrawer}
          />
        </div>

        <Row className="home_sidebar_property_main">
          <Col xs={12} sm={12} md={6} lg={6}>
            <p className="home_sidebar_property_heading">
              {t("common.pages.new_property")}
            </p>
            <div
              className="home_sidebar_property_icon"
              onClick={() => navigateToPage("property")}
            >
              <span class="material-symbols-outlined">home_work</span>
              <span className="home_drawer_property_heading">
                {t("common.pages.home_property")}
              </span>
            </div>
            <div
              className="home_sidebar_property_icon"
              onClick={() => navigateToPage("building")}
            >
              <span class="material-symbols-outlined">home</span>
              <span className="home_drawer_property_heading">
                {t("common.pages.building")}
              </span>
            </div>
            <div
              className="home_sidebar_property_icon"
              onClick={() => navigateToPage("component")}
            >
              <span class="material-symbols-outlined">play_shapes</span>
              <span className="home_drawer_property_heading">
                {t("common.pages.home_component")}
              </span>
            </div>
          </Col>
          <Col>
            <p className="home_sidebar_property_heading">
              {t("common.sidebar.maintainence")}
            </p>
            <div
              className="home_sidebar_property_icon"
              onClick={() => navigateToPage("maintainence")}
            >
              <span class="material-symbols-outlined">place_item</span>
              <span className="home_drawer_property_heading">
                {t("common.pages.planned_task")}
              </span>
            </div>
            <div
              className="home_sidebar_property_icon"
              onClick={() => navigateToPage("report")}
            >
              <span class="material-symbols-outlined">bar_chart_4_bars</span>
              <span className="home_drawer_property_heading">
                {t("planning_page.report")}
              </span>
            </div>
            <div className="home_sidebar_property_icon">
              <span class="material-symbols-outlined">cloud_upload</span>
              <span
                className="home_drawer_property_heading"
                onClick={() => navigateToPage("imports")}
              >
                {t("common.pages.import_plan")}
              </span>
            </div>
          </Col>
          <Col>
            <p className="home_sidebar_property_heading">
              {t("common.pages.home_user")}
            </p>
            <div
              className="home_sidebar_property_icon"
              onClick={() => navigateToPage("userAccount")}
            >
              <span class="material-symbols-outlined">person_add</span>
              <span className="home_drawer_property_heading">
                {t("common.pages.home_user")}
              </span>
            </div>
          </Col>
        </Row>
      </Drawer>

      {/* Building Modal */}
      <Modal show={openPropModal} onHide={handleClose} centered>
        <Modal.Header className="building_modal_header">
          <Modal.Title className="building_modal_title">
            {showBuilding
              ? t("common.pages.select_prop_and_build")
              : t("common.pages.select_prop_build")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>{t("common.pages.select_property")}</label>
          <Form.Select
            onChange={(e) => setUserSelectProp(e.target.value)}
            defaultValue={""}
            required={true}
          >
            <option value={""} disabled>
              {t("common.pages.please_select_property")}
            </option>
            {properties?.map((elem) => {
              if (elem?.property_code) {
                return (
                  <option value={elem?.property_code}>
                    {elem?.name || "UNDEFINED"}
                  </option>
                );
              }
            })}
          </Form.Select>
          {(showBuilding || planTask) && (
            <div className="mt-4">
              <label>{t("common.pages.select_build")}</label>
              <Form.Select
                onChange={(e) => setSelectedBuilding(e.target.value)}
                disabled={!userSelectProp && true}
                defaultValue={""}
                required={true}
              >
                <option value={""} disabled>
                  {t("common.pages.please_select_build")}
                </option>
                {buildings?.map((elem) => (
                  <option value={elem?.building_code}>
                    {elem?.name || "UNDEFINED"}
                  </option>
                ))}
              </Form.Select>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="building_modal_footer">
          <Button onClick={handleClose} className="building_close_btn">
            {t("common.pages.Close")}
          </Button>
          <Button onClick={selectProperty} className="building_submit_btn">
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateNewDrawer;
