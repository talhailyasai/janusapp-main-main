import React, { useEffect, useRef, useState } from "react";

import Tabs from "../components/common/Tabs";
import { usePropertyContextCheck } from "../context/SidebarContext/PropertyContextCheck";

import PropertyDetails from "../components/PropertyPage/PropertyDetails";
import BuildingDetails from "../components/PropertyPage/BuildingDetails";
import ComponentDetails from "../components/PropertyPage/ComponentDetails";
import Breadcrumbs from "../components/common/Breadcrumbs";
import Dropdown from "../components/common/Dropdown";
import { useTranslation } from "react-i18next";
import {
  Nav,
  Badge,
  Image,
  Accordion,
  Container,
  Form,
  NavItem,
} from "@themesberg/react-bootstrap";
import Loader from "components/common/Loader";
import "./property.css";
import { CSSTransition } from "react-transition-group";
import SimpleBar from "simplebar-react";
import { Routes } from "routes";

const DefaultState = () => {
  const { t } = useTranslation();
  return <p>{t("property_page.Please_select_a_property")} </p>;
};

const CollapsableNavItem = (props) => {
  const { eventKey, title, children = null, onClick, activeKey } = props;
  return (
    <Accordion as={Nav.Item} activeKey={activeKey}>
      <Accordion.Item eventKey={eventKey}>
        <Accordion.Button
          as={Nav.Link}
          onClick={onClick}
          // className="d-flex justify-content-between align-items-center"
        >
          <span>
            {/* <span className="sidebar-icon">
              <FontAwesomeIcon icon={icon} />{" "}
            </span> */}
            <span className="sidebar-text">{title}</span>
          </span>
        </Accordion.Button>
        <Accordion.Body className="multi-level sidebar-item-collapse">
          <Nav className="flex-column sideNav sidebar_building">{children}</Nav>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

let searchListTags = [
  { key: "Property code", val: "property_code", label: "property_code" },
  { key: "Property name", val: "name", label: "prop_name" },
  { key: "Building code", val: "building_code", label: "building_code" },
  { key: "Building name", val: "building_name", label: "building_name" },
  { key: "Building address", val: "street_address", label: "Building_address" },
  { key: "Component code", val: "component_code", label: "component_code" },
];

const Property = () => {
  const [currentAction, setCurrentAction] = useState();
  const [dropdownReset, setDropdownReset] = useState(false);
  const [ActiveComponent, setActiveComponent] = useState({
    Component: DefaultState,
    props: {},
  });
  const { t } = useTranslation();

  const modifyAction = currentAction === "modify" ? true : false;
  const newTask = currentAction === "new" ? true : false;
  const newPackage = currentAction === "add_package" ? true : false;
  const deleteAction = currentAction === "delete" ? true : false;
  const newActivity = currentAction === "add_activity" ? true : false;
  const modifyActivity = currentAction === "modify_activity" ? true : false;
  const deleteActivity = currentAction === "delete_activity" ? true : false;
  const newBuilding = currentAction === "Building" ? true : false;
  const newComponent = currentAction === "Component" ? true : false;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchListRef = useRef(null); // Ref to track the div element
  const [showSearchList, setShowSearchList] = useState(false);
  const [activeTag, setActiveTag] = useState(null);

  const [allFilterProperties, setAllFilterProperties] = useState([]);
  const [searchValue, setSearchValue] = useState(null);

  const searchValueRef = useRef();
  const {
    propertyChange,
    setPropertyChange,
    buildingChange,
    setBuildingChange,
    componentChange,
    setComponentChange,
    setBuildings,
    setProperty,
    setBuildingObj,
    setCompObj,
    propertyAdded,
    componentAdded,
    allProperties,
    setComponentMessage,
    isCollapsed,
    isPropertyBarCollapsed,
    togglePropertyBarCollapse,
    windowDimension,
  } = usePropertyContextCheck();
  console.log("windowDimension in property js", windowDimension);
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
    if (
      componentAdded &&
      typeof componentAdded === "object" &&
      Object.keys(componentAdded).length > 0
    ) {
      handleActiveComponent(componentAdded);
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [componentAdded]);
  useEffect(() => {
    if (Object.keys(propertyAdded).length > 0) {
      console.log("plan in prop coming", propertyAdded);
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
  const handleChangeAction = (item) => {
    setCurrentAction(item);
  };

  const getQueryParam = (name) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
  };
  const tabValue = getQueryParam("tab");
  const selectProperty = getQueryParam("selectProperty");
  const selectedBuilding = getQueryParam("selectBuilding");

  useEffect(() => {
    if (tabValue === "addNewProperty") {
      setTimeout(() => {
        handleChangeAction("new");
      }, 1000);
    }
    if (tabValue === "addNewBuilding") {
      setBuildingChange(" ");
      setPropertyChange(selectProperty);
      // setProperty(selectPropId);
      setTimeout(() => {
        handleChangeAction("new");
      }, 1000);
    }

    if (tabValue === "addNewComp") {
      setPropertyChange(selectProperty);
      setBuildingChange(selectedBuilding);
      setComponentChange(" ");
      setTimeout(() => {
        handleChangeAction("new");
      }, 1000);
    }
  }, [tabValue]);

  useEffect(() => {
    if (componentChange) {
      setActiveComponent({
        Component: ComponentDetails,
        props: {
          handleChangeAction,
          modifyAction,
          newTask: newTask || newComponent,
          deleteAction,
          newPackage,
          newActivity,
          modifyActivity,
          deleteActivity,
        },
      });
    } else if (buildingChange) {
      setActiveComponent({
        Component: BuildingDetails,
        props: {
          handleChangeAction,
          modifyAction,
          newTask: newTask || newBuilding,
          deleteAction,
          setBuildingChange,
        },
      });
    } else if (propertyChange || !propertyChange) {
      setActiveComponent({
        Component: PropertyDetails,
        props: {
          handleChangeAction,
          modifyAction,
          newTask,
          deleteAction,
          windowDimension,
        },
      });
    } else {
      setActiveComponent({
        Component: DefaultState,
      });
    }
  }, [buildingChange, componentChange, propertyChange, currentAction]);

  useEffect(() => {
    if (currentAction === null) setDropdownReset(true);
  }, [currentAction]);

  useEffect(() => {
    console.log(buildingChange);
    //debugger;
  }, [buildingChange]);

  const tabValues = [
    {
      name: t("common.pages.main_data"),
      id: "main_data",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        mainData: true,
      },
    },
    {
      name: t("common.pages.attributes"),
      id: "attributes",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        attributes: true,
      },
    },
    propertyChange && {
      name: t("common.pages.quantities"),
      id: "quantities",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        quantities: true,
      },
      ifCon:
        (!componentChange && buildingChange) ||
        (!propertyChange && buildingChange),
    },
    {
      name: t("common.pages.info"),
      id: "info",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        info: true,
      },
      ifCon: componentChange || (propertyChange && !buildingChange),
    },
  ].filter(Boolean); // Remove null entries from the array

  const dropDownItems = [
    {
      id: "new",
      if:
        propertyChange || componentChange || buildingChange
          ? true
          : !propertyChange
          ? true
          : false,
      text: `${t("common.pages.new")} ${
        componentChange
          ? t("property_page.comp_action")
          : buildingChange
          ? t("property_page.building_action")
          : propertyChange
          ? t("property_page.property_action")
          : t("property_page.property_action")
      }`,
      icon: "add",
      handleClick: (value) => handleChangeAction(value),
    },
    {
      text: t("common.pages.add_package"),
      if: componentChange && componentChange !== undefined ? true : false,
      id: "add_package",
      icon: "add",
      handleClick: (value) => handleChangeAction(value),
    },
    {
      id: "modify",
      if: propertyChange || componentChange || buildingChange ? true : false,
      text: `${t("common.pages.modify")} ${
        componentChange
          ? t("property_page.comp_action")
          : buildingChange
          ? t("property_page.building_action")
          : propertyChange
          ? t("property_page.property_action")
          : ""
      }`,
      icon: "edit",
      handleClick: (value) => handleChangeAction(value),
    },
    {
      id: "delete",
      if: propertyChange || componentChange || buildingChange ? true : false,
      text: `${t("common.pages.delete")} ${
        componentChange
          ? t("property_page.comp_action")
          : buildingChange
          ? t("property_page.building_action")
          : propertyChange
          ? t("property_page.property_action")
          : ""
      }`,
      icon: "delete",
      handleClick: (value) => handleChangeAction(value),
    },
    {
      id: "add_activity",
      if: componentChange && componentChange !== undefined ? true : false,
      text: t("common.pages.add_activity"),
      icon: "add",
      handleClick: (value) => handleChangeAction(value),
    },
  ];

  useEffect(() => {
    const previousProperty = localStorage.getItem("property");
    const previousBuilding = localStorage.getItem("building");
    const previousComponent = localStorage.getItem("component");
    if (previousProperty) setPropertyChange(previousProperty);
    if (previousBuilding) setBuildingChange(previousBuilding);
    if (previousComponent) setComponentChange(previousComponent);
  }, []);

  const breadCrumbItems = [
    {
      if: true,
      value: propertyChange || t("property_page.Select a property"),
      handleClick: () => {
        setBuildingChange(null);
        setComponentChange(null);
      },
    },
    {
      if: buildingChange,
      value: buildingChange,
      handleClick: () => {
        setComponentChange(null);
      },
    },
    {
      if: componentChange,
      value:
        componentChange === "Component"
          ? t(`common.pages.${componentChange}`)
          : componentChange,
      handleClick: () => {},
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        {isPropertyBarCollapsed && isCollapsed && (
          <div
            className={`property-page-sidebar-collapsed ${
              isCollapsed ? "collapsed-property-page-sidebar" : ""
            } ${isPropertyBarCollapsed ? "cursor-pointer" : ""}`}
            onClick={() => {
              if (isPropertyBarCollapsed) togglePropertyBarCollapse();
            }}
          >
            <div
              className=""
              title={
                isPropertyBarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }} // Adjust icon size
              >
                arrow_forward_ios
              </span>
            </div>
          </div>
        )}
        {!isPropertyBarCollapsed && isCollapsed && (
          <div
            className={`property-page-sidebar ${
              isCollapsed ? "collapsed-property-page-sidebar" : ""
            }`}
          >
            <div
              className="property-collapse-toggle"
              onClick={togglePropertyBarCollapse}
              title={
                isPropertyBarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }} // Adjust icon size
              >
                arrow_back_ios
              </span>
            </div>
            <div className="d-flex flex-column pt-3 pt-md-4">
              <div className="serach-input-field serach-input-field-bar">
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

                  {showSearchList && (
                    <div className="serach-field-list">
                      <div className="sreach-tags">
                        {activeTag ? (
                          <div className="search-tag search-acive-tag">
                            <div>{t(`property_page.${activeTag?.label}`)}</div>
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
                                    if (activeTag?.key.includes("Property")) {
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
                                            (p) => p?._id == el?.building_code
                                          );
                                        build && handleActiveBuilding(build);
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
              {/* Working on making it scrollable */}
              <div className={"overflow-x-hidden overflow-y-auto"}>
                {allProperties?.length > 0 ? (
                  allProperties?.map((property) => (
                    <CollapsableNavItem
                      key={property?.property_code}
                      eventKey={property?.property_code}
                      activeKey={propertyChange}
                      title={
                        <div title={property?.name} className="title-tooltip">
                          {property?.property_code +
                            " " +
                            property.name?.substring(0, 15)}
                        </div>
                      }
                      icon={"arrow_forward"}
                      onClick={() => handleActiveProperty(property)}
                    >
                      {propertyChange === property?.property_code &&
                      property.buildingsArray?.length > 0 ? (
                        property.buildingsArray.map((building) => (
                          <CollapsableNavItem
                            key={building?.building_code}
                            eventKey={building?.building_code}
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
                                  buildingChange === building.building_code &&
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
                              {buildingChange === building?.building_code &&
                              building.componentsArray?.length > 0 ? (
                                building.componentsArray.map((component) => (
                                  <CollapsableNavItem
                                    key={component?.component_code}
                                    eventKey={component?.component_code}
                                    activeKey={componentChange}
                                    title={
                                      <div
                                        title={component?.name}
                                        className="title-tooltip"
                                      >
                                        {component?.u_system +
                                          " " +
                                          component?.name?.substring(0, 15)}
                                      </div>
                                    }
                                    icon={"arrow_forward"}
                                    onClick={() => {
                                      handleActiveComponent(component);
                                      setComponentMessage(null);
                                      setIsDropdownOpen(false);
                                    }}
                                  />
                                ))
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
            </div>
          </div>
        )}

        <div className="w-100">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
            <Breadcrumbs items={breadCrumbItems} />
            <Dropdown
              handleClick={handleChangeAction}
              name={t("common.pages.actions")}
              nameReset={dropdownReset}
              items={dropDownItems}
            />
          </div>
          <div className="my-4">
            <Tabs tabValues={tabValues} />
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Property;
