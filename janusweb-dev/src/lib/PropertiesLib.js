import useFetch from "../hooks/useFetch";
import { getToken } from "./utils/utils";

export const GetAllProperties = (
  options,
  dependencies,
  isBuildingCodes,
  limit
) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/properties/?buildingCodes=${isBuildingCodes}&limit=${limit}`,
    options,
    dependencies
  );
};
export const GetSinglePropertyByLatitude = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/properties/${id}`,
    options,
    dependencies
  );
};
export const GetSinglePropertyByPropertyCode = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/properties/property-code/${id}`,
    options,
    dependencies
  );
};
export const GetSinglePropertyByPropertyId = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/properties/property-id/${id}`,
    options,
    dependencies
  );
};
export const DeletePropertyById = async (id, options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/properties/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
export const EditPropertyById = async (id, options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/properties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
export const CreateNewProperty = async (options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/properties/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};

export const GetAccountStats = (options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/onboarding/account-stats`,
    options,
    dependencies
  );
};

export const GetAllPropertyCodes = (options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/properties/all/codes`,
    options,
    dependencies
  );
};
