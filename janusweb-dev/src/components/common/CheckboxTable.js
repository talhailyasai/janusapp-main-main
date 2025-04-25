import { OverlayTrigger, Tooltip } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";

const CheckboxTable = ({
  headings,
  data,
  pagination,
  handlePage,
  checkHidden,
  handleCheckRows,
  defaultCheckedRows,
  handleSortClick,
}) => {
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [checkedRows, setCheckedRows] = useState(defaultCheckedRows || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(
    pagination?.totalCount < 10 ? "none" : "10"
  );

  useEffect(() => {
    if (defaultCheckedRows) {
      setCheckedRows(defaultCheckedRows);
    }
  }, [defaultCheckedRows]);
  const handleSortsClick = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      handleSortClick(
        key,
        sortOrder === "asc" ? "desc" : "asc",
        parseInt(data.length)
      );
    } else {
      setSortKey(key);
      setSortOrder("asc");
      handleSortClick(key, "asc", parseInt(data.length));
    }
  };

  const handleCheckRow = (id) => {
    if (id === "all") {
      if (checkedRows.length === data.length) {
        setCheckedRows([]);
        if (handleCheckRows) handleCheckRows("none");
      } else {
        setCheckedRows(data.map((item) => item.id));
        if (handleCheckRows) {
          handleCheckRows("all");
        }
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    handlePage && handlePage(newPage, limit);
  };
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    handlePage && handlePage(currentPage, newLimit);
  };

  const renderPagination = () => {
    const pageNumbers = [];

    for (let i = 1; i <= pagination?.totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav className="d-flex justify-content-between align-items-center">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </button>
          </li>
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === pagination?.totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </button>
          </li>
        </ul>
        <div>
          <select
            name=""
            id=""
            value={limit}
            className="px-2"
            onChange={(e) => handleLimitChange(e.target.value)}
          >
            {pagination?.totalCount < 10 && (
              <option value="none" disabled>
                Showing all of them
              </option>
            )}
            {pagination?.totalCount > 10 && <option value="10">10</option>}
            {pagination?.totalCount > 20 && <option value="20">20</option>}
            {pagination?.totalCount > 50 && <option value="50">50</option>}
            {pagination?.totalCount > 100 && <option value="100">100</option>}
          </select>
          <span className="mx-2">Entries per page</span>
        </div>
      </nav>
    );
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr
            style={{
              backgroundColor: "transparent",
              color: "black",
              borderBottom: "1px solid black",
              minHeight: "70px",
            }}
          >
            {!checkHidden && (
              <th
                style={{ padding: "8px 12px" }}
                scope="col"
                className="maintenance_sidepanel_checkbox_main"
              >
                <div className="form-check">
                  <input
                    onChange={() => {
                      handleCheckRow("all");
                    }}
                    className="form-check-input prop_comp_pkg_side_check"
                    type="checkbox"
                    value=""
                    checked={data?.every((item) =>
                      checkedRows.includes(item.id)
                    )}
                  />
                </div>
              </th>
            )}
            {headings.map(({ sort = false, key, text, headerStyle }) => (
              <th
                style={{
                  padding: "12px 12px 0 12px",
                  cursor: sort ? "pointer" : "auto",
                  position: "relative",
                  bottom: sort ? "" : "10px",
                  ...headerStyle,
                }}
                scope="col"
                key={key}
                onClick={() => sort && handleSortsClick(key)}
                id="maintenance_sidepanel_table_key"
              >
                <div className="d-flex align-items-center" style={{ gap: 2 }}>
                  <span
                    className={
                      key === "u_system" || key === "total_cost"
                        ? "maintenance_system_code"
                        : "comp_pkg_name"
                    }
                  >
                    {key === "price_per_unit" ? (
                      <>
                        {text.split(" ")[0]}
                        <br />
                        {`${text.split(" ")[1]} ${text.split(" ")[2]}`}
                      </>
                    ) : (
                      text
                    )}
                  </span>
                  {sort && (
                    <div className="d-flex flex-column">
                      <span
                        className="material-symbols-outlined position-relative"
                        style={{
                          top:
                            sortOrder === "asc" && key === sortKey
                              ? "10px"
                              : "5px",
                          fontSize: 20,
                          color:
                            sortOrder === "asc" && key === sortKey
                              ? "white"
                              : "black",
                        }}
                      >
                        arrow_drop_up
                      </span>
                      <span
                        className="material-symbols-outlined position-relative"
                        style={{
                          top:
                            sortOrder === "asc" && key === sortKey
                              ? "-10px"
                              : "-5px",
                          fontSize: 20,
                          color:
                            sortOrder === "desc" && key === sortKey
                              ? "white"
                              : "black",
                        }}
                      >
                        arrow_drop_down
                      </span>
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="checkbox-table-row">
              {!checkHidden && (
                <td style={{ padding: "8px 12px" }}>
                  <div className="form-check">
                    <input
                      onChange={() => handleCheckRow(item.id)}
                      className="form-check-input prop_comp_pkg_side_check"
                      type="checkbox"
                      value=""
                      checked={checkedRows.includes(item.id)}
                      id={item.id}
                    />
                  </div>
                </td>
              )}
              {Object.keys(item).map((key) =>
                key !== "id" ? (
                  <td
                    className={
                      headings.find((item) => item.key === key).className
                    }
                    key={key}
                    id={
                      key === "u_system" || key === "unit" || key === "article"
                        ? "maintenance_side_u_system"
                        : key === "start_year" ||
                          key === "quantity" ||
                          key === "technical_life" ||
                          key === "price_per_unit" ||
                          key === "total_cost"
                        ? "maintenance_start_year"
                        : key === "Actions"
                        ? "maintenance_side_actions"
                        : "maintenance_sidepanel_table_value"
                    }
                  >
                    {key === "maintainence_activity" ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>{item[key]}</Tooltip>}
                      >
                        <span
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {item[key]?.length > 34
                            ? `${item[key]?.substring(0, 34)}...`
                            : item[key]}
                        </span>
                      </OverlayTrigger>
                    ) : (
                      <>
                        {item[key]}
                        {console.log("umair key", key)}
                      </>
                    )}
                  </td>
                ) : null
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination?.totalCount && renderPagination()}
    </div>
  );
};

export default CheckboxTable;
