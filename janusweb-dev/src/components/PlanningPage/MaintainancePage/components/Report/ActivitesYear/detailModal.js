import React from "react";
import {
  Modal,
  Container,
  Row,
  Col,
  Form,
  FormCheck,
  Button,
} from "@themesberg/react-bootstrap";
import { BsFileImage } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const DetailModal = ({ detailModalClose, detailModal, initalVal }) => {
  const { t } = useTranslation();
  return (
    <Modal
      show={detailModal}
      onHide={detailModalClose}
      animation={false}
      size="lg"
    >
      <Modal.Header className="modal_header">
        <Modal.Title className="modal_heading">
          {t("planning_page.details")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="detail_modal_main">
          <Row className="mb-5">
            <Col lg={2}>
              <Form.Group>
                <Form.Label> {t("common.pages.property")}</Form.Label>
                <Form.Control
                  name="property_code"
                  value={initalVal?.property_code}
                  disabled={true}
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group>
                <Form.Label>{t("common.pages.building")}</Form.Label>
                <Form.Control
                  name="building_code"
                  disabled={true}
                  value={initalVal?.building_code}
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group>
                <Form.Label>{t("planning_page.position")}</Form.Label>
                <Form.Control
                  name="position"
                  disabled={true}
                  value={initalVal?.position}
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group>
                <Form.Label>{t("planning_page.article_code")}</Form.Label>
                <Form.Control
                  name="article"
                  disabled={true}
                  value={initalVal?.article}
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group>
                <Form.Label>{t("planning_page.interval")}</Form.Label>
                <Form.Control
                  name="price_intervall"
                  disabled={true}
                  value={initalVal?.technical_life}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col lg={2}>
              <Form.Group>
                <Form.Label>{t("planning_page.quantity")}</Form.Label>
                <Form.Control
                  name="quantity"
                  disabled={true}
                  value={initalVal?.quantity}
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group>
                <Form.Label>{t("planning_page.unit")}</Form.Label>
                <Form.Control
                  name="unit"
                  disabled={true}
                  value={initalVal?.unit}
                />
              </Form.Group>
            </Col>

            <Col lg={2}>
              <Form.Group>
                <Form.Label className="detail_modal_total_cost">
                  {t("planning_page.total_cost")}
                </Form.Label>
                <Form.Control
                  name="total_cost"
                  disabled={true}
                  value={initalVal?.total_cost}
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group>
                <Form.Label>{t("planning_page.system_code")}</Form.Label>
                <Form.Control
                  name="u_system"
                  disabled={true}
                  value={initalVal?.u_system}
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group>
                <Form.Label>{t("planning_page.unit_cost")}</Form.Label>
                <Form.Control
                  name="price_per_unit"
                  disabled={true}
                  value={initalVal?.price_per_unit}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col lg={2}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Control
                  name="status"
                  disabled={true}
                  value={initalVal?.status}
                />
              </Form.Group>
            </Col>
            <Col lg={2}></Col>

            <Col lg={2}>
              <Form.Group>
                <Form.Label>{t("planning_page.start_year")}</Form.Label>
                <Form.Control
                  name="start_year"
                  disabled={true}
                  value={initalVal?.start_year}
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group>
                <Form.Label>{t("planning_page.previous_year")}</Form.Label>
                <Form.Control
                  name="previous_year"
                  disabled={true}
                  value={initalVal?.previous_year}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-5"></Row>
          <Row className="mb-5">
            <Col lg={6}>
              <Form.Group>
                <Form.Label>Text</Form.Label>
                <Form.Control
                  name="text"
                  as="textarea"
                  rows={5}
                  disabled={true}
                  value={initalVal?.text}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <div className="d-flex justify-content-between mb-4">
                <Form.Check type="checkbox" className="detail_flags">
                  <FormCheck.Label
                    htmlFor="defaultCheck5"
                    className="mb-0 year_side_panel_checkbox"
                  >
                    {t("planning_page.inspect")}
                  </FormCheck.Label>
                  <FormCheck.Input
                    id="defaultCheck5"
                    className="me-2"
                    name="inspection_flag"
                    checked={initalVal?.inspection_flag}
                    disabled={true}
                  />
                </Form.Check>
                <Form.Check type="checkbox" className="detail_flags">
                  <FormCheck.Label
                    htmlFor="defaultCheck5"
                    className="mb-0 year_side_panel_checkbox"
                  >
                    {t("planning_page.risk")}
                  </FormCheck.Label>{" "}
                  <FormCheck.Input
                    id="defaultCheck5"
                    className="me-2"
                    name="risk_flag"
                    checked={initalVal?.risk_flag}
                    disabled={true}
                  />
                </Form.Check>
                <Form.Check type="checkbox" className="detail_flags">
                  <FormCheck.Label
                    htmlFor="defaultCheck5"
                    className="mb-0 year_side_panel_checkbox"
                  >
                    {t("planning_page.project")}
                  </FormCheck.Label>{" "}
                  <FormCheck.Input
                    id="defaultCheck5"
                    className="me-2"
                    name="project_flag"
                    checked={initalVal?.project_flag}
                    disabled={true}
                  />
                </Form.Check>
              </div>
              <div className="d-flex justify-content-between detail_energy_percent">
                <Form.Check
                  type="checkbox"
                  style={{ width: "9rem" }}
                  className="detail_energy_percent_input"
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
                      checked={initalVal?.invest_flag}
                      disabled={true}
                    />
                    <Form.Group className="activitesYearInvestmentPercent">
                      <Form.Control
                        name="invest_percentage"
                        disabled={true}
                        value={initalVal?.invest_percentage}
                        className=""
                      />
                      <Form.Label style={{ marginTop: "9%" }}>%</Form.Label>
                    </Form.Group>
                  </div>
                </Form.Check>
                <Form.Check
                  type="checkbox"
                  style={{ width: "9rem" }}
                  className="detail_energy_percent_input"
                >
                  <FormCheck.Label htmlFor="defaultCheck5" className="mb-0 year_side_panel_checkbox">
                    {t("planning_page.energy_savings")}
                  </FormCheck.Label>
                  <div className="activitesYearInvestmentPercent">
                    <FormCheck.Input
                      id="defaultCheck5"
                      className="me-2 energy_savings_percent"
                      name="energy_flag"
                      checked={initalVal?.energy_flag}
                      disabled={true}
                    />
                    <Form.Group className="activitesYearInvestmentPercent">
                      <Form.Control
                        name="energy_save_percentage"
                        disabled={true}
                        value={initalVal?.energy_save_percentage}
                        className=""
                      />
                      <Form.Label style={{ marginTop: "9%" }}>%</Form.Label>
                    </Form.Group>
                  </div>
                </Form.Check>
              </div>
            </Col>
          </Row>
          <Row>
            {initalVal?.files?.map((el) => {
              return (
                <Col lg={3}>
                  <a href={el?.image} target="_blank">
                    <div className="show_file_div">
                      <BsFileImage className="files_icon" />
                      {el?.name}
                    </div>
                  </a>
                </Col>
              );
            })}
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button onClick={detailModalClose} className="deatil_modal_close_btn">
          {t("planning_page.close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetailModal;
