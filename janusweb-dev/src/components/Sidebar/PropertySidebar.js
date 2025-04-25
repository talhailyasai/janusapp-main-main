import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import Logo from "../../assets/img/hirez_revB_small.png";
import { GetAllProperties } from "../../lib/PropertiesLib";
import { usePropertyContextCheck } from "../../context/SidebarContext/PropertyContextCheck";
import { GetSingleBuildingByPropertyCode } from "../../lib/BuildingLib";
import { GetSingleComponentByBuildingId } from "../../lib/ComponentLib";
import { useTranslation } from "react-i18next";
import api from "api";
import CreateNewDrawer from "./CreateNewDrawer";
import "./style.css";
import Loader from "components/common/Loader";

let searchListTags = [
  { key: "Property code", val: "property_code", label: "property_code" },
  { key: "Property name", val: "name", label: "prop_name" },
  { key: "Building code", val: "building_code", label: "building_code" },
  { key: "Building name", val: "building_name", label: "building_name" },
  { key: "Building address", val: "street_address", label: "Building_address" },
  { key: "Component code", val: "component_code", label: "component_code" },
];

export default function PropertySidebar(props = {}) {
  const { sidebarShow, NavItem, CollapsableNavItem } = props;
  const [show, setShow] = useState(false);
  const [showSearchList, setShowSearchList] = useState(false);
  const [activeTag, setActiveTag] = useState(null);

  const [allFilterProperties, setAllFilterProperties] = useState([]);
  const [filterComponents, setFilterComponents] = useState([]);
  const [allFilterBuildings, setFilterBuildings] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchValue, setSearchValue] = useState(null);

  const [allData, setAllData] = useState({}); // New: Stores properties, buildings, and components in a grouped structure

  const searchValueRef = useRef();
  const {
    propertyChange,
    setPropertyChange,
    buildingChange,
    setBuildingChange,
    componentChange,
    setComponentChange,
    setBuildings,
    property,
    setProperty,
    setBuildingObj,
    buildingObj,
    setCompObj,
    compObj,
    propertyAdded,
    buildingAdded,
    setBuildingAdded,
    setComponentAdded,
    componentAdded,
    allProperties,
    setComponentMessage,
    componentMessage,
    isCollapsed,
    toggleCollapse,
    setIsPropertyBarCollapsed,
    setIsCollapsed,
  } = usePropertyContextCheck();
  const showClass = show ? "show" : "";
  const onCollapse = () => {
    setIsCollapsed(false);
    setShow(!show);
  };
  const { t } = useTranslation();

  const searchListRef = useRef(null); // Ref to track the div element
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to handle clicks outside of the div
  const handleClickOutside = (event) => {
    if (
      searchListRef.current &&
      !searchListRef.current.contains(event.target)
    ) {
      setShowSearchList(false); // Close the search list
    }
  };

  useEffect(() => {
    if (Object.keys(componentAdded).length > 0) {
      handleActiveComponent(componentAdded);
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [componentAdded]);

  const getAllBuildings = async () => {
    try {
      if (property) {
        const res = await api.get(`/buildings/${property?._id}`);
        setBuildings(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBuildings();
  }, [propertyChange, property, buildingAdded]);
  const handleSearch = (e) => {
    e.preventDefault();
    let value = e.target.value;
    setSearchValue(value?.toUpperCase());
    value = value?.toLowerCase();

    if (allProperties.length > 0 && value && activeTag) {
      let filtered = [];

      if (activeTag.key.includes("Property")) {
        // Filter properties
        filtered = allProperties.filter((property) =>
          property[activeTag?.val]?.toLowerCase().includes(value)
        );
      } else if (activeTag.key.includes("Building")) {
        // Filter buildings from the buildingsArray of each property
        filtered = allProperties.flatMap((property) =>
          property.buildingsArray?.filter((building) =>
            building[activeTag?.val]?.toLowerCase().includes(value)
          )
        );
      } else {
        // Filter components from the componentsArray of each building
        filtered = allProperties.flatMap((property) =>
          property.buildingsArray?.flatMap((building) =>
            building.componentsArray?.filter((component) =>
              component[activeTag?.val]?.toLowerCase().includes(value)
            )
          )
        );
      }

      setAllFilterProperties(filtered);
    } else {
      setAllFilterProperties([]);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("property");
    localStorage.removeItem("building");
    localStorage.removeItem("component");
  };
  useEffect(() => {
    if (Object.keys(propertyAdded).length > 0) {
      handleActiveProperty(propertyAdded);
    }
  }, [propertyAdded]);
  const handleActiveProperty = (property, propertyAdded) => {
    setProperty(property);
    setPropertyChange(property.property_code);
    localStorage.setItem("property", property.property_code);
    localStorage.setItem("propertyObj", JSON.stringify(property));
    if (localStorage.getItem("building")) localStorage.removeItem("building");
    if (localStorage.getItem("component")) localStorage.removeItem("component");
    if (buildingChange) setBuildingChange(undefined);
    if (componentChange) setComponentChange(undefined);
    setBuildings(property.buildingsArray);
    setComponentMessage(null);
    setIsDropdownOpen(false);
  };

  const handleActiveBuilding = (building) => {
    setBuildingObj(building);
    setBuildingChange(building.building_code);
    localStorage.setItem("buildingObj", JSON.stringify(building));
    localStorage.setItem("building", building.building_code);
    if (localStorage.getItem("component")) {
      localStorage.removeItem("component");
      setComponentChange(undefined);
    }
    setComponentMessage(null);
    setIsDropdownOpen(false);
  };

  const handleActiveComponent = (component) => {
    setCompObj(component);
    setComponentChange(component?.component_code);
    localStorage.setItem("compObj", JSON.stringify(component));
    localStorage.setItem("component", component.component_code);
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
          </span>{" "}
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
                <span class="material-symbols-outlined">home_work</span>
                {!isCollapsed && t("common.sidebar.properties")}
              </div>
              <NavItem
                title={!isCollapsed ? t("common.sidebar.go_back") : ""}
                link={Routes.DashboardOverview.path}
                icon={"arrow_back"}
                onClick={() => {
                  setIsPropertyBarCollapsed(true);
                  clearLocalStorage();
                }}
              />
              <Dropdown.Divider className="my-3 border-indigo" />
              {!isCollapsed && (
                <>
                  <div className="serach-input-field">
                    <Form ref={searchListRef}>
                      <Form.Control
                        className="mb-4"
                        type="text"
                        placeholder={t("common.sidebar.quick_filter")}
                        ref={searchValueRef}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowSearchList(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault(); // Prevent default form submission
                          }
                        }}
                        style={{ width: "270px !important" }}
                        onChange={handleSearch}
                        value={searchValue}
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
                                    <div>{t(`property_page.${el?.label}`)}</div>
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
                                          let property = allProperties?.find(
                                            (p) =>
                                              el?.property_code &&
                                              p?._id == el?.property_code
                                          );
                                          if (property)
                                            handleActiveProperty(property);
                                          handleActiveBuilding(el);
                                        } else {
                                          let property = allProperties?.find(
                                            (p) =>
                                              el?.property_code &&
                                              p?._id == el?.property_code
                                          );
                                          if (property)
                                            handleActiveProperty(property);

                                          if (el?.building_code) {
                                            const build =
                                              property?.buildingsArray?.find(
                                                (p) =>
                                                  p?._id == el?.building_code
                                              );
                                            build &&
                                              handleActiveBuilding(build);
                                          }
                                          handleActiveComponent(el);
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
                  <div className={"overflow-x-hidden overflow-y-auto"}>
                    {allProperties?.length > 0 ? (
                      allProperties?.map((property) => (
                        <CollapsableNavItem
                          key={property.property_code}
                          eventKey={property.property_code}
                          activeKey={propertyChange}
                          title={
                            <div
                              title={property.name}
                              className="title-tooltip"
                            >
                              {property.property_code +
                                " " +
                                property.name?.substring(0, 15)}
                            </div>
                          }
                          icon={"arrow_forward"}
                          onClick={() => handleActiveProperty(property)}
                        >
                          {propertyChange === property.property_code &&
                          property.buildingsArray?.length > 0 ? (
                            property.buildingsArray.map((building) => (
                              <CollapsableNavItem
                                key={building.building_code}
                                eventKey={building.building_code}
                                title={
                                  <div
                                    title={building?.name}
                                    className="title-tooltip"
                                  >
                                    {(() => {
                                      const code = building?.building_code;
                                      const name = building?.name || "";
                                      const fullText = `${code} ${name}`;
                                      return fullText?.length > 20
                                        ? `${fullText?.substring(0, 20)}`
                                        : fullText;
                                    })()}
                                  </div>
                                }
                                activeKey={buildingChange}
                                icon={"arrow_forward"}
                                onClick={() => handleActiveBuilding(building)}
                              >
                                <CollapsableNavItem
                                  title={t("property_page.components")}
                                  icon={"arrow_forward"}
                                  onClick={() => {
                                    setComponentChange("Component");
                                    setCompObj(null);

                                    localStorage.setItem("compObj", null);
                                    localStorage.setItem("component", null);
                                    if (
                                      buildingChange ===
                                        building.building_code &&
                                      building.componentsArray?.length > 0
                                    ) {
                                      // Toggle dropdown state
                                      setIsDropdownOpen((prevState) => {
                                        const newState = !prevState; // Toggle open/close state
                                        if (newState) {
                                          setComponentMessage(
                                            "Click on Components in the sidebar to view components in this building"
                                          );
                                        } else {
                                          setComponentMessage(
                                            "Select component to view details"
                                          );
                                        }
                                        return newState;
                                      });
                                    } else {
                                      setComponentMessage(
                                        "No registered components in this building, select Action menu to add new"
                                      );
                                    }
                                  }}
                                >
                                  {buildingChange === building.building_code &&
                                  building.componentsArray?.length > 0 ? (
                                    building.componentsArray.map(
                                      (component) => (
                                        <CollapsableNavItem
                                          key={component.component_code}
                                          eventKey={component.component_code}
                                          activeKey={componentChange}
                                          title={
                                            <div
                                              title={component?.name}
                                              className="title-tooltip"
                                            >
                                              {component?.u_system +
                                                " " +
                                                component?.name?.substring(
                                                  0,
                                                  15
                                                )}
                                            </div>
                                          }
                                          icon={"arrow_forward"}
                                          onClick={() => {
                                            handleActiveComponent(component);
                                            setComponentMessage(null);
                                            setIsDropdownOpen(false);
                                          }}
                                        />
                                      )
                                    )
                                  ) : (
                                    <CollapsableNavItem
                                      eventKey={"Component"}
                                      title={t("common.pages.empty")}
                                      activeKey={componentChange}
                                      icon={"arrow_forward"}
                                      onClick={() => {
                                        setComponentChange("Component");
                                        setCompObj(null);
                                        setComponentMessage(null);
                                        setIsDropdownOpen(false);

                                        localStorage.setItem("compObj", null);
                                        localStorage.setItem("component", null);
                                      }}
                                    />
                                  )}
                                </CollapsableNavItem>
                              </CollapsableNavItem>
                            ))
                          ) : (
                            <CollapsableNavItem
                              eventKey={"Building"}
                              title={t("property_page.Building")}
                              activeKey={buildingChange}
                              icon={"arrow_forward"}
                              onClick={() => setBuildingChange("Building")}
                            />
                          )}
                        </CollapsableNavItem>
                      ))
                    ) : !Array.isArray(allProperties) ? (
                      <div>
                        <Loader />
                      </div>
                    ) : (
                      <div>{t("common.No data found")}</div>
                    )}
                  </div>
                </>
              )}
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
}
