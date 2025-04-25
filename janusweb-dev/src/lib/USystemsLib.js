import useFetch from "../hooks/useFetch";
import { getToken } from "./utils/utils";

export const GetAllUSystems = () => {
  return useFetch(`${process.env.REACT_APP_BACKEND}/u_systems`);
};

export const GetSearchUSystems = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/u_systems/search/${id}`,
    options,
    dependencies
  );
};

export const DeleteUSystemsById = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/u_systems/${id}`,
    { ...options, method: "DELETE" },
    dependencies
  );
};
export const EditUSystemsById = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/u_systems/${id}`,
    { ...options, method: "PUT" },
    dependencies
  );
};

export const CreateNewUSystems = async (options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/u_systems/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
