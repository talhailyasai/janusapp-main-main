import React, { useEffect, useState } from "react";
import DeleteModal from "components/common/Modals/DeleteModal";
import {
  BulkDeletePlanning,
  DeletePlanningById,
  FilterPlanning,
} from "lib/PlanningLib";
import { ModalRoot, ModalService } from "components/common/Modal";
import CheckboxTable from "components/common/CheckboxTable";
import { useTranslation } from "react-i18next";
import Filter from "components/common/Filter";
import { useLocation } from "react-router-dom";
import api from "api";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import Loader from "components/common/Loader";
import { usePlanningContextCheck } from "context/SidebarContext/PlanningContextCheck";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { OverlayTrigger, Tooltip } from "@themesberg/react-bootstrap";

const Overview = ({
  deleteItem,
  handleSortClick,
  sort,
  handleChangeAction,
  selectCreateEditPlan,
}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const currentYear = queryParams.get("currentYear");
  const System = queryParams.get("u_system");

  const { t } = useTranslation();

  const [checkedRows, setCheckedRows] = useState(() => []);
  const [data, setData] = useState();
  const [reload, setReload] = useState(true);

  const [filterValues, setFilterValues] = useState({});
  const [filterLoading, setFilterLoading] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setReloadCreateEdit } = usePlanningContextCheck();
  const { currentTab, windowDimension, isCollapsed } =
    usePropertyContextCheck();
  // useEffect(() => {
  //   if (currentYear && System) {
  //     handleQueryData();
  //   } else {
  //     handlePageChange(1, 100);
  //   }
  //   setReload(false);
  // }, [reload]);
  useEffect(() => {
    if (deleteItem && currentTab === "overview") {
      if (checkedRows.length > 0) {
        ModalService.open(DeleteModal, {
          type: t("planning_page.maintenance_item"),
          handleDelete: async () => {
            await handleDeleteItems(checkedRows);
          },
          handleClose: () => {
            handleChangeAction(null);
          },
        });
      } else {
        toast(t("planning_page.please_select_at_least_one_item_to_perform"), {
          type: "error",
        });
        handleChangeAction(null);
      }
    }
  }, [deleteItem]);

  const handleCheckRows = (id) => {
    if (id === "all" || id === "none") {
      if (id === "all") {
        setCheckedRows(data?.data.map((item) => item._id));
      } else {
        setCheckedRows([]);
      }
    } else {
      const findId = checkedRows.find((item) => item === id);

      if (!findId) {
        setCheckedRows([...checkedRows, id]);
        return;
      }
      setCheckedRows([...checkedRows.filter((item) => item !== id)]);
      return;
    }
  };
  const handleDeleteItems = async (checkedRows) => {
    if (checkedRows.length > 0) {
      // for (let index = 0; index < checkedRows.length; index++) {
      //   const item = checkedRows[index];
      //   await DeletePlanningById(item);
      // }
      await BulkDeletePlanning(checkedRows);
      setCheckedRows([]);
      setReload(true);
      setReloadCreateEdit(true);
    }
  };

  const handleFindClick = async (initialFilters) => {
    setLoading(true);

    // perform find logic using filterValues
    try {
      const hasValues =
        initialFilters &&
        typeof initialFilters === "object" &&
        initialFilters?.start_year;
      const res = await FilterPlanning({
        body: JSON.stringify(hasValues ? initialFilters : filterValues),
      });
      const newData = await res.json();
      setData(newData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handlePageChange = async (currentPage, limit, id, order) => {
    const { order: sortOrder, id: sortId } = sort;
    const res = await FilterPlanning(
      {
        body: JSON.stringify(filterValues),
      },
      "?page=" +
        currentPage +
        "&limit=" +
        limit +
        `&sort=${(id || order || sortId || sortOrder) && true}&order=${
          order || sortOrder
        }&id=${id || sortId}`
    );
    const newData = await res.json();
    setData(newData);
  };

  const handleQueryData = async () => {
    const data = { currentYear, System };
    let newData = await api.post(
      "/planning_component/maintainance/overview/custom",
      data
    );
    setData(newData);
  };

  const handleCheckRow = (id) => {
    if (id === "all") {
      if (checkedRows.length === data?.data?.length) {
        setCheckedRows([]);
        if (handleCheckRows) handleCheckRows("none");
      } else {
        setCheckedRows(data?.data?.map((item) => item.id));
        if (handleCheckRows) handleCheckRows("all");
      }
    } else {
      if (checkedRows.includes(id)) {
        setCheckedRows(checkedRows.filter((checkedId) => checkedId !== id));
      } else {
        setCheckedRows([...checkedRows, id]);
      }
      if (handleCheckRows) handleCheckRows(id);
    }
  };

  const truncateHeader = (text, key) => {
    if (key === "price_per_unit") {
      if (windowDimension >= 1920) {
        return text;
      }
    } else if (windowDimension >= 1680) {
      return text;
    }
    return text?.length > 5 ? `${text?.substring(0, 5)}...` : text;
  };

  const getColumnWidth = (defaultWidth, key) => {
    if (windowDimension >= 2880) {
      return "auto";
    }
    if (windowDimension >= 2420) {
      return `${defaultWidth + 90}px`;
    } else if (
      windowDimension >= 1920 &&
      isCollapsed &&
      (key === "maintenance_activity" || key === "property_name")
    ) {
      return `${defaultWidth + 80}px`;
    } else if (windowDimension >= 1920) {
      return `${defaultWidth + 40}px`;
    } else if (windowDimension >= 1770) {
      return `${defaultWidth + 30}px`;
    } else if (windowDimension >= 1680 && isCollapsed) {
      return `${defaultWidth + 30}px`;
    } else if (windowDimension >= 1500 && isCollapsed) {
      if (key === "maintenance_activity" || key === "property_name") {
        return `${defaultWidth + 50}px`;
      }
      return `${defaultWidth + 20}px`;
    } else if (windowDimension >= 1580) {
      return `${defaultWidth + 12}px`;
    } else if (windowDimension >= 1500) {
      return `${defaultWidth + 6}px`;
    } else if (
      isCollapsed &&
      windowDimension >= 1400 &&
      (key === "maintenance_activity" || key === "property_name")
    ) {
      return `${defaultWidth + 30}px`;
    }
    return `${defaultWidth}px`;
  };

  const getMaxChars = (width) => {
    const truncateCharacters = Math.floor(width / 12);
    // console.log({ truncateCharacters });
    return truncateCharacters;
  };

  const overviewTableColumn = [
    {
      name: (
        <div className="form-check">
          <input
            onChange={() => {
              handleCheckRow("all");
            }}
            className="form-check-input create_edit_header_check"
            type="checkbox"
            value=""
            checked={data?.data?.every((item) =>
              checkedRows?.includes(item._id)
            )}
          />
        </div>
      ),
      cell: (row, index, column, id) => {
        return (
          <div>
            <input
              onChange={() => handleCheckRow(row._id)}
              className="form-check-input create_edit_header_check"
              type="checkbox"
              value=""
              checked={checkedRows.includes(row._id)}
              id={row._id}
              style={{ marginLeft: "0rem" }}
            />
          </div>
        );
      },
      width: "60px",
    },
    {
      name: (
        <OverlayTrigger
          overlay={<Tooltip>{t("common.pages.property")}</Tooltip>}
        >
          <span>{t("common.pages.property")}</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        const propertyName = row?.property_name || "-";
        const columnWidth = getColumnWidth(140, "property_name");
        const maxChars =
          columnWidth === "auto" ? 20 : getMaxChars(parseInt(columnWidth));
        const truncatedText =
          propertyName.length > maxChars
            ? `${propertyName.substring(0, maxChars)}`
            : propertyName;

        return (
          <OverlayTrigger overlay={<Tooltip>{propertyName}</Tooltip>}>
            <span>{truncatedText}</span>
          </OverlayTrigger>
        );
      },
      sortable: true,
      selector: (row) => row?.property_name || "",
      minWidth: getColumnWidth(140, "property_name"),
    },
    {
      name: (
        <OverlayTrigger
          overlay={<Tooltip>{t("common.pages.building")}</Tooltip>}
        >
          <span>{t("common.pages.building")}</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        return (
          <span
            onClick={() => {
              selectCreateEditPlan();
              const currentUrl = new URL(window.location);
              currentUrl.searchParams.set("plan_id", row._id);
              currentUrl.searchParams.set("build_code", row.building_code);
              currentUrl.searchParams.set("prop_id", row.property_code);
              window.history.pushState({}, "", currentUrl); // Update the browser URL
            }}
            className="planning_component_code"
          >
            {row.building_code || "-"}
          </span>
        );
      },
      selector: (row) => row.building_code || "",
      sortable: true,
      minWidth: getColumnWidth(85),
    },
    {
      name: (
        <OverlayTrigger overlay={<Tooltip>System</Tooltip>}>
          <span>System</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        return <span> {row.u_system || "-"} </span>;
      },
      minWidth: getColumnWidth(71),
      sortable: true,
      selector: (row) => row.u_system || "",
    },
    {
      name: (
        <OverlayTrigger
          overlay={<Tooltip>{t("planning_page.article_code")}</Tooltip>}
        >
          <span>{t("planning_page.article_code")}</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        const article = row?.article || "-";

        return (
          <OverlayTrigger overlay={<Tooltip>{article}</Tooltip>}>
            <span>{article}</span>
          </OverlayTrigger>
        );
      },
      selector: (row) => row?.article || "",
      minWidth: getColumnWidth(140),
      sortable: true,
    },
    {
      name: (
        <OverlayTrigger
          overlay={<Tooltip>{t("common.pages.Activity")}</Tooltip>}
        >
          <span>{t("common.pages.Activity")}</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        const activity = row.maintenance_activity || "-";
        const columnWidth = getColumnWidth(140, "maintenance_activity");
        const maxChars =
          columnWidth === "auto" ? 20 : getMaxChars(parseInt(columnWidth));
        const truncatedText =
          activity.length > maxChars
            ? `${activity.substring(0, maxChars)}`
            : activity;

        return (
          <OverlayTrigger overlay={<Tooltip>{activity}</Tooltip>}>
            <span>{truncatedText}</span>
          </OverlayTrigger>
        );
      },
      selector: (row) => row.maintenance_activity || "",
      minWidth: getColumnWidth(140, "maintenance_activity"),
      sortable: true,
    },
    {
      name: (
        <OverlayTrigger
          overlay={<Tooltip>{t("planning_page.start_year")}</Tooltip>}
        >
          <span>{truncateHeader(t("planning_page.start_year"))}</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        return <span> {row.start_year || "-"} </span>;
      },
      sortable: true,
      selector: (row) => parseInt(row.start_year) || 0,
      minWidth: getColumnWidth(75),
    },
    {
      name: (
        <OverlayTrigger
          overlay={<Tooltip>{t("planning_page.technical_life")}</Tooltip>}
        >
          <span>{truncateHeader(t("planning_page.technical_life"))}</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        return <span> {row.technical_life || "-"} </span>;
      },
      selector: (row) => parseInt(row.technical_life) || 0,
      minWidth: getColumnWidth(75),
      sortable: true,
    },
    {
      name: (
        <OverlayTrigger
          overlay={<Tooltip>{t("planning_page.previous_year")}</Tooltip>}
        >
          <span>{truncateHeader(t("planning_page.previous_year"))}</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        return <span> {row.previous_year || "-"} </span>;
      },
      sortable: true,
      minWidth: getColumnWidth(75),
      selector: (row) => parseInt(row.previous_year) || 0,
    },
    {
      name: (
        <OverlayTrigger overlay={<Tooltip>{t("planning_page.unit")}</Tooltip>}>
          <span>{truncateHeader(t("planning_page.unit"))}</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        return <span> {row.unit || "-"} </span>;
      },
      sortable: true,
      selector: (row) => row.unit || "",
      minWidth: getColumnWidth(61),
    },

    {
      name: (
        <OverlayTrigger
          overlay={<Tooltip>{t("planning_page.price_per_unit")}</Tooltip>}
        >
          <span>
            {truncateHeader(
              t("planning_page.price_per_unit"),
              "price_per_unit"
            )}
          </span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        return <span>{row.price_per_unit || "-"}</span>;
      },
      sortable: true,
      selector: (row) => parseInt(row.price_per_unit) || 0,
      minWidth: getColumnWidth(75),
    },

    {
      name: (
        <OverlayTrigger
          overlay={<Tooltip>{t("planning_page.quantity")}</Tooltip>}
        >
          <span>{truncateHeader(t("planning_page.quantity"))}</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        return <span> {row.quantity || "-"} </span>;
      },
      sortable: true,
      selector: (row) => parseInt(row.quantity) || 0,
      minWidth: getColumnWidth(75),
    },

    {
      name: (
        <OverlayTrigger
          overlay={<Tooltip>{t("planning_page.total_cost")}</Tooltip>}
        >
          <span>{truncateHeader(t("planning_page.total_cost"))}</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        const cost =
          row.total_cost || (row.quantity || 0) * (row.price_per_unit || 0);
        return <span>{cost.toLocaleString()}</span>;
      },
      sortable: true,
      minWidth: getColumnWidth(75),
      selector: (row) => {
        return (
          row.total_cost || (row.quantity || 0) * (row.price_per_unit || 0)
        );
      },
    },
  ];
  useEffect(() => {
    if (!currentYear && !System) {
      handlePageChange(1, 100); // Default fetch
    }
    setReload(false);
  }, [reload, currentTab]);
  return (
    <>
      {deleteItem && <ModalRoot />}
      <Filter
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        handleFindClick={(initialFilters) => {
          handleFindClick(initialFilters);
        }}
        setFilterLoading={setFilterLoading}
      />
      {filterLoading &&
        (loading ? (
          <Loader />
        ) : (
          <DataTable
            data={data?.data}
            columns={overviewTableColumn}
            noDataComponent={t("common.pages.There are no records to display")}
            highlightOnHover
            responsive
            pagination
            className="create_edit_table overview_table"
            paginationComponentOptions={{
              rowsPerPageText: t("planning_page.rows_per_page"),
            }}
          />
        ))}
    </>
  );
};

export default Overview;
