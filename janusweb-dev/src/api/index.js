import ReactDOM from "react-dom";
import axios from "axios";
import SignOutModal from "components/common/Modals/SignOutModal";
import React, { useState } from "react";
import { toast } from "react-toastify";
import i18n, { t } from "i18next"; // Add t to the import

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
});
console.log(
  "interceptor process.env.REACT_APP_BACKEND",
  process.env.REACT_APP_BACKEND,
  "process.env",
  process.env.REACT_APP_TEST_KEY
);

function getToken() {
  if (localStorage.getItem("token")) {
    const token = JSON.parse(localStorage.getItem("token") || "");
    return token;
  }
  return "";
}

api.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
  },
  (error) => {
    return error;
  }
);

let modalRendered = false;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("error in interceptor >>>>", error);
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      let token = localStorage.getItem("token");

      if (
        token &&
        !currentPath.includes("sign-in") &&
        !currentPath.includes("sign-up") &&
        !currentPath.includes("reset-password") &&
        (!token ? currentPath !== "/" : true)
      ) {
        if (token === "undefined") {
          localStorage.clear();
          window.location = "/sign-in";
          return;
        }
        modalRendered = true;

        const handleSignOut = async () => {
          try {
            const user = JSON.parse(localStorage.getItem("user"));

            if (user?.email) {
              // Call logout API
              await api.post("/auth/logout", {
                id: user._id,
              });
            }
            localStorage.clear();
            modalRendered = false;
            window.location = "/sign-in";
          } catch (error) {
            console.error(error);
          }
        };

        const closeModal = () => {
          modalRendered = false;
        };

        const modalRoot = document.getElementById("modal-root");
        if (!modalRoot) {
          const div = document.createElement("div");
          div.id = "modal-root";
          document.body.appendChild(div);
        }
        localStorage.removeItem("token");
        ReactDOM.render(
          <SignOutModal
            show={true}
            onHide={closeModal}
            onSignOut={handleSignOut}
          />,
          document.getElementById("modal-root")
        );
      }
    } else if (
      error.response?.data?.message &&
      !error.response?.data?.maxUser
    ) {
      if (
        typeof error?.response?.data?.message === "object" &&
        error?.response?.data?.message?.en &&
        error?.response?.data?.message?.sv
      ) {
        const currentLang = i18n.language;
        toast(
          error.response.data.message[currentLang] ||
            error.response.data.message.en,
          { type: "error" }
        );
      } else {
        toast(t(error?.response?.data?.message || "Internal Server Error"), {
          type: "error",
        });
      }
    } else if (error.response?.data) {
      if (
        typeof error.response?.data === "string" ||
        error.response?.data?.message
      ) {
        toast.error(t(error.response?.data?.message) || error.response?.data);
      } else {
        toast.error(
          t(error?.response.statusText) || t("Internal Server Error")
        );
      }
    } else if (error?.message) {
      toast.error(t(error?.message || "Internal Server Error"));
    } else if (error.response?.data?.error) {
      toast.error(t(error.response.data.error || t("Internal Server Error")));
    } else {
      toast.error(t("Internal Server Error"));
    }

    return error;
  }
);
export default api;
