import React, { useEffect, useState } from "react";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";
import CheckBox from "components/common/CheckBox";
import { usePlanningContextCheck } from "context/SidebarContext/PlanningContextCheck";
import Button from "components/common/Button";
import {
  GetMaintaincePackageByPackageName,
  GetAllUniqueMaintaincePackages,
} from "lib/MaintaincePackageLib";
import { CreateNewPlanning } from "lib/PlanningLib";
import { useTranslation } from "react-i18next";
import CheckboxTable from "components/common/CheckboxTable";
import api from "api";
import Loader from "components/common/Loader";
import { Col, Form, Row, Spinner } from "@themesberg/react-bootstrap";
import { BiPencil } from "react-icons/bi";
import { Modal } from "@themesberg/react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";

const NewPackageSidePanel = ({
  close,
  newItem,
  handleClose,
  start_year,
  singleBuildingData,
}) => {
  const [checkedRows, setCheckedRows] = useState(() => []);
  const [articleCodeChange, setArticleCodeChange] = useState("none");
  const [startYear, setStartYear] = useState(start_year);

  const [checkBoxState, setCheckBoxState] = useState(true);
  const [maintenanceSetting, setMaintenanceSetting] = useState(null);
  const [editData, setEditData] = useState(null);

  const [maintenanceItem, setMaintenanceItem] = useState([]);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  // modal state
  const [show, setShow] = useState(false);
  const [rowData, setRowData] = useState(null);

  const modalClose = () => {
    setRowData(null);
    setShow(false);
  };
  const handleShow = (elem) => {
    setRowData(elem);
    setEditData(elem);
    setShow(true);
  };

  const { value: articleCodeData } = GetAllUniqueMaintaincePackages();
  const { value: maintaincePackages } = GetMaintaincePackageByPackageName(
    articleCodeChange || undefined,
    {},
    []
  );
  const {
    buildingChange,
    planningChange,
    reloadCreateEdit,
    setReloadCreateEdit,
  } = usePlanningContextCheck();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Check if any package is selected
    if (articleCodeChange === "none" || !maintenanceItem.length) {
      toast.info(t("planning_page.please_select_package"), {
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setLoading(false);
      return;
    }

    // Check if any items are checked
    if (!checkedRows.length) {
      toast.info(t("planning_page.please_select_at_least_one_item"), {
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setLoading(false);
      return;
    }
    const invalidItem = maintenanceItem?.find(
      (item) =>
        checkedRows.includes(item._id) &&
        (!item.start_year || item.start_year === "")
    );

    if (invalidItem) {
      toast.info(t("common.pages.Start year is required"));
      setLoading(false);
      return;
    }
    if (newItem) {
      // Create Api
      // const data = maintaincePackages
      const data = maintenanceItem
        ?.filter((item) => checkedRows.includes(item._id))
        .map((item) => {
          const { _id, ...items } = item;
          return {
            ...items,
            previous_year: item?.start_year,
            start_year: parseInt(item?.start_year),
            quantity: item?.quantity || 1,
            total_cost: item?.total_cost,
            building_code: buildingChange,
            property_code: planningChange,
          };
        });
      const user = JSON.parse(localStorage.getItem("user"));
      await CreateNewPlanning({
        body: JSON.stringify({
          user: user?._id,
          data,
          multiple: checkBoxState,
        }),
      });
      setReloadCreateEdit(!reloadCreateEdit);
      handleClose && handleClose();
      close && close();
      // window.location.reload();
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setArticleCodeChange(e.target.value);
  };

  const handleCheckRows = (id) => {
    let rows = [];
    if (id === "all" || id === "none") {
      if (id === "all") {
        rows = maintenanceItem.map((item) => item._id);
        setCheckedRows(rows);
      } else {
        setCheckedRows([]);
      }
    } else {
      const findId = checkedRows.find((item) => item === id);
      if (!findId) {
        setCheckedRows([...checkedRows, id]);
        return;
      }
      rows = [...checkedRows.filter((item) => item !== id)];
      setCheckedRows(rows);
      return;
    }
  };
  // const defaultProps = {
  //   handleChange: handleChange,
  //   required: true,
  // };

  // whose package select whoes releted data show
  const handleSelectPackage = async (e) => {
    setArticleCodeChange(e.target.value);
    const res = await api.get(
      `/maintaince_packages/packageName/${e.target.value}`
    );
    if (res?.data[0]?.MaintenanceItems) {
      const newData = res?.data[0]?.MaintenanceItems.map((elem, i) => ({
        ...elem,
        start_year: elem?.start_year,
        price_per_unit: elem?.price_per_unit,
        quantity: !isNaN(parseInt(elem?.default_amount))
          ? parseInt(elem?.default_amount)
          : 1,
        technical_life: elem?.technical_life,
        total_cost:
          elem?.price_per_unit *
          (parseInt(elem?.quantity) || !isNaN(parseInt(elem?.default_amount))
            ? parseInt(elem?.default_amount)
            : 1),
        unit: elem?.unit,
      }));
      setMaintenanceItem(newData);
    }
  };

  const getMaintenanceSetting = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      let res = await api.get(`/maintenance_settings/${user._id}`);
      setMaintenanceSetting(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMaintenanceSetting();
  }, []);

  const changeFieldData = (e) => {
    setRowData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateData = () => {
    setStartYear(rowData?.start_year);
    // let     maintenanceItem?.filter((elem) => elem._id === rowData?._id);
    let updateData = maintenanceItem?.map((elem) => {
      if (elem._id == rowData?._id) {
        return {
          ...elem,
          start_year: rowData?.start_year,
          price_per_unit: rowData?.price_per_unit,
          default_amount: rowData?.default_amount,
          technical_life: rowData?.technical_life,
          // total_cost: rowData?.total_cost,
          unit: rowData?.unit,
        };
      } else {
        return elem;
      }
    });
    setMaintenanceItem(updateData);
    modalClose();
  };
  const handleInputChange = (event, id, key) => {
    const value = event.target.value;

    const updatedItems = maintenanceItem.map((item) => {
      if (item._id === id) {
        const updatedItem = { ...item, [key]: value };

        if (key === "price_per_unit" || key === "quantity") {
          const price = parseInt(updatedItem.price_per_unit) || 0;
          const quantity =
            parseInt(updatedItem.quantity || updatedItem.default_amount) || 1;
          updatedItem.total_cost = price * quantity;
        }

        return updatedItem;
      }
      return item;
    });

    setMaintenanceItem(updatedItems);
  };
  const handleYearBlur = (event, id) => {
    const inputYear = parseInt(event.target.value);
    const minYear = parseInt(maintenanceSetting?.plan_start_year);
    const maxYear = minYear + parseInt(maintenanceSetting?.plan_duration);

    if (inputYear < minYear || inputYear > maxYear) {
      toast.info(
        t("planning_page.start_year_must_be_between", {
          minYear,
          maxYear,
        }),
        {
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );

      // Clear the value instead of setting min/max
      const updatedItems = maintenanceItem.map((item) => {
        if (item._id === id) {
          return { ...item, start_year: "" };
        }
        return item;
      });
      setMaintenanceItem(updatedItems);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="maintenance-package-form">
        <SidePanel>
          <SidePanelHeader>
            {newItem && t("data_settings.add")}
            {t("data_settings.maintenance_package")}
          </SidePanelHeader>
          <SidePanelBody>
            <div
              className="activity-input-container"
              style={{
                height: "auto",
                margin: "20px 0px",
              }}
            >
              <select name="" id="" onChange={(e) => handleSelectPackage(e)}>
                <option value="none" disabled selected>
                  {t("planning_page.please_select")}
                </option>
                {articleCodeData?.map((item) => (
                  <option value={item} style={{ cursor: "pointer" }}>
                    {item}
                  </option>
                ))}
              </select>
              {loading ? (
                <div style={{ marginBottom: "1rem" }}>
                  <Loader />
                </div>
              ) : maintenanceItem?.length > 0 ? (
                <>
                  <div style={{ overflow: "auto" }}>
                    <CheckboxTable
                      headings={[
                        {
                          text: t("planning_page.system_code"),
                          key: "u_system",
                          sort: false,
                        },
                        {
                          text: t("planning_page.article"),
                          key: "article",
                          sort: false,
                        },
                        {
                          text: t("planning_page.maintain_Act"),
                          key: "maintainence_activity",
                          sort: false,
                        },
                        {
                          text: t("planning_page.start_year"),
                          key: "start_year",
                          sort: false,
                        },
                        {
                          text: t("planning_page.techn_life"),
                          key: "technical_life",
                          sort: false,
                        },
                        {
                          text: t("planning_page.price_per_unit"),
                          key: "price_per_unit",
                          sort: false,
                        },
                        {
                          text: t("planning_page.unit"),
                          key: "unit",
                          sort: false,
                        },
                        {
                          text: t("planning_page.quantity"),
                          key: "quantity",
                          sort: false,
                        },
                        {
                          text: t("planning_page.total_cost"),
                          key: "total_cost",
                          sort: false,
                        },
                      ]}
                      data={
                        maintenanceItem?.map((item) => ({
                          id: item._id,
                          u_system: item.u_system,
                          article: item.article,
                          maintainence_activity: item.maintenance_activity
                            ? item.maintenance_activity.split(" ")[0]
                            : "Null",
                          start_year: (
                            <input
                              className="package_input_field"
                              type="number"
                              value={item?.start_year}
                              onChange={(e) =>
                                handleInputChange(e, item?._id, "start_year")
                              }
                              onBlur={(e) => handleYearBlur(e, item?._id)}
                            />
                          ),
                          technical_life: (
                            <input
                              className="package_input_field"
                              type="number"
                              value={item?.technical_life}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  item?._id,
                                  "technical_life"
                                )
                              }
                            />
                          ),
                          price_per_unit: (
                            <input
                              className="package_input_field"
                              type="number"
                              value={item.price_per_unit}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  item?._id,
                                  "price_per_unit"
                                )
                              }
                            />
                          ),
                          unit: (
                            <input
                              className="package_input_field"
                              type="text"
                              defaultValue={item?.unit}
                              onChange={(e) =>
                                handleInputChange(e, item?._id, "unit")
                              }
                              disabled
                            />
                          ),
                          quantity: (
                            <input
                              className="package_input_field"
                              type="number"
                              value={item?.quantity}
                              onChange={(e) =>
                                handleInputChange(e, item._id, "quantity")
                              }
                              min={1}
                            />
                          ),
                          total_cost: (
                            <input
                              className="package_input_field"
                              type="text"
                              value={item?.total_cost}
                              disabled
                            />
                          ),
                        })) || []
                      }
                      handleCheckRows={handleCheckRows}
                    />
                  </div>
                </>
              ) : (
                t("property_page.Package_not_selected")
              )}
            </div>
            <div className="maintenace_package_checkbox_main maintenance_checkbox_main">
              <Form.Check
                type="checkbox"
                id="checkboxId"
                checked={checkBoxState}
                onChange={() => setCheckBoxState(!checkBoxState)}
                className="plan_checkbox"
              />
              <p className="maintenance_plan_checkBox_text maintenance_package_items_multiple">
                <i>
                  {t(
                    `planning_page.Items that occurs multiple times are added as individual items`
                  )}
                </i>{" "}
              </p>
            </div>
          </SidePanelBody>
          <SidePanelFooter>
            <Button main type="submit">
              {loading ? (
                <Spinner
                  animation="border"
                  size="sm"
                  className="comp_pkg_spinner"
                />
              ) : (
                t("planning_page.submit")
              )}
            </Button>
            <Button
              secondary
              type="button"
              onClick={() => {
                handleClose && handleClose();
                close();
              }}
            >
              {t("planning_page.cancel")}
            </Button>
          </SidePanelFooter>
        </SidePanel>
      </form>

      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {t("planning_page.edit_maintaince_package")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("planning_page.start_year")} </Form.Label>
                <Form.Control
                  type="number"
                  name="start_year"
                  onChange={changeFieldData}
                  value={rowData?.start_year}
                  min={1900}
                  max={2100}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label> {t("planning_page.Techni_life")} </Form.Label>
                <Form.Control
                  type="text"
                  name="technical_life"
                  onChange={changeFieldData}
                  value={rowData?.technical_life}
                  min={0}
                  max={200}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Form.Group>
                <Form.Label> {t("planning_page.price_per_unit")} </Form.Label>
                <Form.Control
                  type="text"
                  name="price_per_unit"
                  onChange={changeFieldData}
                  value={rowData?.price_per_unit}
                  min={1}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label> {t("planning_page.unit")} </Form.Label>
                <Form.Select
                  name="unit"
                  onChange={changeFieldData}
                  value={rowData?.unit}
                >
                  <option key={"m2"} value={"M2"}>
                    M2
                  </option>
                  <option key={"m"} value={"M"}>
                    M
                  </option>
                  <option key={"st"} value={"ST"}>
                    ST
                  </option>
                  <option key={"m3"} value={"M3"}>
                    M3
                  </option>
                  <option key={"l"} value={"L"}>
                    L
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Form.Group>
                <Form.Label> {t("planning_page.Quantity")} </Form.Label>
                <Form.Control
                  type="number"
                  name="default_amount"
                  onChange={changeFieldData}
                  value={
                    rowData?.quantity
                      ? rowData?.quantity
                      : !isNaN(parseInt(rowData?.default_amount))
                      ? parseInt(rowData?.default_amount)
                      : 1
                  }
                  min={1}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label> {t("planning_page.total_cost")} </Form.Label>
                <Form.Control
                  type="number"
                  name="total_cost"
                  onChange={changeFieldData}
                  value={
                    !isNaN(parseInt(rowData?.default_amount))
                      ? parseInt(rowData?.default_amount) *
                        parseInt(rowData?.price_per_unit)
                      : 0
                  }
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleUpdateData}
            className="edit_maintenance_save_btn"
          >
            {t("common.pages.save_change")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NewPackageSidePanel;
