import React from "react";
import ImagesFiles from "./ImagesFiles";

const ImagesFilesPage = ({ imagesfiles, ...props }) => {
  return <div>{imagesfiles ? <ImagesFiles {...props} /> : null}</div>;
};

export default ImagesFilesPage;
