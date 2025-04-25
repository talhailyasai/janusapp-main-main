import React, { useEffect, useState } from "react";
import Components from "../Components/Components";
import ComponentPackage from "../ComponentPackage/ComponentPackage";
import api from "api";
const SettingSupervision = ({ components, componentPackages, ...props }) => {
  const [componentPkgs, setComponentPkgs] = useState([]);

  const getAllComponentPackage = async () => {
    const res = await api.get("/components/datasettings/all");
    setComponentPkgs(res.data?.sort((a, b) => (a.order > b.order ? 1 : -1)));
  };

  useEffect(() => {
    getAllComponentPackage();
  }, []);
  return (
    <div>
      {components ? (
        <Components
          setComponentPkgs={setComponentPkgs}
          componentPkgs={componentPkgs}
        />
      ) : componentPackages ? (
        <ComponentPackage componentPkgs={componentPkgs} />
      ) : null}
    </div>
  );
};

export default SettingSupervision;
