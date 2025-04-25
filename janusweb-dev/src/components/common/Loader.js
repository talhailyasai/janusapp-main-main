import React from "react";
import { RotatingLines } from "react-loader-spinner";
const Loader = ({ style }) => {
  return (
    // <div className="d-flex justify-content-center align-items-center spinner-wrapper">
    //   <div className="spinner-border text-primary" role="status">
    //     <span className="sr-only">Loading...</span>
    //   </div>
    // </div>
    <div className="component_loader" style={style}>
      <RotatingLines
        strokeColor="rgb(53, 199, 251)"
        strokeWidth="5"
        animationDuration="0.75"
        width="60"
        visible={true}
      />
    </div>
  );
};

export default Loader;
