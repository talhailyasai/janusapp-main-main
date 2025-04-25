import React, { useEffect, useState } from "react";
import Loader from "components/common/Loader";
import {
  Button,
  Col,
  Container,
  Form,
  FormCheck,
  Row,
} from "@themesberg/react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./MaintenanceSetting.css";
import { toast } from "react-toastify";
import api from "api";
import { BiPencil } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

const MaintenanceSetting = () => {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectBaseYear, setSelectBaseYear] = useState(null);
  const { setSettingsFormData, settingsFormData } = usePropertyContextCheck();
  //   maintenance Setting State
  const [formData, setFormData] = useState(null);
  const [dupData, setDuplicateData] = useState(null);

  const [checked, setChecked] = useState(false);

  const [edit, setEdit] = useState(false);
  const { t } = useTranslation();

  const handleYearChange = (date) => {
    setSelectedYear(new Date(date).getFullYear());
  };

  const CustomInput = ({ value, onClick }) => (
    <div className="year_picker_field" onClick={onClick}>
      {value ? new Date(value).getFullYear() : t("property_page.Select_Year")}
    </div>
  );

  const handleBaseYearChange = (date) => {
    setSelectBaseYear(new Date(date).getFullYear());
  };

  const handleSubmit = async (e, data) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (selectedYear == null) {
        toast("Please Select the start Year!", { type: "error" });
      } else {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (formData._id) {
          const maintenanceDepo = await api.get(
            `/maintenance_depositions/${userData._id}`
          );

          let values = {
            ...data,
          };
          values.plan_start_year = selectedYear;
          values.use_index = checked;
          values.base_year_increase = selectBaseYear;

          const res = await api.patch(
            `/maintenance_settings/${userData._id}`,
            values
          );
          if (
            (selectedYear !== dupData?.plan_start_year ||
              values.plan_duration !== dupData?.plan_duration) &&
            maintenanceDepo?.data
          ) {
            await api.post(
              "/maintenance_depositions/?editSetting=true",
              maintenanceDepo?.data
            );
          }
          setFormData(res?.data);
          setSettingsFormData(res?.data);
          setEdit(false);
        } else {
          data.plan_start_year = selectedYear;
          data.use_index = checked;
          data.base_year_increase = selectBaseYear;
          data.tenantId = userData._id;
          const res = await api.post("/maintenance_settings", data);
          setFormData(res?.data);
          setSettingsFormData(res?.data);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "yearly_increase") {
      const value = parseFloat(e.target.value);

      if (value > 30) {
        toast.info(t("common.Yearly increase cannot exceed 30%"), {
          autoClose: 2000,
        });
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getMaintenanceSetting = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const res = await api.get(`/maintenance_settings/${userData._id}`);
      setFormData(res?.data);
      setSettingsFormData(res?.data);
      setDuplicateData(res?.data);
      setSelectedYear(res?.data?.plan_start_year);
      setSelectBaseYear(res?.data?.base_year_increase);
      setChecked(res?.data?.use_index);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMaintenanceSetting();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Container className="container maintenence-settings-container">
      <Form
        onSubmit={(e) => {
          handleSubmit(e, formData);
        }}
      >
        <Row>
          <Col lg={12} className="mb-3">
            {!edit && (
              <div className="maintenance_edit_item">
                <Button
                  className="maintenance_edit_item_btn"
                  onClick={() => setEdit(true)}
                >
                  <span class="material-symbols-outlined">edit</span>
                  <div>{t("data_settings.edit")}</div>
                </Button>
              </div>
            )}
          </Col>
          <Col xl={4} lg={6} className="mb-3">
            <Form.Group>
              <Form.Label>{t("common.pages.name")}</Form.Label>
              <Form.Control
                name="version_name"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={formData?.version_name}
                disabled={!edit && true}
              />
            </Form.Group>
          </Col>
          <Col xl={4} lg={6} className="mb-3">
            <Form.Group>
              <Form.Label>{t("planning_page.start_year")}</Form.Label>
              <div className="date-picker">
                <DatePicker
                  name="plan_start_year"
                  selected={selectedYear}
                  onChange={handleYearChange}
                  showYearPicker
                  dateFormat="yyyy"
                  value={selectedYear?.toString()}
                  customInput={<CustomInput value={selectedYear} />}
                  required={true}
                  disabled={!edit && true}
                />
              </div>
            </Form.Group>
          </Col>
          <Col xl={4} lg={6} className="mb-3">
            <Form.Group>
              <Form.Label>{t("data_settings.duration")}</Form.Label>
              <Form.Control
                name="plan_duration"
                type="number"
                required={true}
                placeholder={"-"}
                min={1}
                max={50}
                onChange={handleChange}
                value={formData?.plan_duration}
                disabled={!edit && true}
              />
            </Form.Group>
          </Col>
          <Col xl={4} lg={6} className="mb-3">
            <Form.Group>
              <Form.Label>{t("data_settings.general_surcharge")}, %</Form.Label>
              <Form.Control
                name="general_surcharge"
                type="number"
                required={true}
                placeholder={"-"}
                min={0}
                max={30}
                onChange={handleChange}
                value={formData?.general_surcharge}
                disabled={!edit && true}
              />
            </Form.Group>
          </Col>
          <Col xl={4} lg={6} className="mb-3">
            <Form.Group>
              <Form.Label>{t("data_settings.vat")}, %</Form.Label>
              <Form.Control
                name="vat_percent"
                type="number"
                placeholder={"-"}
                min={0}
                max={30}
                onChange={handleChange}
                value={formData?.vat_percent}
                disabled={!edit && true}
              />
            </Form.Group>
          </Col>
          <Col xl={4} lg={6} className="mb-3">
            <Form.Check type="checkbox">
              <FormCheck.Label className="maintenance_setting_checkbox_label">
                {t("data_settings.use_index")}
              </FormCheck.Label>
              <FormCheck.Input
                className="me-2"
                onChange={() => setChecked(!checked)}
                checked={checked}
                disabled={!edit && true}
              />
            </Form.Check>
          </Col>
          <Col xl={4} lg={6} className="mb-3">
            <Form.Group>
              <Form.Label> {t("data_settings.yearly_increase")} %</Form.Label>
              <Form.Control
                name="yearly_increase"
                type="float"
                placeholder={"-"}
                min={0}
                max={30}
                onChange={handleChange}
                value={formData?.yearly_increase}
                disabled={!edit && true}
                onKeyPress={(event) => {
                  const charCode = event.charCode;
                  const char = String.fromCharCode(charCode);
                  // Allow numbers, dot, and prevent special characters
                  if (
                    !char.match(/^[0-9.]$/) &&
                    char !== "Backspace" &&
                    char !== "Delete"
                  ) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Group>
          </Col>
          <Col xl={4} lg={6} className="mb-3">
            <Form.Group>
              <Form.Label> {t("data_settings.base_year_index")}</Form.Label>
              <div className="date-picker">
                <DatePicker
                  selected={selectBaseYear}
                  onChange={handleBaseYearChange}
                  showYearPicker
                  dateFormat="yyyy"
                  value={selectBaseYear?.toString()}
                  customInput={<CustomInput value={selectBaseYear} />}
                  disabled={!edit && true}
                />
              </div>
            </Form.Group>
          </Col>
          <Col lg={6}>
            {!formData?._id || edit ? (
              <Button main type="submit">
                {t("planning_page.submit")}
              </Button>
            ) : null}
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default MaintenanceSetting;
