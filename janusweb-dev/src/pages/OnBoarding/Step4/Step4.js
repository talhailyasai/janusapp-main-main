import React, { useEffect, useState } from "react";
import "./Step4.css";
import { Button, Form, FormCheck, Modal } from "@themesberg/react-bootstrap";
import DatePicker from "react-datepicker";
import { t } from "i18next";
import { toast } from "react-toastify";
import api from "api";

const Step4 = ({ setStep, step, setStopStep }) => {
  const [maintenanceSetting, setMaintenanceSetting] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectBaseYear, setSelectBaseYear] = useState(null);
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMaintenanceSetting((prev) => ({
      ...prev,
    }));
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (selectedYear == null) {
        toast("Vänligen ange startår!", { type: "error" });
      } else {
        const userData = JSON.parse(localStorage.getItem("user"));
        maintenanceSetting.plan_start_year = selectedYear;
        maintenanceSetting.use_index = checked;
        maintenanceSetting.base_year_increase = selectBaseYear;
        maintenanceSetting.tenantId = userData._id;
        const res = await api.post(
          `/onboarding/maintenance/settings`,
          maintenanceSetting
        );
        //debugger;
        setStopStep(null);
        setStep(3);
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
      {value ? new Date(value).getFullYear() : t("common.pages.Select Year")}
    </div>
  );

  const handleBaseYearChange = (date) => {
    setSelectBaseYear(new Date(date).getFullYear());
  };

  const handlePopulateValue = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userEmail = userData?.email?.split("@")[0];

    setMaintenanceSetting((prev) => ({
      ...prev,
      version_name: `${userEmail}plan`,
      plan_duration: 50,
      general_surcharge: 10,
      vat_percent: 25,
      yearly_increase: 0,
      // plan_duration: Math.floor(Math.random() * (50 - 1 + 1)) + 1,
      // general_surcharge: Math.floor(Math.random() * (30 - 0 + 1)) + 0,
      // vat_percent: Math.floor(Math.random() * (30 - 0 + 1)) + 0,
      // yearly_increase: Math.floor(Math.random() * (30 - 0 + 1)) + 0,
    }));
    setSelectedYear(new Date().getFullYear());
    // setChecked(!checked);
    const currentYear = new Date().getFullYear();
    const randomYear = currentYear + Math.floor(Math.random() * (10 - 1) + 1);
    // setSelectBaseYear(randomYear);
  };

  const handleBack = () => {
    setStopStep(null);
    setStep(2);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);
  return (
    <>
      <span
        class="material-symbols-outlined step_arrow_back"
        onClick={handleBack}
      >
        arrow_back
      </span>
      <div className="step4_main">
        <div className="step4_div">
          <p className="step_maintenance_heading">
            {t("common.pages.Settings maintenance plan")}
          </p>
          <p className="step4_para">
            {t(
              "common.pages.Basic information for the maintenance plan needs to be entered. If you do not know the data, select “default values”. (The details can be adjusted later)"
            )}
          </p>

          <div className="step4_setting_main">
            <Form onSubmit={handleSubmit} className="step4_setting_form">
              <div className="step4_fill_btn_main">
                <Button
                  className="step4_fill_btn"
                  onClick={handlePopulateValue}
                >
                  {t("common.pages.Fill with standard values")}
                </Button>
              </div>
              <br /> <br /> <br />
              <Form.Group className="setting_name">
                <div className="setting_name_div step4_name_label">
                  {t("common.pages.name")}
                </div>
                <Form.Control
                  name="version_name"
                  type="text"
                  required={true}
                  onChange={handleChange}
                  // value={maintenanceSetting?.version_name}
                  defaultValue={user?.organization}
                  className="setting_name_field settings_field_height"
                />
              </Form.Group>
              <Form.Group className="setting_name">
                <div className="setting_name_div step4_name_label step_date_picker_name">
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
                <div className="setting_name_div step4_name_label">
                  {t("common.pages.Plan Length (years)")}
                </div>
                <Form.Control
                  className="setting_name_field settings_field_height"
                  name="plan_duration"
                  type="number"
                  // required={true}
                  // min={1}
                  // max={50}
                  onChange={handleChange}
                  value={maintenanceSetting?.plan_duration}
                />
              </Form.Group>
              <Form.Group className="setting_name">
                <div className="setting_name_div step_surcharge_label step4_name_label">
                  {t("common.pages.Surcharge")}
                </div>
                <Form.Control
                  className="setting_general_field settings_field_height"
                  name="general_surcharge"
                  type="number"
                  // required={true}
                  // min={0}
                  // max={30}
                  onChange={handleChange}
                  value={maintenanceSetting?.general_surcharge}
                />
                <div className="general_percent">%</div>
              </Form.Group>
              <Form.Group className="setting_name">
                <div className="setting_name_div step_surcharge_label">
                  {t("common.pages.VAT")}
                </div>
                <Form.Control
                  className="setting_general_field settings_field_height"
                  name="vat_percent"
                  type="number"
                  // min={0}
                  // max={30}
                  onChange={handleChange}
                  value={maintenanceSetting?.vat_percent}
                />
                <div className="general_percent">%</div>
              </Form.Group>
              <Form.Group className="setting_name">
                <div className="setting_name_div step_surcharge_label">
                  {t("common.pages.Yearly index")}
                </div>
                <Form.Control
                  name="yearly_increase"
                  type="float"
                  onChange={handleChange}
                  min={0}
                  max={30}
                  value={maintenanceSetting?.yearly_increase}
                  className="setting_general_field settings_field_height"
                />
                <div className="general_percent">%</div>
              </Form.Group>
              <Form.Check type="checkbox" className="step4_use_index_main">
                <div className="step4_check_main">
                  <FormCheck.Input
                    className="me-2"
                    onChange={() => setChecked(!checked)}
                    checked={checked}
                  />
                </div>
                <div className="step4_use_index_label_main">
                  <FormCheck.Label>
                    {t("data_settings.use_index")}
                  </FormCheck.Label>
                </div>
              </Form.Check>
              <Form.Group className="setting_name">
                <div className="setting_name_div step4_name_label step_date_picker_name">
                  {t("data_settings.base_year_index")}
                </div>
                <DatePicker
                  name="base_year_increase"
                  selected={selectBaseYear}
                  onChange={handleBaseYearChange}
                  showYearPicker
                  dateFormat="yyyy"
                  value={selectBaseYear?.toString()}
                  customInput={<CustomInput value={selectBaseYear} />}
                />
              </Form.Group>
              <div className="step1_submit_btn_main step_4continue">
                <Button className="step1_started_btn" main type="submit">
                  {t("common.pages.Continue")}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step4;
