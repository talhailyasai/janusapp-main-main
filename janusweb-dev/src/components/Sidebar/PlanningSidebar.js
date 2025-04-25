import React, { useEffect, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import { CSSTransition } from "react-transition-group";
import {
  Nav,
  Image,
  Button,
  Dropdown,
  Navbar,
  Form,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";

import { Routes } from "../../routes";
// import Logo from "../../assets/img/janus.png";
import Logo from "../../assets/img/hirez_revB_small.png";
import ReactHero from "../../assets/img/technologies/react-hero-logo.svg";

import { usePlanningContextCheck } from "../../context/SidebarContext/PlanningContextCheck";
import { getUniqueListBy } from "../../lib/utils/utils";
import { GetAllProperties } from "../../lib/PropertiesLib";
import { GetSingleBuildingByPropertyCode } from "../../lib/BuildingLib";
import { useTranslation } from "react-i18next";
import CreateNewDrawer from "./CreateNewDrawer";
import "./style.css";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

let searchListTags = [
  { key: "Property code", val: "property_code", label: "property_code" },
  { key: "Property name", val: "name", label: "prop_name" },
  { key: "Building code", val: "building_code", label: "building_code" },
  { key: "Building name", val: "building_name", label: "building_name" },
  { key: "Building address", val: "street_address", label: "Building_address" },
];

const PlanningSidebar = (props = {}) => {
  const { sidebarShow, NavItem, CollapsableNavItem } = props;
  const {
    setPlanningChange,
    setBuildingChange,
    buildingChange,
    planningChange,
    setActiveSidebarChange,
    activeTabMaintenance,
    setPlanningProperty,
    planningProperty,
  } = usePlanningContextCheck();
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const { value } = GetAllProperties();
  const { value: buildingsData } = GetSingleBuildingByPropertyCode(
    planningProperty?._id || "",
    {},
    [planningChange]
  );

  const searchValueRef = useRef();
  const searchListRef = useRef(null);
  const [showSearchList, setShowSearchList] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const [allFilterProperties, setAllFilterProperties] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const {
    isCollapsed,
    toggleCollapse,
    setIsCollapsed,
    setIsPropertyBarCollapsed,
  } = usePropertyContextCheck();
  const { t } = useTranslation();
  // const singleData = async (id) => {
  //   const buildingCode = await GetSinglePlanningByPlanningId(id).value.article;
  //   return buildingCode;
  // };
  const showClass = show ? "show" : "";
  const onCollapse = () => {
    setIsCollapsed(false);
    setShow(!show);
  };
  const handleClickOutside = (event) => {
    if (
      searchListRef.current &&
      !searchListRef.current.contains(event.target)
    ) {
      setShowSearchList(false); // Close the search list
    }
  };

  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   const currentTab = localStorage.getItem("activeTabIdPlanningMaintainance");
  //   if (currentTab) {
  //     setActiveTab(currentTab);
  //   }
  // }, []);

  const handleSearch = (e) => {
    let allProperties = value;
    e.preventDefault();
    let inputValue = e.target.value;
    setSearchValue(inputValue?.toUpperCase());
    inputValue = inputValue?.toLowerCase();
    if (allProperties.length > 0 && inputValue && activeTag) {
      if (activeTag.key.includes("Property")) {
        let arr = allProperties.filter((property) =>
          property[activeTag?.val].toLowerCase().includes(inputValue)
        );
        console.log(arr);
        setAllFilterProperties(arr);
      } else if (activeTag.key.includes("Building")) {
        let arr = [];
        allProperties.map((property) => {
          property?.buildingsArray?.map((building) => {
            if (
              building[activeTag?.val] &&
              building[activeTag?.val]?.toLowerCase()?.includes(inputValue)
            ) {
              arr.push(building);
            }
          });
        });
        console.log(arr);
        setAllFilterProperties(arr);
      }
    } else {
      setAllFilterProperties([]);
    }
  };

  const handleActiveProperty = (el) => {
    setPlanningProperty(el);
    setPlanningChange(el.property_code);
    localStorage.setItem("planning_property_code", el.property_code);
    localStorage.setItem("planing_property", JSON.stringify(el));
    setBuildingChange(null);
    if (localStorage.getItem("planning_building_code"))
      localStorage.removeItem("planning_building_code");
  };

  const handleActiveBuilding = (el) => {
    setBuildingChange(el.building_code);
    localStorage.setItem("planning_building_code", el.building_code);
  };

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className={`${
          sidebarShow ? "navbar-theme-primary px-4 d-md-none" : "d-none"
        }`}
      >
        <Navbar.Brand
          className="me-lg-5"
          as={Link}
          to={Routes.DashboardOverview.path}
        >
          <Image src={Logo} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle
          as={Button}
          aria-controls="main-navbar"
          onClick={onCollapse}
        >
          <span
            className={`material-symbols-outlined `}
            style={{ fontSize: "28px", display: "flex" }}
          >
            {show ? "close" : "menu"}
          </span>
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar
          className={
            !sidebarShow
              ? "hidden"
              : `collapse ${showClass} sidebar d-md-block bg-primary text-white ${
                  isCollapsed ? "sidebar-collapsed" : ""
                }`
          }
        >
          <div className={`sidebar-inner ps-2 pe-3 pt-3 relative`}>
            <div
              className="collapse-toggle"
              onClick={toggleCollapse}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "25px" }} // Adjust icon size
              >
                {isCollapsed ? "last_page" : "first_page"}
              </span>
            </div>
            {/* <div className="user-card d-flex d-md-none align-items-center justify-content-end justify-content-md-center pb-4">
              <Nav.Link
                className="collapse-close d-md-none"
                onClick={onCollapse}
              >
                <span class="material-symbols-outlined">close</span>
              </Nav.Link>
            </div> */}

            <Link
              className={`d-flex align-items-center justify-content-center cursor-pointer ${
                isCollapsed ? "collapsed-logo" : ""
              }`}
              style={{ cursor: "pointer", width: "100%", marginTop: "16%" }}
              to="/"
            >
              <Image src={Logo} width={50} height={50} />
              {/* <p style={{ marginLeft: "7px" }} className="my-au   to">
                  Janus
                </p> */}
            </Link>

            <Nav className="flex-column pt-3 pt-md-4">
              {/* Create Drop down */}
              <div className="create_home_drawer">
                <CreateNewDrawer />
              </div>
              <div className="property_image_main">
                <span class="material-symbols-outlined">construction</span>
                {!isCollapsed && t("common.sidebar.maintainence")}
              </div>
              <NavItem
                title={!isCollapsed ? t("common.sidebar.go_back") : ""}
                link={Routes.DashboardOverview.path}
                icon={"arrow_back"}
                onClick={() => {
                  setIsPropertyBarCollapsed(true);
                }}
              />

              <Dropdown.Divider className="my-3 border-indigo" />
              {!isCollapsed && (
                <>
                  {activeTabMaintenance === "create_edit_plan" && (
                    <div className="serach-input-field">
                      <Form ref={searchListRef}>
                        <Form.Control
                          className="mb-4"
                          type="text"
                          placeholder={t("common.sidebar.quick_filter")}
                          ref={searchValueRef}
                          onClick={() => {
                            setShowSearchList(true);
                          }}
                          style={{ width: "270px !important" }}
                          onChange={handleSearch}
                          value={searchValue}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); // Prevent default form submission
                            }
                          }}
                          // disabled={!activeTag || !showSearchList ? true : false}
                        />
                        <button
                          type="button"
                          style={{ bottom: "39%" }}
                          className="position-absolute border-0 bg-white right-0 me-2"
                        >
                          <span
                            style={{ cursor: "pointer" }}
                            class="text-black material-symbols-outlined"
                          >
                            search
                          </span>
                        </button>

                        {showSearchList && (
                          <div className="serach-field-list">
                            <div className="sreach-tags">
                              {activeTag ? (
                                <div className="search-tag search-acive-tag">
                                  <div>
                                    {t(`property_page.${activeTag?.label}`)}
                                  </div>
                                  <span
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "14px",
                                    }}
                                    class="text-black material-symbols-outlined"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveTag(null);
                                      setAllFilterProperties([]);
                                    }}
                                  >
                                    close
                                  </span>
                                </div>
                              ) : (
                                <>
                                  {searchListTags?.map((el) => (
                                    <div
                                      className={`search-tag ${
                                        activeTag?.val == el?.val
                                          ? "search-active-tag"
                                          : ""
                                      }`}
                                      onClick={() => {
                                        setActiveTag(el);
                                        setAllFilterProperties([]);
                                      }}
                                    >
                                      <div>
                                        {t(`property_page.${el?.label}`)}
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                            <div className="property_list">
                              {allFilterProperties.length > 0 ? (
                                <div>
                                  {allFilterProperties?.map((el) => {
                                    return (
                                      <div
                                        className="property_element"
                                        onClick={() => {
                                          if (
                                            activeTag?.key.includes("Property")
                                          ) {
                                            handleActiveProperty(el);
                                          } else if (
                                            activeTag?.key.includes("Building")
                                          ) {
                                            let property = value?.find(
                                              (p) =>
                                                el?.property_code &&
                                                p?._id == el?.property_code
                                            );
                                            if (property)
                                              handleActiveProperty(property);
                                            handleActiveBuilding(el);
                                          }
                                        }}
                                      >
                                        {el[activeTag?.val]}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div>{/* <div>No Data</div> */}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </Form>
                    </div>
                  )}

                  {activeTabMaintenance === "create_edit_plan" &&
                    value?.map((val) => (
                      <CollapsableNavItem
                        key={val.property_code}
                        activeKey={planningChange}
                        eventKey={val.property_code}
                        title={
                          <div title={val?.name} className="title-tooltip">
                            {val?.property_code +
                              " " +
                              val?.name?.substring(0, 15)}
                          </div>
                        }
                        icon={"arrow_forward"}
                        onClick={() => {
                          setPlanningProperty(val);
                          setPlanningChange(val.property_code);
                          localStorage.setItem(
                            "planning_property_code",
                            val.property_code
                          );
                          localStorage.setItem(
                            "planing_property",
                            JSON.stringify(val)
                          );
                          setBuildingChange(null);
                          if (localStorage.getItem("planning_building_code"))
                            localStorage.removeItem("planning_building_code");
                        }}
                      >
                        {val.property_code === planningChange &&
                          getUniqueListBy(
                            buildingsData || [],
                            "building_code"
                          )?.map((building) => (
                            <CollapsableNavItem
                              key={building.building_code}
                              title={building.building_code}
                              activeKey={buildingChange}
                              eventKey={building.building_code}
                              icon={"arrow_forward"}
                              onClick={() => {
                                setBuildingChange(building.building_code);
                                localStorage.setItem(
                                  "planning_building_code",
                                  building.building_code
                                );
                              }}
                            />
                          ))}
                      </CollapsableNavItem>
                    ))}
                </>
              )}
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};

export default PlanningSidebar;
