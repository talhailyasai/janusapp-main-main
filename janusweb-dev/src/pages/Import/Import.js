import {
  Button,
  Table,
  Form,
  Dropdown,
  Modal,
} from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import "./Import.css";
import api from "api";
import ImportMultiSelectDropDown from "../../components/common/ImportMultiSelectDropDown";
import { useTranslation } from "react-i18next";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import Popup from "reactjs-popup";
import CreateBuildingModal from "./CreateBuildingModal";
import MaintenanceSettingModal from "./MaintenanceSettingModal";
import { toast } from "react-toastify";
import { type } from "@testing-library/user-event/dist/type";
import leaf_icon from "../../assets/img/report/icon_leaf.png";
import money_icon from "../../assets/img/report/icon_money.png";
import risk_icon from "../../assets/img/report/icon_risk major.png";
import project_icon from "../../assets/img/report/icon_project.png";
import search_icon from "../../assets/img/report/icon_search.png";
import ImportDoneModal from "./ImportDoneModal";
import MaintenanceSettingMissingModal from "./MaintenanceSettingMissingModal";
import PropertyMissingModal from "./PropertyMissingModal";
import DataTable from "react-data-table-component";
import Loader from "components/common/Loader";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

const Import = ({
  csvFile,
  propertiesData,
  handleDataSubmit,
  setStep,
  step,
  setStopStep,
  setPropertiesData,
}) => {
  const [systemCode, setSystemCode] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [dupPropertiesData, setDupPropertiesData] = useState([]);
  const [maintenanceSetting, setMaintenanceSetting] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [dupFileData, setdupFileData] = useState([]);
  const [buildingOption, setBuildingOption] = useState([]);
  const [selectProperty, setSelectProperty] = useState(null);
  const [importDisable, setImportDisable] = useState(false);
  const [buildingModal, setBuildingModal] = useState(false);
  const [rowIndex, setRowIndex] = useState(null);
  const [show, setShow] = useState(false);
  const [doneModal, setDoneModal] = useState(false);
  const { t } = useTranslation();
  const [missingModalShow, setMissingModalShow] = useState(false);
  const [propertyMissingModalShow, setPropertyMissingModalShow] =
    useState(false);
  const [buildingCodes, setBuildingCodes] = useState([]);
  const { allProperties, setPropertyAdded } = usePropertyContextCheck();
  const [properties, setProperties] = useState([]);
  const [dupProperties, setDupProperties] = useState([]);

  const handleMissingModalShow = () => setMissingModalShow(true);
  const handlePropertyMissingModalShow = () =>
    setPropertyMissingModalShow(true);

  useEffect(() => {
    if (csvFile) {
      handleChangeFile(csvFile);
    }
  }, [csvFile]);
  useEffect(() => {
    if (fileData?.length > 0) {
      continueDisasble();
    }
  }, [fileData]);

  const getSystemCode = async () => {
    try {
      const res = await api.get("/u_systems");
      let updatedUSystem = res?.data?.map((elem) => {
        if (elem?.system_name?.length <= 18) {
          return { ...elem, show_system_name: elem?.system_name };
        } else {
          return {
            ...elem,
            show_system_name: `${elem?.system_name?.substring(0, 18)}...`,
          };
        }
      });
      setSystemCode(updatedUSystem);
    } catch (error) {
      console.log(error);
    }
  };
  const getBuildings = async () => {
    try {
      const res = await api.get("/buildings");
      let buildings;
      if (propertiesData) {
        buildings = propertiesData?.flatMap(
          (property) => property.buildingsArray
        );
      }
      const responseBuildings = Array.isArray(res?.data) ? res.data : [];
      buildings?.length > 0
        ? setBuildings([...responseBuildings, ...buildings])
        : setBuildings(responseBuildings);
    } catch (error) {
      console.log(error);
    }
  };
  // const getProperties = async () => {
  //   try {
  //     const res = await api.get("/properties");
  //     if (res?.data?.length == 0) {
  //       handlePropertyMissingModalShow();
  //     } else {
  //       let buildingCodes = [];
  //       if (propertiesData) {
  //         // console.log("alldata coming in getprop");
  //         let updatedProp = [...propertiesData, ...res?.data];
  //         setProperties(updatedProp);
  //         setDupProperties(updatedProp);
  //         buildingCodes = updatedProp.flatMap((prop) =>
  //           prop.buildingsArray.map((building) => building.building_code)
  //         );
  //       } else {
  //         setProperties(res?.data);
  //         setDupProperties(res?.data);
  //         buildingCodes = res?.data.flatMap((prop) =>
  //           prop.buildingsArray.map((building) => building.building_code)
  //         );
  //       }
  //       setBuildingCodes(buildingCodes);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // console.log(
  //   "loading alldata coming in outside prper",
  //   properties,
  //   "allproperties",
  //   allProperties
  // );

  const getMaintenanceSetting = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await api.get(`/maintenance_settings/${user?._id}`);
      setMaintenanceSetting(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSystemCode();
    getBuildings();
    // getProperties();
    getMaintenanceSetting();
  }, []);
  useEffect(() => {
    handleImportDisable();
  }, [fileData]);
  const [isLoading, setIsLoading] = useState(true);
  // console.log("allData buildingCodes outside", buildingCodes);

  const readFile = async (selectedFile) => {
    let buildCodes = [];
    let updatedProp = [];
    const responseBuildings = Array.isArray(allProperties) ? allProperties : [];
    if (
      allProperties == 0 &&
      (!propertiesData || propertiesData.length === 0)
    ) {
      handlePropertyMissingModalShow();
    } else {
      if (propertiesData) {
        updatedProp = [...propertiesData, ...responseBuildings];
        setProperties(updatedProp);
        setDupProperties(updatedProp);
        buildCodes = updatedProp?.flatMap((prop) =>
          prop.buildingsArray.map((building) => building.building_code)
        );
      } else {
        updatedProp = responseBuildings;

        setProperties(updatedProp);
        setDupProperties(updatedProp);
        buildCodes = updatedProp?.flatMap((prop) =>
          prop.buildingsArray.map((building) => building.building_code)
        );
      }
      setBuildingCodes(buildCodes);
    }
    console.log(
      "alldata coming in getprop",
      updatedProp,
      "allProperties",
      allProperties,
      "responseBuildings",
      responseBuildings,
      "propertiesData",
      propertiesData
    );
    const user = JSON.parse(localStorage.getItem("user"));

    let f = selectedFile;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      //   / Parse data /
      const XLSX = await import("xlsx");
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      //   / Get first worksheet /
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      //   / Convert array of arrays /
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      let removedElement = data.shift();
      //   / Update state /
      const processFileData = (data, user) => {
        let allData;
        // console.log(data);

        let updateData = data?.filter((subArray) => subArray?.length > 0);

        // console.log(
        //   "allData buildingCodes",
        //   buildingCodes,
        //   "updateData",
        //   updateData
        // );

        allData = updateData?.map((arr) => {
          let flags = {};
          // arr[12]?.split(",")?.map((flag) => {
          //   flags[flag] = true;
          // });
          const propertyForBuilding = updatedProp?.find((prop) =>
            prop.buildingsArray?.some(
              (building) => building.building_code == arr[19]
            )
          );
          const toSentenceCase = (str) => {
            if (!str) return "";
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
          };

          // Update the STATUS_MAPPINGS to use sentence case for main statuses
          const STATUS_MAPPINGS = {
            Planerad: [
              "PLANERAD",
              "SCHEMALAGD",
              "INPLANERAD",
              "KOMMANDE",
              "FRAMTIDA",
              "BOKAD",
              "FÖRUTBESTÄMD",
              "RESERVERAD",
              "AVSEDD",
              "FÖRBEREDD",

              //English Variants
              "PLANNED",
              "SCHEDULED",
              "ARRANGED",
              "UPCOMING",
              "FUTURE",
              "BOOKED",
              "INTENDED",
            ],
            Akut: [
              "AKUT",
              "BRÅDSKANDE",
              "OMEDELBAR",
              "KRITISK",
              "PRIORITERAD",
              "ALARMERANDE",
              "NÖDLÄGE",
              "BRÅTTOM",
              "KRIS",
              "PRESSANDE",

              // English variants
              "URGENT",
              "IMMEDIATE",
              "CRITICAL",
              "PRIORITIZED",
              "ALARMING",
              "EMERGENCY",
            ],
            Eftersatt: [
              "EFTERSATT",
              "FÖRSENAD",
              "FÖRDRÖJD",
              "UPPSKJUTEN",
              "NEGLIGERAD",
              "FÖRSUMMAD",
              "BORTGLÖMD",
              "ÖVERGIVEN",
              "ÅSIDOSATT",
              "IGNORERAD",

              // English variants
              "DEFERRED",
              "DELAYED",
              "POSTPONED",
              "NEGLECTED",
              "OVERLOOKED",
              "DISREGARDED",
              "IGNORED",
            ],
            Beslutad: [
              "BESLUTAD",
              "BESTÄMD",
              "AVGJORD",
              "FASTSTÄLLD",
              "BEKRÄFTAD",
              "GODKÄND",
              "ACCEPTERAD",
              "ANTAGEN",
              "BIFALLEN",
              "ÖVERENSKOMMEN",

              // English variants
              "DECIDED",
              "DETERMINED",
              "CONFIRMED",
              "APPROVED",
              "ACCEPTED",
              "GRANTED",
              "AGREED UPON",
            ],
            Utförd: [
              "UTFÖRD",
              "GENOMFÖRD",
              "AVKLARAD",
              "FÄRDIG",
              "SLUTFÖRD",
              "VERKSTÄLLD",
              "FULLBORDAD",
              "KOMPLETT",
              "KLAR",
              "LEVERERAD",

              // English variants
              "FULFILLED",
              "CARRIED OUT",
              "COMPLETED",
              "FINISHED",
              "EXECUTED",
              "ACCOMPLISHED",
              "FINALIZED",
              "DONE",
              "DELIVERED",
            ],
          };

          // Function to get main status in sentence case
          const getMainStatus = (inputStatus) => {
            if (!inputStatus) return null;

            const upperStatus = inputStatus.toUpperCase().trim();

            // Check through all mappings
            for (const [mainStatus, alternatives] of Object.entries(
              STATUS_MAPPINGS
            )) {
              if (
                alternatives.includes(upperStatus) ||
                upperStatus === mainStatus.toUpperCase()
              ) {
                return mainStatus; // mainStatus is already in sentence case in our mapping
              }
            }

            return null;
          };
          const returnObj = {
            uniqueKey: `row_${Date.now()}_${Math.random().toString(36)}`,
            tenantId: user?._id,
            article: arr[0]?.toUpperCase(),
            maintenance_activity: arr[1]?.toUpperCase(),
            technical_life: arr[2],
            status: getMainStatus(arr[3]) || "",
            position: arr[4]?.toUpperCase(),
            u_system: arr[5]?.toUpperCase(),
            quantity: arr[6],
            unit: arr[7]?.toUpperCase(),
            price_per_unit: arr[8],
            total_cost: arr[9],
            start_year: arr[10],
            previous_year: arr[11],
            risk_flag: arr[12] == true ? true : false,
            invest_flag: arr[13] == true ? true : false,
            inspection_flag: arr[14] == true ? true : false,
            energy_flag: arr[15] == true ? true : false,
            project_flag: arr[16] == true ? true : false,
            invest_percentage: arr[17],
            energy_save_percentage: arr[18],
            building_code: buildCodes?.some((bc) => bc == arr[19])
              ? arr[19].toString()
              : "",
            // allFlags: arr[12],
          };
          // Only add property_code if building exists
          // console.log(
          //   "propertyForBuilding",
          //   propertyForBuilding,
          //   "arr[19",
          //   arr[19]
          // );
          if (propertyForBuilding?.property_code && arr[19]) {
            returnObj.property_code = propertyForBuilding.property_code;
          }

          return returnObj;
        });

        let validatedData = checkDataValidation(allData);
        if (validatedData !== false) {
          setFileData(validatedData);
          setdupFileData(validatedData);
        }

        // console.log(
        //   "allData",
        //   allData,
        //   "validatedData",
        //   validatedData,
        //   "properties",
        //   properties
        // );
      };
      // if (propertiesData) {
      //   setTimeout(() => {
      processFileData(data, user);
      //   }, 2000);
      // } else {
      //   processFileData(data, user);
      // }
      //   try {
      //     let res = await api.post(`/businessData`, allData);
      //   } catch (error) {
      //     console.log(error);
      //   }
    };

    reader.readAsBinaryString(f);
    if (!propertiesData) {
      document.getElementById("uploadExcelData").value = "";
    }
  };

  const handleChangeFile = async (e) => {
    setIsLoading(true); // Stop loading after processing
    await readFile(e.target.files[0]);
  };

  const handleSystCodeChange = (name, value, indexNo, uniqueKey) => {
    let updatedData = fileData?.map((el, index) => {
      if (el?.uniqueKey == uniqueKey) {
        return { ...el, u_system: value[0] };
      } else {
        return el;
      }
    });
    setFileData(updatedData);
  };

  const chooseProperty = async (property) => {
    // console.log("choose prop buildings", buildings, "property", property);
    let buildOpt;
    // if (propertiesData) {
    //   let selectProp = propertiesData?.filter(
    //     (elem) => elem?.property_code == property.property_code
    //   );
    //   buildOpt = selectProp[0]?.buildingsArray;
    // } else {
    buildOpt = buildings?.filter(
      (elem) =>
        (elem?.property_code?.property_code || elem?.property_code) ==
        property.property_code
    );
    // }

    setBuildingOption(buildOpt);
    setSelectProperty(property);
  };

  const removeSelectedProp = async () => {
    setBuildingOption(null);
    setSelectProperty(null);
  };

  const handleSelectBuilding = async (building, close, uniqueKey) => {
    //debugger;
    // console.log("indexNo", indexNo, "fileData", fileData, "building", building);
    setFileData(
      fileData?.map((el, index) =>
        el.uniqueKey == uniqueKey
          ? {
              ...el,
              building_code: building?.building_code,
              property_code:
                building?.property_code?.property_code ||
                building?.property_code,
            }
          : el
      )
    );
    if (close) {
      close();
      setProperties(dupProperties);
    }
  };

  const handleImportDisable = () => {
    const invalidData = fileData?.some((elem) => {
      const foundCode = systemCode?.find(
        (item) => item?.system_code == elem.u_system
      );
      const foundBuilding = buildings?.find(
        (item) => item?.building_code == elem.building_code
      );
      return !foundCode || !foundBuilding;
    });

    setImportDisable(fileData?.length == 0 || invalidData);
  };

  const validateNumericProperty = (property, min, max, uploadedData) => {
    return uploadedData?.some(
      (elem) =>
        elem?.[property] &&
        (typeof elem?.[property] !== "number" ||
          elem?.[property] < min ||
          elem?.[property] > max)
    );
  };

  const validateStringProperty = (property, uploadedData) => {
    return uploadedData?.some(
      (elem) => elem?.[property] && typeof elem?.[property] !== "string"
    );
  };

  const validateYear = (property, length, uploadedData) => {
    return uploadedData?.some(
      (elem) =>
        !elem?.[property] ||
        typeof elem?.[property] !== "number" ||
        elem?.[property].toString().length !== length
    );
  };

  const validatePercentage = (property, min, max, uploadedData) => {
    return uploadedData?.some(
      (elem) =>
        (elem?.[property] && typeof elem?.[property] !== "number") ||
        elem?.[property] < min ||
        elem?.[property] > max
    );
  };

  const checkDataValidation = (data) => {
    let uploadedData = data;
    if (uploadedData?.some((elem) => !elem?.maintenance_activity)) {
      toast(t("import.validation.maintenance_activity_error"), {
        type: "error",
      });
      return false;
    }
    // ........Tec Life.......
    if (validateNumericProperty("technical_life", 1, 200, uploadedData)) {
      toast(t("import.validation.technical_life_error"), {
        type: "error",
      });
      return false;
    }
    // Status
    const allowedStatus = [
      "PLANERAD",
      "AKUT",
      "EFTERSATT",
      "BESLUTAD",
      "UTFORD",
      "UTFÖRD",
    ];
    let newData = uploadedData?.map((elem) => ({
      ...elem,
      status:
        elem?.status && !allowedStatus.includes(elem?.status?.toUpperCase())
          ? null
          : elem?.status,
    }));
    uploadedData = newData.map((item) => ({
      ...item,
      total_cost: item?.total_cost
        ? parseInt(item.total_cost.toString().replace(/\s+/g, "")) // Convert to string and remove whitespaces
        : item.total_cost, // Keep the original value if it's null or undefined
    }));

    // ..................Quantity.............................
    if (validateNumericProperty("quantity", uploadedData)) {
      toast(t("import.validation.quantity_error"), { type: "error" });
      return false;
    }
    //  ........................Unit........................................
    if (validateStringProperty("unit", uploadedData)) {
      toast(t("import.validation.unit_error"), { type: "error" });
      return false;
    }
    // ..........Unit Price......................
    if (validateNumericProperty("price_per_unit", uploadedData)) {
      toast(t("import.validation.price_per_unit_error"), { type: "error" });
      return false;
    }
    // ...................Total Cost......................
    if (
      uploadedData?.some(
        (elem) => !elem?.total_cost || typeof elem?.total_cost !== "number"
      )
    ) {
      toast(t("import.validation.total_cost_error"), { type: "error" });

      return false;
    }
    // ..................Start Year.............
    if (validateYear("start_year", 4, uploadedData)) {
      toast(t("import.validation.start_year_error"), { type: "error" });
      return false;
    }
    // .................Prev Year.....................
    const invalidPrevYear = uploadedData?.some(
      (elem) =>
        elem?.previous_year &&
        (typeof elem?.previous_year !== "number" ||
          elem?.previous_year?.toString()?.length !== 4)
    );
    if (invalidPrevYear) {
      toast(t("import.validation.prev_year_error"), { type: "error" });
      return false;
    }
    // ..............Investment Percentage.............................
    if (validatePercentage("invest_percentage", 0, 100, uploadedData)) {
      toast(t("import.validation.investment_error"), { type: "error" });
      return false;
    }
    // ....................Energy Percentage................................
    if (validatePercentage("energy_save_percentage", 0, 100, uploadedData)) {
      toast(t("import.validation.energy_error"), { type: "error" });
      return false;
    }
    return uploadedData;
  };
  const showDoneModal = () => {
    setPropertyAdded({});
    setDoneModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (maintenanceSetting?.plan_start_year) {
        // Maintenance Activity
        // if (fileData?.some((elem) => !elem?.maintenance_activity)) {
        //   return toast("Please add Maintenance Activity for all objects!", {
        //     type: "error",
        //   });
        // }
        // // ........Tec Life.......
        // if (validateNumericProperty("technical_life", 1, 200)) {
        //   return toast("Please Set Correct technical_life !", {
        //     type: "error",
        //   });
        // }
        // // Status
        // const allowedStatus = [
        //   "Planerad",
        //   "Akut",
        //   "Eftersatt",
        //   "Beslutad",
        //   "Utförd",
        // ];
        // let newData = fileData?.map((elem) => ({
        //   ...elem,
        //   status:
        //     elem?.status && !allowedStatus.includes(elem.status)
        //       ? null
        //       : elem.status,
        // }));
        // setFileData(newData);
        // // ..................Quantity.............................
        // if (validateNumericProperty("quantity")) {
        //   return toast("Please Set Correct Quantity!", { type: "error" });
        // }
        // //  ........................Unit........................................
        // if (validateStringProperty("unit")) {
        //   return toast("Please Set Correct Unit!", { type: "error" });
        // }
        // // ..........Unit Price......................
        // if (validateNumericProperty("price_per_unit")) {
        //   return toast("Please Set Correct Unit Price!", { type: "error" });
        // }
        // // ...................Total Cost......................
        // if (
        //   fileData?.some(
        //     (elem) => !elem?.total_cost || typeof elem?.total_cost !== "number"
        //   )
        // ) {
        //   return toast("Please add Correct Total Cost!", {
        //     type: "error",
        //   });
        // }
        // // ..................Start Year.............
        // if (validateYear("start_year", 4)) {
        //   return toast("Please Set Correct Start Year!", { type: "error" });
        // }
        // // .................Prev Year.....................
        // const invalidPrevYear = fileData?.some(
        //   (elem) =>
        //     elem?.previous_year &&
        //     (typeof elem?.previous_year !== "number" ||
        //       elem?.previous_year?.toString()?.length !== 4)
        // );
        // if (invalidPrevYear) {
        //   return toast("Please Set Correct Prev Year!", {
        //     type: "error",
        //   });
        // }
        // // ..............Investment Percentage.............................
        // if (validatePercentage("invest_percentage", 0, 100)) {
        //   return toast("Please Set Correct Investment Percentage!", {
        //     type: "error",
        //   });
        // }
        // // ....................Energy Percentage................................
        // if (validatePercentage("energy_save_percentage", 0, 100)) {
        //   return toast("Please Set Correct Energy Saving Percentage!", {
        //     type: "error",
        //   });
        // }
        // // ..............Set Property Code As Building base......................
        // let data = fileData?.map((elem) => ({
        //   ...elem,
        //   property_code:
        //     elem?.property_code ||
        //     buildings?.find(
        //       (item) => item?.building_code == elem?.building_code
        //     )?.property_code?.property_code,
        // }));
        // console.log("data", data);
        // console.log("fileData", fileData);
        // console.log("buildings", buildings);
        // ..............Set Property Code As Building base......................
        const hasEmptyBuildingCode = fileData?.some(
          (item) => !item.building_code
        );

        if (hasEmptyBuildingCode) {
          toast.warning(t("common.pages.please_select_building_for_all_items"));
          return;
        }
        let data = fileData?.map((elem) => ({
          ...elem,
          property_code:
            elem?.property_code ||
            buildings?.find(
              (item) => item?.building_code == elem?.building_code
            )?.property_code?.property_code,
          quantity: Number(elem?.quantity),
        }));
        const res = await api.post(`/plannings?upload=${true}`, { data });
        showDoneModal();
      } else {
        // Maintenance Setting Modal
        // showSettingModal();
        handleMissingModalShow();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShow = (uniqueKey, close) => {
    setRowIndex(uniqueKey);
    setBuildingModal(true);
  };

  const showSettingModal = () => setShow(true);

  const handleSearch = (e) => {
    let val = e.target.value.toLowerCase();
    if (val == "") {
      setProperties(dupProperties);
    } else {
      // if (propertiesData) {
      //   setPropertiesData(
      //     dupPropertiesData?.filter((el) =>
      //       el?.legal_name?.toLowerCase()?.includes(val)
      //     )
      //   );
      // } else {
      setProperties(
        dupProperties?.filter((el) =>
          el?.legal_name?.toLowerCase()?.includes(val)
        )
      );
      // }
    }
  };

  const hanldeOnBoardData = () => {
    const hasEmptyBuildingCode = fileData?.some((item) => !item.building_code);

    if (hasEmptyBuildingCode) {
      toast.warning(t("common.pages.please_select_building_for_all_items"));
      return;
    }
    let data = { propertiesData: propertiesData, maintenancePlan: fileData };
    handleDataSubmit(data);
  };

  const renderProperties = (properties) => {
    return properties?.map((property, index) => (
      <tr>
        {/* <td>{property?.property_code}</td> */}

        <td
          className="popup_table_data table_property_name"
          onClick={() => chooseProperty(property)}
        >
          {property?.legal_name}
        </td>
      </tr>
    ));
  };
  const continueDisasble = () => {
    let error = fileData?.map((elem, index) => {
      let foundCode = systemCode?.find(
        (item) => item?.system_code == elem.u_system
      );
      let foundbuilding = buildings?.find(
        (item) => item?.building_code == elem.building_code
      );
      // console.log(
      //   "foundbuilding",
      //   foundbuilding,
      //   "elem >>",
      //   elem,
      //   "foundCode",
      //   foundCode
      // );

      return !foundCode || !foundbuilding ? true : false;
    });
    return error[0] ? true : false;

    // setOnBoardingContinue(error);
  };
  useEffect(() => {
    setDupPropertiesData(propertiesData);
  }, []);
  const [selectedRows, setSelectedRows] = useState([]);

  // Handle checkbox toggle
  const handleCheckboxChange = (uniqueKey) => {
    setSelectedRows(
      (prevSelected) =>
        prevSelected.includes(uniqueKey)
          ? prevSelected.filter((key) => key !== uniqueKey) // Remove if already selected
          : [...prevSelected, uniqueKey] // Add to selected
    );
  };

  // Delete selected rows
  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) {
      toast.warning(
        t("planning_page.please_select_at_least_one_item_to_perform")
      );
      return;
    }
    setFileData(
      fileData.filter((row) => !selectedRows.includes(row.uniqueKey))
    );
    setSelectedRows([]); // Clear selected rows after deletion
  };
  const importTableColoumn = [
    {
      name: (
        <Form.Check
          type="checkbox"
          checked={
            selectedRows.length === fileData.length && fileData.length > 0
          }
          className="custom-row-checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(fileData.map((row) => row.uniqueKey));
            } else {
              setSelectedRows([]);
            }
          }}
        />
      ),
      cell: (row) => (
        <Form.Check
          className="custom-row-checkbox"
          type="checkbox"
          checked={selectedRows.includes(row.uniqueKey)}
          onChange={() => handleCheckboxChange(row.uniqueKey)}
        />
      ),
      width: "50px",
    },
    {
      name: t("common.pages.Article"),
      cell: (row, index, column, id) => {
        return <span>{row.article} </span>;
      },
      selector: "article",
      sortable: true,
    },
    {
      name: t("common.pages.Maintaince_Activity"),
      cell: (row, index, column, id) => {
        return <span>{row.maintenance_activity} </span>;
      },
      sortable: true,
      selector: "maintenance_activity",
      width: "300px",
    },
    {
      name: t("common.pages.Techn.life"),
      cell: (row, index, column, id) => {
        return <span>{row.technical_life} </span>;
      },
      selector: "technical_life",
      sortable: true,
    },
    {
      name: t("common.pages.Status"),
      cell: (row, index, column, id) => {
        return (
          <span> {row.status ? t(`common.pages.${row.status}`) : "-"} </span>
        );
      },
      sortable: true,
      selector: "status",
    },
    {
      name: t("common.pages.Position"),
      cell: (row, index, column, id) => {
        return <span> {row.position} </span>;
      },
      selector: "position",
      // width: "130px",
      sortable: true,
    },
    {
      name: t("common.pages.System"),
      cell: (row, index, column, id) => {
        let foundCode = systemCode?.find(
          (item) => item?.system_code == row?.u_system
        );
        let originalCode = systemCode?.find(
          (item) =>
            item?.system_code ==
            dupFileData?.find((data) => data.uniqueKey === row.uniqueKey)
              ?.u_system
        );
        return (
          <span className={!foundCode && "import_error"}>
            <div className={"import_error_div"}>
              {foundCode && row?.u_system}
              {!originalCode && (
                <>
                  <ImportMultiSelectDropDown
                    options={systemCode?.map((item) => ({
                      label: `${item?.system_code} ${item?.show_system_name}`,
                      id: item.system_code,
                      system_name: item?.system_name,
                    }))}
                    name="u_system"
                    selectedOptions={[row?.u_system]}
                    onSelectionChange={(name, value) =>
                      handleSystCodeChange(name, value, index, row?.uniqueKey)
                    }
                    placeholder={" "}
                    import={true}
                  />
                </>
              )}
            </div>
          </span>
        );
      },
      sortable: true,
      selector: "u_system",
      width: "150px",
    },
    {
      name: t("common.pages.Quant"),
      cell: (row, index, column, id) => {
        return <span> {row?.quantity} </span>;
      },
      selector: "quantity",
      sortable: true,
    },
    {
      name: t("common.pages.Unit"),
      cell: (row, index, column, id) => {
        return <span> {row?.unit} </span>;
      },
      sortable: true,
      selector: "unit",
    },
    {
      name: t("common.pages.Unit_price"),
      cell: (row, index, column, id) => {
        return <span> {row?.price_per_unit || 0} </span>;
      },
      sortable: true,
      selector: "price_per_unit",
    },

    {
      name: t("common.pages.Total_Cost"),
      cell: (row, index, column, id) => {
        return <span>{row?.total_cost}</span>;
      },
      sortable: true,
      selector: "total_cost",
    },

    {
      name: t("common.pages.Start_Yr"),
      cell: (row, index, column, id) => {
        return <span> {row?.start_year} </span>;
      },
      sortable: true,
      selector: "start_year",
    },
    {
      name: t("common.pages.prev_year"),
      cell: (row, index, column, id) => {
        return <span>{row?.previous_year}</span>;
      },
      sortable: true,
      selector: "previous_year",
    },

    {
      name: t("common.pages.Flags"),
      cell: (row, index, column, id) => {
        return (
          <div className="import_inner_flag">
            {row?.risk_flag && (
              <img src={risk_icon} alt="risk-icon" className={"leaf_img"} />
            )}
            {row?.invest_flag && (
              <img src={money_icon} alt="money-icon" className={"leaf_img"} />
            )}
            {row?.inspection_flag && (
              <img src={search_icon} alt="search-icon" className={"leaf_img"} />
            )}
            {row?.energy_flag && (
              <img src={leaf_icon} alt="leaf-icon" className={"leaf_img"} />
            )}
            {row?.project_flag && (
              <img
                src={project_icon}
                alt="project-icon"
                className={"leaf_img"}
              />
            )}
          </div>
        );
      },
      sortable: true,
      width: "200px",
    },

    {
      name: t("common.pages.Building"),
      cell: (row, index, column, id) => {
        let foundbuilding = buildings?.find(
          (item) => item?.building_code == row?.building_code
        );

        let originalBuilding = buildings?.find(
          (item) =>
            item?.building_code ===
            dupFileData?.find((data) => data.uniqueKey === row.uniqueKey)
              ?.building_code
        );
        return (
          <span className={!foundbuilding && "import_error"}>
            <div className={"import_error_div"}>
              {row?.building_code && row?.building_code}
              {!originalBuilding && (
                <>
                  {/* Building Dropdown */}
                  <Popup
                    className="superVisionPopup"
                    key={index}
                    trigger={
                      <div
                        // className={`pin c_${building?.buildingStatus}`}
                        // onClick={() => handleMarkerClick(building)}
                        // number={index + 1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0px 3px",
                        }}
                      >
                        {!row?.building_code && <div>Select</div>}
                        <IoMdArrowDropdownCircle className="import_dropdown_icon" />
                      </div>
                    }
                    position="bottom right"
                    on="click"
                    closeOnDocumentClick
                    mouseLeaveDelay={300}
                    mouseEnterDelay={0}
                    contentStyle={{
                      padding: "0px",
                      border: "none",
                    }}
                    arrow={true}
                    onClose={() => setSelectProperty(null)}
                  >
                    {(close) => (
                      <>
                        <div className="superVisionPopup import_popup">
                          <div
                            className={
                              !selectProperty
                                ? "popup_header import_build_drop"
                                : "popup_header import_prop_drop"
                            }
                          >
                            {selectProperty ? (
                              <>
                                <span
                                  class="material-symbols-outlined import_build_back_arrow"
                                  onClick={removeSelectedProp}
                                >
                                  arrow_back
                                </span>

                                {selectProperty?.legal_name}
                              </>
                            ) : (
                              <>
                                <Form.Control
                                  placeholder={t("common.pages.search_options")}
                                  onChange={(e) => handleSearch(e)}
                                  className="building_search"
                                />

                                <span
                                  class="material-symbols-outlined import_build_cancel"
                                  onClick={() => {
                                    setProperties(dupProperties);
                                    close(); // Close the popup when cancel is clicked
                                  }}
                                >
                                  cancel
                                </span>
                              </>
                            )}
                          </div>
                          <hr />
                          <div className={"import_build_code_main"}>
                            <Table borderless>
                              <tbody>
                                {selectProperty ? (
                                  buildingOption?.map((elem) => {
                                    return (
                                      <tr
                                        onClick={() =>
                                          handleSelectBuilding(
                                            elem,
                                            close,
                                            row?.uniqueKey
                                          )
                                        }
                                        className="popup_table_data table_property_name"
                                      >
                                        <td>{elem?.building_code}</td>
                                        <td>
                                          {selectProperty && propertiesData
                                            ? elem?.building_name
                                            : elem?.name}
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <>
                                    {renderProperties(properties)}
                                    <hr />
                                    <div>
                                      <Button
                                        className="create_property_bulding_btn"
                                        onClick={() => {
                                          handleShow(row?.uniqueKey, close);
                                          setProperties(dupProperties);
                                        }}
                                      >
                                        <AiOutlinePlus className="import_add_build_icon" />
                                        {t("common.pages.create_property")}
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </>
                    )}
                  </Popup>
                </>
              )}
            </div>
          </span>
        );
      },
      width: "150px",
    },
  ];
  // console.log(
  //   "buildings",
  //   buildings,
  //   "properties",
  //   properties,
  //   "propertiesData",
  //   propertiesData
  // );
  // console.log("loading", isLoading);

  return (
    <>
      <div className="import_main">
        {csvFile ? null : (
          <>
            {/* upload files  */}
            <a href="https://janus-uploads.s3.eu-north-1.amazonaws.com/maintenance_plan_template.xlsx">
              <h5 className="downloadTemplate">
                {t("common.pages.download_temp")}
              </h5>
            </a>
            <Form.Control
              type="file"
              name="image"
              id="uploadExcelData"
              onChange={(e) => handleChangeFile(e)}
              style={{ display: "none" }}
              accept=".xlsx,.csv,.xls"
              multiple={false}
            />
            <label
              for="uploadExcelData"
              style={{ display: "block", width: "12rem", marginTop: "3rem" }}
            >
              <div className="import_select_btn">
                {t("common.pages.select_file_to_import")}
              </div>
            </label>
          </>
        )}

        <div className="import_table_main">
          <div className="w-100 d-flex gap-4 justify-content-end">
            {csvFile ? null : (
              <Button
                className={
                  importDisable
                    ? "import_data_btn import_disable_btn"
                    : "import_data_btn"
                }
                // disabled={importDisable}
                onClick={handleSubmit}
              >
                {t("common.pages.import_Data")}
              </Button>
            )}
            <div
              className="delete_select_btn"
              disabled={selectedRows.length === 0}
              onClick={handleDeleteSelected}
            >
              {t("Delete Selected")}
            </div>
          </div>
          {/* {isLoading && <Loader />} */}
          {fileData?.length > 0 && (
            <div className="import_table">
              <DataTable
                data={fileData}
                columns={importTableColoumn}
                noDataComponent={t(
                  "common.pages.There are no records to display"
                )}
                highlightOnHover
                responsive
                pagination
                className="create_edit_table"
                paginationComponentOptions={{
                  rowsPerPageText: t("planning_page.rows_per_page"),
                }}
              />
            </div>
          )}
        </div>

        {csvFile && (
          <div className="step1_submit_btn_main step_4continue next_step_btn">
            <Button
              className="step1_started_btn"
              onClick={hanldeOnBoardData}
              // disabled={continueDisasble()}
            >
              {t("common.pages.Continue")}
            </Button>
          </div>
        )}

        {/* Create Building Modal */}
        <CreateBuildingModal
          buildingModal={buildingModal}
          setBuildingModal={setBuildingModal}
          buildings={buildings}
          setBuildings={setBuildings}
          handleSelectBuilding={handleSelectBuilding}
          rowIndex={rowIndex}
          setRowIndex={setRowIndex}
          properties={properties}
          setProperties={setProperties}
          setDupProperties={setDupProperties}
          setPropertiesData={setPropertiesData}
          setDupPropertiesData={setDupPropertiesData}
          propertiesData={propertiesData}
        />

        {/* Maintenance Setting  Missing Modal */}
        <MaintenanceSettingMissingModal
          missingModalShow={missingModalShow}
          setMissingModalShow={setMissingModalShow}
          showSettingModal={showSettingModal}
        />
        {/* Maintenance Setting Modal */}
        <MaintenanceSettingModal
          show={show}
          setShow={setShow}
          maintenanceSetting={maintenanceSetting}
          setMaintenanceSetting={setMaintenanceSetting}
          createPlan={handleSubmit}
        />

        {/* Property Missing Modal */}
        {!propertiesData && (
          <PropertyMissingModal
            propertyMissingModalShow={propertyMissingModalShow}
            setPropertyMissingModalShow={setPropertyMissingModalShow}
          />
        )}

        {/* Import Done ModaL */}
        <ImportDoneModal doneModal={doneModal} setDoneModal={setDoneModal} />
      </div>
    </>
  );
};

export default Import;
