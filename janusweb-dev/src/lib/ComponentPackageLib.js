import useFetch from "../hooks/useFetch";
import { getToken } from "./utils/utils";

export const GetAllComponentPackages = () => {
  return useFetch(`${process.env.REACT_APP_BACKEND}/component_package`);
};

export const GetAllUniqueComponentPackages = () => {
  return useFetch(`${process.env.REACT_APP_BACKEND}/component_package/unique`);
};

export const GetComponentPackageByPackageName = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/component_package/name/`,
    {
      ...options,
      method: "POST",
      body: JSON.stringify({ id }),
    },
    dependencies
  );
};
export const DeleteComponentPackageById = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/component_package/${id}`,
    { ...options, method: "DELETE" },
    dependencies
  );
};
export const EditComponentPackageById = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/component_package/${id}`,
    { ...options, method: "PUT" },
    dependencies
  );
};

export const CreateNewComponentPackage = async (options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/component_package/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
