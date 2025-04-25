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
import "react-datepicker/dist/react-datepicker.css";
import "../MaintenanceSetting/MaintenanceSetting.css";
import api from "api";
import { BiPencil } from "react-icons/bi";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./MaintenanceDepositions.css";
import { useTranslation } from "react-i18next";

const MaintenanceDepositions = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const { t } = useTranslation();

  const [edit, setEdit] = useState(false);

  const handleSubmit = async (e, data) => {
    setLoading(true);
    try {
      e.preventDefault();

      if (typeof data.current_deposition === "string") {
        data.current_deposition = parseInt(
          data?.current_deposition?.replace(/\s/g, ""),
          10
        );
      }
      if (typeof data.recommended_deposition === "string") {
        data.recommended_deposition = parseInt(
          data?.recommended_deposition?.replace(/\s/g, ""),
          10
        );
      }
      if (typeof data.start_value_fund === "string") {
        data.start_value_fund = parseInt(
          data?.start_value_fund?.replace(/\s/g, ""),
          10
        );
      }
      const userData = JSON.parse(localStorage.getItem("user"));
      data.tenantId = userData._id;

      if (formData._id) {
        const res = await api.post(
          `/maintenance_depositions?editSetting = ${true}`,
          data
        );
        setFormData(res?.data);
        setEdit(false);
      } else {
        const res = await api.post("/maintenance_depositions", data);
        setFormData(res?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getMaintenanceDeposition = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const res = await api.get(`/maintenance_depositions/${userData._id}`);
      setFormData(res?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMaintenanceDeposition();
  }, []);

  const data = {
    labels: formData?.depositions?.map((elem) => {
      return elem.deposition_year;
    }),
    datasets: [
      {
        label: t("data_settings.rec_deposition"),
        data: formData?.depositions?.map((elem) => {
          return elem.rec_value_fund;
        }),
        backgroundColor: "lightYellow",
        borderColor: "#FF9A25",
        borderWidth: 2,
      },
      {
        label: t("data_settings.current_deposition"),
        data: formData?.depositions?.map((elem) => {
          return elem.curr_value_fund;
        }),
        borderColor: "#413F41",
        backgroundColor: "navy",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return loading ? (
    <Loader />
  ) : (
    <Container>
      <Form
        onSubmit={(e) => {
          handleSubmit(e, formData);
        }}
      >
        <Row>
          <Col lg={12} className="mb-3">
            {formData?._id && !edit && (
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
              <Form.Label>{t("data_settings.current_deposition")}</Form.Label>
              <Form.Control
                name="current_deposition"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={
                  formData?.current_deposition &&
                  formData?.current_deposition !== undefined &&
                  formData?.current_deposition !== null
                    ? `${formData.current_deposition}`.length <= 3
                      ? formData.current_deposition
                      : formData.current_deposition
                          .toLocaleString("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 0,
                          })
                          .replace(/,/g, " ")
                    : ""
                }
                disabled={formData?._id && !edit && true}
              />
            </Form.Group>
          </Col>
          {/* <Col lg={4} className="mb-3">
            <Form.Group>
              <Form.Label>Current Deposition Boa</Form.Label>
              <Form.Control
                name="current_deposition_boa"
                type="number"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                // value={formData?.version_name}
              />
            </Form.Group>
          </Col> */}
          <Col xl={4} lg={6} className="mb-3 data_settings_depositions">
            <Form.Group>
              <Form.Label> {t("data_settings.rec_deposition")}</Form.Label>
              <Form.Control
                name="recommended_deposition"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={
                  formData?.recommended_deposition &&
                  formData?.recommended_deposition !== undefined &&
                  formData?.recommended_deposition !== null
                    ? `${formData.recommended_deposition}`.length <= 3
                      ? formData.recommended_deposition
                      : formData.recommended_deposition
                          .toLocaleString("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 0,
                          })
                          .replace(/,/g, " ")
                    : ""
                }
                disabled={formData?._id && !edit && true}
              />
            </Form.Group>
          </Col>
          {/* <Col lg={4} className="mb-3">
            <Form.Group>
              <Form.Label>Rec Deposition Boa</Form.Label>
              <Form.Control
                name="recommended_deposition_boa"
                type="number"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                // value={formData?.general_surcharge}
              />
            </Form.Group>
          </Col> */}
          <Col xl={4} lg={6} className="mb-3">
            <Form.Group>
              <Form.Label>
                {" "}
                {t("data_settings.average_yearly_maintenance_costs")}
              </Form.Label>
              <div className="depositions_end_value_fund_rec">
                {formData?.average_yearly_maintenance_costs &&
                formData?.average_yearly_maintenance_costs !== undefined &&
                formData?.average_yearly_maintenance_costs !== null
                  ? `${formData.average_yearly_maintenance_costs}`.length <= 3
                    ? formData.average_yearly_maintenance_costs
                    : formData.average_yearly_maintenance_costs
                        .toLocaleString()
                        .replace(/,/g, " ")
                  : "-"}
              </div>
            </Form.Group>
          </Col>
          <Col xl={4} lg={6} className="mb-3">
            <Form.Group>
              <Form.Label>{t("data_settings.start_value_fund")}</Form.Label>
              <Form.Control
                name="start_value_fund"
                type="text"
                placeholder={"-"}
                onChange={handleChange}
                value={
                  formData?.start_value_fund &&
                  formData?.start_value_fund !== undefined &&
                  formData?.start_value_fund !== null
                    ? `${formData.start_value_fund}`.length <= 3
                      ? formData.start_value_fund
                      : formData.start_value_fund
                          .toLocaleString("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 0,
                          })
                          .replace(/,/g, " ")
                    : ""
                }
                disabled={formData?._id && !edit && true}
              />
            </Form.Group>
          </Col>
          <Col xl={4} lg={6} className="mb-3">
            <Form.Group>
              <Form.Label>{t("data_settings.end_value_fund")}</Form.Label>
              <div className="depositions_end_value_fund_rec">
                {formData?.end_value_fund &&
                formData?.end_value_fund !== undefined &&
                formData?.end_value_fund !== null
                  ? `${formData.end_value_fund}`.length <= 3
                    ? formData.end_value_fund
                    : formData.end_value_fund
                        .toLocaleString()
                        .replace(/,/g, " ")
                  : "-"}
              </div>
            </Form.Group>
          </Col>
          <Col xl={4} lg={6} className="mb-3">
            <Form.Group>
              <Form.Label>
                {t("data_settings.end_value_fund_rec_depos")}.
              </Form.Label>
              <div className="depositions_end_value_fund_rec">
                {formData?.end_value_fund_recommended &&
                formData?.end_value_fund_recommended !== undefined &&
                formData?.end_value_fund_recommended !== null
                  ? `${formData.end_value_fund_recommended}`.length <= 3
                    ? formData.end_value_fund_recommended
                    : formData.end_value_fund_recommended
                        .toLocaleString()
                        .replace(/,/g, " ")
                  : "-"}
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
          <Col lg={12} className="mt-3 deposition_Line_main">
            <Line data={data} options={options} />
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default MaintenanceDepositions;
