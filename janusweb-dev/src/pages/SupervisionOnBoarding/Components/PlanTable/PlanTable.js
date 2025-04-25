import React, { useEffect, useRef, useState } from "react";
import Loader from "components/common/Loader";
import api from "api";
import {
  Button,
  Dropdown,
  Form,
  OverlayTrigger,
  Spinner,
  Tooltip,
  Modal,
} from "@themesberg/react-bootstrap";
import "../../../../pages/Supervision/Planning/Planning.css";
import { Link, useHistory } from "react-router-dom";
import { AiFillCaretDown } from "react-icons/ai";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { useOnboarding } from "context/OnboardingContext";
import { generateRandomString } from "utils/helper";
import { generateUniqueCode } from "lib/utils/generateUniqueCode";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import InputBox from "components/common/InputBox";

const PlanTable = () => {
  const [users, setUsers] = useState([]);
  const [clickComponent, setClickComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const {
    plansCode,
    activeProperty,
    activeBuilding,
    properties,
    nextStep,
    selectedPropertyTab,
    components,
    setComponents,
  } = useOnboarding();
  const { setPropertyAdded } = usePropertyContextCheck();

  const [showIntervalModal, setShowIntervalModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'attendance' or 'maintenance'
  const [currentComponent, setCurrentComponent] = useState(null);

  console.log({ activeProperty, activeBuilding, properties, components });

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
    // console.log({
    //   startDate,
    //   intervalValue,
    //   intervalUnit,
    //   nextDate: nextDate.toISOString().split("T")[0],
    // });
    return nextDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
  };

  const getComponentsData = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/u_components/codes`, {
        abbreviations: plansCode,
      });
      //   const res = await api.get(`/components`);
      const today = new Date().toISOString().split("T")[0]; // Today's date

      const updatedComponents = res.data.map((el) => {
        return {
          ...el,
          key: generateRandomString(7),
          component_code: generateUniqueCode(),
          _id: undefined,
          long_name: el?.u_component_name,
          name: el?.u_component_abbreviation,
          // attendance_plan_date: today,
          attendance_lastest_date: today,
          attendance_interval_unit: el?.attendance_interval_unit,
          attendance_next_date:
            el.attendance_interval_value && el.attendance_interval_unit
              ? calculateNextDate(
                  today,
                  el.attendance_interval_value,
                  el.attendance_interval_unit
                )
              : "",
          maintenance_interval_unit: el?.maintenance_interval_unit,
          // maintenance_plan_date: today,
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
        };
      });

      setComponents(updatedComponents.filter((el) => el.component_code !== ""));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getUsersData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const { data } = await api.get(
        `/users/adminId/${user?.tenantId || user?._id}`
      );
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (plansCode?.length > 0) {
      getComponentsData();
    }
    getUsersData();
  }, []);

  const changeUser = (selectedEmail, row) => {
    setComponents((prevData) =>
      prevData.map((item) =>
        item.key === row.key
          ? { ...item, responsible_user: selectedEmail }
          : item
      )
    );
  };

  const [activeUser, setActiveUser] = useState(null);
  const popoverRef = useRef();
  const [popupPosition, setPopupPosition] = useState({
    top: "50px",
  });

  const handleShowPopup = (row, event) => {
    const rowRect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: rowRect.top + 40,
    });
  };
  const handleSubmit = async (e, ignoreValidation) => {
    // Validation
    setIsSubmitting(true);
    for (const component of components) {
      if (!component.building_code && selectedPropertyTab === 2) {
        toast.error(t("common.pages.building_code_missing"));
        setIsSubmitting(false);
        return;
      }

      // Attendance validation
      if (
        component.attendance_next_date &&
        (!component.attendance_interval_unit ||
          !component.attendance_interval_value)
      ) {
        if (!ignoreValidation) {
          setModalType("attendance");
          setCurrentComponent(component);
          setShowIntervalModal(true);
          setIsSubmitting(false);
          return;
        } else {
          component.attendance_next_date = "";
        }
      }

      // Maintenance validation
      if (
        component.maintenance_next_date &&
        (!component.maintenance_interval_unit ||
          !component.maintenance_interval_value)
      ) {
        if (!ignoreValidation) {
          setModalType("maintenance");
          setCurrentComponent(component);
          setShowIntervalModal(true);
          setIsSubmitting(false);
          return;
        } else {
          component.maintenance_next_date = "";
        }
      }

      // Set attendance_plan_date if all attendance fields are present
      if (
        component.attendance_next_date &&
        component.attendance_interval_unit &&
        component.attendance_interval_value
      ) {
        component.attendance_plan_date = component.attendance_lastest_date;
      }

      // Set maintenance_plan_date if all maintenance fields are present
      if (
        component.maintenance_next_date &&
        component.maintenance_interval_unit &&
        component.maintenance_interval_value
      ) {
        component.maintenance_plan_date = component.maintenance_lastest_date;
      }
    }

    let updatedProperties;
    if (selectedPropertyTab === 2) {
      updatedProperties = properties.map((property) => {
        const updatedBuildings = property.buildingsArray.map((building) => {
          const buildingComponents = components.filter(
            (component) => component.building_code == building.building_code
          );

          if (buildingComponents.length > 0) {
            return {
              ...building,
              components: buildingComponents,
            };
          }
          return building;
        });

        return {
          ...property,
          buildingsArray: updatedBuildings,
        };
      });
    } else {
      // Find the active property
      updatedProperties = properties.map((property) => {
        if (property.property_code == activeProperty.property_code) {
          return {
            ...property,
            buildingsArray: property.buildingsArray.map((building) => {
              if (building.building_code == activeBuilding.building_code) {
                return {
                  ...building,
                  components: components, // ✅ Updating components array
                };
              }
              return building;
            }),
          };
        }
        return property;
      });
    }

    // console.log("Updated Properties:", updatedProperties);

    // Optionally set state to update UI
    // setComponents([]);
    // setProperties(updatedProperties);

    // Call API to update database (if needed)
    try {
      const response = await api.post(`/onboarding/supervision`, {
        properties: updatedProperties,
      });

      if (response?.data) {
        console.log("✅ Data successfully updated on the server!");
        setIsSubmitting(false);
        setPropertyAdded({});
        nextStep();
      } else {
        setIsSubmitting(false);
        console.error("❌ Error updating data:", response);
        if (response?.response?.data?.isMax) {
          toast.error(
            t(`limit_exceed_modal.${response?.response?.data?.message}`)
          );
        } else {
          toast.error(t(`${response?.response?.data?.message}`));
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("❌ Error updating data:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setActiveUser(null);
    };

    window.addEventListener("scroll", handleScroll);

    const table = document.querySelector(".pagination_planing_table");
    if (table) {
      table.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (table) {
        table.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  const onChangePlan = (key, newValue, field) => {
    setComponents((prevComponents) =>
      prevComponents.map((item) => {
        if (item.key !== key) return item; // Keep other rows unchanged

        let updatedItem = { ...item, [field]: newValue };

        // Recalculate `attendance_next_date` only if both value and unit exist
        if (
          field === "attendance_interval_value" ||
          field === "attendance_interval_unit"
        ) {
          console.log(
            "coming in att",
            updatedItem.attendance_interval_value,
            updatedItem.attendance_interval_unit
          );
          updatedItem.attendance_next_date =
            updatedItem.attendance_interval_value &&
            updatedItem.attendance_interval_unit
              ? calculateNextDate(
                  item.attendance_lastest_date,
                  updatedItem.attendance_interval_value,
                  updatedItem.attendance_interval_unit
                )
              : item.attendance_next_date; // Keep the old value if missing data
        }

        // Recalculate `maintenance_next_date` only if both value and unit exist
        if (
          field === "maintenance_interval_value" ||
          field === "maintenance_interval_unit"
        ) {
          updatedItem.maintenance_next_date =
            updatedItem.maintenance_interval_value &&
            updatedItem.maintenance_interval_unit
              ? calculateNextDate(
                  item.maintenance_lastest_date,
                  updatedItem.maintenance_interval_value,
                  updatedItem.maintenance_interval_unit
                )
              : item.maintenance_next_date; // Keep the old value if missing data
        }

        return updatedItem;
      })
    );
  };
  const handleDelete = (key) => {
    setComponents((prevComponents) =>
      prevComponents.filter((item) => item.key !== key)
    );
  };

  const CustomDateInput = ({ value, onChange, onClear, field }) => {
    // const formattedDate = value
    //   ? new Date(value).toISOString().split("T")[0]
    //   : "";
    // Create a ref to store the input element
    const dateInputRef = useRef(null);

    // Function to handle the click on the input field
    const handleClick = () => {
      // Safely call showPicker() on the input element
      if (dateInputRef.current && dateInputRef.current.showPicker) {
        dateInputRef.current.showPicker();
      }

      // Timeout to reopen the picker if it closes immediately
      setTimeout(() => {
        if (dateInputRef.current && dateInputRef.current.showPicker) {
          dateInputRef.current.showPicker();
        }
      }, 100);
    };
    return (
      <Form.Group style={{ marginBottom: 0, width: "100%" }}>
        <Form.Control
          ref={dateInputRef}
          type="date"
          name={field}
          className="hide-calendar-icon"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          // onClick={(e) => {
          //   if (e.currentTarget?.showPicker) {
          //     e.currentTarget.showPicker();
          //   }
          // }}
          onClick={handleClick}
          style={{
            fontSize: "12px",
            color: "#000000DE",
            borderRadius: "4px",
            padding: "6px 4px",
          }}
          // readOnly={false}
          required={false}
        />
      </Form.Group>
    );
  };

  const planningColumn = [
    {
      name: t("common.pages.user"),
      cell: (row, index, column, id) => {
        return (
          <>
            <p style={{ marginBottom: "0rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={(event) => {
                  if (!users?.length) {
                    toast.info(t("common.pages.no_users_warning"));
                    return;
                  }
                  if (row?.key === activeUser?.key) {
                    setActiveUser(null);
                  } else {
                    handleShowPopup(row, event);
                    setClickComponent(row?.key);
                    setActiveUser(row);
                  }
                }}
              >
                <OverlayTrigger
                  overlay={
                    row?.responsible_user ? (
                      <Tooltip>{row?.responsible_user}</Tooltip>
                    ) : (
                      <div></div>
                    )
                  }
                >
                  <Button className="user_email" variant="secondary">
                    <span className="email_wrapper">
                      {row?.responsible_user?.length > 18
                        ? `${row?.responsible_user.substring(0, 18)}`
                        : !row?.responsible_user
                        ? t("common.pages.select_user")
                        : row?.responsible_user}
                    </span>
                  </Button>
                </OverlayTrigger>
                <AiFillCaretDown className="downArrow" />
              </div>
            </p>
            <div
              className={`${row?.key === activeUser?.key ? "" : "hide"}`}
              style={{
                position: "fixed",
                zIndex: 99999,
                top: popupPosition.top,
                backgroundColor: "white",
                border: "1px solid #ccc",
                display: row?.key === activeUser?.key ? "flex" : "none",
                flexDirection: "column",
                padding: "0.5rem 0",
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                minWidth: "200px",
              }}
              ref={popoverRef}
            >
              {users?.map((elem, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  style={{
                    padding: "8px 16px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    changeUser(elem?.email?.toLowerCase(), row);
                    setActiveUser(null);
                  }}
                >
                  {elem?.email}
                </div>
              ))}
            </div>
          </>
        );
      },
      sortable: true,
      selector: (row) => row.responsible_user || "",
      // style: {
      //   minWidth: "193px",
      //   maxWidth: "222px",
      // },
      width: "220px",
      id: "planing_responsible_user",
    },
    {
      name: t("common.pages.building"),
      cell: (row, index, column, id) => {
        return (
          <>
            {selectedPropertyTab === 2 ? (
              <select
                value={row?.building_code}
                onChange={(e) => {
                  onChangePlan(row?.key, e.target.value, "building_code");
                }}
                style={{ width: "90px" }}
              >
                <option value="">Select</option>
                {properties.map((property) =>
                  property.buildingsArray.map((building) => (
                    <option key={building?.key} value={building?.building_code}>
                      {building.building_code}
                    </option>
                  ))
                )}
              </select>
            ) : (
              <OverlayTrigger
                overlay={<Tooltip>{activeBuilding?.building_code}</Tooltip>}
              >
                <p className="planning_building_code">
                  {activeBuilding?.building_code}
                </p>
              </OverlayTrigger>
            )}
          </>
        );
      },
      selector: (row) =>
        activeBuilding?.building_code || row?.building_code || "",
      sortable: true,
      id: "planing_building_code",
      width: "100px",
    },
    {
      name: "ID",
      cell: (row, index, column, id) => {
        return (
          <input
            className="quantity_field"
            type="text"
            value={row.component_code || ""}
            onChange={(e) =>
              onChangePlan(row?.key, e.target.value, "component_code")
            }
          />
        );
      },
      id: "planning_name",
      width: "107px",
      sortable: true,
      selector: (row) => row.component_code || "",
    },
    {
      name: t("common.pages.name"),
      cell: (row, index, column, id) => {
        return (
          <OverlayTrigger
            overlay={<Tooltip>{row?.u_component_abbreviation}</Tooltip>}
          >
            <p className="planning_building_code planning_name ">
              {row?.u_component_abbreviation}
            </p>
          </OverlayTrigger>
        );
      },
      selector: (row) => row?.u_component_abbreviation || "",
      width: "90px",
      sortable: true,
    },
    {
      name: "System",
      cell: (row, index, column, id) => {
        return (
          <p
            className="planning_building_code"
            id={row?.u_system?.split(".")[0]}
            style={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            {row?.u_system}
          </p>
        );
      },
      sortable: true,
      selector: (row) => row.u_system || "",
      width: "105px",
    },
    {
      name: t("common.pages.Position"),
      cell: (row, index, column, id) => {
        return (
          <OverlayTrigger overlay={<Tooltip>{row?.position_of_code}</Tooltip>}>
            {/* <p className="planning_building_code">{row?.position_of_code}</p> */}
            <input
              className="position_field"
              type="text"
              value={row.position_of_code || ""}
              onChange={(e) =>
                onChangePlan(
                  row?.key,
                  e.target.value.toUpperCase(),
                  "position_of_code"
                )
              }
            />
          </OverlayTrigger>
        );
      },
      selector: (row) => row?.position_of_code || "",
      width: "150px",
      sortable: true,
    },
    {
      name: (
        <>
          <span
            className="border-line"
            style={{ position: "absolute", left: "-10px" }}
          ></span>
          <div>IV</div>
        </>
      ),
      cell: (row, index, column, id) => {
        return (
          <input
            className="quantity_field attendance_field"
            type="number"
            value={row.attendance_interval_value || ""}
            onChange={(e) =>
              onChangePlan(
                row?.key,
                e.target.value,
                "attendance_interval_value"
              )
            }
          />
        );
      },
      selector: (row) => row.attendance_interval_value || "",
      sortable: false,
      width: "70px",
    },
    {
      name: "UI",
      cell: (row, index, column, id) => {
        return (
          <select
            className="quantity_field attendance_field hide-select-arrow table-select-field"
            value={row.attendance_interval_unit || ""}
            onChange={(e) =>
              onChangePlan(row?.key, e.target.value, "attendance_interval_unit")
            }
          >
            <option value="D">D</option>
            <option value="V">V</option>
            <option value="M">M</option>
            <option value="Å">Å</option>
          </select>
        );
      },
      sortable: false,
      selector: (row) => row.attendance_interval_unit || "",
      width: "70px",
    },
    // {
    //   name: (
    //     <>
    //       <div
    //         className="attend_header_plan"
    //         style={{
    //           position: "absolute",
    //           top: "10px",
    //           left: "-15px",
    //           borderBottom: "2px solid #404040",
    //           fontSize: "13px",
    //           pointerEvents: "none",
    //         }}
    //       >
    //         {t("common.sidebar.attendance")}
    //       </div>
    //       <div>{t("common.pages.previous")}</div>
    //     </>
    //   ),
    //   cell: (row, index, column, id) => {
    //     return (
    //       <CustomDateInput
    //         value={row?.attendance_lastest_date}
    //         onChange={(value) =>
    //           onChangePlan(row?.key, value, "attendance_lastest_date")
    //         }
    //         onClear={() =>
    //           onChangePlan(row?.key, "", "attendance_lastest_date")
    //         }
    //       />
    //     );
    //   },
    //   sortable: true,
    //   selector: (row) => row.attendance_lastest_date || "",
    //   width: "145px",
    // },
    {
      name: (
        <>
          <div
            className="attend_header_plan"
            style={{
              position: "absolute",
              top: "10px",
              left: "-45px",
              borderBottom: "2px solid #404040",
              fontSize: "13px",
              pointerEvents: "none",
            }}
          >
            {t("common.sidebar.attendance")}
          </div>
          <div>{t("common.pages.next")}</div>
          <span
            className="border-line"
            style={{ position: "absolute", right: "2px" }}
          ></span>
        </>
      ),
      cell: (row, index, column, id) => {
        return (
          <InputBox
            handleChange={(e) => {
              onChangePlan(row?.key, e.target.value, "attendance_next_date");
            }}
            mdCol={12}
            type={"date"}
            id={"attendance_next_date"}
            value={row?.attendance_next_date}
            inputClassName="hide-calendar-icon"
            onClick={(e) => {
              if (e.currentTarget?.showPicker) {
                e.currentTarget.showPicker();
              }
            }}
            mb={false}
            inputStyle={{
              fontSize: "12px",
              color: "#000000DE",
              borderRadius: "4px",
              padding: "6px 4px",
            }}
          />
        );
      },
      sortable: true,
      selector: (row) => row.attendance_next_date || "",
      width: "145px",
    },
    {
      name: "IV",
      cell: (row, index, column, id) => {
        return (
          <input
            className="quantity_field attendance_field"
            type="number"
            value={row.maintenance_interval_value || ""}
            onChange={(e) =>
              onChangePlan(
                row?.key,
                e.target.value,
                "maintenance_interval_value"
              )
            }
          />
        );
      },
      selector: (row) => row.maintenance_interval_value || "",
      sortable: false,
      width: "70px",
    },
    {
      name: "IU",
      cell: (row, index, column, id) => {
        return (
          <select
            className="quantity_field attendance_field hide-select-arrow table-select-field"
            value={row.maintenance_interval_unit || ""}
            onChange={(e) =>
              onChangePlan(
                row?.key,
                e.target.value,
                "maintenance_interval_unit"
              )
            }
          >
            <option value="D">D</option>
            <option value="V">V</option>
            <option value="M">M</option>
            <option value="Å">Å</option>
          </select>
        );
      },
      sortable: true,
      selector: (row) => row.maintenance_interval_unit || "",
      width: "70px",
    },
    // {
    //   name: (
    //     <>
    //       <div
    //         className="attend_header_plan"
    //         style={{
    //           position: "absolute",
    //           top: "10px",
    //           left: "-15px",
    //           borderBottom: "2px solid #404040",
    //           fontSize: "13px",
    //           pointerEvents: "none",
    //         }}
    //       >
    //         {t("Maintenance")}
    //       </div>
    //       <div>{t("common.pages.previous")}</div>
    //     </>
    //   ),
    //   cell: (row, index, column, id) => {
    //     return (
    //       <CustomDateInput
    //         value={row?.maintenance_lastest_date}
    //         onChange={(value) =>
    //           onChangePlan(row?.key, value, "maintenance_lastest_date")
    //         }
    //         onClear={() =>
    //           onChangePlan(row?.key, "", "maintenance_lastest_date")
    //         }
    //       />
    //     );
    //   },
    //   selector: (row) => row.maintenance_lastest_date || "",
    //   sortable: true,
    //   width: "145px",
    // },
    {
      name: (
        <>
          <div
            className="attend_header_plan"
            style={{
              position: "absolute",
              top: "10px",
              left: "-81px",
              borderBottom: "2px solid #404040",
              fontSize: "13px",
              pointerEvents: "none",
            }}
          >
            {t("Maintenance")}
          </div>
          <div>{t("common.pages.next")}</div>
        </>
      ),

      cell: (row, index, column, id) => {
        return (
          <>
            <InputBox
              handleChange={(e) => {
                onChangePlan(row?.key, e.target.value, "maintenance_next_date");
              }}
              mdCol={12}
              type={"date"}
              id={"maintenance_next_date"}
              value={row?.maintenance_next_date}
              inputClassName="hide-calendar-icon"
              onClick={(e) => {
                if (e.currentTarget?.showPicker) {
                  e.currentTarget.showPicker();
                }
              }}
              mb={false}
              inputStyle={{
                fontSize: "12px",
                color: "#000000DE",
                borderRadius: "4px",
                padding: "6px 4px",
              }}
            />
          </>
        );
      },
      sortable: true,
      selector: (row) => row.maintenance_next_date || "",
      width: "145px",
      style: { position: "relative" },
    },
    {
      width: "60px",

      cell: (row, index, column, id) => {
        return (
          <div
            style={{
              position: "sticky",
              right: 0,
            }}
          >
            <MdOutlineDeleteOutline
              size={26}
              cursor="pointer"
              color="#333F50"
              onClick={() => handleDelete(row.key)}
            />
          </div>
        );
      },
    },
  ];

  const IntervalWarningModal = () => (
    <Modal
      show={showIntervalModal}
      onHide={() => setShowIntervalModal(false)}
      className="modal-dialog-centered"
      centered
    >
      <div className="d-flex justify-content-end p-2">
        <span
          onClick={() => setShowIntervalModal(false)}
          style={{
            cursor: "pointer",
            fontSize: "20px",
            padding: "0 10px",
            color: "#000000DE",
          }}
        >
          ×
        </span>
      </div>
      <Modal.Body className="text-center px-4 pt-0 pb-4">
        <p>
          {modalType === "attendance"
            ? t("common.pages.attendance_interval_warning")
            : t("common.pages.maintenance_interval_warning")}
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center border-0 p-3">
        <Button
          variant="primary"
          onClick={() => {
            if (modalType === "attendance") {
              currentComponent.attendance_lastest_date = "";
              currentComponent.attendance_next_date = "";
            } else {
              currentComponent.maintenance_lastest_date = "";
              currentComponent.maintenance_next_date = "";
            }
            setShowIntervalModal(false);
            // Continue with form submission
            handleSubmit();
          }}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return loading ? (
    <Loader />
  ) : (
    <div
      style={{ width: "99%", marginRight: "1rem" }}
      className="planning_table"
    >
      <DataTable
        data={components}
        columns={planningColumn}
        noDataComponent={t("common.pages.There are no records to display")}
        highlightOnHover
        responsive
        pagination
        className="pagination_planing_table"
        paginationComponentOptions={{
          rowsPerPageText: t("planning_page.rows_per_page"),
        }}
      />
      <div className="w-100 d-flex align-items-center justify-content-center">
        <Button
          className="step1_started_btn"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner
              animation="border"
              size="sm"
              className="comp_pkg_spinner"
            />
          ) : (
            t("common.pages.Continue")
          )}
        </Button>
      </div>
      <IntervalWarningModal />
    </div>
  );
};

export default PlanTable;
