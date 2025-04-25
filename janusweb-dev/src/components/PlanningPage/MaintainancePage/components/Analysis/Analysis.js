import React, { useEffect, useState } from "react";
import "./Analysis.css";
import api from "api";
import { Bar } from "react-chartjs-2";
import Loader from "components/common/Loader";
import { FilterAnalysis } from "lib/PlanningLib";
import Filter from "components/common/Filter";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { toast } from "react-toastify";
import { GetAllUSystems } from "lib/USystemsLib";
import Switch from "../../../../common/Switch";
import { t } from "i18next";
import { useHistory } from "react-router-dom";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

const Analysis = ({ printAnalysis, handleChangeAction }) => {
  const history = useHistory();

  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  const [dupData, setDupData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(false);
  const [Usystems, setUsystems] = useState([]);
  const [switchState, setSwitchState] = useState(false);
  const [yearlySwitchState, setYearlySwitchState] = useState(false);
  const [calculation, setCalculation] = useState(true);
  const [filterLoading, setFilterLoading] = useState(null);
  // Filter State
  const [filterValues, setFilterValues] = useState({});
  const {
    currentTab,
    setSettingsFormData: setFormData,
    settingsFormData: formData,
  } = usePropertyContextCheck();

  const printRef = useRef();

  const getAllMaintenancePlan = async () => {
    let a = new Date().getFullYear() + 100;
    let b = new Date().getFullYear() - 100;

    const user = JSON.parse(localStorage.getItem("user"));
    setLoading(true);
    try {
      let allMaintenancePlan = await api.post(
        `/planning_component/maintainance/analysis/${user?._id}`
      );
      setData({
        labels: allMaintenancePlan?.data?.labels,
        datasets: allMaintenancePlan?.data?.data,
      });
      setDupData({
        labels: allMaintenancePlan?.data?.labels,
        datasets: allMaintenancePlan?.data?.data,
      });

      setLoading(false);
      setSwitchState(false);
      setYearlySwitchState(false);
    } catch (error) {
      console.error(error);
      setSwitchState(false);
      setYearlySwitchState(false);
    }
  };

  // useEffect(() => {
  //   if (formData && data?.labels.length > 0 && calculation) {
  //     calculatePercentage(data);
  //     setCalculation(false);
  //   }
  // }, [formData, data]);

  const getUsystems = async () => {
    setLoading(true);
    try {
      let all_u_systems = await api.get(`/u_systems?analysis=true`);
      setUsystems(all_u_systems?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // if (user) {
    //   getMaintencanceSettings(user?._id);
    // }
    getAllMaintenancePlan();
    getUsystems();
  }, [currentTab]);

  useEffect(() => {
    if (printAnalysis) {
      handlePrintClick();
    }
  }, [printAnalysis]);

  const genratePdf = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Analysis",
  });

  const handlePrintClick = () => {
    setTimeout(() => {
      genratePdf();
      handleChangeAction(null);
    }, [100]);
  };

  const getMaintencanceSettings = async (id) => {
    const res = await api.get(`/maintenance_settings/${id}`);
    setFormData(res?.data);
  };

  const plugins = {
    legend: {
      // display: false,
      // position: "bottom",
      // onClick: (e, item) => {
      //   console.log("Click Legend", e, item);
      // },

      onHover: (e, item) => {
        let txt = Usystems?.find(
          (el) => el?.system_code == item?.text
        )?.system_name;
        txt = txt ? txt : "No Text Provided!";
        toast(txt, {
          type: "info",
          autoClose: false,
          closeButton: false,
          // position: "top-center",
        });
      },
      onLeave: (e, item) => {
        toast.dismiss();
      },
    },
  };
  const options = {
    responsive: true,
    plugins: plugins,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedElement = elements[0];
        const datasetIndex = clickedElement.datasetIndex;
        const dataIndex = clickedElement.index;
        const clickedValue = data.datasets[datasetIndex].data[dataIndex];

        let Year = data?.labels[dataIndex];
        let SystemCode = data?.datasets[datasetIndex]?.label;
        localStorage.setItem("activeTabIdPlanningMaintainance", "overview");
        window.open(`/maintainence?currentYear=${Year}&u_system=${SystemCode}`);
      } else {
        console.log("empty");
      }
    },
    // tooltips: {
    //   mode: "custom",
    //   intersect: false,
    //   callbacks: {
    //     title: (tooltipItem) => "umair", // Display "umair" in tooltip title
    //     label: (tooltipItem, data) => {
    //       const datasetIndex = tooltipItem.datasetIndex;
    //       console.log("datasetIndex", datasetIndex);
    //       const dataIndex = tooltipItem.index;
    //       const value = data.datasets[datasetIndex].data[dataIndex];
    //       return `Value: ${value}`;
    //     },
    //   },
    // },
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
        grid: {
          display: false, // Remove vertical grid lines
        },
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
    maintainAspectRatio: false,
  };

  // Filter Code

  const handleFindClick = async () => {
    // perform find logic using filterValues

    let filterObj = {};
    for (const key in filterValues) {
      if (filterValues[key]?.length > 0) {
        filterObj[key] = filterValues[key];
      }
    }

    const res = await FilterAnalysis({
      body: JSON.stringify({
        filters: filterObj,
      }),
    });
    const newData = await res.json();
    setData({
      labels: newData?.labels,
      datasets: newData?.data,
    });
    setDupData({
      labels: newData?.labels,
      datasets: newData?.data,
    });
    setSwitchState(false);
    setYearlySwitchState(false);
    // }
  };

  const handleChangeSwitch = (e, newdata) => {
    setSwitchState(e);
    if (e === true && formData?.vat_percent) {
      let percent = formData.vat_percent;
      let dataArr = newdata ? newdata?.datasets : data?.datasets;

      let updatedData = dataArr?.map((elem) => {
        return {
          ...elem,
          data: elem.data.map((item) => {
            return (item * percent) / 100 + item;
          }),
        };
      });

      setData({ ...data, datasets: updatedData });
    } else {
      // Revert VAT
      let percent = formData?.vat_percent;
      let dataArr = newdata ? newdata?.datasets : data?.datasets;

      let revertedData = dataArr?.map((elem) => {
        return {
          ...elem,
          data: elem.data.map((item) => {
            return item / (1 + percent / 100); // Undo the VAT addition
          }),
        };
      });

      setData({ ...data, datasets: revertedData });
    }
  };

  const handleYearlyIncreaseSwitch = (e, newdata) => {
    setYearlySwitchState(e);
    if (
      e === true &&
      formData?.base_year_increase &&
      formData?.yearly_increase
    ) {
      const baseYearIndex = data.labels.findIndex(
        (year) => year === formData.base_year_increase
      );

      if (baseYearIndex === -1) {
        console.error("Base year not found in labels array.");
        return;
      }

      const yearlyIncrease = formData.yearly_increase;
      const dataArr = newdata ? newdata?.datasets : data?.datasets;

      const updatedData = dataArr?.map((dataset) => {
        let num = 1;
        return {
          ...dataset,
          data: dataset.data.map((value, index) => {
            if (index >= baseYearIndex) {
              const addition = 1 + yearlyIncrease / 100;
              const factor = Math.pow(addition, num);
              const result = value * factor;
              num++;
              return result;
            }
            return value;
          }),
        };
      });

      setData({ ...data, datasets: updatedData });
    } else {
      // Revert yearly increase
      const baseYearIndex = data.labels.findIndex(
        (year) => year === formData.base_year_increase
      );

      if (baseYearIndex === -1) {
        console.error("Base year not found in labels array.");
        setData(dupData);
        return;
      }

      const yearlyIncrease = formData.yearly_increase;
      const dataArr = newdata ? newdata?.datasets : data?.datasets;

      const revertedData = dataArr?.map((dataset) => {
        let num = 1;
        return {
          ...dataset,
          data: dataset.data.map((value, index) => {
            if (index >= baseYearIndex) {
              const addition = 1 + yearlyIncrease / 100;
              const factor = Math.pow(addition, num);
              const reverted = value / factor; // Undo the increase
              num++;
              return reverted;
            }
            return value;
          }),
        };
      });

      setData({ ...data, datasets: revertedData });
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Filter
        handleFindClick={handleFindClick}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        maintenanceAnalysis={true}
        setFilterLoading={setFilterLoading}
        currentTab={currentTab}
      />

      {/* .....................STacked Bar chart........................... */}
      {filterLoading && (
        <div
          ref={printRef}
          style={{
            padding: "0rem 1.5rem",
            width: "100%",
          }}
          className="analysis_main"
        >
          <div className="d-flex gap-4">
            <div className="vat_switch">
              <Switch
                checked={switchState}
                setChecked={setSwitchState}
                onChange={(e) => handleChangeSwitch(e, null)}
                text={
                  !switchState
                    ? t("common.pages.EX. VAT")
                    : t("common.pages.INC. VAT")
                }
                disabled={!formData?.vat_percent}
              />
            </div>
            <div className="vat_switch">
              <Switch
                checked={yearlySwitchState}
                setChecked={setYearlySwitchState}
                onChange={(e) => handleYearlyIncreaseSwitch(e, null)}
                text={t("data_settings.yearly_increase")}
                disabled={
                  !formData?.yearly_increase || !formData?.base_year_increase
                }
              />
            </div>
          </div>
          <div className="chart-container">
            <Bar data={data} options={options} />
          </div>
        </div>
      )}
    </>
  );
};

export default Analysis;
