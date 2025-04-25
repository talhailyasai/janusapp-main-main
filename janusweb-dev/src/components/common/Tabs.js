import { Row, Col, Nav, Tab } from "@themesberg/react-bootstrap";
import { useEffect, useState, useRef } from "react";
import { ReactComponent as SettingsIcon } from "../../assets/svg/settings.svg";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

export default function Tabs({
  tabValues,
  colLg,
  activeTabId,
  onTabChange,
  maintenanceTabWidth,
  settingMaintenance,
  settingsIcon,
  notShowChild,
}) {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(activeTabId || tabValues[0].id);
  const isMatainencePage = location.pathname === "/maintainence";
  const [showScrollArrows, setShowScrollArrows] = useState(false);
  const tabNavRef = useRef(null);
  const { isCollapsed, isPropertyBarCollapsed, windowDimension } =
    usePropertyContextCheck();
  const isFirstRender = useRef(true);

  const setLocalStorage = (clickTab) => {
    localStorage.setItem("activeTabSettingMaintenance", clickTab);
  };

  const scrollTabs = (direction) => {
    if (tabNavRef.current) {
      const scrollAmount = direction === "left" ? -100 : 100;
      tabNavRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const checkOverflow = (sidebarCollapse) => {
    if (sidebarCollapse) {
      setTimeout(() => {
        if (tabNavRef.current) {
          setShowScrollArrows(
            tabNavRef.current.scrollWidth > tabNavRef.current.clientWidth
          );
        }
      }, 300);
    } else {
      isFirstRender.current = false;
      if (tabNavRef.current) {
        setShowScrollArrows(
          tabNavRef.current.scrollWidth > tabNavRef.current.clientWidth
        );
      }
    }
  };

  useEffect(() => {
    if (activeTabId) {
      setActiveTab(activeTabId);
    }
  }, [activeTabId]);

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [tabValues]);
  useEffect(() => {
    !isFirstRender.current && checkOverflow(true);
  }, [isCollapsed, isPropertyBarCollapsed]);
  return (
    <Tab.Container
      defaultActiveKey={activeTabId || tabValues[0].id}
      onSelect={(id) => {
        setActiveTab(id);
        onTabChange && onTabChange(id);
      }}
    >
      <Row>
        <Col lg={colLg ? colLg : maintenanceTabWidth ? 12 : 11}>
          <div style={{ display: "flex", width: "100%" }}>
            <div
              className="tab-scroll-wrapper"
              style={{
                width: isMatainencePage
                  ? windowDimension > 1300
                    ? "820px"
                    : "82%"
                  : "100%",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                }}
              >
                {/* Left Arrow */}
                {showScrollArrows && (
                  <button
                    className="scroll-arrow left-arrow"
                    onClick={() => scrollTabs("left")}
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>
                )}
                <Nav
                  fill
                  className={`text-white d-flex tab-container-items`}
                  ref={tabNavRef}
                  style={{
                    gap: "3px",
                    display: "flex",
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    whiteSpace: "nowrap",
                    flexWrap: "nowrap",
                    scrollbarWidth: "none", // For Firefox
                  }}
                >
                  {tabValues.map(
                    ({ name, id, ifCon = true }, i) =>
                      ifCon && (
                        <Nav.Item key={i} className="property_tabs">
                          <Nav.Link
                            eventKey={id}
                            style={{
                              borderRadius: "10px 10px 0px 0px",
                              border: "1px solid #2e3650",
                              borderBottom: "0px",
                              background:
                                activeTab === id ? "#f5f8fb" : "#2e3650",
                              color: activeTab === id ? "#2e3650" : "#f5f8fb",
                              padding: "10px 15px",
                              flex: "0 0 auto",
                            }}
                            className="py-3 mb-sm-3 mb-md-0 property_tabs"
                            onClick={
                              settingMaintenance
                                ? () => setLocalStorage(id)
                                : undefined
                            }
                          >
                            {name}
                          </Nav.Link>
                        </Nav.Item>
                      )
                  )}
                </Nav>
                {/* Right Arrow */}
                {showScrollArrows && (
                  <button
                    className="scroll-arrow right-arrow"
                    onClick={() => scrollTabs("right")}
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                )}
              </div>
            </div>

            {isMatainencePage && settingsIcon && (
              <div
                className="settings-wrapper cursor-pointer"
                onClick={() => {
                  history.push("/datasetting/maintenance");
                }}
              >
                <SettingsIcon />
                <p>{t("data_settings.settings")}</p>
              </div>
            )}
          </div>
          {!notShowChild && (
            <Tab.Content>
              {tabValues.map(
                ({ ifCon = true, Component, props, id }, i) =>
                  ifCon && (
                    <Tab.Pane
                      style={{ overflowX: "visible" }}
                      eventKey={id}
                      className="py-4 tab-panel"
                      key={id}
                    >
                      <Component {...props} />
                    </Tab.Pane>
                  )
              )}
            </Tab.Content>
          )}
        </Col>
      </Row>
    </Tab.Container>
  );
}
