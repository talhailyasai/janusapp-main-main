import React, { useEffect, useState } from "react";
import MultiSelectDropdown from "../../../components/common/MultiSelectDropdown";
import { useTranslation } from "react-i18next";
import { GetSupervisionFilters } from "lib/PlanningLib";
import Loader from "../../../components/common/Loader";
import api from "api";

const Filter = ({ filterValues, setFilterValues, handleFindClick }) => {
  const { value: allFilters } = GetSupervisionFilters();

  const [showFilters, setShowFilters] = useState(false);
  const [responsibleUser, setResponsibleUser] = useState([]);
  const [allProperties, setAllProperties] = useState([]);

  const { t } = useTranslation();

  const getAllUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let allresponsibleUser = await api.get(`/users/adminId/${user?._id}`);
      setResponsibleUser(allresponsibleUser?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProperty = async () => {
    try {
      let allProperties = await api.get(`/properties`);
      setAllProperties(allProperties?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUser();
    getAllProperty();
  }, []);

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (name, value) => {
    //debugger;
    setFilterValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleDeleteFilter = (valueToDelete) => {
    Object.keys(filterValues).forEach((key) => {
      if (Array.isArray(filterValues[key])) {
        const index = filterValues[key].indexOf(valueToDelete);
        if (index !== -1) {
          setFilterValues((prevObject) => ({
            ...prevObject,
            [key]: prevObject[key].filter((item, i) => i !== index),
          }));
        }
      }
    });
  };
  const filterAnimation = {
    maxHeight: showFilters ? "500px" : "0",
    opacity: showFilters ? "1" : "0",
    visibility: showFilters ? "visible" : "hidden",
    transition: "max-height 0.5s ease-out, opacity 0.5s ease-out",
  };

  // if (!allFilters) return <Loader />;

  return (
    <div className="mb-5">
      <div className="row planning_row">
        <div className="col-md-12 d-flex align-items-center planning_filter_main">
          <button
            onClick={handleFilterClick}
            style={{
              borderRadius: "3px",
              border: "1px solid #35C7FB",
            }}
            className="btn bg-primary py-2 text-white planning_filter_btn"
          >
            <div className="py-1 d-flex align-items-center justify-content-between">
              <span class="material-symbols-outlined planning_filter_icon">
                filter_list
              </span>
              <span className="planning_filter_name">
                {t("planning_page.filter")}
              </span>
              <span class="material-symbols-outlined planning_filter_icon">
                expand_more
              </span>
            </div>
          </button>
          <div className="form-group filter_select_main">
            <div
              className="form-control py-1 px-2 w-100 d-flex scrollBar-hidden planning_user_filter_main"
              style={{
                maxHeight: "50px",
                overflowX: "auto",
                overflowY: "hidden",
              }}
            >
              {Object.values(filterValues).every((arr) => arr.length === 0) ? (
                <span
                  style={{
                    fontSize: "16px",
                    display: "block",
                    border: "1px solid #35C7FB",
                  }}
                  className="badge badge-pill badge-primary mr-1 bg-primary text-white mx-2 py-2 my-1 planning_filter_select"
                >
                  {t("planning_page.no_filters_selected")}
                </span>
              ) : (
                [
                  ...Object.values(filterValues).filter(Array.isArray).flat(),
                ].map((item) => (
                  <span
                    style={{
                      fontSize: "16px",
                      display: "block",
                      border: "1px solid #35C7FB",
                    }}
                    className="badge badge-pill badge-primary mr-1 bg-primary text-white mx-2 py-2 my-1 planning_user_filter"
                  >
                    {item} &nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDeleteFilter(item)}
                    >
                      x
                    </span>
                  </span>
                ))
              )}
            </div>
          </div>

          <button
            onClick={handleFindClick}
            className="btn btn-secondary text-white rounded-pill px-4 py-2 planning_filter_find_btn"
          >
            {t("planning_page.find")}
          </button>
        </div>
      </div>

      <div className={`row planning_row`} style={filterAnimation}>
        <div
          className="mt-2 d-flex planning_users_main"
          style={{ gap: "60px", justifyContent: "start" }}
        >
          <div className="d-flex flex-column">
            <MultiSelectDropdown
              options={responsibleUser?.map((item) => ({
                label: item?.email?.toLowerCase(),
                id: item?.email?.toLowerCase(),
              }))}
              selectedOptions={filterValues.responsible_user}
              name="responsible_user"
              onSelectionChange={handleFilterChange}
              placeholder={t("common.pages.user")}
            />
          </div>
          {/* Error Start Below Div */}
          <div className="d-flex flex-column">
            <MultiSelectDropdown
              options={allProperties?.map((item) => ({
                label: item?.name,
                id: item?.property_code,
              }))}
              selectedOptions={filterValues.properties}
              name="property_code"
              placeholder={t("common.sidebar.properties")}
              onSelectionChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
