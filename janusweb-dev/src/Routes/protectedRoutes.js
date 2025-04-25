import React from "react";
import SignIn from "pages/Signin";
import Dashboard from "pages/Dashboard/Dashboard";
import { useHistory, useLocation } from "react-router-dom";
import SignUp from "pages/Signup";
import Property from "pages/Property";
import LandingPage from "pages/LandingPage/LandingPage";
import OnBoarding from "pages/OnBoarding/OnBoarding";
import HomePage from "pages/HomePage";
import UserAccountsPage from "pages/UserAccounts";
import PricingPlan from "pages/PricingPlan/PricingPlan";
import SuperVisionOnboardingPage from "pages/SupervisionOnBoarding/SuperVisionOnboardingPage";
import { SupervisionOnboardingWrapper } from "pages/SupervisionOnBoarding/SupervisionOnboardingWrapper";

function ProtectedRoute({ children }) {
  const token = JSON.parse(localStorage.getItem("token"));

  const user = JSON.parse(localStorage.getItem("user"));

  if (token) {
    return <Dashboard />;
  }
  return children;
}

function ProtectedAuthRoute(children) {
  const location = useLocation();
  let hostname = window.location.hostname;
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));

  let landingDomain = "dinunderhallsplan.se";
  let appDomain = "app.dinunderhallsplan.se";
  // console.log("hostname", hostname)
  // console.log("user?.isFirstLogin", user?.isFirstLogin);

  let path = location?.pathname;
  if (
    hostname === landingDomain ||
    (hostname !== landingDomain &&
      hostname !== appDomain &&
      location?.pathname == "/" &&
      !token)
  ) {
    return LandingPage;
  } else if (
    token &&
    !user?.isFirstLogin &&
    user?.plan === "Under Notice" &&
    user?.role !== "user"
  ) {
    return PricingPlan;
  } else if (
    token &&
    !user?.isFirstLogin &&
    (user.plan === "Standard Plus" || user.canceledPlan === "Standard Plus")
  ) {
    return SupervisionOnboardingWrapper;
  } else if (token && !user?.isFirstLogin) {
    return OnBoarding;
  } else if (
    (path == "/onboarding" || path.includes("user-onboarding")) &&
    user?.isFirstLogin
  ) {
    return Dashboard;
  } else if (hostname !== landingDomain && location?.pathname == "/" && token) {
    return Dashboard;
  } else if (!token && location?.pathname !== "/sign-up") {
    return SignIn;
  } else if (!token && location?.pathname == "/sign-up") {
    return SignUp;
  } else if (
    token &&
    (location?.pathname === "/sign-in" || location?.pathname === "/sign-up")
  ) {
    return Dashboard;
  }

  return children;
}

// let publicRoutes = ["SignIn", "SignUp", "ForgotPassword", "ResetPassword"];
let publicRoutes = ["/sign-in", "/sign-up", "ForgotPassword", "ResetPassword"];

export { ProtectedRoute, ProtectedAuthRoute, publicRoutes };
