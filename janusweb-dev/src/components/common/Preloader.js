import React from "react";
import { Image, Modal } from "@themesberg/react-bootstrap";

import ReactLogo from "../../assets/img/technologies/react-logo-transparent.svg";
import { RotatingLines } from "react-loader-spinner";

export default (props) => {
  const { show } = props;

  return (
    <div
      className={`preloader bg-soft flex-column justify-content-center align-items-center ${
        show ? "" : "show"
      }`}
    >
      {/* <Image
        // className="loader-element animate__animated animate__jackInTheBox"
        src={ReactLogo}
        height={40}
      /> */}
      <RotatingLines
        strokeColor="rgb(53, 199, 251)"
        strokeWidth="5"
        animationDuration="0.75"
        width="60"
        visible={true}
      />
    </div>
    // <Modal show={show} animation={false} centered className="screenLoader">
    //   <Modal.Body>
    // <RotatingLines
    //   strokeColor="rgb(53, 199, 251)"
    //   strokeWidth="5"
    //   animationDuration="0.75"
    //   width="60"
    //   visible={true}
    // />
    //   </Modal.Body>
    // </Modal>
  );
};
