import React from "react";
import { Image, Button } from "@themesberg/react-bootstrap";
import Logo from "../../../assets/img/hirez_revB_small.png";
import ProgressBar from "react-scroll-progress-bar";
import { useHistory } from "react-router-dom";

const LandingHeader = () => {
  const history = useHistory();

  const handleLogoClick = () => {
    history.push("/");
  };

  return (
    <>
      <div className="navBar landing_nav">
        <Image
          src={Logo}
          className="navLogo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        />
        <div className="navRight">
          <a
            href={`${process.env.REACT_APP_FRONT_END_URL}/sign-in`}
            target="_blank"
          >
            <h6 className="navLogin">Logga in</h6>
          </a>
          <a
            href={`${process.env.REACT_APP_FRONT_END_URL}/sign-up`}
            target="_blank"
          >
            <Button main className="navRegister navregTrans">
              Skapa konto
            </Button>
          </a>
        </div>
      </div>
      <div className="landing_progress_bar">
        <ProgressBar bgcolor="#36C6FB" style={{ top: "60px" }} />
      </div>
    </>
  );
};

export default LandingHeader;
