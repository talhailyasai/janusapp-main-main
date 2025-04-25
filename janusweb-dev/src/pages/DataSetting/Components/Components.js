import {
  InputGroup,
  OverlayTrigger,
  Table,
  Tooltip,
  Modal,
} from "@themesberg/react-bootstrap";
import React, { useState, useRef } from "react";
import { Form } from "@themesberg/react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import "../MaintenanceItem/maintenanceItem.css";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import { useEffect } from "react";
import ComponentsSidePanel from "./ComponentsSIdePanel";
import Loader from "components/common/Loader";
import api from "api";
import { BsFileEarmarkText } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import DeleteModal from "components/PlanningPage/MaintainancePage/components/Report/ActivitesYear/DeleteModal";
import Button from "components/common/Button";
import { MdContentCopy } from "react-icons/md";

const Components = ({ componentPkgs, setComponentPkgs }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [initalVal, setInitalVal] = useState(null);
  const [allComponents, setAllComponents] = useState([]);
  const [duplicateComponents, setDuplicateComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);

  const [show, setShow] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const { t } = useTranslation();

  const handleNewProperty = (item) => {
    setInitalVal(item);
    SidePanelService.open(ComponentsSidePanel, {
      handleSubmit,
      initalVal,
      // newTask,
      handleClose: () => {
        setShowDrawer(false);
      },
    });
  };

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    if (initalVal == null || !initalVal?._id) {
      data.order = allComponents.length;
      const res = await api.post("/components/datasettings", data);
      let response = [...allComponents, res.data];
      setAllComponents(response);
      setDuplicateComponents(response);
      setComponentPkgs([...componentPkgs, res.data]);
    } else {
      let res = await api.patch(
        `/components/datasettings/${initalVal._id}`,
        data
      );
      let response = allComponents.map((elem) => {
        if (elem._id == res.data._id) {
          return (elem = res.data);
        } else {
          return elem;
        }
      });

      setAllComponents(response);
      setDuplicateComponents(response);
      setComponentPkgs(response);
    }

    setShowDrawer(false);
  };

  const getAllMaintenanceItem = async () => {
    setLoading(true);

    const res = await api.get("/components/datasettings/all");
    setAllComponents(res.data);
    console.log(res.data?.filter((el) => el?.tenantId));
    setDuplicateComponents(res.data);
    setLoading(false);
  };

  useEffect(() => {
    handleNewProperty();
    getAllMaintenanceItem();
  }, [showDrawer]);

  const deleteComponent = async (id) => {
    const res = await api.delete(`/components/datasettings/${id}`);
    let data = allComponents.filter((elem) => {
      return elem._id !== id;
    });

    setAllComponents(data);
    setDuplicateComponents(data);
    setComponentPkgs(data);
    deleteModalClose();
  };

  const handleSearch = (e) => {
    let uValue = e.target.value.toUpperCase();
    setSearchValue(uValue);
    let val = e.target.value.toLowerCase();
    if (val === "") {
      setAllComponents(duplicateComponents);
    } else {
      setAllComponents(
        duplicateComponents?.filter((el) =>
          el?.u_component_name?.toLowerCase()?.includes(val)
        )
      );
    }
  };

  const deleteModalClose = () => {
    setShow(false);
  };

  const handleShow = (item) => {
    setInitalVal(item);
    setShow(true);
  };

  const handleShowTextModal = (text, type) => {
    setModalText(text);
    setModalTitle(
      type === "attendance"
        ? t("data_settings.attendance_text")
        : type === "maintenance"
        ? t("data_settings.maintenance_text")
        : t("data_settings.cleaning_text")
    );
    setShowTextModal(true);
  };

  return (
    <>
      {/* Search bar  */}
      <div className="d-flex align-items-center">
        <Form.Control
          type="text"
          placeholder={t("common.pages.search")}
          onChange={(e) => handleSearch(e)}
          value={searchValue}
          style={{ width: "17rem" }}
        />
      </div>

      {/* <AiOutlinePlus
        className="data_setting_create_icon"
        onClick={() => setShowDrawer(true)}
      /> */}
      <div className="component_package_add_btn">
        <Button
          className="add_package_btn component_add"
          onClick={() => setShowDrawer(true)}
        >
          <span className="add_package_plus">+</span>
          {t("common.pages.add_component")}
        </Button>
      </div>
      {showDrawer && <SidePanelRoot />}
      {loading ? (
        <div style={{ marginBottom: "1rem" }}>
          <Loader />
        </div>
      ) : (
        <>
          <div className="maintenanceItem_Table">
            <Table className="components-table">
              <thead>
                <tr style={{ color: "black" }}>
                  <th>{t("data_settings.component_code")}</th>
                  <th>{t("data_settings.component_name")}</th>
                  <th>{t("data_settings.interval_attendance")}</th>
                  <th>{t("data_settings.time_attendance")}</th>
                  <th>{t("data_settings.text_attandance")}</th>
                  <th>{t("data_settings.interval_maint")}</th>
                  <th>{t("data_settings.time_maint")}</th>
                  <th>{t("data_settings.text_maint")}</th>
                  {/* <th>{t("data_settings.interval_clean")}</th>
                  <th>{t("data_settings.time_clean")}</th>
                  <th>{t("data_settings.text_clean")}</th>
                  <th>Attributes</th> */}
                  <th>{t("common.pages.actions")}</th>
                  <th>System</th>
                </tr>
              </thead>
              <tbody className="components_main">
                {allComponents?.map((el) => {
                  return (
                    <tr>
                      <td>{el?.u_component_abbreviation}</td>
                      <td>{el?.u_component_name}</td>
                      <td>{el?.attendance_interval_value}</td>
                      <td>{el?.attendance_budget_time}</td>
                      <td>
                        {el?.attendance_text ? (
                          <OverlayTrigger
                            overlay={
                              <Tooltip>
                                {t("data_settings.click_to_view_text")}
                              </Tooltip>
                            }
                          >
                            <BsFileEarmarkText
                              className="text_attendenance_icon"
                              onClick={() =>
                                handleShowTextModal(
                                  el?.attendance_text,
                                  "attendance"
                                )
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </OverlayTrigger>
                        ) : null}
                      </td>
                      <td>{el?.maintenance_interval_value}</td>
                      <td>{el?.maintenance_budget_time}</td>
                      <td>
                        {el?.maintenance_text ? (
                          <OverlayTrigger
                            overlay={
                              <Tooltip>
                                {t("data_settings.click_to_view_text")}
                              </Tooltip>
                            }
                          >
                            <BsFileEarmarkText
                              className="text_attendenance_icon"
                              onClick={() =>
                                handleShowTextModal(
                                  el?.maintenance_text,
                                  "maintenance"
                                )
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </OverlayTrigger>
                        ) : null}
                      </td>
                      {/* <td>{el?.intervalClean}</td>
                      <td>{el?.cleaning_budget_time}</td>
                      <td>{el?.cleaning_text}</td>
                      <td>{el?.attributes}</td> */}
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItem: "center",
                            columnGap: "5px",
                            justifyContent: "center",
                          }}
                        >
                          {el?.tenantId && (
                            <CiEdit
                              className="data_setting_edit_icon"
                              onClick={() => {
                                handleNewProperty(el);
                                setShowDrawer(true);
                              }}
                            />
                          )}
                          <MdContentCopy
                            className="data_setting_edit_icon"
                            onClick={() => {
                              let element = el;
                              delete element._id;
                              handleNewProperty(element);
                              setShowDrawer(true);
                            }}
                          />
                          {el?.tenantId && (
                            <RiDeleteBin6Line
                              className="data_setting_delete_icon"
                              onClick={() => handleShow(el?._id)}
                              // onClick={() => deleteComponent(el._id)}
                            />
                          )}
                        </div>
                      </td>
                      <td id={el?.u_system?.split(".")[0]}>{el?.u_system}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {/* // Delete Modal  */}
          {show && (
            <DeleteModal
              deleteModalClose={deleteModalClose}
              show={show}
              modalBody={t(
                "data_settings.Are you sure you want to delete this  Component?"
              )}
              modalHeader={t("data_settings.Delete Component")}
              deleteFunction={deleteComponent}
              deleteItemId={initalVal}
            />
          )}

          <Modal
            show={showTextModal}
            onHide={() => setShowTextModal(false)}
            size="lg"
            centered
            className="component-text-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {modalText}
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};

export default Components;
