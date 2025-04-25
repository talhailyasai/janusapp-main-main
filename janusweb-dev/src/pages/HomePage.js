import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { Routes } from "../routes";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// pages

import Dashboard from "./Dashboard/Dashboard";

import NotFoundPage from "./NotFound";

import Property from "./Property";
import Profile from "./Profile";

import Maintaince from "./Maintaince";
import Inspection from "./Inspection";

import DataSetting from "./DataSetting/DataSetting";
import ImagesFiles from "./Images&Files/ImagesFilesTab";

import Signin from "./Signin";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

// components
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/common/Navbar";
import Preloader from "../components/common/Preloader";

// Context
import AppContextProvider from "../context/AppContext";
// protected Route
import {
  ProtectedAuthRoute,
  ProtectedRoute,
  publicRoutes,
} from "../Routes/protectedRoutes";
import Supervision from "../pages/Supervision/Supervision";
import UserAccounts from "./UserAccounts/UserAccounts";
import PricingPlan from "./PricingPlan/PricingPlan";
import SettingProperty from "./DataSetting/SettingProperty/SettingProperty";
import Index from "./DataSetting/SettingSupervision";
import api from "api";
import Import from "./Import/Import";
import LandingPage from "./LandingPage/LandingPage";
import { Button, Modal, Table } from "@themesberg/react-bootstrap";
import OnBoarding from "../pages/OnBoarding/OnBoarding";
import Processed from "../pages/OnBoarding/Step5/MaintenancePlan/Processed";
import CookieConsent from "react-cookie-consent";
import CookiePolicy from "./LandingPage/DestinationPages/CookiePolicy/CookiePolicy";
import HelpResources from "./help_resources/index";
import HelpResourcesArticles from "./help_resources/links";
import HowItWorks from "./help_resources/how-it-works";
import PropertyRegister from "./help_resources/property-register";
import MaintenancePlanning from "./help_resources/maintenance-planning";
import SuperVision from "./help_resources/superVision";
import MobileApp from "./help_resources/mobileapp";
import Data_Setting from "./help_resources/data-setting";
import User_Accounts from "./help_resources/user-accounts";
import VideoHandler from "./help_resources/video-handler";
import JanusInterface from "./help_resources/janus-interface";
import { t } from "i18next";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { useUserContext } from "context/SidebarContext/UserContext";
import SuperVisionOnboardingPage from "./SupervisionOnBoarding/SuperVisionOnboardingPage";
import { SupervisionOnboardingWrapper } from "./SupervisionOnBoarding/SupervisionOnboardingWrapper";
import PrivacyPolicy from "./LandingPage/DestinationPages/PrivacyPolicy/PrivacyPolicy";
import Om from "./LandingPage/DestinationPages/Om";
import Sakerhet from "./LandingPage/DestinationPages/Sakerhet";
import Affiliate from "./LandingPage/DestinationPages/Affiliate";
import Blogs from "./LandingPage/DestinationPages/Blogs";
import Features from "./LandingPage/DestinationPages/Features";
import Blog1 from "./LandingPage/DestinationPages/BlogsPages/Blog1";
import Blog2 from "./LandingPage/DestinationPages/BlogsPages/Blog2";
import Blog3 from "./LandingPage/DestinationPages/BlogsPages/Blog3";
import Blog4 from "./LandingPage/DestinationPages/BlogsPages/Blog4";
import Blog5 from "./LandingPage/DestinationPages/BlogsPages/Blog5";
import Blog6 from "./LandingPage/DestinationPages/BlogsPages/Blog6";
import TermsConditions from "./TermsAndConditions/TermsConditions";
import Terms from "./LandingPage/DestinationPages/Terms";
import JanusChatBot from "ChatBot/JanusChatBot";

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Route
        {...rest}
        render={(props) => (
          <>
            <Preloader show={loaded ? false : true} /> <Component {...props} />{" "}
          </>
        )}
      />
    </>
  );
};
const RouteWithoutLoader = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          <Component {...props} />
        </>
      )}
    />
  );
};

const RouteWithSidebar = ({ component: Component, user1, ...rest }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));

  const [loaded, setLoaded] = useState(false);
  const { isCollapsed, isPropertyBarCollapsed } = usePropertyContextCheck();
  // useEffect(() => {
  //   const timer = setTimeout(() => setLoaded(true), 1000);
  //   return () => clearTimeout(timer);
  // }, []);
  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          {/* <Preloader show={loaded ? false : true} /> */}
          {token && user?.isFirstLogin ? (
            // {!publicRoutes?.includes(rest?.path) ? (
            <>
              <Sidebar />
              <main
                className={`content ${
                  isCollapsed && isPropertyBarCollapsed
                    ? "content-collapsed"
                    : ""
                } ${
                  (window.location.pathname === "/property" ||
                    window.location.pathname === "/maintainence") &&
                  isCollapsed &&
                  !isPropertyBarCollapsed
                    ? "property-page-content"
                    : ""
                }
                 ${
                   (window.location.pathname === "/property" ||
                     window.location.pathname === "/maintainence") &&
                   isCollapsed &&
                   isPropertyBarCollapsed
                     ? "property-page-content-collapsed"
                     : ""
                 } ${
                  window.location.pathname === "/maintainence"
                    ? "maintenance-content"
                    : ""
                }`}
              >
                {" "}
                <Navbar />
                <Component {...props} />
              </main>
            </>
          ) : (
            <Component {...props} />
          )}
        </>
      )}
    />
  );
};

const HomePage = () => {
  const history = useHistory();
  // const [user, setUser] = useState(null);
  const [resUsers, setResUsers] = useState([]);
  const [show, setShow] = useState(false);
  const { setUser, user, setFetchResUsers, fetchResUsers } = useUserContext();
  console.log(
    "process.env.REACT_APP_BACKEND",
    process.env.REACT_APP_BACKEND,
    "process.env",
    process.env.REACT_APP_TEST_KEY
  );

  // {
  //   console.log("user?.isFirstLogin", user?.email);
  // }

  // const getUser = async () => {
  //   let userId = JSON.parse(localStorage.getItem("user"))?._id;
  //   try {
  //     if (userId) {
  //       let res = await api.get(`/users/${userId}`);
  //       console.log("resp", res);
  //       setUser(res?.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getResponsibleUsers = async () => {
    try {
      let userId = JSON.parse(localStorage.getItem("user"))?._id;
      if (userId || user?._id) {
        let res = await api.get(
          `/users/responsibleUser/${user?._id || userId}`
        );
        setResUsers(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getResponsibleUsers();
  }, [fetchResUsers]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    if (
      user &&
      (!user?.plan || user?.plan == "Under Notice") &&
      user?.role !== "user"
    ) {
      localStorage.setItem("userId", user?._id);
      if (!user?.cancelSubscriptionDate) {
        history.push("/pricing-plan");
      }
    }
  }, [user]);
  useEffect(() => {
    if (
      user &&
      (user?.plan || user?.plan !== "Under Notice") &&
      user?.maxUsers <= resUsers?.length &&
      window.location.pathname !== "/pricing-plan"
    ) {
      handleShow();
    }
    return () => {
      setResUsers([]);
    };
  }, [window.location.pathname, user]);

  const handleDelete = async (resUser) => {
    try {
      let res = await api.delete(`/users/delete/${resUser?._id}`);
      setFetchResUsers(!fetchResUsers);
      if (user?.maxUsers >= resUsers?.length) {
        handleClose();
        // window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getCustomerPortal = async () => {
    if (
      (user?.plan === "Standard Plus" ||
        user?.plan === "Standard" ||
        user?.cancelSubscriptionDate) &&
      !user?.trialEnd
    ) {
      let res = await api.get(`/stripe/getCustomerPortal/${user?._id}`);
      // console.log("res?.dat in myproleie", res?.data);
      handleClose();
      window.location = res?.data;
    } else {
      history.push("/pricing-plan");
    }
  };
  return (
    <>
      <Switch>
        <RouteWithSidebar
          exact
          path={Routes.LandingPage.path}
          component={ProtectedAuthRoute(LandingPage)}
        />
        <RouteWithoutLoader
          exact
          path={Routes.PrivacyPolicy.path}
          component={PrivacyPolicy}
        />
        <RouteWithoutLoader
          exact
          path={Routes.CookiePolicy.path}
          component={CookiePolicy}
        />
        <RouteWithoutLoader exact path={Routes.Terms.path} component={Terms} />
        <RouteWithoutLoader exact path={Routes.Om.path} component={Om} />
        <RouteWithoutLoader
          exact
          path={Routes.Sakerhet.path}
          component={Sakerhet}
        />
        <RouteWithoutLoader
          exact
          path={Routes.Affiliate.path}
          component={Affiliate}
        />
        <RouteWithoutLoader exact path={Routes.Blogs.path} component={Blogs} />
        <RouteWithoutLoader exact path={Routes.Blog1.path} component={Blog1} />
        <RouteWithoutLoader exact path={Routes.Blog2.path} component={Blog2} />
        <RouteWithoutLoader exact path={Routes.Blog3.path} component={Blog3} />
        <RouteWithoutLoader exact path={Routes.Blog4.path} component={Blog4} />
        <RouteWithoutLoader exact path={Routes.Blog5.path} component={Blog5} />
        <RouteWithoutLoader exact path={Routes.Blog6.path} component={Blog6} />
        <RouteWithoutLoader
          exact
          path={Routes.Features.path}
          component={Features}
        />
        <RouteWithoutLoader
          exact
          path={Routes.HelpResources.path}
          component={HelpResources}
        />
        <RouteWithoutLoader
          exact
          path={Routes.HelpResourcesArticles.path}
          component={HelpResourcesArticles}
        />
        <RouteWithoutLoader
          exact
          path={Routes.HowItWorks.path}
          component={HowItWorks}
        />
        <RouteWithoutLoader
          exact
          path={Routes.propertyRegister.path}
          component={PropertyRegister}
        />
        <RouteWithoutLoader
          exact
          path={Routes.superVision.path}
          component={SuperVision}
        />
        <RouteWithoutLoader
          exact
          path={Routes.maintenancePlanning.path}
          component={MaintenancePlanning}
        />
        <RouteWithoutLoader
          exact
          path={Routes.Processed.path}
          component={Processed}
        />
        <RouteWithoutLoader
          exact
          path={Routes.mobileApp.path}
          component={MobileApp}
        />
        <RouteWithoutLoader
          exact
          path={Routes.dataSetting.path}
          component={Data_Setting}
        />
        <RouteWithoutLoader
          exact
          path={Routes.userAccounts.path}
          component={User_Accounts}
        />
        <RouteWithoutLoader
          exact
          path={Routes.videoHandler.path}
          component={VideoHandler}
        />
        <RouteWithLoader
          exact
          path={Routes.janusInterface.path}
          component={JanusInterface}
        />
        <RouteWithSidebar
          exact
          path={Routes.OnBoarding.path}
          component={ProtectedAuthRoute(OnBoarding)}
          user={user}
        />
        <RouteWithSidebar
          exact
          user={user}
          path={Routes.SuperVisionOnboardingPage.path}
          component={ProtectedAuthRoute(SupervisionOnboardingWrapper)}
        />

        <RouteWithSidebar
          exact
          path={Routes.DashboardOverview.path}
          component={ProtectedAuthRoute(Dashboard)}
        />
        <RouteWithSidebar
          exact
          path={Routes.Property.path}
          component={ProtectedAuthRoute(Property)}
        />
        <RouteWithSidebar
          exact
          path={Routes.DataSetting.path}
          component={ProtectedAuthRoute(DataSetting)}
        />
        <RouteWithSidebar
          exact
          path={Routes.SettingProperty.path}
          component={ProtectedAuthRoute(SettingProperty)}
        />
        <RouteWithSidebar
          exact
          path={Routes.SettingSupervision.path}
          component={ProtectedAuthRoute(Index)}
        />
        <RouteWithSidebar
          exact
          path={Routes.Imports.path}
          component={ProtectedAuthRoute(Import)}
        />

        <RouteWithSidebar
          exact
          path={Routes.Inspection.path}
          component={ProtectedAuthRoute(Inspection)}
        />
        <RouteWithSidebar
          exact
          path={Routes.ImagesFiles.path}
          component={ProtectedAuthRoute(ImagesFiles)}
        />
        <RouteWithSidebar
          exact
          path={Routes.Supervision.path}
          component={ProtectedAuthRoute(Supervision)}
        />
        <RouteWithSidebar
          exact
          path={Routes.Maintainence.path}
          component={ProtectedAuthRoute(Maintaince)}
        />
        <RouteWithSidebar
          exact
          path={Routes.Profile.path}
          component={ProtectedAuthRoute(Profile)}
        />
        <RouteWithSidebar
          exact
          path={Routes.Signin.path}
          component={ProtectedAuthRoute(Signin)}
        />

        <RouteWithSidebar
          exact
          path={Routes.Pricing.path}
          component={PricingPlan}
        />
        <RouteWithSidebar
          exact
          path={Routes.Signup.path}
          component={ProtectedAuthRoute(Signup)}
        />
        <RouteWithSidebar
          exact
          path={Routes.UserAccounts.path}
          component={ProtectedAuthRoute(UserAccounts)}
        />
        <RouteWithSidebar
          exact
          path={Routes.ForgotPassword.path}
          component={ForgotPassword}
        />
        <RouteWithSidebar
          exact
          path={Routes.ResetPassword.path}
          component={ResetPassword}
        />
        <RouteWithLoader
          exact
          path={Routes.NotFound.path}
          component={NotFoundPage}
        />
        <Redirect to={Routes.NotFound.path} />
      </Switch>

      {/* // Modal */}
      <Modal show={show} onHide={handleShow} className="res_user_modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {t("common.pages.Allowed maximum Users")} {user?.maxUsers - 1}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="res_users_main">
            <Table bordered>
              <thead>
                <tr>
                  <th>{t("common.pages.Email")}</th>
                  <th>{t("planning_page.Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {resUsers?.map((user) => (
                  <tr>
                    <td>{user?.email}</td>
                    <td>
                      <span
                        class="material-symbols-outlined users_delete_icon"
                        onClick={() => handleDelete(user)}
                      >
                        delete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="update_btn_main">
            <Button
              variant="primary"
              onClick={getCustomerPortal}
              className="update_btn_change_plan mt-2"
            >
              {t("common.pages.update_plan")}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {user?._id && <JanusChatBot />}
    </>
  );
};

export default HomePage;
