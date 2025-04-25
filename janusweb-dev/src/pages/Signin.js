import React, { useContext } from "react";
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  Container,
  InputGroup,
  Modal,
  Spinner,
  Nav,
  Navbar,
  Dropdown,
} from "@themesberg/react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import { Routes } from "../routes";
import BgImage from "../assets/img/illustrations/signin.svg";
import { Formik } from "formik";
import { toast } from "react-toastify";
import api from "api";
import { GrFacebookOption } from "react-icons/gr";
import { AiOutlineTwitter, AiFillGithub } from "react-icons/ai";
import { useState } from "react";
import Logo from "../assets/img/janus.png";
import "./Signin.css";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { useUserContext } from "context/SidebarContext/UserContext";

export default function SignIn() {
  const { setToken, setPropertyChange, setBuildingChange, setComponentChange } =
    usePropertyContextCheck();
  usePropertyContextCheck();
  const { setUserToken, usertoken, setUser } = useUserContext();
  const [codeModal, setCodeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

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

  const handleSubmit = async (values, resetForm) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signin", values);
      // console.log("response in login data", res?.data);
      if (res?.data?.message && res?.data?.error) {
        toast.error(
          res?.data?.message[currentLang] ||
            res?.data?.message.en ||
            res?.data?.message
        );
        setPropertyChange(undefined);
        setBuildingChange(null);
        setComponentChange(null);
        if (res?.data?.verified === false) {
          setCodeModal(true);
        }
        setLoading(false);
        return;
      }
      if (res?.data?.verified === false) {
        setCodeModal(true);
        return;
      }
      if (
        res.data.data.user &&
        (!res.data.data.user?.plan ||
          res.data.data.user?.plan == "Under Notice") &&
        res.data.data.user?.role !== "user"
      ) {
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        localStorage.setItem("token", JSON.stringify(res.data.token));
        setToken(JSON.stringify(res.data.token));
        setUserToken(!usertoken);
        setUser(res?.data?.data?.user);
        localStorage.setItem(
          "userId",
          JSON.stringify(res.data.data?.user?._id)
        );
        resetForm();
        setLoading(false);
        setPropertyChange(undefined);
        setBuildingChange(null);
        setComponentChange(null);
        history.push("/");
        return;
      }
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("token", JSON.stringify(res.data.token));
      setToken(JSON.stringify(res.data.token));
      setUserToken(!usertoken);
      setUser(res?.data?.data?.user);
      // history.push("/");
      resetForm();
      setLoading(false);
      setPropertyChange(undefined);
      setBuildingChange(null);
      setComponentChange(null);
      if (
        res.data.data.user?.isFirstLogin ||
        res.data.data.user?.role === "user"
      ) {
        // window.location = "/";
        history.push("/");
      } else {
        // window.location = "/onboarding";
        if (res.data.data.user?.plan == "Under Notice") {
          history.push("/pricing-plan");
        } else {
          history.push("/onboarding");
        }
      }
    } catch (error) {
      setPropertyChange(undefined);
      setBuildingChange(null);
      setComponentChange(null);
      console.log(error);
      // toast(error?.response?.data?.message, { type: "error" });
      if (error?.response?.data?.verified === false) {
        setCodeModal(true);
      }
      setLoading(false);
    }
    // toast.error(t("Internal Server Error"));
  };

  const handleCodeSubmit = async (values) => {
    try {
      values.login = true;
      const res = await api.post("/auth/mailVerification", values);
      if (res?.data?.message && res?.data?.error) {
        toast.error(
          res?.data?.message[currentLang] ||
            res?.data?.message.en ||
            res?.data?.message
        );
        return;
      }
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("token", JSON.stringify(res.data.token));
      // window.location = "/";
      history.push("/");
    } catch (error) {
      toast(error?.response?.data?.message, { type: "error" });
      console.log(error);
    }
  };

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
      {/* Dropdown Change Language */}
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
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5 signin_main">
        <Container>
          <p className="text-center">
            {/* <Card.Link
              as={Link}
              to={Routes.DashboardOverview.path}
              className="text-gray-700"
            >
              <span class="material-symbols-outlined me-2">chevron_left</span>
              Back to homepage
            </Card.Link> */}
          </p>
          <Row
            className="justify-content-center form-bg-image"
            // style={{ backgroundImage: `url(${BgImage})` }}
          >
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  {/* <h3 className="mb-0">Sign in to our platform</h3> */}
                  <img src={Logo} alt="logo" className="signin_logo" />
                </div>
                <Formik
                  onSubmit={(values, { resetForm }) =>
                    handleSubmit(values, resetForm)
                  }
                  enableReinitialize
                  initialValues={{
                    email: "",
                    password: "",
                  }}
                >
                  {(formik) => (
                    <Form className="mt-4" onSubmit={formik.handleSubmit}>
                      <Form.Group id="email" className="mb-4">
                        <Form.Label>{t("common.pages.Email")} </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            {/* <span class="material-symbols-outlined">mail</span> */}
                          </InputGroup.Text>
                          <Form.Control
                            autoFocus
                            required
                            type="email"
                            // placeholder="example@company.com"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                          />
                        </InputGroup>
                      </Form.Group>
                      <Form.Group>
                        <Form.Group id="password" className="mb-4">
                          <Form.Label>{t("common.pages.Password")}</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              {/* <span class="material-symbols-outlined">
                                lock_open
                              </span> */}
                            </InputGroup.Text>
                            <Form.Control
                              required
                              type="password"
                              // placeholder="Password"
                              name="password"
                              value={formik.values.password}
                              onChange={formik.handleChange}
                            />
                          </InputGroup>
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center mb-4 signin_lost_password_main">
                          {/* <Form.Check type="checkbox">
                            <FormCheck.Input
                              id="defaultCheck5"
                              className="me-2"
                            />
                            <FormCheck.Label
                              htmlFor="defaultCheck5"
                              className="mb-0"
                            >
                              Remember me
                            </FormCheck.Label>
                          </Form.Check> */}
                          <Card.Link
                            className="small text-end signin_lost_password"
                            onClick={() => history.push("/forgot-password")}
                          >
                            {t("common.pages.Lost password")}?
                          </Card.Link>
                        </div>
                      </Form.Group>
                      <Button variant="primary" type="submit" className="w-100">
                        {loading ? (
                          <Spinner animation="border" variant="warning" />
                        ) : (
                          t("common.pages.Sign in")
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>
                <div className="mt-3 mb-4 text-center">
                  <span className="fw-normal">
                    {t("common.pages.or")}
                    {/* login with */}
                  </span>
                </div>
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
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    {/* Not registered? */}
                    <Card.Link
                      as={Link}
                      to={Routes.Signup.path}
                      className="fw-bold"
                    >
                      {t("common.pages.Create account")}
                      {/* {` Create account `} */}
                    </Card.Link>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        {/* Email verifi modal  */}
        <Modal
          // size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={codeModal}
          className="email_verification_modal_main"
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Email Verification
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                    placeholder="Enter Verification code"
                    name="token"
                    value={formik.values.token}
                    onChange={formik.handleChange}
                  />
                  <div style={{ float: "right", marginTop: "1.5rem" }}>
                    <Button
                      variant="secondary"
                      onClick={() => setCodeModal(false)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      style={{ marginLeft: "0.7rem" }}
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </section>
    </main>
  );
}
