import useFetch from "../hooks/useFetch";

function getToken() {
  if (localStorage.getItem("token")) {
    const token = JSON.parse(localStorage.getItem("token") || "");
    return token;
  }
  return "";
}

export const GetSinglePlanningByPlanningCode = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/plannings/property_code/${id}`,
    options,
    dependencies
  );
};
export const GetSinglePlanningByPlanningId = (id, options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/plannings/${id}`,
    options,
    dependencies
  );
};
export const DeletePlanningById = async (id, options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/plannings/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};
export const BulkDeletePlanning = async (options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/plannings/bulk-delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ ids: options }),
  });
};

export const EditPlanningById = async (id, options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/plannings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};

export const CreateNewPlanning = async (options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/plannings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};

export const CreateNewPlannings = async (options) => {
  return await fetch(`${process.env.REACT_APP_BACKEND}/plannings/multiple`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...options,
  });
};

export const FilterPlanning = async (options, query = "") => {
  return await fetch(
    `${process.env.REACT_APP_BACKEND}/planning_component/maintainance/overview/filter` +
      query,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      ...options,
    }
  );
};

export const FilterAnalysis = async (options, query = "") => {
  const user = JSON.parse(localStorage.getItem("user"));

  return await fetch(
    `${process.env.REACT_APP_BACKEND}/planning_component/maintainance/analysis/${user?._id}` +
      query,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      ...options,
    }
  );
};

export const FilterSupervisionPlanning = async (options, query = "") => {
  return await fetch(
    `${process.env.REACT_APP_BACKEND}/components/supervison-filter` + query,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      ...options,
    }
  );
};

export const GetFilters = (options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/planning_component/maintainance/overview/filter`,
    options,
    dependencies
  );
};

export const GetAllProperties = (options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/properties/`,
    options,
    dependencies
  );
};

export const GetSupervisionFilters = (options, dependencies) => {
  return useFetch(
    `${process.env.REACT_APP_BACKEND}/planning_component/maintainance/overview/supervision-planning/filter`,
    options,
    dependencies
  );
};

export const EditManyPlanning = async (options, query = "") => {
  return await fetch(
    `${process.env.REACT_APP_BACKEND}/planning_component/maintainance/edit-many` +
      query,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      ...options,
    }
  );
};

// filter activites per Year
export const FilterActivitesYear = async (options, query = "") => {
  return await fetch(
    `${process.env.REACT_APP_BACKEND}/planning_component/maintainance/activitesPerYear` +
      query,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      ...options,
    }
  );
};

export const FilterReportesPerType = async (options, query = "") => {
  return await fetch(
    `${process.env.REACT_APP_BACKEND}/planning_component/maintainance/activitesPertype` +
      query,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      ...options,
    }
  );
};

export const SortPlanning = async (id, options, query = "") => {
  return await fetch(
    `${process.env.REACT_APP_BACKEND}/planning_component/maintainance/sort/${id}` +
      query,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      ...options,
    }
  );
};
