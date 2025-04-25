import useFetch from "../hooks/useFetch";
import { getToken } from "./utils/utils";

export const GetSingleActivityByComponentCode = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/activities/${id}`,
    options,
    dependencies
  );
};

export const GetSingleActivityByActivityId = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/activities/activity-id/${id}`,
    options,
    dependencies
  );
};
export const DeleteActivityById = async (id, options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/activities/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
export const CreateNewActivity = async (options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/activities/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};

export const EditActivityById = async (id, options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/activities/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
