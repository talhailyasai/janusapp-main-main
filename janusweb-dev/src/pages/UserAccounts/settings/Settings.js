import {
  Col,
  Container,
  Row,
  Dropdown,
  Form,
  Button,
  Modal,
} from "@themesberg/react-bootstrap";
import React, { useRef, useState } from "react";
import "./Setting.css";
import api from "api";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Multiselect from "multiselect-react-dropdown";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import { t } from "i18next";

const Settings = ({
  selectedUser,
  setSelectedUser,
  users,
  setUsers,
  setAdmin,
}) => {
  const history = useHistory();

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [allProperty, setAllProperty] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShowValue = (elem) => {
    setSelectedUser(elem);
  };
  const multiselectRef = useRef();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUsers(users?.filter((el) => el?._id !== user?._id));
    // setSelectedUser(selectedUser?._id === user?._id ? null : selectedUser);
    setAdmin(selectedUser?._id === user?._id ? selectedUser : null);
  }, []);

  const onSelect = (selectedList, selectedItem) => {
    //debugger;
    let selectedPropertyArray = selectedList?.map((el) => el?.property_code);
    let propertyCodes = selectedPropertyArray?.join(",");
    setSelectedProperty(selectedList);
    handleChange(propertyCodes);
  };

  const onRemove = (selectedList, removedItem) => {
    setSelectedProperty(selectedList);
    let selectedPropertyArray = selectedList?.map((el) => el?.property_code);
    let propertyCodes = selectedPropertyArray?.join(",");
    if (!propertyCodes) {
      handleChange("null");
    } else {
      handleChange(propertyCodes);
    }
  };
  const updateSelectedUser = async (updateData) => {
    try {
      const res = await api.patch(`/users/${selectedUser?._id}`, updateData);
      const updatedUsers = users?.map((el) =>
        el._id === selectedUser._id ? res.data : el
      );
      setUsers(updatedUsers);
      setSelectedUser(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = async (propertyCode) => {
    //debugger;
    try {
      if (selectedUser) {
        if (!propertyCode) {
          if (selectedUser?.propertyAccess) {
            await updateSelectedUser({ isAccessAllProperty: false });
          } else {
            return toast(t("property_page.please_select_property"), {
              type: "error",
            });
          }
        } else {
          await updateSelectedUser({
            propertyAccess: propertyCode,
            isAccessAllProperty: false,
          });
        }
      } else {
        toast(t("Please Select the User!"), {
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProperties = async (indv) => {
    if (selectedUser?.role != "user") {
      setSelectedUser(null);
      return;
    }
    const res = await api.get(`/properties/?pagination=${false}`);
    const allProperties = res?.data?.filter((el) => el?.name);
    setProperties(allProperties || []);
    if (selectedUser?.propertyAccess && selectedUser?.propertyAccess != null) {
      let foundProperties = selectedUser?.propertyAccess?.split(",");
      let foundWholeProperties = allProperties?.filter((elem) =>
        foundProperties?.includes(elem?.property_code)
      );
      setSelectedProperty(
        foundWholeProperties?.length > 0 ? foundWholeProperties : null
      );
    } else {
      setSelectedProperty([]);
    }

    setAllProperty(true);
  };
  useEffect(() => {
    if (selectedUser) {
      setSelectedProperty(null);
      fetchProperties();
      if (multiselectRef.current) {
        multiselectRef.current.resetSelectedValues();
      }
    } else {
      setProperties([]); // Reset properties when no user is selected
      setSelectedProperty([]);
      if (multiselectRef.current) {
        multiselectRef.current.resetSelectedValues();
      }
    }
  }, [selectedUser?._id]);

  const getCurrentUser = async () => {
    let userId = JSON.parse(localStorage.getItem("user"))?._id;
    try {
      let res = await api.get(`/users/${userId}`);
      setCurrentUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const propertyFunctionsUpdate = async (functionName) => {
    try {
      if (selectedUser) {
        let data = {
          switchOn: !selectedUser?.Functions?.includes(functionName),
          functionName,
        };
        const res = await api.patch(
          `/useraccounts/functions/${selectedUser?._id}`,
          data
        );

        setSelectedUser(res?.data);
      } else {
        toast(t("Please Select the User!"), {
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAllProperty = async () => {
    try {
      if (selectedUser) {
        const res = await api.patch(`/users/${selectedUser?._id}`, {
          isAccessAllProperty: true,
        });
        setSelectedUser(res?.data);
      } else {
        toast(t("Please Select the User!"), {
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpgradePlan = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (
      (user?.plan === "Standard Plus" ||
        user?.plan === "Standard" ||
        user?.cancelSubscriptionDate) &&
      !user?.trialEnd
    ) {
      let res = await api.get(`/stripe/getCustomerPortal/${user?._id}`);
      window.location = res?.data;
    } else {
      history.push("/pricing-plan");
    }
  };

  return (
    <Container style={{ margin: "0px" }}>
      <Row className="mt-5">
        <Col xl={4} lg={6} md={9} className="mb-5">
          <Form.Label>{t("common.pages.user")}</Form.Label>

          <Dropdown className="dropdown_year">
            <Dropdown.Toggle className="activites_year_dropdown activites_dropdown my_profile_dropdown my_profile_toogle">
              {selectedUser?.email || t("common.pages.select_user")}
              <span class="material-symbols-outlined">arrow_drop_down</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="my_profile_dropdown setting_dropdown">
              {users?.map((elem) => {
                return (
                  <Dropdown.Item
                    onClick={() => handleShowValue(elem)}
                    className="activitesYear_dropdown_menu_item"
                  >
                    {elem?.email}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <hr />
      </Row>

      <Row>
        <Col md={4}>
          <label
            className="mt-2 text-center bg-dark text-light rounded setting_functions_label"
            style={{ fontSize: "17px", width: "100%" }}
          >
            {t("common.pages.Functions")}
          </label>
          <div>
            <Row className="mt-4">
              <Col className="setting_property_heading" lg={6}>
                {t("common.pages.property_registry")}
              </Col>
              <Col lg={6}>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  onChange={() => propertyFunctionsUpdate("propertyRegistry")}
                  checked={
                    selectedUser?.Functions?.includes("propertyRegistry")
                      ? true
                      : false
                  }
                />
              </Col>
            </Row>

            <Row className="mt-4">
              <Col lg={6} className="setting_property_heading">
                {t("common.sidebar.maintainence")}
              </Col>
              <Col lg={6}>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  onChange={() => propertyFunctionsUpdate("maintenance")}
                  checked={
                    selectedUser?.Functions?.includes("maintenance")
                      ? true
                      : false
                  }
                />
              </Col>
            </Row>

            <Row className="mt-4">
              <Col lg={6} className="setting_property_heading">
                {t("common.sidebar.supervision")}
              </Col>

              <Col lg={6}>
                {currentUser?.plan === "Under Notice" ||
                currentUser?.plan == "Standard" ||
                currentUser?.canceledPlan == "Standard" ? (
                  <AiOutlineInfoCircle
                    onClick={handleShow}
                    className="supervision_icon"
                  />
                ) : (
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    onChange={() => propertyFunctionsUpdate("supervision")}
                    checked={
                      selectedUser?.Functions?.includes("supervision")
                        ? true
                        : false
                    }
                  />
                )}
              </Col>
            </Row>

            {/* Images & FIles */}
            <Row className="mt-4">
              <Col lg={6} className="setting_property_heading">
                {t("common.pages.Images & Files")}
              </Col>

              <Col lg={6}>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  onChange={() => propertyFunctionsUpdate("images_&_files")}
                  checked={
                    selectedUser?.Functions?.includes("images_&_files")
                      ? true
                      : false
                  }
                />
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={2}></Col>
        <Col md={4}>
          <label
            className="mt-2 text-center bg-dark text-light rounded setting_functions_label"
            style={{ fontSize: "17px", width: "100%" }}
          >
            {t("common.sidebar.properties")}
          </label>
          <div>
            {/* <Row className="mt-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>
                    {t("common.pages.User_have_access_to")}
                  </Form.Label>
                  <div className="d-flex justify-content-between">
                    <Form.Control
                      name="email"
                      type="email"
                      value={t(
                        "common.pages.Properties_user_is_responsible_for"
                      )}
                      disabled
                      style={{ width: "81%" }}
                    />
                    <input
                      type="radio"
                      name="radioGroup"
                      value="option1"
                      onChange={() => handleChange("responsibleProperty")}
                      className="property_radio_btn"
                      checked={
                        selectedUser?.propertyAccess === "responsibleProperty"
                          ? true
                          : false
                      }
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row> */}
            <Row className="mt-4">
              <Col md={10} className="setting_property_heading">
                <div className="d-flex flex-column">
                  <label>{t("common.pages.individual_properties")}</label>
                  <Multiselect
                    options={properties}
                    onSelect={onSelect}
                    onRemove={onRemove}
                    selectedValues={
                      !selectedUser?.isAccessAllProperty
                        ? selectedProperty
                          ? selectedProperty
                          : []
                        : []
                    }
                    displayValue="name"
                    id={`properties${selectedUser?._id}`}
                    className="mb-3"
                    name="properties"
                    placeholder={t("common.pages.select")}
                    disable={
                      (!selectedUser || selectedUser?.role !== "user") && true
                    }
                    singleSelect={false}
                    ref={multiselectRef}
                    keepSearchTerm={false}
                  />
                </div>
              </Col>
              <Col
                md={2}
                className="d-flex align-items-center justify-content-center"
              >
                <input
                  type="radio"
                  // name="radioGroup"
                  // value="option2"
                  onClick={() => handleChange(false)}
                  className="property_radio_btn"
                  checked={
                    selectedProperty?.length > 0 &&
                    !selectedUser?.isAccessAllProperty
                      ? true
                      : false
                  }
                />
              </Col>
            </Row>

            <Row className="mt-4">
              <Col md={10} className="setting_property_heading">
                <Form.Group>
                  <Form.Control
                    name="text"
                    type="text"
                    value={t("common.pages.all_properties")}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col
                md={2}
                className="d-flex align-items-center justify-content-center"
              >
                <input
                  type="radio"
                  // name="radioGroup"
                  // value="option1"
                  onClick={handleAllProperty}
                  className="property_radio_btn"
                  checked={
                    // selectedUser?.Functions?.includes("propertyRegistry") &&
                    selectedUser?.isAccessAllProperty
                  }
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="email_verification_modal_main"
      >
        <Modal.Header closeButton>
          <Modal.Title> {t("common.pages.change_plan")} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("common.pages.if_you_want_this_then_you_update")}
          <div className="update_btn_main">
            <Button
              variant="primary"
              onClick={handleUpgradePlan}
              className="update_btn_change_plan"
            >
              {t("common.pages.update_plan")}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Settings;
