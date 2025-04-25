import React from "react";
import "./style.css";
import { useHistory } from "react-router-dom";
import Navbar from "./navbar";

const Index = () => {
  const history = useHistory();
  return (
    <>
      <Navbar />
      <div className="help-page-wrapper">
        <div className="how-it-works">
          <div className="crumb">
            <span onClick={() => history.push("/help-resources-articles")}>
              BÖRJA ANVÄNDA JANUS
            </span>{" "}
            : MOBILAPP FÖR RONDERING
          </div>
          <div className="header">Mobilapp</div>
        </div>
      </div>
    </>
  );
};

export default Index;
