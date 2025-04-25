import {
  Accordion,
  Card,
  Form,
  OverlayTrigger,
  Table,
  Tooltip,
  Button as ThemeButton,
} from "@themesberg/react-bootstrap";
import React, { useEffect } from "react";
import { useState } from "react";
import drag_icon from "../../../assets/img/pages/drag_icon.png";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import { AiOutlinePlus } from "react-icons/ai";
import "./maintenancePackage.css";
import api from "api";
import MaintenancePackageSidePanel from "./maintenancePackageSidePanel";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { InputGroup } from "@themesberg/react-bootstrap";
import Loader from "components/common/Loader";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Button from "components/common/Button";
import DeleteModal from "components/PlanningPage/MaintainancePage/components/Report/ActivitesYear/DeleteModal";
import { MdContentCopy } from "react-icons/md";

const MaintenancePackage = ({ maintenanceItemPkgs }) => {
  const [maintenanceItem, setMaintenanceItem] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [show, setShow] = useState(false);

  let taskStatus = {
    requested: {
      name: "Requested",
      items: maintenanceItem,
    },
    toDo: {
      name: "To do",
      items: [],
    },
  };

  const [showDrawer, setShowDrawer] = useState(false);
  const [columns, setColumns] = useState(taskStatus);

  // package name edit state
  const [initalVal, setInitalVal] = useState(null);

  // package name state
  const [allPackage, setAllPackage] = useState([]);

  const [dupAllPackage, setDupAllPackage] = useState([]);

  const [backMaintenanceItem, setBackMaintenanceItem] = useState(false);

  const [loading, setLoading] = useState(false);
  const [hoveredPackageId, setHoveredPackageId] = useState(null);

  // package accordian state
  const [packageAccordian, setPackageAccordian] = useState([]);
  const { t } = useTranslation();

  const handleNewProperty = (item) => {
    setInitalVal(item);
    SidePanelService.open(MaintenancePackageSidePanel, {
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

    const packageName = allPackage.some(
      (item) => item.maintenance_package === data?.maintenance_package
    );

    if (packageName && initalVal == null) {
      toast(t("data_settings.package_already_exist"), { type: "error" });
    } else {
      if (initalVal == null || !initalVal?._id) {
        const packageName = allPackage.some(
          (item) => item.maintenance_package === data?.maintenance_package
        );

        if (packageName) {
          toast(t("data_settings.package_already_exist"), { type: "error" });
        } else {
          const res = await api.post("/maintaince_packages", data);
          setAllPackage([...allPackage, res.data]);
        }
      } else {
        let res = await api.patch(
          `/maintaince_packages/${initalVal._id}`,
          data
        );

        let updatePackage = allPackage.map((elem) => {
          if (elem._id == res.data._id) {
            return (elem = res.data);
          } else {
            return elem;
          }
        });

        setAllPackage(updatePackage);
      }
      setShowDrawer(false);
    }
  };

  const getAllMaintenancePackage = async () => {
    setLoading(true);
    const res = await api.get("/maintaince_packages");
    setAllPackage(res.data);
    setLoading(false);
  };

  useEffect(() => {
    setColumns(taskStatus);
    handleNewProperty();
  }, [maintenanceItem]);

  useEffect(() => {
    getAllMaintenancePackage();
  }, []);

  useEffect(() => {
    setMaintenanceItem(maintenanceItemPkgs);
    setDupAllPackage(maintenanceItemPkgs);
  }, [maintenanceItemPkgs]);

  useEffect(() => {
    handleNewProperty();
  }, [showDrawer]);

  const deleteMaintenancePackage = async (id) => {
    const res = await api.delete(`/maintaince_packages/${id}`);
    let deletePackage = allPackage.filter((elem) => {
      return elem._id !== id;
    });

    setAllPackage(deletePackage);
    deleteModalClose();
  };

  const updateRowsOrder = async (updatedData) => {
    try {
      await api.patch(`/maintaince_items/updateRowsOrder/all`, { updatedData });
    } catch (error) {
      console.log(error);
    }
  };

  const moveRows = async (maintenanceId, packageId, type) => {
    try {
      let updatedPackage = await api.patch(
        `/maintaince_packages/moveRow/ToMaintenancePkg`,
        {
          maintenanceId,
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

  const handleDragStart = (event, id) => {
    event.dataTransfer.setData("text/plain", id);
    event.target.classList.add("dragging");
  };

  const handleDragOver = (event, type, packageId) => {
    event.preventDefault();
    if (type === "backToMaintePkg") {
      setBackMaintenanceItem(true);
    }
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
      if (backMaintenanceItem) {
        setBackMaintenanceItem(false);
      } else {
        updateRowsOrder(updatedRows?.requested?.items);
      }

      setColumns(updatedRows);
    } else {
      let droppedItem = columns?.requested?.items[sourceIndex];
      let pkgFound = allPackage?.find((pkg) => pkg?._id == destinationId);
      let isAlreadyPresent = pkgFound?.MaintenanceItems?.find(
        (item) => item?._id == droppedItem?._id
      );
      if (!isAlreadyPresent) {
        let updatedPkgs = allPackage?.map((el) => {
          if (el?._id === destinationId) {
            return {
              ...el,
              MaintenanceItems:
                el.MaintenanceItems?.length > 0
                  ? [...el.MaintenanceItems, droppedItem]
                  : [droppedItem],
            };
          } else {
            return el;
          }
        });
        moveRows(droppedItem?._id, pkgFound?._id, "add");
        setAllPackage(updatedPkgs);
      }
    }
    setHoveredPackageId(null); // Remove the hover when drag leaves
  };

  const handleSearch = (e) => {
    let uValue = e.target.value.toUpperCase();
    setSearchValue(uValue);
    let val = e.target.value.toLowerCase();
    if (val === "") {
      let taskStatus = {
        requested: {
          name: "Requested",
          items: dupAllPackage,
        },
        toDo: {
          name: "To do",
          items: [],
        },
      };
      setColumns(taskStatus);
    } else {
      let dupPackage = maintenanceItem?.filter((el) => {
        if (
          el?.article?.toLowerCase()?.includes(val) ||
          el?.maintenance_activity?.toLowerCase()?.includes(val)
        ) {
          return el;
        }
      });

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
    setHoveredPackageId(null); // Remove the hover when drag leaves
  };

  return (
    <div style={{ paddingRight: "2rem" }}>
      {loading ? (
        <div style={{ marginBottom: "1rem" }}>
          <Loader />
        </div>
      ) : (
        <>
          {/* Search bar  */}
          <div className="d-flex align-items-center mb-3 justify-content-between w-100">
            <Form.Control
              type="text"
              placeholder={t("common.pages.search")}
              onChange={(e) => handleSearch(e)}
              value={searchValue}
              style={{ width: "17rem" }}
            />
            <div draggable="true" className="add_package_btn_main">
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
            <div className="package_table maintenance_pkg_main">
              <Table>
                <thead>
                  <tr style={{ color: "black" }}>
                    <th className="accordian_table_cell">
                      {t("planning_page.article")}
                    </th>
                    <th className="accordian_table_cell maintenance_pkg_activity">
                      {t("planning_page.maintainence_activity")}
                    </th>
                    <th className="accordian_table_cell maintenance_pkg_technical_life">
                      {" "}
                      {t("planning_page.technical_life")}
                    </th>
                    <th className="accordian_table_cell maintenance_pkg_technical_life">
                      System
                    </th>
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
                            className="components_main"
                            style={{ cursor: "grab" }}
                          >
                            <td className="accordian_table_cell">
                              {item.article}
                            </td>
                            <td className="accordian_table_cell maintenance_pkg_activity">
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>
                                    {item?.maintenance_activity}
                                  </Tooltip>
                                }
                              >
                                <span
                                  style={{
                                    cursor: "pointer",
                                  }}
                                >
                                  {item?.maintenance_activity?.length > 32
                                    ? `${item?.maintenance_activity?.substring(
                                        0,
                                        32
                                      )}...`
                                    : item?.maintenance_activity}
                                </span>
                              </OverlayTrigger>
                            </td>
                            <td className="accordian_table_cell maintenance_pkg_technical_life">
                              {item.technical_life}
                            </td>
                            <td
                              className="accordian_table_cell maintenance_pkg_technical_life"
                              id={item?.u_system?.split(".")[0]}
                            >
                              <span>{item.u_system}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  );
                })}
              </Table>
            </div>
            {/* ...................................... */}
            {/*  Package Name Component */}
            <div className="accordian_table_main">
              {showDrawer && <SidePanelRoot />}
              {/* <br /> */}
              <div className="accordian_main">
                <p className="maintenance_package_heading">
                  {t("data_settings.Packages")}
                </p>
                {allPackage?.map((elem, index) => {
                  return (
                    <Accordion
                      style={{ marginBottom: "1rem" }}
                      key={elem?._id}
                      onDragOver={(event) =>
                        handleDragOver(event, "backToMaintePkg", elem?._id)
                      }
                      onDrop={(event) =>
                        handleDrop(event, elem?._id, index, "dropToPkgTable")
                      }
                      className={
                        hoveredPackageId === elem?._id ? "package-hovered" : ""
                      }
                    >
                      <Accordion.Item eventKey="0">
                        <Accordion.Header className="custom-accordion-header">
                          <div className="package_accordian">
                            <div className="accordian_header_main">
                              <div className="package_name_main_field">
                                {elem.maintenance_package}
                              </div>
                              <span className="maintenance_item_count">
                                {t("data_settings.Items")}:
                                {elem?.MaintenanceItems?.length}
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
                                  className="delete_icon"
                                  onClick={() => {
                                    let element = elem;
                                    delete element?._id;
                                    handleNewProperty(element);
                                    setShowDrawer(true);
                                  }}
                                />
                                {elem?.tenantId && (
                                  <RiDeleteBin6Line
                                    className="delete_icon"
                                    // onClick={() =>
                                    //   deleteMaintenancePackage(elem._id)
                                    // }
                                    onClick={() => handleShow(elem._id)}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body className="accordion_body">
                          <Table>
                            <thead>
                              {elem?.MaintenanceItems?.map((el) => {
                                return (
                                  <tr className="maintenancePackage_table">
                                    <td className="accordian_table_cell">
                                      {el?.article}
                                    </td>
                                    <td className="accordian_table_cell">
                                      {el?.maintenance_activity}
                                    </td>
                                    <td className="accordian_table_cell">
                                      {el?.technical_life}
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
                                          moveRows(el?._id, elem?._id, "remove")
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
          </div>
          {/* // Delete Modal  */}
          {show && (
            <DeleteModal
              deleteModalClose={deleteModalClose}
              show={show}
              modalBody={t(
                "data_settings.Are you sure you want to delete this  Maintenance Package?"
              )}
              modalHeader={t("data_settings.Delete Maintenance Package")}
              deleteFunction={deleteMaintenancePackage}
              deleteItemId={initalVal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MaintenancePackage;
