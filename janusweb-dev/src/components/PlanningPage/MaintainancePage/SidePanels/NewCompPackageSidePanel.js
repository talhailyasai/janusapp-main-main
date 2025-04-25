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
import { CreateNewPlanning } from "lib/PlanningLib";
import { useTranslation } from "react-i18next";
import {
  GetAllUniqueComponentPackages,
  GetComponentPackageByPackageName,
} from "lib/ComponentPackageLib";
import { CreateNewComponent } from "lib/ComponentLib";
import CheckboxTable from "components/common/CheckboxTable";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import api from "api";
import { toast } from "react-toastify";
import { Modal, Spinner } from "@themesberg/react-bootstrap";
import { useHistory } from "react-router-dom";

const NewCompPackageSidePanel = ({
  close,
  newItem,
  handleClose,
  start_year,
  singleBuildingData,
}) => {
  const [checkedRows, setCheckedRows] = useState(() => []);
  const [articleCodeChange, setArticleCodeChange] = useState("none");
  const history = useHistory();

  const [allCompPkg, setAllCompPkg] = useState([]);
  const [selectedCompPkg, setSelectedCompPkg] = useState([]);
  const [maxPropertyMessage, setMaxPropertyMessage] = useState("");
  const [showMaxPropertyModal, setShowMaxPropertyModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const { value: articleCodeData } = GetAllUniqueComponentPackages();
  const { value: componentPackages } = GetComponentPackageByPackageName(
    articleCodeChange || undefined,
    {},
    [articleCodeChange]
  );
  const {
    property,
    buildingObj,
    setComponentAdded,
    setComponentChange,
    setCompObj,
  } = usePropertyContextCheck();

  const getAllComponentPackage = async () => {
    try {
      const res = await api.get("/component_package");
      setAllCompPkg(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllComponentPackage();
  }, []);

  function generateUniqueCode() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let alphabets = "";

    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      alphabets += alphabet.charAt(randomIndex);
    }

    const numbers = (Math.random() * 1000).toFixed(0).padStart(3, "0");

    return alphabets + numbers;
  }

  // Example usage:
  const uniqueCode = generateUniqueCode();

  const processInterval = (intervalValue, intervalUnit) => {
    if (intervalValue === null || !intervalValue) {
      return null;
    }

    const value = parseInt(intervalValue);
    switch (intervalUnit) {
      case "D":
        return new Date(
          Date.now() + value * 24 * 60 * 60 * 1000
        ).toLocaleDateString();
      case "V":
        return new Date(
          Date.now() + value * 7 * 24 * 60 * 60 * 1000
        ).toLocaleDateString();
      case "M":
        return new Date(
          new Date().setMonth(new Date().getMonth() + value)
        ).toLocaleDateString();
      case "Å":
        return new Date(
          new Date().setFullYear(new Date().getFullYear() + value)
        ).toLocaleDateString();
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create Api
      const data = selectedCompPkg
        .filter((item) => checkedRows?.includes(item._id))
        .map((item) => {
          const { _id, Components, ...items } = item;
          return {
            ...items,
            long_name: item?.u_component_name,
            name: item?.u_component_abbreviation,
            property_code: property?._id,
            building_code: buildingObj?._id,
            component_code: generateUniqueCode(),
          };
        });
      const currentDate = new Date().toLocaleDateString();
      let compData = data?.map((elem) => {
        const {
          attendance_interval_value,
          attendance_interval_unit,
          maintenance_interval_value,
          maintenance_interval_unit,
        } = elem;

        const attendNextVal = processInterval(
          attendance_interval_value,
          attendance_interval_unit
        );
        const maintananceNextVal = processInterval(
          maintenance_interval_value,
          maintenance_interval_unit
        );

        return {
          ...elem,
          attendance_lastest_date: currentDate,
          attendance_next_date: attendNextVal,
          maintenance_lastest_date: currentDate,
          maintenance_next_date: maintananceNextVal,
        };
      });
      let res = await api.post("/components/", compData);
      // let res = await CreateNewComponent({
      //   body: JSON.stringify(data),
      // });
      if (res?.response?.data?.message) {
        setMaxPropertyMessage(res?.response?.data?.message);
        return setShowMaxPropertyModal(true);
      }

      // window.location.reload();
      setLoading(false);
      setComponentAdded({});
      close && close();
      handleClose && handleClose();
    } catch (error) {
      console.log(error);
      // window.location.reload();
      setLoading(false);
      close && close();
      handleClose && handleClose();
    }
  };
  const handleChange = (e) => {
    setArticleCodeChange(e.target.value);
  };

  const handleCheckRows = (id) => {
    if (id === "all" || id === "none") {
      if (id === "all") {
        // setCheckedRows(componentPackages.map((item) => item._id));
        setCheckedRows(selectedCompPkg.map((item) => item._id));
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

  const { t } = useTranslation();

  const handleSelectCompPkg = (e) => {
    setArticleCodeChange(e.target.value);
    let selectedComp = allCompPkg?.find(
      (elem) => elem?.component_package === e.target.value
    );
    setSelectedCompPkg(selectedComp?.Components);
  };

  const handleCloseMaxProperty = () => {
    setShowMaxPropertyModal(false);
    setMaxPropertyMessage("");
  };
  const handleUpgradePlan = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      (user?.plan === "Standard Plus" ||
        user?.plan === "Standard" ||
        user?.cancelSubscriptionDate) &&
      !user?.trialEnd
    ) {
      let res = await api.get(`/stripe/getCustomerPortal/${user?._id}`);
      window.location = res?.data;
    } else {
      history.push("/pricing-plan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="prop_comp_pkg_side">
      <SidePanel>
        <SidePanelHeader>
          {newItem && "Add"}
          {t("data_settings.component_packages")}{" "}
        </SidePanelHeader>
        <SidePanelBody>
          <div
            className="activity-input-container"
            style={{ height: "auto", margin: "20px 0" }}
          >
            <select name="" id="" onChange={(e) => handleSelectCompPkg(e)}>
              <option value="none" disabled selected>
                {t("property_page.Select_package")}
              </option>
              {articleCodeData?.map((item) => (
                <option value={item} style={{ cursor: "pointer" }}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div style={{ overflow: "auto" }} className="comp_package_table">
            <CheckboxTable
              headings={[
                {
                  text: t("property_page.component_name"),
                  key: "component_name",
                  sort: false,
                  className: "text-break",
                  headerStyle: {
                    whiteSpace: "break-spaces",
                    // textAlign: "center",
                    width: "200px",
                    minWidth: "200px",
                  },
                },
                {
                  text: (
                    <>
                      <span className="border-line"></span>
                    </>
                  ),
                  key: "extra_column_1",
                  className: "text-center text-break",
                  headerStyle: {
                    whiteSpace: "break-spaces",
                    textAlign: "center",
                    position: "relative",
                    width: "0px",
                  },
                  sort: false,
                },

                {
                  text: t("property_page.attendance_interval_value"),
                  key: "attendance_interval_value",
                  className: "text-center text-break",
                  headerStyle: {
                    whiteSpace: "break-spaces",
                    textAlign: "center",
                    width: "80px",
                    minWidth: "80px",
                  },

                  sort: false,
                },
                {
                  text: (
                    <div style={{ position: "relative" }}>
                      <div className="attendance-header">
                        {t("common.sidebar.attendance")}
                      </div>
                      {t("property_page.attendance_interval_unit")}
                    </div>
                  ),
                  key: "attendance_interval_unit",
                  className: "text-center text-break",
                  headerStyle: {
                    whiteSpace: "break-spaces",
                    textAlign: "center",
                    width: "80px",
                    minWidth: "80px",
                  },
                  sort: false,
                },
                {
                  text: t("property_page.attendance_budget_time"),
                  key: "attendance_budget_time",
                  className: "text-center text-break",
                  headerStyle: {
                    whiteSpace: "break-spaces",
                    textAlign: "center",
                    width: "80px",
                    minWidth: "80px",
                  },
                  sort: false,
                },
                {
                  text: (
                    <>
                      <span className="border-line"></span>
                    </>
                  ),
                  key: "extra_column_2",
                  className: "text-center text-break",
                  headerStyle: {
                    whiteSpace: "break-spaces",
                    textAlign: "center",
                    position: "relative",
                    width: "0px",
                  },
                  sort: false,
                },
                {
                  text: t("property_page.attendance_interval_value"),
                  key: "maintenance_interval_value",
                  className: "text-center text-break",
                  headerStyle: {
                    whiteSpace: "break-spaces",
                    textAlign: "center",
                    width: "80px",
                    minWidth: "80px",
                  },
                  sort: false,
                },
                {
                  text: (
                    <div style={{ position: "relative" }}>
                      <div className="attendance-header">
                        {t("common.sidebar.maintainence")}
                      </div>
                      {t("property_page.attendance_interval_unit")}{" "}
                    </div>
                  ),
                  key: "maintenance_interval_unit",
                  className: "text-center text-break",
                  headerStyle: {
                    whiteSpace: "break-spaces",
                    textAlign: "center",
                    width: "80px",
                    minWidth: "80px",
                  },
                  sort: false,
                },
                {
                  text: t("property_page.attendance_budget_time"),
                  key: "maintenance_budget_time",
                  className: "text-center text-break",
                  headerStyle: {
                    whiteSpace: "break-spaces",
                    textAlign: "center",
                    width: "80px",
                    minWidth: "80px",
                  },
                  sort: false,
                },
                {
                  text: (
                    <>
                      <span className="border-line"></span>
                    </>
                  ),
                  key: "extra_column_3",
                  className: "text-center text-break",
                  headerStyle: {
                    whiteSpace: "break-spaces",
                    textAlign: "center",
                    position: "relative",
                    width: "0px",
                  },
                  sort: false,
                },
              ]}
              data={
                (selectedCompPkg?.length > 0 &&
                  selectedCompPkg?.map((item) => ({
                    id: item._id,
                    component_name: (
                      <div
                        className="title-tooltip"
                        title={item?.u_component_name}
                      >
                        {item?.u_component_name?.slice(0, 30) +
                          (item?.u_component_name?.length > 30 ? "..." : "")}
                      </div>
                    ),
                    extra_column_1: "",
                    attendance_interval_value: item?.attendance_interval_value,
                    attendance_interval_unit: item?.attendance_interval_unit,
                    attendance_budget_time: item?.attendance_budget_time,
                    extra_column_2: "",
                    maintenance_interval_value:
                      item?.maintenance_interval_value,
                    maintenance_interval_unit: item?.maintenance_interval_unit,
                    maintenance_budget_time: item?.maintenance_budget_time,
                    extra_column_3: "",
                  }))) ||
                []
              }
              handleCheckRows={handleCheckRows}
            />
          </div>
        </SidePanelBody>
        <SidePanelFooter>
          <Button main type="submit" disabled={loading}>
            {loading ? (
              <Spinner
                animation="border"
                size="sm"
                className="comp_pkg_spinner"
              />
            ) : (
              t("property_page.submit")
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
            {t("property_page.cancel")}
          </Button>
        </SidePanelFooter>
      </SidePanel>

      {/* Maximum properties Modal  */}
      <Modal
        show={showMaxPropertyModal}
        onHide={handleCloseMaxProperty}
        centered
        className="email_verification_modal_main"
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {maxPropertyMessage}
          {maxPropertyMessage !== "You cannot add more than 15 properties!" && (
            <div className="update_btn_main">
              {/* <a href="/pricing-plan" target="_blank"> */}
              <Button
                variant="primary"
                onClick={handleUpgradePlan}
                className="update_btn_change_plan mt-2"
              >
                Upgrade Plan
              </Button>
              {/* </a> */}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </form>
  );
};

export default NewCompPackageSidePanel;
