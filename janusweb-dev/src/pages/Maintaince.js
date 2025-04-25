import React, { useState, useEffect, useRef } from "react";
import MaintainancePage from "../components/PlanningPage/MaintainancePage";
import Tabs from "../components/common/Tabs";
import { usePlanningContextCheck } from "../context/SidebarContext/PlanningContextCheck";
import Breadcrumbs from "../components/common/Breadcrumbs";
import Dropdown from "../components/common/Dropdown";
import DeleteModal from "components/PlanningPage/MaintainancePage/components/Report/ActivitesYear/DeleteModal";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { Nav, Form, Accordion } from "@themesberg/react-bootstrap";
import { GetAllProperties } from "../lib/PropertiesLib";
import { GetSingleBuildingByPropertyCode } from "../lib/BuildingLib";
import { getUniqueListBy } from "../lib/utils/utils";
import "./property.css";

const defaultState = () => <p>{t("planning_page.select_property")} </p>;
const defaultStateBuilding = () => <p>Please select a Building</p>;

let searchListTags = [
  { key: "Property code", val: "property_code", label: "property_code" },
  { key: "Property name", val: "name", label: "prop_name" },
  { key: "Building code", val: "building_code", label: "building_code" },
  { key: "Building name", val: "building_name", label: "building_name" },
  { key: "Building address", val: "street_address", label: "Building_address" },
];

const Maintaince = () => {
  const [currentAction, setCurrentAction] = useState();
  const [ActiveComponent, setActiveComponent] = useState({
    Component: defaultState,
    props: {},
  });
  // Delete Modal State
  const [show, setShow] = useState(false);

  const {
    setPlanningChange,
    setBuildingChange,
    buildingChange,
    planningChange,
    setActiveTabMaintenance,
    activeTabMaintenance,
    setPlanningProperty,
    planningProperty,
  } = usePlanningContextCheck();
  const {
    isCollapsed,
    isPropertyBarCollapsed,
    setIsPropertyBarCollapsed,
    togglePropertyBarCollapse,
    currentTab,
    setCurrentTab,
  } = usePropertyContextCheck();

  const { t } = useTranslation();
  const newItem = currentAction === "add_item" ? true : false;
  const deleteItem = currentAction === "delete" ? true : false;
  const newPackage = currentAction === "add_package" ? true : false;
  const modifyItem = currentAction === "modify" ? true : false;
  const printItem = currentAction === "print" ? true : false;
  const createReport = currentAction === "create_report" ? true : false;
  const printAnalysis = currentAction === "printAnalysis" ? true : false;
  const batchEditItems = currentAction === "batch_edit_item" ? true : false;
  console.log({ currentAction });
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

  // const singleData = async (id) => {
  //   const buildingCode = await GetSinglePlanningByPlanningId(id).value.article;
  //   return buildingCode;
  // };

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

  const handleChangeAction = (item) => {
    const buildingCode = localStorage.getItem("planning_building_code");
    if (!buildingCode && item === "add_package") {
      setShow(true);
    } else {
      setCurrentAction(item);
    }
  };

  const getQueryParam = (name) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
  };

  useEffect(() => {
    const tabValue = getQueryParam("tab");
    if (tabValue === "addNewMaintenance") {
      // setTimeout(() => {
      handleChangeAction("add_item");
      // Remove only the 'tab' parameter
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.delete("tab");

      // Create new URL with remaining parameters
      const newUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;

      // Update URL without reloading the page
      window.history.replaceState({}, "", newUrl);
      // }, 1000);
    }
  }, []);

  useEffect(() => {
    //debugger;
    if (buildingChange || planningChange || !planningChange) {
      setActiveComponent({
        Component: MaintainancePage,
        props: {
          handleChangeAction,
          newItem,
          deleteItem,
          newPackage,
          modifyItem,
          printItem,
          createReport,
          printAnalysis,
          currentTab,
          batchEditItems,
        },
      });
    } else if (planningChange) {
      setActiveComponent({
        Component: defaultStateBuilding,
        props: {
          handleChangeAction,
          newItem,
        },
      });
    }
  }, [buildingChange, currentAction, newItem, planningChange]);
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
            <Nav className="flex-column sideNav sidebar_building">
              {children}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };
  const maintainceTabValues = [
    {
      name: t("planning_page.create_edit_plan"),
      id: "create_edit_plan",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        createEditPlan: true,
      },
    },
    {
      name: t("planning_page.overview"),
      id: "overview",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        overview: true,
        selectCreateEditPlan: () => setCurrentTab("create_edit_plan"),
      },
    },
    {
      name: t("planning_page.batch_editing"),
      id: "batch_editing",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        batchediting: true,
      },
    },
    {
      name: t("planning_page.analysis"),
      id: "analysis",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        analysis: true,
        currentTab: currentTab,
      },
    },
    {
      name: t("planning_page.report"),
      id: "report",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        report: true,
      },
    },
  ];

  const dropDownItems = [
    {
      if: currentTab === "create_edit_plan" && buildingChange,
      text: t("common.pages.add_item"),
      id: "add_item",
      icon: "add",
      handleClick: (value) => handleChangeAction(value),
    },
    {
      if: currentTab === "create_edit_plan" && buildingChange,
      text: t("common.pages.add_package"),
      id: "add_package",
      icon: "add",
      handleClick: (value) => handleChangeAction(value),
    },
    {
      if:
        (currentTab === "create_edit_plan" ||
          currentTab === "batch_editing" ||
          currentTab === "overview") &&
        planningChange,

      text: t("planning_page.delete_selected"),
      id: "delete",
      icon: "remove",
      handleClick: (value) => handleChangeAction(value),
    },
    {
      if: currentTab === "batch_editing",
      text: t("planning_page.edit_many"),
      id: "batch_edit_item",
      icon: "edit",
      handleClick: (value) => handleChangeAction(value),
    },
    {
      if: currentTab === "create_edit_plan",

      text: t("common.pages.modify_item"),
      id: "modify",
      icon: "edit",
      handleClick: (value) => handleChangeAction(value),
    },
    // {
    //   if: currentTab === "report",
    //   text: t("planning_page.print"),
    //   id: "print",
    //   icon: "export_notes",
    //   handleClick: (value) => handleChangeAction(value),
    // },
    {
      if: currentTab === "report",
      text: t("planning_page.create_report"),
      id: "create_report",
      icon: "export_notes",
      handleClick: (value) => handleChangeAction(value),
    },
    {
      if: currentTab === "analysis",
      text: t("planning_page.print"),
      id: "printAnalysis",
      icon: "export_notes",
      handleClick: (value) => handleChangeAction(value),
    },
  ];
  const breadCrumbItems = [
    {
      if: true,
      value: planningChange || t("property_page.Select_Building"),
      handleClick: () => {
        setBuildingChange(null);
      },
    },
    {
      if: buildingChange,
      value: buildingChange,
      handleClick: () => {},
    },
  ];
  useEffect(() => {
    const activeTabId = localStorage.getItem("activeTabIdPlanningMaintainance");
    const selectedTab = getQueryParam("selectedTab");
    if (selectedTab === "report") {
      setCurrentTab("report");
      localStorage.setItem("activeTabIdPlanningMaintainance", "report");

      // Remove selectedTab from URL
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.delete("selectedTab");
      const newUrl = `${window.location.pathname}${
        urlParams.toString() ? `?${urlParams.toString()}` : ""
      }`;
      window.history.pushState({}, "", newUrl);
    } else if (activeTabId) {
      setCurrentTab(activeTabId);
    } else {
      setCurrentTab(maintainceTabValues[0].id);
    }

    // Cleanup function
    return () => {
      setCurrentTab(null);
      setActiveTabMaintenance(activeTabId);
    };
  }, []);

  useEffect(() => {
    if (currentTab) {
      localStorage.setItem("activeTabIdPlanningMaintainance", currentTab);
      setActiveTabMaintenance(currentTab);
      setIsPropertyBarCollapsed(true);
    }
  }, [currentTab]);

  // Delete Modal Function
  const deleteModalClose = () => {
    setShow(false);
  };
  return (
    <div className="maintenance-page">
      <div style={{ display: "flex", gap: "10px" }}>
        {isPropertyBarCollapsed &&
          isCollapsed &&
          activeTabMaintenance === "create_edit_plan" && (
            <div
              className={`property-page-sidebar-collapsed ${
                isCollapsed ? "collapsed-property-page-sidebar" : ""
              } ${
                isPropertyBarCollapsed &&
                activeTabMaintenance === "create_edit_plan"
                  ? "cursor-pointer"
                  : ""
              }`}
              onClick={() => {
                if (
                  isPropertyBarCollapsed &&
                  activeTabMaintenance === "create_edit_plan"
                )
                  togglePropertyBarCollapse();
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
        {!isPropertyBarCollapsed &&
          isCollapsed &&
          activeTabMaintenance === "create_edit_plan" && (
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
                {activeTabMaintenance === "create_edit_plan" && (
                  <div className="serach-input-field serach-input-field-bar">
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
              </div>
            </div>
          )}
        <div className="w-100">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
            {currentTab === undefined || currentTab === "create_edit_plan" ? (
              <Breadcrumbs items={breadCrumbItems} />
            ) : (
              <div></div>
            )}
            <Dropdown
              handleClick={handleChangeAction}
              nameReset={currentAction ? false : true}
              name={t("common.pages.actions")}
              items={dropDownItems}
            />
          </div>
          <div className="my-4">
            {currentTab && (
              <Tabs
                tabValues={maintainceTabValues}
                activeTabId={currentTab}
                onTabChange={(item) => {
                  const urlParams = new URLSearchParams(window.location.search);
                  urlParams.delete("plan_id");
                  urlParams.delete("prop_id");
                  urlParams.delete("build_code");
                  const newUrl = `${
                    window.location.pathname
                  }?${urlParams.toString()}`;
                  window.history.pushState({}, "", newUrl);
                  setCurrentTab(item);
                }}
                maintenanceTabWidth={true}
                settingsIcon={true}
              />
            )}
          </div>
        </div>
      </div>
      {/* // Delete Modal */}
      {show && (
        <DeleteModal
          show={show}
          maintenanceCreate={true}
          deleteModalClose={deleteModalClose}
        />
      )}
    </div>
  );
};

export default Maintaince;
