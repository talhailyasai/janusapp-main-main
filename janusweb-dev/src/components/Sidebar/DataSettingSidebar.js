import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import { CSSTransition } from "react-transition-group";
import {
  Nav,
  Image,
  Button,
  Dropdown,
  Navbar,
} from "@themesberg/react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { Routes } from "../../routes";
// import Logo from "../../assets/img/janus.png";
import Logo from "../../assets/img/hirez_revB_small.png";
import ReactHero from "../../assets/img/technologies/react-hero-logo.svg";
import { useTranslation } from "react-i18next";
import CreateNewDrawer from "./CreateNewDrawer";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

const DataSettingSidebar = (props = {}) => {
  const { sidebarShow, NavItem } = props;
  const [show, setShow] = useState(false);
  const [activeItem, setActiveItem] = useState("property");

  const { t } = useTranslation();
  const { isCollapsed, toggleCollapse } = usePropertyContextCheck();

  const history = useHistory();

  const showClass = show ? "show" : "";
  const onCollapse = () => setShow(!show);

  const handleItemClick = (itemName, path) => {
    setActiveItem(itemName);
    history.push(path);
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
          {/* <span className="navbar-toggler-icon" /> */}
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
              : `collapse ${showClass} home_sidebar sidebar d-md-block bg-primary text-white ${
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
                <span class="material-symbols-outlined">settings</span>
                {!isCollapsed && t("common.sidebar.data_settings")}
              </div>
              {!isCollapsed ? (
                <div className="setting_property_main">
                  <div className="setting_Item">
                    <div
                      className={
                        activeItem === "property"
                          ? "property_image_main setting_property"
                          : "property_image_main setting_property disactiveItem"
                      }
                      style={{ width: "4.5vw" }}
                      onClick={() =>
                        handleItemClick("property", "/datasetting/property")
                      }
                    >
                      {/* <span class="material-symbols-outlined">settings</span> */}
                      {t("common.pages.Property")}
                    </div>
                  </div>
                  <div className="setting_Item">
                    <div
                      className={
                        activeItem === "supervision"
                          ? "property_image_main setting_property setting_Item"
                          : "property_image_main setting_property disactiveItem setting_Item"
                      }
                      style={{ width: "5.5vw" }}
                      onClick={() =>
                        handleItemClick(
                          "supervision",
                          "/datasetting/supervision"
                        )
                      }
                    >
                      {/* <span class="material-symbols-outlined">settings</span> */}
                      {t("common.sidebar.supervision")}
                    </div>
                  </div>
                  <div className="setting_Item">
                    <div
                      className={
                        activeItem === "maintenance"
                          ? "property_image_main setting_property setting_Item"
                          : "property_image_main setting_property disactiveItem setting_Item"
                      }
                      style={{ width: "6.2vw" }}
                      onClick={() =>
                        handleItemClick(
                          "maintenance",
                          "/datasetting/maintenance"
                        )
                      }
                    >
                      {/* <span class="material-symbols-outlined">settings</span> */}
                      {t("common.sidebar.maintainence")}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <NavItem
                    onClick={() =>
                      handleItemClick("property", "/datasetting/property")
                    }
                    icon={"home_work"}
                    dynamicClass={"data-settings-sidebar"}
                    active={activeItem === "property"}
                  />
                  <NavItem
                    onClick={() =>
                      handleItemClick("supervision", "/datasetting/supervision")
                    }
                    icon={"checklist"}
                    dynamicClass={"data-settings-sidebar"}
                    active={activeItem === "supervision"}
                  />
                  <NavItem
                    onClick={() =>
                      handleItemClick("maintenance", "/datasetting/maintenance")
                    }
                    icon={"construction"}
                    dynamicClass={"data-settings-sidebar"}
                    active={activeItem === "maintenance"}
                  />
                </div>
              )}
              <NavItem
                title={!isCollapsed ? t("common.sidebar.go_back") : ""}
                link={Routes.DashboardOverview.path}
                icon={"arrow_back"}
              />
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};

export default DataSettingSidebar;
