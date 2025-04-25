import React from "react";
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  Container,
  InputGroup,
  Spinner,
  Dropdown,
  Nav,
} from "@themesberg/react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";

import { Routes } from "../routes";
import { Formik } from "formik";
import api from "api";
import { toast } from "react-toastify";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function ForgotPassword() {
  const [mailSent, setMailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/forgotPassword", values);
      setMailSent(true);
      setLoading(false);
      // toast("Your Password has sucessfully changed!", { type: "success" });
    } catch (error) {
      toast(t(error?.response?.data?.message), { type: "error" });
      console.log(error);
      setLoading(false);
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
      {/* ......  */}
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

      <section className="vh-lg-100 mt-4 mt-lg-0 bg-soft d-flex align-items-center signin_main">
        <Container>
          <Row className="justify-content-center">
            <p className="back_signin_main">
              <Card.Link
                as={Link}
                to={Routes.Signin.path}
                className="text-gray-700 back_signin"
              >
                <span class="material-symbols-outlined me-2">arrow_back</span>

                {t("common.pages.Back to sign in")}
              </Card.Link>
            </p>
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="signin-inner my-3 my-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                {mailSent ? (
                  <>
                    <h3>{t("common.pages.Check your email")}!</h3>
                    <p className="mb-4">
                      {t(
                        "common.pages.We have sent you a link to reset your password"
                      )}
                      .
                    </p>
                  </>
                ) : (
                  <>
                    <h3> {t("common.pages.Forgot password")} ?</h3>
                    <p className="mb-4">
                      {t(
                        "common.pages.Type in your email and we send you a link to reset your password"
                      )}
                    </p>
                    <Formik
                      onSubmit={(values, { resetForm }) =>
                        handleSubmit(values, resetForm)
                      }
                      enableReinitialize
                      initialValues={{
                        email: "",
                      }}
                    >
                      {(formik) => (
                        <Form onSubmit={formik.handleSubmit}>
                          <div className="mb-4">
                            <Form.Label htmlFor="email">
                              {t("common.pages.Email")}
                            </Form.Label>
                            <InputGroup id="email">
                              <Form.Control
                                required
                                autoFocus
                                type="email"
                                // placeholder="john@company.com"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                              />
                            </InputGroup>
                          </div>
                          <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                          >
                            {loading ? (
                              <Spinner animation="border" variant="warning" />
                            ) : (
                              t("common.pages.Recover password")
                            )}
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
