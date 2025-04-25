import React from "react";
import Navbar from "./navbar";
import image1 from "../../assets/img/help/img-card-1.svg";
import image2 from "../../assets/img/help/img-card-2.png";
import image3 from "../../assets/img/help/img-card-3.svg";
import { t } from "i18next";
import "./style.css";
import { useHistory } from "react-router-dom";

const Index = () => {
  const history = useHistory();

  const cards = [
    {
      image: image1,
      title: "common.pages.Getting started with Janus",
      path: "/help-resources-articles",
    },
    {
      image: image2,
      title: "common.pages.Video tutorials",
      path: "/help-resources/video-handler",
    },
    {
      image: image3,
      title: "common.pages.Navigating the Janus interface",
      path: "/help-resources/janus-interface",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="help-page-wrapper">
        <div className="help-main">
          <div className="header">
            {t("common.pages.Just started using the service? Start here.")}
          </div>
          <div className="help-cards">
            {cards.map((card, index) => (
              <div className="help-card" key={index}>
                <div className="help-card-image-wrapper">
                  <img
                    src={card.image}
                    alt={t(card.title)}
                    className="help-card-img"
                    onClick={() => history.push(card.path)}
                    loading="lazy"
                  />
                </div>
                <div className="help-card-title">{t(card.title)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
