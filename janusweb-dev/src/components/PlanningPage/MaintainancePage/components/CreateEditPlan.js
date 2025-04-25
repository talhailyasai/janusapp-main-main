import React, { useEffect, useState } from "react";
import NewItemSidePanel from "../SidePanels/NewItemSidePanel";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import DeleteModal from "components/common/Modals/DeleteModal";
import {
  BulkDeletePlanning,
  DeletePlanningById,
  FilterPlanning,
} from "lib/PlanningLib";
import NewPackageSidePanel from "../SidePanels/NewPackageSidePanel";
import { ModalRoot, ModalService } from "components/common/Modal";
import { GetSingleBuildingByBuildingCode } from "lib/BuildingLib";
import { usePlanningContextCheck } from "context/SidebarContext/PlanningContextCheck";
import CheckboxTable from "components/common/CheckboxTable";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import api from "api";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { OverlayTrigger, Tooltip } from "@themesberg/react-bootstrap";

const CreateEditPlan = ({
  singlePlanningData,
  newItem,
  handleChangeAction,
  deleteItem,
  modifyItem,
  newPackage,
  handleSortClick,
  sort,
  currentTab,
}) => {
  const [data, setData] = useState(singlePlanningData);
  const [checkedRows, setCheckedRows] = useState(() => []);
  const { t } = useTranslation();
  const { buildingChange, planningChange, setReloadCreateEdit } =
    usePlanningContextCheck();
  const {
    setSettingsFormData,
    settingsFormData,
    windowDimension,
    isCollapsed,
  } = usePropertyContextCheck();
  const { value: singleBuildingData } = GetSingleBuildingByBuildingCode(
    buildingChange,
    {},
    [buildingChange, planningChange, newPackage]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get("plan_id");
    if (planId) {
      setCheckedRows([planId]);
    }
  }, [window.location.search]);
  useEffect(() => {
    setData(singlePlanningData);
  }, [singlePlanningData]);

  useEffect(() => {
    if (newItem) {
      if (
        settingsFormData?.plan_duration &&
        settingsFormData?.plan_start_year
      ) {
        SidePanelService.open(NewItemSidePanel, {
          newItem: newItem,
          modifyItem: modifyItem,
          handleClose: () => {
            handleChangeAction(null);
          },
        });
      } else {
        toast.info(t("planning_page.maintenance_settings_missing"));
        handleChangeAction(null);
      }
    } else if (modifyItem) {
      if (checkedRows.length === 1)
        SidePanelService.open(NewItemSidePanel, {
          defaultValue: data.data.find((item) =>
            checkedRows.includes(item._id)
          ),
          id: checkedRows[0],
          modifyItem: modifyItem,
          handleClose: () => {
            handleChangeAction(null);
          },
        });
      else {
        toast(
          t("planning_page.Please select one item to perform this action!"),
          {
            type: "info",
          }
        );
        handleChangeAction(null);
      }
    } else if (deleteItem && currentTab === "create_edit_plan") {
      if (checkedRows.length > 0) {
        ModalService.open(DeleteModal, {
          type: t("planning_page.maintnance_item"),
          handleDelete: async () => {
            await handleDeleteItems(checkedRows);
          },
          handleClose: () => {
            handleChangeAction(null);
          },
        });
      } else {
        toast.info(
          t("planning_page.please_select_at_least_one_item_to_perform")
        );
        handleChangeAction(null);
      }
    } else if (newPackage) {
      if (singleBuildingData?._id) {
        if (
          settingsFormData?.plan_duration &&
          settingsFormData?.plan_start_year
        ) {
          SidePanelService.open(NewPackageSidePanel, {
            newItem: true,
            start_year: singleBuildingData?.construction_year,
            singleBuildingData,
            handleClose: () => {
              handleChangeAction(null);
            },
          });
        } else {
          toast.info(t("planning_page.maintenance_settings_missing"));
          handleChangeAction(null);
        }
      }
    }
  }, [newItem, deleteItem, modifyItem, newPackage, singleBuildingData?._id]);
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
      // const item = checkedRows[index];
      // await DeletePlanningById(item);
      await BulkDeletePlanning(checkedRows);
      // }
      setCheckedRows([]);
      setReloadCreateEdit(true);
    }
  };
  // const handlePageChange = async (currentPage, limit, id, order) => {
  //   const { order: sortOrder, id: sortId } = sort;

  //   if (buildingChange) {
  //     const res = await FilterPlanning(
  //       {
  //         body: JSON.stringify({
  //           property_code: [planningChange],
  //           building_code: [buildingChange],
  //         }),
  //       },
  //       "?page=" +
  //         currentPage +
  //         "&limit=" +
  //         limit +
  //         `&sort=${(id || order || sortId || sortOrder) && true}&order=${
  //           order || sortOrder
  //         }&id=${id || sortId}`
  //     );
  //     const newData = await res.json();
  //     setData(newData);
  //   } else if (planningChange) {
  //     const res = await FilterPlanning(
  //       {
  //         body: JSON.stringify({
  //           property_code: [planningChange],
  //         }),
  //       },
  //       "?page=" +
  //         currentPage +
  //         "&limit=" +
  //         limit +
  //         `&sort=${(id || order || sortId || sortOrder) && true}&order=${
  //           order || sortOrder
  //         }&id=${id || sortId}`
  //     );
  //     const newData = await res.json();
  //     setData(newData);
  //   }
  // };

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
    } else if (windowDimension >= 1500) {
      return `${defaultWidth + 14}px`;
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
    return Math.floor(width / 12);
  };

  const createEditPlanColumn = [
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
              className="form-check-input create_checkbox create_edit_header_check"
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
        <OverlayTrigger overlay={<Tooltip>System</Tooltip>}>
          <span>System</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        return <span>{row.u_system || "-"} </span>;
      },
      sortable: true,
      selector: (row) => row.u_system,
      minWidth: getColumnWidth(75),
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
        const article = row.article || "-";
        const columnWidth = getColumnWidth(140);
        const maxChars =
          columnWidth === "auto" ? 20 : getMaxChars(parseInt(columnWidth));
        const truncatedText =
          article.length > maxChars
            ? `${article.substring(0, maxChars)}`
            : article;

        return (
          <OverlayTrigger overlay={<Tooltip>{article}</Tooltip>}>
            <span>{truncatedText}</span>
          </OverlayTrigger>
        );
      },
      selector: (row) => row.article || "",
      sortable: true,
      minWidth: getColumnWidth(140),
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
      sortable: true,
      selector: (row) => row.maintenance_activity,
      minWidth: getColumnWidth(140, "maintenance_activity"),
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
        return <span>{row?.start_year || "-"}</span>;
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
        return <span>{row.technical_life || "-"}</span>;
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
        return <span>{row.previous_year || "-"}</span>;
      },
      sortable: true,
      selector: (row) => parseInt(row.previous_year) || 0,
      minWidth: getColumnWidth(75),
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
      selector: (row) => parseInt(row.price_per_unit) || 0,
      minWidth: getColumnWidth(75),
      sortable: true,
    },
    {
      name: (
        <OverlayTrigger overlay={<Tooltip>{t("planning_page.unit")}</Tooltip>}>
          <span>{truncateHeader(t("planning_page.unit"))}</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        return <span>{row.unit || "-"}</span>;
      },
      sortable: true,
      minWidth: getColumnWidth(75),
      selector: (row) => row.unit || 0,
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
        return <span>{row.quantity || "-"}</span>;
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

  return (
    <>
      {newItem || modifyItem ? (
        <SidePanelRoot />
      ) : newPackage ? (
        <SidePanelRoot style={{ width: "77%" }} />
      ) : (
        deleteItem && <ModalRoot />
      )}
      <DataTable
        data={data?.data}
        columns={createEditPlanColumn}
        noDataComponent={t("common.pages.There are no records to display")}
        highlightOnHover
        responsive
        pagination
        className="create_edit_table custom_create_edit_table"
        paginationComponentOptions={{
          rowsPerPageText: t("planning_page.rows_per_page"),
        }}
      />
    </>
  );
};

export default CreateEditPlan;
