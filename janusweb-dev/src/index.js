import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// core styles
import "./scss/volt.scss";

// vendor styles
import "react-datetime/css/react-datetime.css";

// i18n
import "./i18n";

import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/common/ScrollToTop";
import { Slide, ToastContainer } from "react-toastify";
import "./components/common/style.css";
import AppContextProvider from "context/AppContext";

ReactDOM.render(
  <BrowserRouter>
    <AppContextProvider>
      <ScrollToTop />
      <HomePage />
      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />
    </AppContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
