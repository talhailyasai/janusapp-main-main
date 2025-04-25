import React, { useEffect, useRef, useState } from "react";
import Loader from "components/common/Loader";
import api from "api";
import {
  Button,
  Dropdown,
  OverlayTrigger,
  Tooltip,
} from "@themesberg/react-bootstrap";
import "./Planning.css";
import { Link, useHistory } from "react-router-dom";
import Filter from "./PlanningFilter";
import { FilterSupervisionPlanning } from "lib/PlanningLib";
import { AiFillCaretDown } from "react-icons/ai";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

const Planning = () => {
  const history = useHistory();
  const [components, setComponents] = useState([]);
  const [users, setUsers] = useState([]);

  const [clickComponent, setClickComponent] = useState(null);

  const [loading, setLoading] = useState(false);
  // Filter State
  const [filterValues, setFilterValues] = useState({});
  const { t } = useTranslation();
  const { setCompObj, setBuildingObj, setProperty, setComponentChange } =
    usePropertyContextCheck();
  const getComponentsData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/components`);
      setComponents(data?.filter((el) => el?.component_code !== ""));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getUsersData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const { data } = await api.get(`/users/adminId/${user?._id}`);
      setUsers(data);
      console.log(users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComponentsData();
    getUsersData();
  }, []);

  const changeUser = async (value) => {
    try {
      const { data } = await api.patch(
        `/components/update-changeby/${clickComponent}`,
        {
          value,
        }
      );
      setClickComponent(null);
      setComponents(
        components?.map((elem) => {
          if (elem._id == data._id) {
            return (elem = data);
          } else {
            return elem;
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowProperty = async (value) => {
    try {
      console.log("row in planing value", value);
      setCompObj(value);
      setBuildingObj(value?.building_code);
      setProperty(value.property_code);
      setComponentChange(value?.component_code);

      localStorage.setItem("property", value?.property_code?.property_code);
      localStorage.setItem("propertyObj", JSON.stringify(value?.property_code));
      localStorage.setItem("buildingObj", JSON.stringify(value?.building_code));
      localStorage.setItem("building", value?.building_code?.building_code);
      localStorage.setItem("component", value?.component_code);
      localStorage.setItem("compObj", JSON.stringify(value));

      history.push("/property");
    } catch (error) {
      console.log(error);
    }
  };

  // Filter Code
  const handleFindClick = async () => {
    // perform find logic using filterValues

    let filterObj = {};
    for (const key in filterValues) {
      if (filterValues[key]?.length > 0) {
        filterObj[key] = filterValues[key];
      }
    }
    const res = await FilterSupervisionPlanning({
      body: JSON.stringify({
        filters: filterObj,
      }),
    });
    const newData = await res.json();
    setComponents(newData);
  };
  // Add these state variables at the top of your component
  const [activeUser, setActiveUser] = useState(null);
  const popoverRef = useRef();
  const [popupPosition, setPopupPosition] = useState({
    top: "50px",
  });

  // Add the handleShowPopup function
  const handleShowPopup = (row, event) => {
    const rowRect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: rowRect.top + 40,
    });

    // Update popover position
    // if (popoverRef.current) {
    //   popoverRef.current.style.top = `${popupTop}px`;
    //   popoverRef.current.style.left = `${popupLeft}px`;
    // }
  };

  // Add click outside handler
  useEffect(() => {
    const handleScroll = () => {
      setActiveUser(null); // Close dropdown on scroll
    };

    // Listen for scroll events on both window and table container
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

  const planningColumn = [
    {
      name: t("common.pages.user"),
      cell: (row, index, column, id) => {
        return (
          <>
            <p style={{ marginBottom: "0rem" }}>
              {/* {row?.responsible_user && ( */}
              {/* <Dropdown
              className="planning_dropdown"
              onClick={() => setClickComponent(row?._id)}
              // drop="up"
            > */}
              {/* <Dropdown.Toggle className="dropdown_menu"> */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={(event) => {
                  if (row?._id === activeUser?._id) {
                    setActiveUser(null);
                  } else {
                    handleShowPopup(row, event);
                    setClickComponent(row?._id);
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
                      {row?.responsible_user?.length > 10
                        ? `${row?.responsible_user.substring(0, 10)}`
                        : !row?.responsible_user
                        ? "Please Select User"
                        : row?.responsible_user}
                    </span>
                  </Button>
                </OverlayTrigger>
                <AiFillCaretDown className="downArrow" />
              </div>

              {/* </Dropdown.Toggle> */}

              {/* <Dropdown.Menu className="planning_dropdown_menu">
                {users?.map((elem) => (
                  <Dropdown.Item onClick={() => changeUser(elem?.email)}>
                    {elem?.email}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu> */}
              {/* </Dropdown> */}
            </p>
            <div
              className={`${row?._id === activeUser?._id ? "" : "hide"}`}
              style={{
                position: "fixed",
                zIndex: 99999,
                top: popupPosition.top,
                backgroundColor: "white",
                border: "1px solid #ccc",
                display: row?._id === activeUser?._id ? "flex" : "none",
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
                    console.log("plan elem in user", elem);
                    changeUser(elem?.email);
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
      // width: "222px",
      style: {
        minWidth: "193px",
        maxWidth: "222px",
      },
      id: "planing_responsible_user",
    },
    {
      name: t("common.pages.building"),
      cell: (row, index, column, id) => {
        return (
          <OverlayTrigger
            overlay={<Tooltip>{row?.building_code?.name}</Tooltip>}
          >
            <p className="planning_building_code">
              {row?.building_code?.building_code}
            </p>
          </OverlayTrigger>
        );
      },
      selector: (row) => row?.building_code?.building_code || "",
      sortable: true,
      id: "planing_building_code",
      width: "93px",
    },
    {
      name: "ID",
      cell: (row, index, column, id) => {
        return (
          <span
            // to={"/property"}
            style={{
              cursor: "pointer",
              color: "#0091b3",
              textDecoration: "underline",
              fontSize: "12px",
              fontWeight: 700,
            }}
            onClick={() => handleShowProperty(row)}
            className="planning_component_code"
          >
            {row.component_code}
          </span>
        );
      },
      id: "planing_component_code",
      style: {
        minWidth: "87px",
        maxWidth: "140px",
      },
      sortable: true,
      selector: (row) => row.component_code || "",
    },
    {
      name: t("common.pages.name"),
      cell: (row, index, column, id) => {
        const text = row?.long_name || row?.name || "";
        const truncatedText =
          text.length > 20 ? `${text.substring(0, 20)}` : text;
        return (
          <OverlayTrigger overlay={<Tooltip>{text}</Tooltip>}>
            <p className="planning_building_code planning_name ">
              {truncatedText}
            </p>
          </OverlayTrigger>
        );
      },
      selector: (row) => row?.long_name || row?.name || "",
      width: "200px",
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
      name: t("property_page.location"),
      cell: (row, index, column, id) => {
        const text = row?.position_of_code;
        const truncatedText =
          text?.length > 20 ? `${text.substring(0, 15)}` : text;
        return (
          <OverlayTrigger overlay={<Tooltip>{text}</Tooltip>}>
            <p className="planning_building_code">{truncatedText}</p>
          </OverlayTrigger>
        );
      },
      selector: (row) => row?.position_of_code || "",
      width: "160px",
      sortable: true,
    },
    // {
    //   name: t("property_page.Act._T"),
    //   cell: (row, index, column, id) => {
    //     return (
    //       <p className="planning_building_code">
    //         {row.attendance_interval_unit &&
    //           row.attendance_interval_value &&
    //           row.attendance_lastest_date &&
    //           row.attendance_next_date &&
    //           "Tillsyn"}
    //       </p>
    //     );
    //   },
    //   sortable: true,
    //   selector: (row) =>
    //     row.attendance_interval_unit &&
    //     row.attendance_interval_value &&
    //     row.attendance_lastest_date &&
    //     row.attendance_next_date
    //       ? "Tillsyn"
    //       : "",
    //   width: "80px",
    // },
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
          <p className="planning_building_code">
            {row.attendance_interval_value}{" "}
          </p>
        );
      },
      selector: (row) => row.attendance_interval_value || "",
      sortable: true,
      width: "70px",
    },

    {
      name: "UI",
      cell: (row, index, column, id) => {
        return (
          <>
            <p className="planning_building_code">
              {row.attendance_interval_unit}
            </p>
          </>
        );
      },
      sortable: true,
      selector: (row) => row.attendance_interval_unit || "",
      width: "70px",
    },

    {
      name: (
        <>
          <div
            className="attend_header_plan"
            style={{
              position: "absolute",
              top: "10px",
              left: "-15px",
              borderBottom: "2px solid #404040",
              fontSize: "13px",
              pointerEvents: "none",
            }}
          >
            {t("common.sidebar.attendance")}
          </div>
          <div>{t("common.pages.previous")}</div>
        </>
      ),
      cell: (row, index, column, id) => {
        return (
          <p className="planning_building_code">
            {row.attendance_lastest_date}{" "}
          </p>
        );
      },
      sortable: true,
      selector: (row) => row.attendance_lastest_date || "",
      width: "125px",
    },
    {
      name: (
        <>
          <div>{t("common.pages.next")}</div>
          <span
            className="border-line"
            style={{ position: "absolute", right: "2px" }}
          ></span>
        </>
      ),
      cell: (row, index, column, id) => {
        return (
          <p className="planning_building_code">{row.attendance_next_date} </p>
        );
      },
      sortable: true,
      selector: (row) => row.attendance_next_date || "",
      width: "125px",
    },
    // {
    //   name: t("property_page.Act._S"),
    //   cell: (row, index, column, id) => {
    //     return (
    //       <p className="planning_building_code">
    //         {row.maintenance_interval_unit &&
    //         row.maintenance_interval_value &&
    //         row.maintenance_lastest_date &&
    //         row.maintenance_next_date
    //           ? "Skötsel"
    //           : null}{" "}
    //       </p>
    //     );
    //   },
    //   selector: (row) =>
    //     row.maintenance_interval_unit &&
    //     row.maintenance_interval_value &&
    //     row.maintenance_lastest_date &&
    //     row.maintenance_next_date
    //       ? "Skötsel"
    //       : "",
    //   sortable: true,
    //   width: "90px",
    // },
    {
      name: "IV",
      cell: (row, index, column, id) => {
        return (
          <p className="planning_building_code">
            {row.maintenance_interval_value}{" "}
          </p>
        );
      },
      selector: (row) => row.maintenance_interval_value || "",
      sortable: true,
      width: "60px",
    },
    {
      name: "IU",
      cell: (row, index, column, id) => {
        return (
          <p className="planning_building_code">
            {row.maintenance_interval_unit}{" "}
          </p>
        );
      },
      sortable: true,
      selector: (row) => row.maintenance_interval_unit || "",
      width: "65px",
    },

    {
      name: (
        <>
          <div
            className="attend_header_plan"
            style={{
              position: "absolute",
              top: "10px",
              left: "-15px",
              borderBottom: "2px solid #404040",
              fontSize: "13px",
              pointerEvents: "none",
            }}
          >
            {t("common.sidebar.maintainence")}
          </div>
          <div>{t("common.pages.previous")}</div>
        </>
      ),
      cell: (row, index, column, id) => {
        return (
          <p className="planning_building_code">
            {row.maintenance_lastest_date}{" "}
          </p>
        );
      },
      selector: (row) => row.maintenance_lastest_date || "",
      sortable: true,
      width: "125px",
    },
    {
      name: t("common.pages.next"),
      cell: (row, index, column, id) => {
        return (
          <p className="planning_building_code">{row.maintenance_next_date} </p>
        );
      },
      sortable: true,
      selector: (row) => row.maintenance_next_date || "",
      width: "125px",
    },
  ];
  console.log("components", components);

  return loading ? (
    <>
      {" "}
      <Loader />{" "}
    </>
  ) : (
    <>
      <Filter
        handleFindClick={handleFindClick}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
      />
      <div
        style={{ width: "99%", marginRight: "1rem" }}
        className="planning_table supervision_table"
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
      </div>
    </>
  );
};

export default Planning;
