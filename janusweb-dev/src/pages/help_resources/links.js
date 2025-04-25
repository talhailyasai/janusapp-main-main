import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import "./style.css";
import { t } from "i18next";

const Links = () => {
  const links = [
    {
      title: "Så här fungerar Janus",
      path: "/help-resources/how-it-works",
    },
    {
      title: "Fastighetsregister",
      path: "/help-resources/property-register",
    },
    {
      title: "Underhållsplanering",
      path: "/help-resources/maintenance-planning",
    },
    {
      title: "Rondering",
      path: "/help-resources/super-vision",
    },
    {
      title: "Mobilapp för rondering",
      path: "/help-resources/mobileapp",
    },
    {
      title: "Datainställningar",
      path: "/help-resources/data-setting",
    },
    {
      title: "Användarkonton",
      path: "/help-resources/user-accounts",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="help-page-wrapper">
        <div className="help-links">
          <h2 className="header">Börja använda Janus</h2>
          <div className="links-grid">
            {links.map((link, index) => (
              <Link key={index} to={link.path} className="link-item">
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Links;
