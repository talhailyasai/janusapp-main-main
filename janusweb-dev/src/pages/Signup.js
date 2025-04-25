import React from "react";
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  FormCheck,
  Container,
  InputGroup,
  Modal,
  Spinner,
  Dropdown,
  Nav,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import { Routes } from "../routes";
import BgImage from "../assets/img/illustrations/signin.svg";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import api from "api";
import * as yup from "yup";
import { useState } from "react";
import Logo from "../assets/img/janus.png";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import TermsConditions from "./TermsAndConditions/TermsConditions";
import DataProcessingAgreement from "./TermsAndConditions/DataProcessingAgreement";

export default function SignUp() {
  const [codeModal, setCodeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { t, i18n } = useTranslation();

  const [show, setShow] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [organization, setOrganization] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (values, resetForm) => {
    setLoading(true);
    try {
      if (
        values?.password === values?.passwordConfirm &&
        values?.password?.length >= 8
      ) {
        const res = await api.post("/auth/signup", values);
        if (res?.status === 201) {
          setCodeModal(true);
          // history.push("/sign-in");
          resetForm();
        }
        // if (res?.response?.data?.message === "User Already Exist") {
        //   toast(t(`planning_page.User Already Exist`), {
        //     type: "error",
        //   });
        // }
      } else if (values?.password?.length < 8) {
        toast(t("Password must contains at least 8 characters!"), {
          type: "error",
        });
      } else {
        toast(t("Password and confirm password should be same!"), {
          type: "error",
        });
      }
      setLoading(false);
    } catch (error) {
      // toast(t(`planning_page.${error?.response?.data?.message}`), {
      //   type: "error",
      // });
      console.log(error);
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (values) => {
    try {
      values.login = false;
      values.isVerified = true;
      const res = await api.post("/auth/mailVerification", values);
      localStorage.setItem("userId", res.data.user?._id);
      history.push("/pricing-plan");
      // history.push("/sign-in");
    } catch (error) {
      // toast(t(error?.response?.data?.message), { type: "error" });
      console.log(error);
    }
  };
  let languageOptions = [
    {
      lang: "English",
      key: "en",
    },
    {
      lang: "Swedish",
      key: "sv",
    },
  ];

  const getLocation = () => {
    fetch(
      "https://api.ipdata.co/?api-key=0d765e29bdf941cef8137c508f5b9d366a36dfa5b9bd17a0f3b7bc44"
    )
      .then((data) => {
        data.json().then((parsed) => {
          console.log("country is..", parsed?.country_name);
          if (parsed?.country_name === "Sweden") {
            i18n.changeLanguage("sv");
          } else {
            i18n.changeLanguage("en");
          }
        });
      })
      .catch((err) => {
        console.log(err);
        i18n.changeLanguage("sv");
      });
  };
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <main>
      <Dropdown as={Nav.Item} className="signin_language_dropdown">
        <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
          <div className="media d-flex align-items-center">
            <span
              class="material-symbols-outlined text-black"
              style={{ fontSize: "1.5rem" }}
            >
              language
            </span>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
          {languageOptions?.map((elem) => {
            return (
              <Dropdown.Item
                onClick={() => i18n.changeLanguage(elem.key)}
                key={elem}
              >
                {elem?.lang}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      <section className="d-flex align-items-center my-5 mt-lg-3  mb-lg-5 signin_main">
        <Container>
          {/* <p className="text-center">
            <Card.Link
              as={Link}
              to={Routes.DashboardOverview.path}
              className="text-gray-700"
            >
              <span class="material-symbols-outlined me-2">chevron_left</span>
              Back to homepage
            </Card.Link>
          </p> */}
          <Row
            className="justify-content-center form-bg-image"
            // style={{ backgroundImage: `url(${BgImage})` }}
          >
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="mb-1 mb-lg-0 bg-white shadow-soft border rounded border-light p-4 pb-3 pt-1 w-100 fmxw-500">
                <div className="text-center text-md-center mb-1 mt-md-0">
                  {/* <h3 className="mb-0">Create an account</h3> */}
                  <img src={Logo} alt="logo" className="signin_logo" />
                </div>
                <Formik
                  onSubmit={(values, { resetForm }) =>
                    handleSubmit(values, resetForm)
                  }
                  enableReinitialize
                  initialValues={{
                    organization: "",
                    address_1: "",
                    address_2: "",
                    email: "",
                    password: "",
                    passwordConfirm: "",
                  }}
                >
                  {(formik) => (
                    <Form
                      className="mt-2 signup-form"
                      onSubmit={formik.handleSubmit}
                    >
                      <Form.Group className="mb-2" controlId="organization">
                        <Form.Label>
                          {t("common.pages.organization_name")}
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            autoFocus
                            required
                            type="text"
                            // placeholder="example@company.com"
                            name="organization"
                            value={formik.values.organization}
                            onChange={(e) => {
                              formik.handleChange(e);
                              setOrganization(e.target.value);
                            }}
                          />
                        </InputGroup>
                      </Form.Group>
                      <Form.Group className="mb-2" controlId="address_1">
                        <Form.Label>{t("common.pages.Address")}</Form.Label>
                        <InputGroup>
                          <Form.Control
                            autoFocus
                            required
                            type="text"
                            // placeholder="example@company.com"
                            name="address_1"
                            value={formik.values.address_1}
                            onChange={formik.handleChange}
                          />
                        </InputGroup>
                      </Form.Group>
                      <div style={{ display: "flex", columnGap: "16px" }}>
                        <Form.Group
                          className="mb-2"
                          controlId="zipcode"
                          style={{ width: "40%" }}
                        >
                          <Form.Label>{t("property_page.Zip_Code")}</Form.Label>
                          <InputGroup>
                            <Form.Control
                              autoFocus
                              required
                              type="text"
                              // placeholder="example@company.com"
                              name="zipcode"
                              value={formik.values.zipcode}
                              onChange={formik.handleChange}
                            />
                          </InputGroup>
                        </Form.Group>
                        <Form.Group
                          className="mb-2"
                          controlId="city"
                          style={{ width: "60%" }}
                        >
                          <Form.Label>{t("common.pages.City")}</Form.Label>
                          <InputGroup>
                            <Form.Control
                              autoFocus
                              required
                              type="text"
                              // placeholder="example@company.com"
                              name="city"
                              value={formik.values.city}
                              onChange={formik.handleChange}
                            />
                          </InputGroup>
                        </Form.Group>
                      </div>

                      <Form.Group className="mb-2" controlId="email">
                        <Form.Label> {t("common.pages.Email")}</Form.Label>
                        <InputGroup>
                          {/* <InputGroup.Text>
                            <span class="material-symbols-outlined">mail</span>
                          </InputGroup.Text> */}
                          <Form.Control
                            autoFocus
                            autoComplete="off"
                            required
                            type="email"
                            // placeholder="example@company.com"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                          />
                        </InputGroup>
                      </Form.Group>
                      <Form.Group id="password" className="mb-2">
                        <Form.Label>{t("common.pages.Password")}</Form.Label>
                        <InputGroup>
                          {/* <InputGroup.Text>
                            <span class="material-symbols-outlined">
                              lock_open
                            </span>
                          </InputGroup.Text> */}
                          <Form.Control
                            required
                            autoComplete="off"
                            type="password"
                            // placeholder="Password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                          />
                        </InputGroup>
                      </Form.Group>
                      <Form.Group id="passwordConfirm" className="mb-2">
                        <Form.Label>
                          {t("common.pages.Confirm_Password")}
                        </Form.Label>
                        <InputGroup>
                          {/* <InputGroup.Text>
                            <span class="material-symbols-outlined">
                              lock_open
                            </span>
                          </InputGroup.Text> */}
                          <Form.Control
                            required
                            type="password"
                            // placeholder="Confirm Password"
                            name="passwordConfirm"
                            value={formik.values.passwordConfirm}
                            onChange={formik.handleChange}
                          />
                        </InputGroup>
                      </Form.Group>
                      <FormCheck
                        type="checkbox"
                        className="d-flex mb-2 align-items-center signup_agree_main"
                      >
                        <FormCheck.Input required id="terms" className="me-2" />
                        <FormCheck.Label
                          htmlFor="terms"
                          onClick={handleShow}
                          className="signup_terms_condition"
                        >
                          {t("common.pages.I agree")}
                        </FormCheck.Label>
                      </FormCheck>
                      <FormCheck
                        type="checkbox"
                        className="d-flex mb-2 align-items-center signup_agree_main"
                      >
                        <FormCheck.Input required id="terms" className="me-2" />
                        <FormCheck.Label
                          htmlFor="terms"
                          onClick={() => setShowProcessModal(true)}
                          className="signup_terms_condition"
                          style={{ width: "380px" }}
                        >
                          {t("dpa_consent")}
                        </FormCheck.Label>
                      </FormCheck>

                      <Button variant="primary" type="submit" className="w-100">
                        {loading ? (
                          <Spinner animation="border" variant="warning" />
                        ) : (
                          t("common.pages.Sign up")
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>
                {/* <div className="mt-3 mb-4 text-center">
                  <span className="fw-normal">or</span>
                </div> */}
                {/* <div className="d-flex justify-content-center my-4">
                  <Button
                    variant="outline-light"
                    className="btn-icon-only btn-pill text-facebook me-2"
                  >
                    <GrFacebookOption style={{ fontSize: "1.5rem" }} />
                  </Button>
                  <Button
                    variant="outline-light"
                    className="btn-icon-only btn-pill text-twitter me-2"
                  >
                    <AiOutlineTwitter style={{ fontSize: "1.5rem" }} />
                  </Button>
                  <Button
                    variant="outline-light"
                    className="btn-icon-only btn-pil text-dark"
                  >
                    <AiFillGithub style={{ fontSize: "1.5rem" }} />
                  </Button>
                </div> */}
                <div
                  className="d-flex justify-content-center align-items-center "
                  style={{ marginTop: "13px" }}
                >
                  <span className="fw-normal w-100">
                    {t("common.pages.Already have an account")}?
                    <Card.Link
                      as={Link}
                      to={Routes.Signin.path}
                      className="fw-bold signup_login_btn"
                    >
                      {t("common.pages.Login here")}
                    </Card.Link>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        {/* Email verfication Modal  */}
        <Modal
          // size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={codeModal}
          className="email_verification_modal_main"
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              {t("common.pages.Email verification")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {t("common.pages.We have sent")}

            <Formik
              onSubmit={(values, { resetForm }) =>
                handleCodeSubmit(values, resetForm)
              }
              enableReinitialize
              initialValues={{
                token: "",
              }}
            >
              {(formik) => (
                <Form className="mt-2" onSubmit={formik.handleSubmit}>
                  <Form.Control
                    autoFocus
                    required
                    type="text"
                    placeholder={t("common.pages.Enter verification code")}
                    name="token"
                    value={formik.values.token}
                    onChange={formik.handleChange}
                  />
                  <div style={{ float: "right", marginTop: "1.5rem" }}>
                    <Button
                      className="email_verification_cancel_btn"
                      onClick={() => setCodeModal(false)}
                    >
                      {t("property_page.cancel")}
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      style={{ marginLeft: "0.7rem" }}
                    >
                      {t("property_page.submit")}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>

        {/* Terms And Conditions Modal */}
        {/* <div  > */}
        <Modal show={show} onHide={handleClose} className="modal_main">
          <Modal.Header closeButton>
            <Modal.Title className="terms_condition_heading">
              Allmänna villkor Janus – abonnemang (SaaS)
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TermsConditions />
          </Modal.Body>
        </Modal>
        <Modal
          show={showProcessModal}
          onHide={() => setShowProcessModal(false)}
          className="modal_main"
        >
          <Modal.Header closeButton>
            <Modal.Title className="terms_condition_heading">
              Databehandlingsavtal
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DataProcessingAgreement organizationName={organization || ""} />
          </Modal.Body>
        </Modal>
        {/* </div> */}
      </section>
    </main>
  );
}
