import {
  Accordion,
  Form,
  OverlayTrigger,
  Table,
  Tooltip,
  Button as BootstrapButton,
  Modal,
} from "@themesberg/react-bootstrap";
import React, { useEffect } from "react";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import "../../../../pages/DataSetting/MaintenancePackage/maintenancePackage.css";
import api from "api";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "components/common/Loader";
import { useTranslation } from "react-i18next";
import Button from "components/common/Button";
import DeleteModal from "components/PlanningPage/MaintainancePage/components/Report/ActivitesYear/DeleteModal";
import { MdContentCopy } from "react-icons/md";
import ComponentPackageSidePanel from "pages/DataSetting/ComponentPackage/ComponentPackageSidePanel";
import { BsFileEarmarkText } from "react-icons/bs";
import { generateRandomString } from "utils/helper";
import { useOnboarding } from "context/OnboardingContext";
import { toast } from "react-toastify";
import { generateUniqueCode } from "lib/utils/generateUniqueCode";

const OnBoardingComponentPackages = () => {
  const [allComponents, setAllComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dupCompPkg, setDupCompPkg] = useState([]);
  const [hoveredPackageId, setHoveredPackageId] = useState(null);
  const { t } = useTranslation();
  const { setPlansCode, setComponents, nextStep, activeBuilding } =
    useOnboarding();
  const [showTextModal, setShowTextModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const [show, setShow] = useState(false);

  const taskStatus = {
    requested: {
      name: "Requested",
      items: allComponents,
    },
    toDo: {
      name: "To do",
      items: [],
    },
  };

  const [showDrawer, setShowDrawer] = useState(false);
  const [columns, setColumns] = useState(taskStatus);
  const [selectedPackages, setSelectedPackages] = useState([]);

  // package name edit state
  const [initalVal, setInitalVal] = useState(null);

  // package name state
  const [allPackage, setAllPackage] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [componentPkgs, setComponentPkgs] = useState([]);

  const getAllPackages = async () => {
    const res = await api.get("/components/datasettings/all");
    setComponentPkgs(res.data?.sort((a, b) => (a.order > b.order ? 1 : -1)));
  };

  const handleNewProperty = (item) => {
    setInitalVal(item);
    SidePanelService.open(ComponentPackageSidePanel, {
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
      const res = await api.post("/component_package", data);
      setAllPackage([...allPackage, res.data]);
    } else {
      let res = await api.patch(`/component_package/${initalVal._id}`, data);
      setAllPackage(
        allPackage.map((elem) => {
          if (elem._id == res.data._id) {
            return (elem = res.data);
          } else {
            return elem;
          }
        })
      );
    }
    setShowDrawer(false);
  };

  const getAllComponentPackage = async () => {
    setLoading(true);
    const res = await api.get("/component_package");
    setAllPackage(res.data);
    setLoading(false);
  };

  useEffect(() => {
    setColumns(taskStatus);
    handleNewProperty();
  }, [allComponents]);

  useEffect(() => {
    getAllPackages();
    getAllComponentPackage();
  }, []);

  useEffect(() => {
    handleNewProperty();
  }, [showDrawer]);

  useEffect(() => {
    setAllComponents(componentPkgs);
    setDupCompPkg(componentPkgs);
  }, [componentPkgs]);

  const deleteComponentPackage = async (id) => {
    const res = await api.delete(`/component_package/${id}`);
    setAllPackage(
      allPackage.filter((elem) => {
        return elem._id !== id;
      })
    );
    deleteModalClose();
  };

  const updateRowsOrder = async (updatedData) => {
    try {
      await api.patch(`/components/datasettings/updateRowsOrder/all`, {
        updatedData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDragStart = (event, id) => {
    event.dataTransfer.setData("text/plain", id);
    event.target.classList.add("dragging");
  };

  const handleDragOver = (event, packageId) => {
    event.preventDefault();
    if (packageId) {
      setHoveredPackageId(packageId);
    }
  };

  const handleDrop = (event, destinationId, destinationIndex, type) => {
    event.preventDefault();
    const sourceIndex = parseInt(event.dataTransfer.getData("text/plain"));
    if (type === "dropToMaintananceItself") {
      const column = columns["requested"];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(sourceIndex, 1);
      copiedItems.splice(destinationIndex, 0, removed);
      let updatedRows = {
        ...columns,
        requested: {
          ...column,
          items: copiedItems,
        },
      };
      updatedRows.requested.items = updatedRows?.requested?.items?.map(
        (el, index) => {
          el.order = index;
          return el;
        }
      );
      updateRowsOrder(updatedRows?.requested?.items);
      setColumns(updatedRows);
    } else {
      let droppedItem = columns?.requested?.items[sourceIndex];
      let pkgFound = allPackage?.find((pkg) => pkg?._id == destinationId);

      if (!pkgFound?.tenantId) {
        toast.info(t("common.pages.common_package_warning"));
        return;
      }

      let isAlreadyPresent = pkgFound?.Components?.find(
        (item) => item?._id == droppedItem?._id
      );
      if (!isAlreadyPresent) {
        let updatedPkgs = allPackage?.map((el) => {
          if (el?._id === destinationId) {
            return {
              ...el,
              Components:
                el.Components?.length > 0
                  ? [...el.Components, droppedItem]
                  : [droppedItem],
            };
          } else {
            return el;
          }
        });
        moveRows(droppedItem?._id, pkgFound?._id, "add");
        setAllPackage(updatedPkgs);
      } else {
        toast.info("Component already present");
      }
    }
    setHoveredPackageId(null);
  };

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      let updatedRows = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      };

      setColumns(updatedRows);
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      let updatedRows = {
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      };

      updatedRows.requested.items = updatedRows?.requested?.items?.map(
        (el, index) => {
          el.order = index;
          return el;
        }
      );
      updateRowsOrder(updatedRows?.requested?.items);
      setColumns(updatedRows);
    }
  };

  const moveRows = async (componentId, packageId, type) => {
    try {
      let updatedPackage = await api.patch(
        `/component_package/moveRow/ToComponentPkg`,
        {
          componentId,
          packageId,
          type,
        }
      );
      let u = allPackage?.map((el) => {
        if (el?._id === updatedPackage?.data?._id) {
          el = updatedPackage?.data;
          return el;
        } else {
          return el;
        }
      });
      setAllPackage(u);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    let uValue = e.target.value.toUpperCase();
    setSearchValue(uValue);
    let val = e.target.value.toLowerCase();
    if (val === "") {
      let taskStatus = {
        requested: {
          name: "Requested",
          items: dupCompPkg,
        },
        toDo: {
          name: "To do",
          items: [],
        },
      };
      setColumns(taskStatus);
    } else {
      let dupPackage = allComponents?.filter(
        (el) =>
          el?.u_component_name?.toLowerCase()?.includes(val) ||
          el?.u_component_abbreviation?.toLowerCase()?.includes(val)
      );

      let taskStatus = {
        requested: {
          name: "Requested",
          items: dupPackage,
        },
        toDo: {
          name: "To do",
          items: [],
        },
      };
      setColumns(taskStatus);
    }
  };

  const deleteModalClose = () => {
    setShow(false);
  };

  const handleShow = (item) => {
    setInitalVal(item);
    setShow(true);
  };

  const handleDragEnd = (event) => {
    event.target.classList.remove("dragging");
    setHoveredPackageId(null);
  };
  console.log({ allPackage });

  const handlePackageSelect = (packageId) => {
    setSelectedPackages((prevSelected) => {
      if (prevSelected.includes(packageId)) {
        return prevSelected.filter((id) => id !== packageId);
      } else {
        return [...prevSelected, packageId];
      }
    });
  };
  const calculateNextDate = (startDate, intervalValue, intervalUnit) => {
    if (!intervalValue || !intervalUnit) return startDate;

    let nextDate = new Date(startDate);

    switch (intervalUnit) {
      case "D": // Days
        nextDate.setDate(nextDate.getDate() + parseInt(intervalValue));
        break;
      case "V": // Weeks
        nextDate.setDate(nextDate.getDate() + parseInt(intervalValue) * 7);
        break;
      case "M": // Months
        nextDate.setMonth(nextDate.getMonth() + parseInt(intervalValue));
        break;
      case "Å": // Years
        nextDate.setFullYear(nextDate.getFullYear() + parseInt(intervalValue));
        break;
      case "A": // Years
        nextDate.setFullYear(nextDate.getFullYear() + parseInt(intervalValue));
        break;
      default:
        return startDate;
    }

    return nextDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
  };
  const handleNextStep = () => {
    const componentsToSave = [];
    const today = new Date().toISOString().split("T")[0];
    selectedPackages.forEach((packageId) => {
      const packageData = allPackage.find((pkg) => pkg._id === packageId);
      if (packageData && packageData.Components) {
        packageData.Components.forEach((el) => {
          componentsToSave.push({
            ...el,
            key: generateRandomString(7),
            component_code: generateUniqueCode(),
            _id: undefined,
            long_name: el?.u_component_name,
            name: el?.u_component_abbreviation,
            attendance_plan_date: today,
            attendance_lastest_date: today,
            attendance_interval_unit: el?.attendance_interval_unit || "D",
            attendance_next_date:
              el.attendance_interval_value && el.attendance_interval_unit
                ? calculateNextDate(
                    today,
                    el.attendance_interval_value,
                    el.attendance_interval_unit
                  )
                : "",
            maintenance_interval_unit: el?.maintenance_interval_unit || "D",
            maintenance_plan_date: today,
            maintenance_lastest_date: today,
            maintenance_next_date:
              el.maintenance_interval_value && el.maintenance_interval_unit
                ? calculateNextDate(
                    today,
                    el.maintenance_interval_value,
                    el.maintenance_interval_unit
                  )
                : "",
            responsible_user: activeBuilding?.responsible_user,
          });
        });
      }
    });
    setPlansCode([]);
    setComponents(componentsToSave);
    nextStep();
    console.log("Selected Components:", componentsToSave);
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
    <div style={{ paddingRight: "2rem", width: "100%" }}>
      {loading ? (
        <div style={{ marginBottom: "1rem" }}>
          <Loader />
        </div>
      ) : (
        <>
          {/* Search bar  */}
          <div className="supervision-package-title d-flex flex-column align-items-center justify-content-center gap-4">
            <h2>{t("Create Supervision Package")}</h2>
            <p>
              {t(
                "Select components from the list on the left and drag the items to your package on the right."
              )}
            </p>
          </div>
          <div className="d-flex align-items-center mb-3 justify-content-between w-100">
            <Form.Control
              type="text"
              placeholder={t("common.pages.search")}
              onChange={(e) => handleSearch(e)}
              value={searchValue}
              style={{ width: "17rem" }}
            />
            <div className="component_package_add_btn">
              <Button
                className="add_package_btn component_package_add"
                onClick={() => setShowDrawer(true)}
              >
                <span className="add_package_plus">+</span>
                {t("planning_page.add_package")}
              </Button>
            </div>
          </div>
          <div className="maintenance_package_main">
            <DragDropContext
              onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
            >
              <div className="package_table">
                <Table>
                  <thead>
                    <tr style={{ color: "black" }}>
                      <th className="accordian_table_cell">
                        {t("Comp. code")}
                      </th>
                      <th className="accordian_table_cell">
                        {t("data_settings.component_name")}
                      </th>
                      <th className="accordian_table_cell">
                        {t("Attendance")}
                      </th>
                      <th className="accordian_table_cell">
                        {t("Maintenance")}
                      </th>
                      <th className="accordian_table_cell">System</th>
                    </tr>
                  </thead>

                  {Object.entries(columns).map(([columnId, column], index) => {
                    return (
                      <tbody>
                        {column?.items?.map((item, index) => {
                          return (
                            <tr
                              key={item._id}
                              draggable
                              onDragStart={(event) =>
                                handleDragStart(event, index)
                              }
                              onDragOver={handleDragOver}
                              onDragEnd={handleDragEnd}
                              onDrop={(event) =>
                                handleDrop(
                                  event,
                                  item._id,
                                  index,
                                  "dropToMaintananceItself"
                                )
                              }
                            >
                              <td className="accordian_table_cell">
                                {item.u_component_abbreviation}
                              </td>
                              <td className="accordian_table_cell">
                                {item.u_component_name}
                              </td>

                              <td className="accordian_table_cell">
                                <span className="me-3">
                                  {item.attendance_interval_value}
                                </span>
                                <span className="me-3">
                                  {item.attendance_interval_unit}
                                </span>
                                <span>
                                  {item?.attendance_text ? (
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip>
                                          {t(
                                            "data_settings.click_to_view_text"
                                          )}
                                        </Tooltip>
                                      }
                                    >
                                      <BsFileEarmarkText
                                        className="text_attendenance_icon"
                                        onClick={() =>
                                          handleShowTextModal(
                                            item?.attendance_text,
                                            "attendance"
                                          )
                                        }
                                        style={{ cursor: "pointer" }}
                                      />
                                    </OverlayTrigger>
                                  ) : null}
                                </span>
                              </td>
                              <td className="accordian_table_cell">
                                <span className="me-3">
                                  {item.maintenance_interval_value}
                                </span>
                                <span className="me-3">
                                  {item.maintenance_interval_unit}
                                </span>
                                <span>
                                  {item?.maintenance_text ? (
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip>
                                          {t(
                                            "data_settings.click_to_view_text"
                                          )}
                                        </Tooltip>
                                      }
                                    >
                                      <BsFileEarmarkText
                                        className="text_attendenance_icon"
                                        onClick={() =>
                                          handleShowTextModal(
                                            item?.maintenance_text,
                                            "maintenance"
                                          )
                                        }
                                        style={{ cursor: "pointer" }}
                                      />
                                    </OverlayTrigger>
                                  ) : null}
                                </span>
                              </td>
                              <td
                                className="accordian_table_cell maintenance_package_u_system"
                                id={item?.u_system?.split(".")[0]}
                              >
                                {item.u_system}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    );
                  })}
                </Table>
              </div>

              {/*  Package Name Component */}
              <div className="accordian_table_main">
                {showDrawer && <SidePanelRoot />}
                <br />
                <div className="accordian_main">
                  {/* <br /> <br /> <br /> */}
                  <p className="maintenance_package_heading">
                    {t("planning_page.packages")}
                  </p>
                  {allPackage.map((elem, index) => {
                    return (
                      <Accordion
                        style={{ marginBottom: "1rem" }}
                        key={elem?._id}
                        onDragOver={(event) => handleDragOver(event, elem?._id)}
                        onDrop={(event) =>
                          handleDrop(event, elem?._id, index, "dropToPkgTable")
                        }
                        className={
                          hoveredPackageId === elem?._id
                            ? "package-hovered"
                            : ""
                        }
                      >
                        <Accordion.Item eventKey="0">
                          <Accordion.Header className="custom-accordion-header">
                            <div className="package_accordian">
                              <div className="accordian_header_main">
                                <div onClick={(e) => e.stopPropagation()}>
                                  <input
                                    id={`package-select-${elem._id}`}
                                    type="checkbox"
                                    checked={selectedPackages.includes(
                                      elem._id
                                    )}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handlePackageSelect(elem._id);
                                    }}
                                  />
                                </div>
                                <div className="package_name_main_field">
                                  {elem?.component_package}
                                </div>
                                <span className="maintenance_item_count">
                                  {t("planning_page.Items")} :
                                  {elem?.Components?.length}
                                </span>
                                <div className="edit_delete_icons_main">
                                  {elem?.tenantId && (
                                    <CiEdit
                                      className="edit_icon"
                                      onClick={() => {
                                        handleNewProperty(elem);
                                        setShowDrawer(true);
                                      }}
                                    />
                                  )}
                                  <MdContentCopy
                                    className="data_setting_edit_icon"
                                    onClick={() => {
                                      let element = elem;
                                      delete element._id;
                                      handleNewProperty(element);
                                      setShowDrawer(true);
                                    }}
                                  />
                                  {elem?.tenantId && (
                                    <RiDeleteBin6Line
                                      className="delete_icon"
                                      onClick={() => handleShow(elem?._id)}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body className="accordion_body">
                            <Table>
                              <thead>
                                {elem?.Components?.map((el) => {
                                  return (
                                    <tr className="maintenancePackage_table">
                                      <td className="accordian_table_cell">
                                        {el?.u_component_abbreviation}
                                      </td>
                                      <td className="accordian_table_cell">
                                        <OverlayTrigger
                                          overlay={
                                            <Tooltip>
                                              {el?.u_component_name}{" "}
                                            </Tooltip>
                                          }
                                        >
                                          <span>
                                            {el?.u_component_name?.length > 27
                                              ? `${el.u_component_name.substring(
                                                  0,
                                                  20
                                                )}...`
                                              : el?.u_component_name}
                                          </span>
                                        </OverlayTrigger>
                                      </td>
                                      <td className="accordian_table_cell">
                                        <span className="me-3">
                                          {el.attendance_interval_value}
                                        </span>
                                        <span className="me-3">
                                          {el.attendance_interval_unit}
                                        </span>
                                        <span>
                                          {el?.attendance_text ? (
                                            <OverlayTrigger
                                              overlay={
                                                <Tooltip>
                                                  {t(
                                                    "data_settings.click_to_view_text"
                                                  )}
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
                                        </span>
                                      </td>
                                      <td className="accordian_table_cell">
                                        <span className="me-3">
                                          {el.maintenance_interval_value}
                                        </span>
                                        <span className="me-3">
                                          {el.maintenance_interval_unit}
                                        </span>
                                        <span>
                                          {el?.maintenance_text ? (
                                            <OverlayTrigger
                                              overlay={
                                                <Tooltip>
                                                  {t(
                                                    "data_settings.click_to_view_text"
                                                  )}
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
                                        </span>
                                      </td>
                                      <td
                                        className="accordian_table_cell"
                                        id={el?.u_system?.split(".")[0]}
                                      >
                                        {el?.u_system}
                                      </td>
                                      <span style={{ display: "flex" }}>
                                        <RiDeleteBin6Line
                                          className="delete_icon"
                                          onClick={() =>
                                            moveRows(
                                              el?._id,
                                              elem?._id,
                                              "remove"
                                            )
                                          }
                                        />
                                      </span>
                                    </tr>
                                  );
                                })}
                              </thead>
                            </Table>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    );
                  })}
                </div>
              </div>
            </DragDropContext>
          </div>
          <div
            className="step1_submit_btn_main step2_continue_btn"
            style={{ marginTop: "2rem", marginBottom: "1rem" }}
          >
            <BootstrapButton
              className="step1_started_btn"
              onClick={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
              disabled={selectedPackages?.length === 0}
            >
              {t("common.pages.Continue")}
            </BootstrapButton>
          </div>

          {/* // Delete Modal  */}
          {show && (
            <DeleteModal
              deleteModalClose={deleteModalClose}
              show={show}
              modalBody={t(
                "data_settings.Are you sure you want to delete this  Component Package?"
              )}
              modalHeader={t("data_settings.Delete Component Package")}
              deleteFunction={deleteComponentPackage}
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
    </div>
  );
};

export default OnBoardingComponentPackages;
