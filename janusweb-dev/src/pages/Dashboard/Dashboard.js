import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import DashboardGroup from "../../assets/img/pages/dashboard_group.png";
import DashboardSideBar from "../../assets/img/pages/dashboard_sidebar.png";
import Logo from "../../assets/img/pages/logo.png";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Col, Row } from "@themesberg/react-bootstrap";
import api from "api";
import { useUserContext } from "context/SidebarContext/UserContext";

const Dashboard = () => {
  const [dashboardPage, setDashboardPage] = useState(null);
  const history = useHistory();
  const { t } = useTranslation();
  // const [curUser, setCurUser] = useState(null);
  const { user: curUser } = useUserContext();

  // const getCurrentUser = async () => {
  //   try {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     let res = await api.get(`/users/${user?._id}`);
  //     setCurUser(res?.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const navigateToRoute = (route, tab) => {
    if (route === "maintainence") {
      localStorage.setItem("activeTabIdPlanningMaintainance", tab);
      history.push(`/${route}`);
    } else if (route === "supervision") {
      history.push(`/${route}?tab=${tab}`);
    } else if (route === "property" && tab === "main") {
      history.push(`/${route}`);
    } else if (route === "property" && tab === "addNewProperty") {
      history.push(`/${route}?tab=addNewProperty`);
    }
  };

  return (
    <div className="dashboard_main">
      <div className="dashboard">
        <div className="page_main">
          <div
            className={
              "dashboard_properties_main " +
              (dashboardPage === "maintenancePlan" && "active_dashboard_btn")
            }
            onClick={() => setDashboardPage("maintenancePlan")}
          >
            <div className="dashboard_icon_main">
              <span class="material-symbols-outlined dashboard_icon">
                construction
              </span>
            </div>
            <span className="dashboard_maintenance_heading">
              {t("planning_page.Maintenance_Plan")}
            </span>
          </div>
          {(curUser?.role != "user" &&
            (curUser?.plan === "Standard Plus" ||
              curUser?.canceledPlan === "Standard Plus")) ||
          (curUser?.role == "user" &&
            curUser?.Functions?.includes("supervision")) ? (
            <div
              className={
                "dashboard_properties_main " +
                (dashboardPage === "supervision" && "active_dashboard_btn")
              }
              onClick={() => setDashboardPage("supervision")}
            >
              <div className="dashboard_icon_main">
                <span class="material-symbols-outlined dashboard_icon">
                  checklist
                </span>
              </div>
              <span className="dashboard_maintenance_heading">
                {t("planning_page.Supervision")}
              </span>
            </div>
          ) : null}

          <div
            className={
              "dashboard_properties_main " +
              (dashboardPage === "properties" && "active_dashboard_btn")
            }
            onClick={() => setDashboardPage("properties")}
          >
            <div className="dashboard_icon_main">
              <span class="material-symbols-outlined dashboard_icon">
                home_work
              </span>
            </div>
            <span className="dashboard_maintenance_heading">
              {t("planning_page.Properties")}
            </span>
          </div>
        </div>
        <div className="page_text_main">
          {dashboardPage === "maintenancePlan" ? (
            // <div className="dashboard_maintenance_main">
            <Row style={{ width: "100%" }}>
              <Col>
                <div
                  className="dashboard_analysis_main"
                  onClick={() => navigateToRoute("maintainence", "analysis")}
                >
                  <div className="maintenance_plan_icon_main">
                    <span class="material-symbols-outlined analysis_icon">
                      bar_chart_4_bars
                    </span>
                  </div>
                  <p className="maintenance_analysis_heading">
                    {t("planning_page.analysis")}{" "}
                  </p>
                </div>
              </Col>
              <Col>
                <div
                  className="dashboard_analysis_main"
                  onClick={() => navigateToRoute("maintainence", "report")}
                >
                  <div className="maintenance_plan_icon_main">
                    <span class="material-symbols-outlined analysis_icon">
                      summarize
                    </span>
                  </div>
                  <p className="maintenance_analysis_heading">
                    {" "}
                    {t("planning_page.report")}{" "}
                  </p>
                </div>
              </Col>
            </Row>
          ) : // {/* </div> */}
          dashboardPage === "supervision" ? (
            // <div className="dashboard_maintenance_main">
            <Row style={{ width: "100%" }}>
              <Col>
                <div
                  className="dashboard_analysis_main"
                  onClick={() => navigateToRoute("supervision", "followUp")}
                >
                  <div className="maintenance_plan_icon_main">
                    <span class="material-symbols-outlined analysis_icon">
                      fmd_bad
                    </span>
                  </div>
                  <p className="maintenance_analysis_heading">
                    {t("common.pages.follow_up")}
                  </p>
                </div>
              </Col>
              <Col>
                <div
                  className="dashboard_analysis_main"
                  onClick={() => navigateToRoute("supervision", "analysis")}
                >
                  <div className="maintenance_plan_icon_main">
                    <span class="material-symbols-outlined analysis_icon">
                      readiness_score
                    </span>
                  </div>
                  <p className="maintenance_analysis_heading">
                    {t("planning_page.analysis")}
                  </p>
                </div>
              </Col>
            </Row>
          ) : // </div>
          dashboardPage === "properties" ? (
            // <div className="dashboard_maintenance_main">
            <Row style={{ width: "100%" }}>
              <Col>
                <div
                  className="dashboard_analysis_main"
                  onClick={() => navigateToRoute("property", "main")}
                >
                  <div className="maintenance_plan_icon_main">
                    <span class="material-symbols-outlined analysis_icon">
                      source_environment
                    </span>
                  </div>
                  <p className="maintenance_analysis_heading">
                    {t("property_page.your_properties")}
                  </p>
                </div>
              </Col>
              <Col>
                <div
                  className="dashboard_analysis_main dashboard_property"
                  onClick={() => navigateToRoute("property", "addNewProperty")}
                >
                  <div className="maintenance_plan_icon_main">
                    <span class="material-symbols-outlined analysis_icon">
                      add_home_work
                    </span>
                  </div>
                  <p className="maintenance_analysis_heading">
                    {t("property_page.add_new_property")}
                  </p>
                </div>
              </Col>
            </Row>
          ) : (
            // </div>
            <>
              <div className="dashboard_heading_main">
                <span className="dashboard_first_default_heading dashboard_group_img_main">
                  {t("planning_page.Choose_the_function")}
                </span>
                <div className="dashboard_group_img_main">
                  <img src={DashboardGroup} alt="chhose" />
                </div>
              </div>
              <div className="dashboard_heading_main dashboard_first_default_heading">
                {t("planning_page.or")}

                <div></div>
              </div>
              <div className="dashboard_sidebar_pic dashboard_heading_main">
                <span className="dashboard_first_default_heading dashboard_group_img_main">
                  {t("planning_page.navigate_from_the_side")}
                </span>
                <div className="dashboard_group_img_main">
                  <img src={DashboardSideBar} alt="DashboardSideBar" />
                </div>
              </div>
              <div className="dashboard_heading_main">
                <span className="dashboard_first_default_heading dashboard_group_img_main">
                  {t("planning_page.press_icon_logo_to_return_here")}
                </span>
                <div className="dashboard_group_img_main">
                  <img src={Logo} alt="Logo" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
