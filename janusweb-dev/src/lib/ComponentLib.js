import useFetch from "../hooks/useFetch";
import { getToken } from "./utils/utils";

export const GetAllComponents = () => {
  return useFetch(`${process.env.REACT_APP_BACKEND}/components`);
};
export const GetSingleComponentByBuildingId = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/components/${id}`,
    options,
    dependencies
  );
};
export const GetSingleComponentByComponentCode = (
  id,
  options,
  dependencies
) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/components/component/${id}`,
    options,
    dependencies
  );
};
export const GetSingleComponentByComponentId = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/components/component-id/${id}`,
    options,
    dependencies
  );
};
export const DeleteComponentById = async (id, options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/components/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
export const EditComponentById = async (id, options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/components/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};

export const CreateNewComponent = async (options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/components/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
