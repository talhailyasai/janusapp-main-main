import React from "react";
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  Container,
  InputGroup,
} from "@themesberg/react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";

import { Routes } from "../routes";
import api from "api";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { t } from "i18next";

export default function ResetPassword() {
  const { token } = useParams();
  const history = useHistory();

  const handleSubmit = async (values) => {
    try {
      if (
        values?.password === values?.confirmPassword &&
        values?.password?.length >= 8
      ) {
        values.token = token;
        const res = await api.post("/auth/resetPassword", values);
        toast("Ditt lösenord har ändrats!", { type: "success" });
        history.push("/sign-in");
      } else if (values?.password?.length < 8) {
        toast("Password must contains at least 8 characters!", {
          type: "error",
        });
      } else {
        toast("Password and confirm password should be same!", {
          type: "error",
        });
      }
    } catch (error) {
      toast(error?.response?.data?.message, { type: "error" });
      console.log(error);
    }
  };
  return (
    <main>
      <section className="bg-soft d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center">
            <p className="text-center">
              <Card.Link
                as={Link}
                to={Routes.Signin.path}
                className="text-gray-700"
              >
                <span class="material-symbols-outlined me-2">chevron_left</span>
                {t("common.pages.back_sigin")}
              </Card.Link>
            </p>
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <h3 className="mb-4">{t("common.pages.reset_pass")}</h3>
                <Formik
                  onSubmit={(values, { resetForm }) =>
                    handleSubmit(values, resetForm)
                  }
                  enableReinitialize
                  initialValues={{
                    password: "",
                    confirmPassword: "",
                  }}
                >
                  {(formik) => (
                    <Form onSubmit={formik.handleSubmit}>
                      {/* <Form.Group id="email" className="mb-4">
                    <Form.Label>Your Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <span class="material-symbols-outlined">mail</span>
                      </InputGroup.Text>
                      <Form.Control
                        autoFocus
                        required
                        type="email"
                        placeholder="example@company.com"
                      />
                    </InputGroup>
                  </Form.Group> */}
                      <Form.Group id="password" className="mb-4">
                        <Form.Label>{t("common.pages.Password")}</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <span class="material-symbols-outlined">
                              lock_open
                            </span>
                          </InputGroup.Text>
                          <Form.Control
                            required
                            type="password"
                            placeholder={t("common.pages.Password")}
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                          />
                        </InputGroup>
                      </Form.Group>
                      <Form.Group id="confirmPassword" className="mb-4">
                        <Form.Label>
                          {t("common.pages.Confirm_Password")}
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            {" "}
                            <span class="material-symbols-outlined">
                              lock_open
                            </span>
                          </InputGroup.Text>
                          <Form.Control
                            required
                            type="password"
                            placeholder={t("common.pages.Confirm_Password")}
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                          />
                        </InputGroup>
                      </Form.Group>
                      <Button variant="primary" type="submit" className="w-100">
                        {t("common.pages.reset_pass")}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
