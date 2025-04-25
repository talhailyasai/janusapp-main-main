import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  FormCheck,
} from "@themesberg/react-bootstrap";
import api from "api";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { t } from "i18next";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

const MaintenanceSettingModal = ({
  show,
  setShow,
  maintenanceSetting,
  setMaintenanceSetting,
  createPlan,
}) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const { setSettingsFormData } = usePropertyContextCheck();

  const handleClose = () => setShow(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (selectedYear == null) {
        toast("Please Select the start Year!", { type: "error" });
      } else {
        const userData = JSON.parse(localStorage.getItem("user"));
        maintenanceSetting.plan_start_year = selectedYear;
        maintenanceSetting.tenantId = userData._id;
        const res = await api.post("/maintenance_settings", maintenanceSetting);
        res?.data && setSettingsFormData(res?.data);
        //debugger;
        createPlan();
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setMaintenanceSetting((prev) => ({
      ...prev,
      [e.target.name]: e.target.value?.toUpperCase(),
    }));
  };

  const handleYearChange = (date) => {
    setSelectedYear(new Date(date).getFullYear());
  };

  const CustomInput = ({ value, onClick }) => (
    <div className="year_picker_field" onClick={onClick}>
      {value ? new Date(value).getFullYear() : "Select  Year"}
    </div>
  );
  return (
    <Modal show={show} onHide={handleClose} animation={false} centered>
      <Modal.Header className="building_modal_header">
        <Modal.Title className="building_modal_title">
          Create Maintenance Setting
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="setting_name">
            {/* <Form.Label>{t("common.pages.name")}</Form.Label> */}
            <div className="setting_name_div">{t("common.pages.name")}</div>
            <Form.Control
              name="version_name"
              type="text"
              required={true}
              onChange={handleChange}
              value={maintenanceSetting?.version_name}
              className="setting_name_field"
            />
          </Form.Group>
          <Form.Group className="setting_name">
            {/* <Form.Label>{t("planning_page.start_year")}</Form.Label> */}
            <div className="setting_name_div">
              {t("planning_page.start_year")}
            </div>
            <DatePicker
              name="plan_start_year"
              selected={selectedYear}
              onChange={handleYearChange}
              showYearPicker
              dateFormat="yyyy"
              value={selectedYear?.toString()}
              customInput={<CustomInput value={selectedYear} />}
              required={true}
            />
          </Form.Group>

          <Form.Group className="setting_name">
            {/* <Form.Label>{t("data_settings.duration")}</Form.Label> */}
            <div className="setting_name_div">
              {t("data_settings.duration")}
            </div>
            <Form.Control
              className="setting_name_field"
              name="plan_duration"
              type="number"
              required={true}
              min={1}
              max={50}
              onChange={handleChange}
              value={maintenanceSetting?.plan_duration}
            />
          </Form.Group>
          <Form.Group className="setting_name">
            {/* <Form.Label>{t("data_settings.general_surcharge")}, %</Form.Label> */}
            <div className="setting_name_div general_main">
              {t("data_settings.general_surcharge")}
            </div>
            <Form.Control
              className="setting_general_field"
              name="general_surcharge"
              type="number"
              required={true}
              min={0}
              max={30}
              onChange={handleChange}
              value={maintenanceSetting?.general_surcharge}
            />
            <div className="general_percent">%</div>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="building_modal_footer">
          <Button className="building_close_btn" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" className="building_submit_btn">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MaintenanceSettingModal;
