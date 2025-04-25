import React, { useEffect, useState } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { useTranslation } from "react-i18next";
import MultiRangeSlider from "./MultiRangeSlider";
import Loader from "./Loader";
import leafIcon from "../../assets/img/report/icon_leaf.png";
import moneyIcon from "../../assets/img/report/icon_money.png";
import projectIcon from "../../assets/img/report/icon_project.png";
import riskIcon from "../../assets/img/report/icon_risk major.png";
import searchIcon from "../../assets/img/report/icon_search.png";
import { GetFilters } from "lib/PlanningLib";
import { useLocation } from "react-router-dom";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

const Filter = ({
  filterValues,
  setFilterValues,
  handleFindClick,
  ImagesFiles,
  status,
  maintenanceAnalysis,
  setFilterLoading,
}) => {
  const { value: allFilters } = GetFilters();
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentYear = queryParams.get("currentYear");
  const System = queryParams.get("u_system");

  const { t } = useTranslation();
  const handleFilterClick = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    setFilterLoading && setFilterLoading(allFilters);
  }, [allFilters]);
  useEffect(() => {
    if (currentYear && System && allFilters) {
      const filteredUSystems = allFilters?.uSystems
        ?.filter((item) => item.startsWith(System))
        .map((item) => item.split(" ")[0]);
      const initialFilters = {
        start_year: [`${currentYear}-${parseInt(currentYear)}`],
        u_system: filteredUSystems,
      };

      setFilterValues(initialFilters);
      handleFindClick(initialFilters);
    }
  }, [allFilters]);
  const handleFilterChange = (name, value) => {
    setFilterValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleDeleteFilter = (valueToDelete) => {
    setFilterValues((prevValues) => {
      const updatedValues = { ...prevValues };

      Object.keys(updatedValues).forEach((key) => {
        if (Array.isArray(updatedValues[key])) {
          // Handle array values
          if (updatedValues[key].includes(valueToDelete)) {
            updatedValues[key] = updatedValues[key].filter(
              (item) => item !== valueToDelete
            );
          }
        } else {
          // Handle string values (startDate and endDate)
          if (updatedValues[key] === valueToDelete) {
            delete updatedValues[key]; // Remove the key from the object
          }
        }
      });

      return updatedValues;
    });
  };
  const filterAnimation = {
    maxHeight: showFilters ? "500px" : "0",
    opacity: showFilters ? "1" : "0",
    visibility: showFilters ? "visible" : "hidden",
    transition: "max-height 0.5s ease-out, opacity 0.5s ease-out",
  };

  const FlagArray = [
    { label: leafIcon, id: "energy_flag", value: t("planning_page.energy") },
    {
      label: moneyIcon,
      id: "invest_flag",
      value: t("planning_page.investment"),
    },
    {
      label: projectIcon,
      id: "project_flag",
      value: t("planning_page.project"),
    },
    { label: riskIcon, id: "risk_flag", value: t("planning_page.risk") },
    {
      label: searchIcon,
      id: "inspection_flag",
      value: t("planning_page.inspection"),
    },
  ];
  if (!allFilters) return <Loader />;

  const belong = [
    t("common.pages.home_property"),
    t("common.pages.building"),
    t("common.pages.component"),
    t("planning_page.Maintenance_Plan"),
    t("planning_page.activity"),
  ];

  const statusArray = ["Planerad", "Akut", "Eftersatt", "Beslutad", "UTFöRD"];
  return (
    <div className=" mb-5">
      <div className="row">
        <div className="col-md-12 d-flex align-items-center">
          <button
            onClick={handleFilterClick}
            style={{
              borderRadius: "3px",
              border: "1px solid #35C7FB",
            }}
            className="btn bg-primary py-2 text-white maintenace_filter_head_main"
          >
            <div className="py-1 d-flex align-items-center justify-content-between">
              <span
                class="material-symbols-outlined
              maintenance_filter_icon"
              >
                filter_list
              </span>
              <span className="maintenance_filter_head">
                {t("planning_page.filter")}
              </span>
              <span class="material-symbols-outlined maintenance_expand_icon">
                expand_more
              </span>
            </div>
          </button>
          <div className="form-group filter_select_main">
            <div
              className="form-control py-1 px-2 w-100 d-flex scrollBar-hidden filter_select_line"
              style={{
                height: "50px",
                overflowX: "auto",
                // width: "50vw",
                overflowY: "hidden",
              }}
            >
              {Object.values(filterValues).every((arr) => arr.length === 0) ? (
                <span
                  style={{
                    fontSize: "16px",
                    display: "block",
                    border: "1px solid #35C7FB",
                    maxWidth: "170px",
                  }}
                  className="badge badge-pill badge-primary mr-1 bg-primary text-white mx-2 py-2 my-1 maintenance_filter_head"
                >
                  {t("planning_page.no_filters_selected")}
                </span>
              ) : (
                [
                  ...Object.entries(filterValues).flatMap(([key, value]) =>
                    Array.isArray(value) ? value : [value]
                  ), // Convert non-array values into arrays
                ].map((item) => (
                  <span
                    style={{
                      fontSize: "16px",
                      display: "block",
                      border: "1px solid #35C7FB",
                    }}
                    className="badge badge-pill badge-primary mr-1 bg-primary text-white mx-2 py-2 my-1 maintenance_select_option"
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
            className="btn btn-secondary text-white rounded-pill mx-4 px-4 py-2 maintenance_find_btn"
          >
            {t("planning_page.find")}
          </button>
        </div>
      </div>
      <div className={`row`} style={filterAnimation}>
        <div
          className="mt-2 d-flex maintenance_filter_option"
          style={{ gap: "20px", justifyContent: "start" }}
        >
          <div className="d-flex flex-column">
            {/* <label>
              {" "}
              {ImagesFiles ? null : t("common.sidebar.properties")}
            </label> */}

            <MultiSelectDropdown
              options={allFilters?.property?.map((item) => ({
                label: item,
                id: item?.split(" ")[1],
              }))}
              selectedOptions={filterValues.properties}
              name="properties"
              placeholder={t("common.sidebar.properties")}
              onSelectionChange={handleFilterChange}
            />
          </div>
          {ImagesFiles ? (
            <>
              <div className="d-flex flex-column">
                <MultiSelectDropdown
                  options={belong?.map((item) => ({
                    label: item,
                    id: item,
                  }))}
                  selectedOptions={filterValues?.belongsTo}
                  name="belongsTo"
                  placeholder={t("common.pages.Belongs to")}
                  onSelectionChange={handleFilterChange}
                  // handleFilter={handleFilter}
                  // belongsTo={belongsTo}
                />
              </div>
              <div className="created_date_picker_main">
                <p style={{ marginBottom: "0rem" }}>
                  {t("common.pages.Created from")}
                </p>
                <input
                  type="date"
                  name="startDate"
                  placeholder="Select a Date"
                  value={filterValues.startDate || ""}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="filterCreatedDate"
                />
              </div>
              <div className="created_date_picker_main">
                <p style={{ marginBottom: "0rem" }}>
                  {t("common.pages.Created to")}
                </p>
                <input
                  type="date"
                  placeholder="Select a Date"
                  value={filterValues.endDate || ""}
                  name="endDate"
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="filterCreatedDate"
                />
              </div>
            </>
          ) : (
            <>
              <div className="d-flex flex-column">
                <MultiSelectDropdown
                  options={allFilters?.articles.map((item) => ({
                    label: item,
                    id: item.split(" ")[0],
                  }))}
                  selectedOptions={filterValues.article}
                  name="article"
                  onSelectionChange={handleFilterChange}
                  placeholder={t("planning_page.article_code")}
                />
              </div>
              <div className="d-flex flex-column">
                <MultiSelectDropdown
                  options={
                    maintenanceAnalysis
                      ? allFilters?.analysisUSystem?.map((item) => ({
                          label: item,
                          id: item.split(" ")[0],
                        }))
                      : allFilters?.uSystems.map((item) => ({
                          label: item,
                          id: item.split(" ")[0],
                        }))
                  }
                  name="u_system"
                  selectedOptions={filterValues.u_system}
                  onSelectionChange={handleFilterChange}
                  placeholder={t("planning_page.system_code")}
                />
              </div>
              <div className="d-flex flex-column">
                <MultiSelectDropdown
                  options={FlagArray?.map((item) => ({
                    label: (
                      <div
                        className="d-flex align-items-center justify-content-between"
                        style={{ width: "90px" }}
                      >
                        <img src={item?.label} alt="flag-icon" />
                        <span className="mx-2">{item.value}</span>
                      </div>
                    ),
                    id: item?.id,
                  }))}
                  name="flag"
                  // selectedOptions={FlagArray}
                  onSelectionChange={handleFilterChange}
                  placeholder={t("common.pages.select_flag")}
                  className="flag_dropdown"
                  searchInput={true}
                />
              </div>
              {/* Status */}
              {status && (
                <div className="d-flex flex-column">
                  <MultiSelectDropdown
                    options={statusArray?.map((item) => ({
                      label: item,
                      id: item,
                    }))}
                    selectedOptions={filterValues.status}
                    name="status"
                    onSelectionChange={handleFilterChange}
                    placeholder={t("planning_page.select_status")}
                  />
                </div>
              )}
              <div className="d-flex flex-column">
                <label>{t("planning_page.year_from")}:</label>
                <MultiRangeSlider
                  min={allFilters?.start_year.min}
                  max={allFilters?.start_year.max}
                  selectedOptions={filterValues.start_year}
                  name="start_year"
                  onChange={handleFilterChange}
                  placeholder="Enter year from"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
