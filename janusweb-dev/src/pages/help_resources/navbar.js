import { Image } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import Logo from "../../assets/img/janus.png";
import { t } from "i18next";
import "./style.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="help-resources-navBar">
      <Image src={Logo} className="navLogo" />

      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Nav links - will be shown/hidden on mobile */}
      <div className={`nav-links ${isMenuOpen ? "show" : ""}`}>
        <div>
          <Link to={"/help-resources"}>{t("common.pages.Help Resources")}</Link>
        </div>
        <div className="link">
          <Link to={`/help-resources-articles`}>
            {t("common.pages.Articles")}
          </Link>
        </div>
        <div className="link">
          <Link to={"/help-resources/video-handler"}>
            {t("common.pages.Video tutorials")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
