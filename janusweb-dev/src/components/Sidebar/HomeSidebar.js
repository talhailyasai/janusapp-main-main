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
import Logo from "../../assets/img/hirez_revB_small.png";
import ReactHero from "../../assets/img/technologies/react-hero-logo.svg";
import { useTranslation } from "react-i18next";
import api from "api";
import "react-modern-drawer/dist/index.css";
import "./HomeSidebar.css";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import CreateNewDrawer from "./CreateNewDrawer";
import { useUserContext } from "context/SidebarContext/UserContext";

const HomeSidebar = (props = {}) => {
  const { NavItem, sidebarShow } = props;
  const { isCollapsed, toggleCollapse } = usePropertyContextCheck();
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  const { t } = useTranslation();
  // const [currentUser, setCurrentUser] = useState(null);
  const { user: currentUser } = useUserContext();
  // console.log("currentUser", currentUser);
  const onCollapse = () => setShow(!show);

  // const getCurrentUser = async () => {
  //   let userId = JSON.parse(localStorage.getItem("user"))?._id;
  //   try {
  //     if (userId) {
  //       let res = await api.get(`/users/${userId}`);
  //       setCurrentUser(res.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getCurrentUser();
  // }, []);

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className={` ${
          !sidebarShow ? "d-none" : "navbar-theme-primary px-4 d-md-none"
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
              {/* <NavItem title="Janus" image={Logo} /> */}
              {!currentUser?.role ||
              (currentUser?.role == "user" &&
                currentUser?.Functions.includes("propertyRegistry")) ? (
                <NavItem
                  title={!isCollapsed ? t("common.sidebar.properties") : ""}
                  link={Routes.Property.path}
                  icon={"home_work"}
                />
              ) : null}

              {(currentUser?.role != "user" &&
                (currentUser?.plan === "Standard Plus" ||
                  currentUser?.canceledPlan === "Standard Plus")) ||
              (currentUser?.role == "user" &&
                currentUser?.Functions?.includes("supervision")) ? (
                <NavItem
                  // title={t("common.sidebar.supervision")}
                  title={!isCollapsed ? t("common.sidebar.supervision") : ""}
                  link={Routes.Supervision.path}
                  icon={"checklist"}
                />
              ) : null}
              {!currentUser?.role ||
              (currentUser?.role == "user" &&
                currentUser?.Functions.includes("maintenance")) ? (
                <NavItem
                  // title={t("common.sidebar.maintainence")}
                  title={!isCollapsed ? t("common.sidebar.maintainence") : ""}
                  link={Routes.Maintainence.path}
                  icon={"construction"}
                />
              ) : null}

              {!currentUser?.role ||
              (currentUser?.role == "user" &&
                currentUser?.Functions.includes("images_&_files")) ? (
                <NavItem
                  // title={t("common.pages.Images & Files")}
                  title={!isCollapsed ? t("common.pages.Images & Files") : ""}
                  link={Routes.ImagesFiles.path}
                  icon={"image"}
                />
              ) : null}

              {!currentUser?.role && (
                <NavItem
                  // title={t("common.sidebar.data_settings")}
                  title={!isCollapsed ? t("common.sidebar.data_settings") : ""}
                  link={Routes.SettingProperty.path}
                  icon={"settings"}
                />
              )}

              {currentUser?.role !== "user" && (
                <NavItem
                  // title={t("common.sidebar.user_accounts")}
                  title={!isCollapsed ? t("common.sidebar.user_accounts") : ""}
                  link={Routes.UserAccounts.path}
                  icon={"manage_accounts"}
                />
              )}
              {/* <CollapsableNavItem
                eventKey="examples/"
                title="Auth Pages"
                icon={faFileAlt}
              >
                <NavItem title="Sign In" link={Routes.Signin.path} />
                <NavItem title="Sign Up" link={Routes.Signup.path} />
                <NavItem
                  title="Forgot password"
                  link={Routes.ForgotPassword.path}
                />
                <NavItem
                  title="Reset password"
                  link={Routes.ResetPassword.path}
                />
                <NavItem title="404 Not Found" link={Routes.NotFound.path} />
              </CollapsableNavItem> */}

              <Dropdown.Divider className="my-3 border-indigo" />
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};

export default HomeSidebar;
