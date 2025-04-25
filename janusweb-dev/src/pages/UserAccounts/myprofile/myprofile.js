import React, { useEffect, useState } from "react";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import myProfileSidePanel from "./myProfileSidePanel";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "@themesberg/react-bootstrap";
import { Dropdown } from "@themesberg/react-bootstrap";
import "./myprofile.css";
import api from "api";
import UserDeleteModal from "./UserDeleteModal";
import { t } from "i18next";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import DropdownComponent from "components/common/Dropdown";
import { Formik } from "formik";
import { useUserContext } from "context/SidebarContext/UserContext";
import SubscriptionCancelModal from "./modals/SubscriptionCancelModal";
import DeleteAccountConfirmModal from "./modals/DeleteAccountConfirmModal";

const Myprofile = ({
  newItem,
  editItem,
  deleteItem,
  handleChangeAction,
  selectedUser,
  setSelectedUser,
  users,
  setUsers,
  setCurrentTab,
  setUser,
  dupUsers,
  admin,
  fetchUsers,
  setFetchUsers,
}) => {
  const [showMaxUserModal, setShowMaxUserModal] = useState(false);
  const [maxUserMessage, setMaxUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [codeModal, setCodeModal] = useState(false);
  const { setUser: setCurrentUser, user: currentUser } = useUserContext();

  const history = useHistory();
  // const [users, setUsers] = useState([]);

  // Delete Modal State
  const [show, setShow] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteUser = async () => {
    try {
      let res = await api.delete(`/users/delete/${selectedUser?._id}`);
      setUsers(users?.filter((el) => el?._id !== selectedUser?._id));
      deleteModalClose();
      setShowDeleteModal(false);
      handleChangeAction(null);
      setFetchUsers(!fetchUsers);
      setSelectedUser(undefined);
      // window.location.reload();
    } catch (error) {
      handleChangeAction(null);
      console.log(error);
    }
  };
  const handleGoToSubscription = async () => {
    // Navigate to subscription settings
    getCustomerPortal();
  };
  const handleCloseMaxUser = () => {
    handleChangeAction(null);
    setShowMaxUserModal(false);
  };
  const getCustomerPortal = async () => {
    if (
      (currentUser?.plan === "Standard Plus" ||
        currentUser?.plan === "Standard" ||
        currentUser?.cancelSubscriptionDate) &&
      !currentUser?.trialEnd
    ) {
      let res = await api.get(`/stripe/getCustomerPortal/${currentUser?._id}`);
      // console.log("res?.dat in myproleie", res?.data);
      setLoading(false);
      setShowSubscriptionModal(false);
      handleChangeAction(null);
      setLoading(false);
      window.location = res?.data;
    } else {
      setLoading(false);
      setShowSubscriptionModal(false);
      handleChangeAction(null);
      setLoading(false);
      history.push("/pricing-plan");
    }
  };

  useEffect(() => {
    setUsers(dupUsers);
    if (admin) {
      setSelectedUser(admin);
    }
  }, []);

  const handleUpgradePlan = async () => {
    setLoading(true);
    await getCustomerPortal();
  };

  const handleSubmit = async (e, data) => {
    setDisabledBtn(true);
    e.preventDefault();
    data.isVerified = true;
    if (newItem) {
      // data.profileUser = true;
      const user = JSON.parse(localStorage.getItem("user"));
      data.tenantId = user?._id;
      data.role = "user";
      const res = await api.post("/auth/signup", data);
      console.log(res?.response, "response");
      if (res?.response?.data?.message) {
        setMaxUserMessage(res?.response?.data?.message);
        if (res?.response?.data?.message !== "User already exists")
          return setShowMaxUserModal(true);
        else return;
      }
      setUsers([...users, res.data]);
      // setUser(res.data);
      setSelectedUser(res?.data);
      handlePopulateValue(res?.data);
      setFetchUsers(!fetchUsers);
      setCurrentTab("settings");
    } else {
      if (data?.password) {
        data.passwordChange = true;
      } else {
        data.password = selectedUser?.password;
        data.passwordChange = false;
      }
      let res = await api.patch(`/users/edit/${selectedUser?._id}`, data);
      if (res?.status === 201) {
        setCodeModal(true);
        handleChangeAction(null);
        // history.push("/useraccounts");
        setDisabledBtn(false);
        return;
      }
      setFetchUsers(!fetchUsers);
      setSelectedUser(res?.data);
      // setUsers(
      //   users.map((elem) => {
      //     if (elem._id == res.data._id) {
      //       return (elem = res.data);
      //     } else {
      //       return elem;
      //     }
      //   })
      // );
      // window.location.reload();
    }
    handleChangeAction(null);
    history.push("/useraccounts");
    setDisabledBtn(false);
  };

  const handleCodeSubmit = async (values) => {
    try {
      values.login = false;
      values.isVerified = true;
      const res = await api.post("/auth/mailVerification", values);
      console.log("currentUser", currentUser, res?.data);
      if (currentUser?._id === res?.data?.user?._id) {
        setCurrentUser(res?.data?.user);
      }
      localStorage.setItem("userId", res.data.user?._id);
      setSelectedUser(res?.data?.user);
      toast.success(t("User updated successfully!"));
      setCodeModal(false);
      setFetchUsers(!fetchUsers);
    } catch (error) {
      // toast(t(error?.response?.data?.message), { type: "error" });
      setCodeModal(false);
      console.log(error);
    }
  };

  const handleNewProperty = (item) => {
    if (selectedUser || newItem) {
      let d = editItem ? { ...selectedUser, password: null } : null;
      SidePanelService.open(myProfileSidePanel, {
        handleSubmit,
        initalVal: d,
        // newTask,
        disabledBtn,
        handleClose: () => {
          handleChangeAction(null);
          history.push("/useraccounts");
        },
      });
    } else {
      handleChangeAction(null);
      return toast(t("Please Select the User!"), { type: "error" });
    }
  };

  useEffect(() => {
    if (newItem) {
      handleNewProperty();
    } else if (editItem) {
      handleNewProperty();
    } else if (deleteItem) {
      // setShow(true);
      if (selectedUser?.role === "user") {
        setShow(true);
      } else if (selectedUser?.plan === "Under Notice") {
        setShowDeleteModal(true);
      } else {
        setShowSubscriptionModal(true);
      }
    }
  }, [newItem, editItem, deleteItem]);

  // const getAllUser = async () => {
  //   try {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     let allprofileUser = await api.get(`/users/adminId/${user?._id}`);
  //     setUsers(allprofileUser?.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getAllUser();
  // }, []);

  const handlePopulateValue = (elem) => {
    setSelectedUser(elem);
  };

  // Delete Modal Function
  const deleteModalClose = () => {
    setShow(false);
    handleChangeAction(null);
  };
  // console.log({ selectedUser, users });
  return (
    <div>
      {(newItem || editItem) && <SidePanelRoot />}
      <Container style={{ margin: "0px" }}>
        <Row>
          <Col xl={4} lg={7}>
            <div className="activity-input-container mt-5">
              <Dropdown className="dropdown_year">
                <Dropdown.Toggle className="activites_year_dropdown activites_dropdown my_profile_dropdown my_profile_toogle">
                  {t("common.pages.select_user")}
                  <span class="material-symbols-outlined">arrow_drop_down</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="my_profile_dropdown dropDown_scroll">
                  {users?.map((elem) => {
                    return (
                      <Dropdown.Item
                        onClick={() => handlePopulateValue(elem)}
                        className="activitesYear_dropdown_menu_item"
                      >
                        {elem?.email}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>

              <Form.Group>
                <Form.Label>{t("common.pages.Email")}</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={selectedUser?.email || ""}
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("common.pages.Password")}</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  value={selectedUser?.password ? "passw" : ""}
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("property_page.name")}</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  value={selectedUser?.name || ""}
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("data_settings.phone")} </Form.Label>
                <Form.Control
                  name="mobile_phone"
                  type="number"
                  value={selectedUser?.mobile_phone || ""}
                  disabled
                />
              </Form.Group>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Delete Modal */}
      {show && (
        <UserDeleteModal
          deleteModalClose={deleteModalClose}
          show={show}
          deleteUser={deleteUser}
        />
      )}
      <SubscriptionCancelModal
        show={showSubscriptionModal}
        onHide={() => {
          setShowSubscriptionModal(false);
          handleChangeAction(null);
        }}
        onGoToSubscription={handleGoToSubscription}
      />
      <DeleteAccountConfirmModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          handleChangeAction(null);
        }}
        onConfirmDelete={deleteUser}
      />

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
      {/* Maximum User Modal  */}
      <Modal
        show={showMaxUserModal}
        onHide={handleCloseMaxUser}
        centered
        className="email_verification_modal_main"
      >
        <Modal.Header closeButton>
          <Modal.Title> {t("common.pages.chg_plan")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("common.pages.you_can_add_maximum") + " "}
          {maxUserMessage ? maxUserMessage - 1 : 0}
          {t("property_page.user")}.
          {" " + t("property_page.if_you_add_more_users")}
          <div className="update_btn_main">
            <Button
              variant="primary"
              onClick={handleUpgradePlan}
              className="update_btn_change_plan mt-2"
              disabled={loading}
            >
              {loading ? "Loading..." : t("common.pages.update_plan")}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Myprofile;
