import { Button, Form, Modal } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../../../../common/Loader";
import { RotatingLines } from "react-loader-spinner";

const PrintModal = ({
  show,
  setPrintModal,
  handleChangeAction,
  handleChangePoint,
  handlePrintClick,
  setSelectedPoints,
  handleClosePrintModal,
  loader,
}) => {
  const { t } = useTranslation();

  const handleChange = (contentName) => {
    console.log("contentName", contentName);
    handleChangePoint(contentName);
  };
  return (
    <Modal show={show} onHide={handleClosePrintModal} centered>
      <Modal.Header className="print_modal_title">
        {t("property_page.Select_content_for_report")}
      </Modal.Header>
      <Modal.Body>
        <div className="print_content_main">
          <div className="coversheet_main">
            <Form.Check
              type={"checkbox"}
              className="print_cover_checkbox"
              onChange={() => handleChange("coverPage")}
            />
            <label className="print_cover_label">
              {t("property_page.Cover_page")}
            </label>
          </div>
          <div className="coversheet_main">
            <Form.Check
              type={"checkbox"}
              className="print_cover_checkbox"
              onChange={() => handleChange("tableOfContent")}
            />
            <label className="print_cover_label">
              {t("property_page.Table_of_content")}
            </label>
          </div>
          <div className="coversheet_main">
            <Form.Check
              type={"checkbox"}
              className="print_cover_checkbox"
              onChange={() => handleChange("planSettings")}
            />
            <label className="print_cover_label">
              {t("property_page.Settings")}
            </label>
          </div>
          <div className="coversheet_main">
            <Form.Check
              type={"checkbox"}
              className="print_cover_checkbox"
              onChange={() => handleChange("myCustomText")}
            />
            <label className="print_cover_label">
              {t("property_page.My_custom_text")}
            </label>
          </div>
          <div className="coversheet_main">
            <Form.Check
              type={"checkbox"}
              className="print_cover_checkbox"
              onChange={() => handleChange("propertyAndBuildingData")}
            />
            <label className="print_cover_label">
              {t("property_page.Property_and_building_data")}
            </label>
          </div>
          <div className="coversheet_main">
            <Form.Check
              type={"checkbox"}
              className="print_cover_checkbox"
              onChange={() => handleChange("maintenanceDiagram")}
            />
            <label className="print_cover_label">
              {t("property_page.Maintenance_diagram")}
            </label>
          </div>
          <div className="coversheet_main">
            <Form.Check
              type={"checkbox"}
              className="print_cover_checkbox"
              onChange={() => handleChange("maintenanceActivitiesPerYear")}
            />
            <label className="print_cover_label">
              {t("property_page.Maintenance_activities_per_year")}
            </label>
          </div>
          <div className="coversheet_main">
            <Form.Check
              type={"checkbox"}
              className="print_cover_checkbox"
              onChange={() => handleChange("maintenanceActivitiesPerSystem")}
            />
            <label className="print_cover_label">
              {t("property_page.Maintenance_activities_per_system")}
            </label>
          </div>
          <div className="coversheet_main">
            <Form.Check
              type={"checkbox"}
              className="print_cover_checkbox"
              onChange={() => handleChange("depositionsDiagram")}
            />
            <label className="print_cover_label">
              {t("property_page.Depositions_diagram")}
            </label>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="print_modal_footer">
        <Button
          onClick={handleClosePrintModal}
          className="print_submit_btn print_modal_close_btn"
        >
          {t("property_page.Cancel")}
        </Button>
        {loader ? (
          <RotatingLines
            strokeColor="rgb(53, 199, 251)"
            strokeWidth="5"
            animationDuration="0.75"
            width="30"
            visible={true}
          />
        ) : (
          <Button
            variant="primary"
            onClick={handlePrintClick}
            className="print_submit_btn"
          >
            {t("property_page.Print")}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PrintModal;
