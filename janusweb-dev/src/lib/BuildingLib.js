import useFetch from "../hooks/useFetch";
import { getToken } from "./utils/utils";

export const GetAllBuildings = () => {
  return useFetch(`${process.env.REACT_APP_BACKEND}/buildings`);
};
export const GetSingleBuildingByPropertyCode = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/buildings/${id}`,
    options,
    dependencies
  );
};
export const GetSingleBuildingByBuildingCode = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/buildings/building-code/${id}`,
    options,
    dependencies
  );
};
export const GetSingleBuildingByBuildingId = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/buildings/building-id/${id}`,
    options,
    dependencies
  );
};
export const DeleteBuildingById = async (id, options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/buildings/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
export const EditBuildingById = async (id, options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/buildings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
export const CreateNewBuilding = async (options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/buildings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
