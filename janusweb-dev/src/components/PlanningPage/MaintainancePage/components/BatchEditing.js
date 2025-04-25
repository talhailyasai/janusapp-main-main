import React, { useEffect, useState } from "react";
import DeleteModal from "components/common/Modals/DeleteModal";
import {
  BulkDeletePlanning,
  DeletePlanningById,
  FilterPlanning,
} from "lib/PlanningLib";
import { ModalRoot, ModalService } from "components/common/Modal";
import CheckboxTable from "components/common/CheckboxTable";
import Filter from "components/common/Filter";
import EditMany from "components/common/EditMany";
import DropdownComponent from "components/common/Dropdown";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { OverlayTrigger, Tooltip } from "@themesberg/react-bootstrap";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import { toast } from "react-toastify";

const BatchEditing = ({
  deleteItem,
  handleChangeAction,
  handleSortClick,
  sort,
  batchEditItems,
}) => {
  const [checkedRows, setCheckedRows] = useState(() => []);
  const [data, setData] = useState();
  const [reload, setReload] = useState(false);

  const [filterValues, setFilterValues] = useState({});
  const { currentTab, windowDimension, isCollapsed } =
    usePropertyContextCheck();
  const { t } = useTranslation();

  useEffect(() => {
    handlePageChange(1, 100);
  }, [reload, currentTab]);

  useEffect(() => {
    if (deleteItem) {
      if (checkedRows.length > 0) {
        ModalService.open(DeleteModal, {
          type: "Maintence Item",
          handleDelete: async () => {
            await handleDeleteItems(checkedRows);
          },
          handleClose: () => {
            handleChangeAction(null);
            // setReload(true);
          },
        });
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
    }
  };

  const handleFindClick = async () => {
    setCheckedRows([]);
    // perform find logic using filterValues
    const res = await FilterPlanning(
      {
        body: JSON.stringify(filterValues),
      },
      "?limit=100"
    );
    const newData = await res.json();
    setData(newData);
    setCheckedRows([]);
  };

  const handlePageChange = async (currentPage, limit, id, order) => {
    const { order: sortOrder, id: sortId } = sort;

    const res = await FilterPlanning(
      {
        body: JSON.stringify(filterValues),
      },
      `?page=${currentPage}${limit ? `&limit=${limit}` : ""}&sort=${
        (id || order || sortId || sortOrder) && true
      }&order=${order || sortOrder}&id=${id || sortId}`
    );
    const newData = await res.json();
    setCheckedRows([]);
    setData(newData);
    setReload(false);
  };

  const filteredCheckedRows = data?.data;
  const reducedCheckedRows = filteredCheckedRows?.length > 0 && {
    ...filteredCheckedRows[0],
  };

  filteredCheckedRows?.forEach((obj) => {
    Object.keys(reducedCheckedRows).forEach((key) => {
      if (reducedCheckedRows[key] !== obj[key]) {
        reducedCheckedRows[key] = undefined;
      }
    });
  });
  // console.log(
  //   "batchEditItems outside",
  //   batchEditItems,
  //   "reducedCheckedRows",
  //   reducedCheckedRows
  // );

  useEffect(() => {
    if (batchEditItems) {
      SidePanelService.open(EditMany, {
        reducedCheckedRows: reducedCheckedRows,
        checkedRows: checkedRows,
        data: data,
        setCheckedRows: setCheckedRows,
        handleDataSubmit: setData,
        setData: setData,
        handleClose: () => {
          handleChangeAction(null);
        },
      });
    }
  }, [batchEditItems]);
  const handleSelectItems = (id) => {
    if (id === "check_rows") {
      const newData = data?.data || [];
      const newCheckedRows = newData.filter(
        (item) => !checkedRows.includes(item._id)
      );
      setData({ ...data, data: newCheckedRows });
    } else if (id === "uncheck_rows") {
      const newData = data?.data || [];
      const newUncheckedRows = newData.filter((item) =>
        checkedRows.includes(item._id)
      );
      setData({ ...data, data: newUncheckedRows });
    }
  };

  const handleCheckRow = (id) => {
    if (id === "all") {
      if (checkedRows?.length === data?.data?.length) {
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
    return truncateCharacters;
  };

  const batchEditingTableColumn = [
    {
      name: (
        <div className="form-check">
          <input
            onChange={() => {
              handleCheckRow("all");
            }}
            className="form-check-input"
            type="checkbox"
            value=""
            checked={data?.data?.every((item) =>
              checkedRows?.includes(item?._id)
            )}
          />
        </div>
      ),
      cell: (row, index, column, id) => {
        return (
          <div>
            <input
              onChange={() => handleCheckRow(row._id)}
              className="form-check-input"
              type="checkbox"
              value=""
              checked={checkedRows?.includes(row._id)}
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
        const buildingName = row.building_code || "-";

        return (
          <OverlayTrigger overlay={<Tooltip>{buildingName}</Tooltip>}>
            <span>{buildingName}</span>
          </OverlayTrigger>
        );
      },
      selector: (row) => row.building_code || "",
      sortable: true,
      minWidth: getColumnWidth(85),
    },
    {
      name: (
        <OverlayTrigger overlay={<Tooltip>System</Tooltip>}>
          <span>{"System"}</span>
        </OverlayTrigger>
      ),
      cell: (row, index, column, id) => {
        const system = row.u_system || "-";
        return (
          <OverlayTrigger overlay={<Tooltip>{system}</Tooltip>}>
            <span>{system}</span>
          </OverlayTrigger>
        );
      },
      sortable: true,
      selector: (row) => row.u_system || "",
      minWidth: getColumnWidth(71),
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
        return (
          <OverlayTrigger overlay={<Tooltip>{article}</Tooltip>}>
            <span>{article}</span>
          </OverlayTrigger>
        );
      },
      selector: (row) => row.article || "",
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
        return <span>{row.start_year || "-"}</span>;
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
        return <span>{row.unit || "-"}</span>;
      },
      sortable: true,
      selector: (row) => row.unit || "",
      minWidth: getColumnWidth(61),
    },
    {
      name: (
        <OverlayTrigger overlay={<Tooltip>Unit Cost</Tooltip>}>
          <span>{truncateHeader("Unit Cost", "price_per_unit")}</span>
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
      {deleteItem && <ModalRoot />}
      {batchEditItems && <SidePanelRoot />}
      <Filter
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        handleFindClick={handleFindClick}
      />

      <div className="batch_edit_remove_btn">
        <DropdownComponent
          nameReset
          style={{ width: "100%" }}
          items={[
            {
              text: t("common.pages.checked_rows"),
              id: "check_rows",
              handleClick: (id) => handleSelectItems(id),
            },
            {
              text: t("common.pages.unchecked_rows"),
              id: "uncheck_rows",
              handleClick: (id) => handleSelectItems(id),
            },
          ]}
          name={t("common.pages.remove")}
          icon="expand_more"
          className="btn btn-secondary text-white rounded-pill mx-4 px-4 py-2 d-flex jusitfy-content-center align-items-center"
        ></DropdownComponent>
      </div>

      {/* <CheckboxTable
        defaultCheckedRows={checkedRows}
        handleSortClick={async (w, x, y, z) => {
          await handleSortClick(w, x, y, filterValues);
          handlePageChange(
            data.pagination.currentPage,
            data.pagination?.pageSize,
            w,
            x,
            y
          );
        }}
        pagination={data?.pagination || {}}
        handlePage={handlePageChange}
        headings={[
          { text: "Property", key: "property", sort: false },
          { text: "Building", key: "building", sort: false },
          { text: "System", key: "u_system" },
          { text: "Article Code", key: "article" },
          { text: "Start Year", key: "start_year" },
          { text: "Technical Life", key: "technical_life" },
          { text: "Previous Year", key: "previous_year" },
          { text: "Unit", key: "unit" },
          { text: "Unit Cost", key: "price_per_unit" },
          { text: "Quantity", key: "quantity" },
          { text: "Total Cost", key: "total_cost", sort: false },
        ]}
        data={
          data?.data?.map((item) => ({
            id: item._id,
            property: item.property_name,
            building: item.building_name,
            u_system: item.u_system,
            article: item.article,
            start_year: item.start_year,
            technical_life: item.technical_life,
            previous_year: item.previous_year,
            unit: item.unit,
            price_per_unit: item.price_per_unit,
            quantity: item.quantity || 0,
            total_cost: (
              (item.quantity || 0) * item.price_per_unit
            ).toLocaleString(),
          })) || []
        }
        handleCheckRows={handleCheckRows}
      /> */}
      <div className="mt-5">
        <DataTable
          data={data?.data}
          columns={batchEditingTableColumn}
          noDataComponent={t("common.pages.There are no records to display")}
          highlightOnHover
          responsive
          pagination
          className="create_edit_table batch_edit_table"
          paginationComponentOptions={{
            rowsPerPageText: t("planning_page.rows_per_page"),
          }}
        />
      </div>
    </>
  );
};

export default BatchEditing;
