import useFetch from "../hooks/useFetch";
import { getToken } from "./utils/utils";

export const GetAllMaintaincePackages = () => {
  return useFetch(`${process.env.REACT_APP_BACKEND}/maintaince_packages`);
};

export const GetAllUniqueMaintaincePackages = () => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/maintaince_packages/unique`
  );
};

export const GetMaintaincePackageByPackageName = (
  id,
  options,
  dependencies
) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/maintaince_packages/name/${id}`,
    options,
    dependencies
  );
};
export const DeleteMaintaincePackageById = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/maintaince_packages/${id}`,
    { ...options, method: "DELETE" },
    dependencies
  );
};
export const EditMaintaincePackageById = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/maintaince_packages/${id}`,
    { ...options, method: "PUT" },
    dependencies
  );
};

export const CreateNewMaintaincePackage = async (options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/maintaince_packages/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
