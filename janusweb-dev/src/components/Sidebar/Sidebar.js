import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HomeSidebar from "./HomeSidebar";
import PlanningSidebar from "./PlanningSidebar";
import PropertySidebar from "./PropertySidebar";
import DataSettingSidebar from "./DataSettingSidebar";

import {
  Nav,
  Badge,
  Image,
  Accordion,
  Container,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import { Routes } from "../../routes";
import ImagesFilesSidebar from "./ImagesFilesSidebar";
import SupervisionSidebar from "./SupervisionSidebar";
import "./style.css";

export default function SideBar(props = {}) {
  const location = useLocation();
  const { pathname } = location;
  const [sidebarShow, setSidebarShow] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [currentPath, setCurrentPath] = useState(0);

  const sideBarFunc = (itemNum) => {
    setSidebarShow(
      sidebarShow.map((cond, idx) => {
        if (idx === itemNum) {
          cond = true;
          return cond;
        } else {
          return false;
        }
      })
    );
  };

  useEffect(() => {
    if (pathname === Routes.Property.path) {
      setCurrentPath(1);
    } else if (pathname === Routes.Maintainence.path) {
      setCurrentPath(2);
    } else if (
      pathname === Routes.DashboardOverview.path ||
      pathname === Routes.LandingPage.path
    ) {
      setCurrentPath(0);
    } else if (
      pathname === Routes.SettingProperty.path ||
      pathname === Routes.SettingSupervision.path ||
      pathname === Routes.DataSetting.path
    ) {
      setCurrentPath(3);
    } else if (pathname === Routes.ImagesFiles.path) {
      setCurrentPath(4);
    } else if (pathname === Routes.Supervision.path) {
      setCurrentPath(5);
    } else if (pathname === "/useraccounts" || pathname === "/pricing-plan") {
      setCurrentPath(0);
    }
    // if (pathname.includes(Routes.Property.path)) {
    //   setCurrentPath(1);
    // } else if (pathname.includes(Routes.Planning.path)) {
    //   setCurrentPath(2);
    // } else if (pathname.includes(Routes.DashboardOverview.path)) {
    //   setCurrentPath(0);
    // } else if (pathname.includes(Routes.DataSetting.path)) {
    //   setCurrentPath(3);
    // }
  }, [pathname]);
  useEffect(() => {
    sideBarFunc(currentPath);
  }, [currentPath]);

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

  const NavItem = (props) => {
    const {
      title,
      link,
      external,
      onClick,
      arrow,
      target,
      active,
      icon,
      image,
      badgeText,
      badgeBg = "secondary",
      badgeColor = "primary",
      dynamicClass,
    } = props;

    const classNames = badgeText
      ? "d-flex justify-content-start align-items-center justify-content-between"
      : "";
    const navItemClassName = active
      ? title === active
        ? "active"
        : ""
      : link === pathname
      ? "active"
      : "";
    const linkProps = link
      ? external
        ? { href: link }
        : { as: Link, to: link || "" }
      : { as: Container };

    return (
      <Nav.Item
        className={`${dynamicClass} ${navItemClassName}`}
        onClick={onClick}
      >
        <Nav.Link
          {...linkProps}
          style={{ cursor: "pointer" }}
          target={target}
          className={classNames}
        >
          <span className="d-flex">
            {icon ? (
              <span
                class="material-symbols-outlined sidebar-icon"
                id={icon === "inventory" && "inspection_navlink"}
              >
                {icon}
              </span>
            ) : null}
            {image ? (
              <Image
                src={image}
                width={20}
                height={20}
                className="sidebar-icon svg-icon"
              />
            ) : null}

            <span className="sidebar-text w-100">
              <div
                className={`${
                  arrow ? "theicon" : ""
                } d-flex justify-content-between w-100`}
                id={
                  (title === "Inspection" || title === "Besiktning") &&
                  "inspection_navlink"
                }
              >
                {title}
              </div>
            </span>
          </span>
          {badgeText ? (
            <Badge
              pill
              bg={badgeBg}
              text={badgeColor}
              className="badge-md notification-count ms-2"
            >
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };
  return (
    <>
      {currentPath === 0 ? (
        <HomeSidebar
          CollapsableNavItem={CollapsableNavItem}
          NavItem={NavItem}
          sideBarFunc={sideBarFunc}
          sidebarShow={sidebarShow[0]}
        />
      ) : currentPath === 1 ? (
        <PropertySidebar
          CollapsableNavItem={CollapsableNavItem}
          NavItem={NavItem}
          sideBarFunc={sideBarFunc}
          sidebarShow={sidebarShow[1]}
        />
      ) : currentPath === 3 ? (
        <DataSettingSidebar
          CollapsableNavItem={CollapsableNavItem}
          NavItem={NavItem}
          sideBarFunc={sideBarFunc}
          sidebarShow={sidebarShow[3]}
        />
      ) : currentPath === 4 ? (
        <ImagesFilesSidebar
          CollapsableNavItem={CollapsableNavItem}
          NavItem={NavItem}
          sideBarFunc={sideBarFunc}
          sidebarShow={sidebarShow[4]}
        />
      ) : currentPath === 5 ? (
        <SupervisionSidebar
          CollapsableNavItem={CollapsableNavItem}
          NavItem={NavItem}
          sideBarFunc={sideBarFunc}
          sidebarShow={sidebarShow[5]}
        />
      ) : (
        currentPath === 2 && (
          <PlanningSidebar
            CollapsableNavItem={CollapsableNavItem}
            NavItem={NavItem}
            sideBarFunc={sideBarFunc}
            sidebarShow={sidebarShow[2]}
          />
        )
      )}
    </>
  );
}
