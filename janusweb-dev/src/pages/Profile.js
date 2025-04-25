import React from "react";
import {
  Row,
  Col,
  Nav,
  Tab,
  Form,
  InputGroup,
  Button,
} from "@themesberg/react-bootstrap";
import userImg from "../assets/img/user.png";
import editImg from "../assets/img/icons/edit.png";
import { Formik } from "formik";
import { useState } from "react";
import api from "api";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [pic, setPic] = useState(null);
  const [picUrl, setPicUrl] = useState(null);
  const { t } = useTranslation();

  const getUser = async () => {
    let userId = JSON.parse(localStorage.getItem("user"))?._id;
    try {
      let res = await api.get(`/users/${userId}`);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleFormikFileChange = async (e, formik) => {
    let file = e.target.files[0];
    setPic(file);
    setPicUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (values) => {
    try {
      if (pic) {
        const formData = new FormData();
        for (const key in values) {
          if (Array.isArray(values[key])) {
            formData.append(key, JSON.stringify(values[key]));
          } else {
            if (values[key] !== null) formData.append(key, values[key]);
          }
        }
        formData.append("photo", pic);
        let res = await api.patch(`/users/${user?._id}`, formData);
        setUser(res.data);
      } else {
        let res = await api.patch(`/users/${user?._id}`, values);
        setUser(res.data);
      }
      setPic(null);
      setPicUrl(null);
      toast("Profile Updated Successfully!", { type: "success" });
    } catch (error) {
      console.log(error);
      // toast(error?.response?.data?.message, { type: "error" });
    }
  };
  return (
    <div className="mt-4">
      <Tab.Container defaultActiveKey="profile">
        <Row>
          <Col lg={10}>
            <Nav
              fill
              className="bg-black text-white flex-column flex-sm-row border border-dark"
            >
              <Nav.Item>
                <Nav.Link
                  eventKey="profile"
                  className="border border-white py-3 mb-sm-3 mb-md-0 nav-tabmenu"
                >
                  Profile
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="settings"
                  className="border border-white py-3 mb-sm-3 mb-md-0 nav-tabmenu"
                >
                  {t("data_settings.settings")}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="billing"
                  className="border border-white py-3 mb-sm-3 mb-md-0 nav-tabmenu"
                >
                  {t("data_settings.billing_info")}
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="profile" className="py-4">
                <div>
                  <div className="userImg">
                    <img
                      src={
                        picUrl ? picUrl : user?.photo ? user?.photo : userImg
                      }
                      style={{
                        width: "8rem",
                        height: "8rem",
                        borderRadius: "50%",
                      }}
                      alt="userImg"
                    />
                    <Form.Control
                      className="rounded-0"
                      type="file"
                      name="image"
                      id="userImg"
                      onChange={(e) => handleFormikFileChange(e)}
                      style={{ display: "none" }}
                    />
                    <label for="userImg">
                      <img src={editImg} alt="editPic" className="editPic" />
                    </label>
                  </div>

                  <Formik
                    onSubmit={(values, { resetForm }) =>
                      handleSubmit(values, resetForm)
                    }
                    enableReinitialize
                    initialValues={{
                      email: user?.email,
                      mobile_phone: user?.mobile_phone,
                      name: user?.name,
                    }}
                  >
                    {(formik) => (
                      <Form className="mt-4" onSubmit={formik.handleSubmit}>
                        <Row>
                          <Form.Group id="name" className="mb-4" as={Col}>
                            <Form.Label>{t("common.pages.name")}</Form.Label>
                            <InputGroup>
                              <Form.Control
                                autoFocus
                                // required
                                type="text"
                                placeholder={t("data_settings.enter_name")}
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                              />
                            </InputGroup>
                          </Form.Group>
                          <Form.Group id="email" className="mb-4" as={Col}>
                            <Form.Label>{t("data_settings.email")}</Form.Label>
                            <InputGroup>
                              <Form.Control
                                readOnly
                                // autoFocus
                                required
                                type="email"
                                placeholder="example@company.com"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                              />
                            </InputGroup>
                          </Form.Group>
                        </Row>
                        <Row>
                          <Form.Group
                            id="mobile_phone"
                            className="mb-4"
                            as={Col}
                          >
                            <Form.Label>{t("data_settings.phone")}</Form.Label>
                            <InputGroup>
                              <Form.Control
                                autoFocus
                                // required
                                type="text"
                                placeholder="Phone No."
                                name="mobile_phone"
                                value={formik.values.mobile_phone}
                                onChange={formik.handleChange}
                              />
                            </InputGroup>
                          </Form.Group>
                          <Form.Group className="mb-4" as={Col}></Form.Group>
                        </Row>

                        <Button
                          variant="primary"
                          type="submit"
                          //   className="w-100"
                        >
                          {t("planning_page.submit")}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="settings" className="py-4">
                settings
              </Tab.Pane>
              <Tab.Pane eventKey="billing" className="py-4">
                billing
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default Profile;
