import useFetch from "../hooks/useFetch";
import { getToken } from "./utils/utils";

export const GetAllMaintainceItems = () => {
  return useFetch(`${process.env.REACT_APP_BACKEND}/maintaince_items`);
};

export const GetSingleMaintainceItemByArticleCode = (
  id,
  options,
  dependencies
) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/maintaince_items/search/${id}`,
    options,
    dependencies
  );
};
export const DeleteMaintainceItemById = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/maintaince_items/${id}`,
    { ...options, method: "DELETE" },
    dependencies
  );
};
export const EditMaintainceItemById = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/maintaince_items/${id}`,
    { ...options, method: "PUT" },
    dependencies
  );
};

export const CreateNewMaintainceItem = async (options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/maintaince_items/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
