import React, { useState } from "react";
import "./PropertyImport.css";
import { Button, Form } from "@themesberg/react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import LimitExceededModal from "components/common/Modals/LimitExceededModal";

const PropertyImport = ({
  setStep,
  step,
  setProperties,
  setStopStep,
  setCsvFile,
}) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [showMaxBuildingModal, setShowMaxBuildingModal] = useState(false);
  const [maxBuildingMessage, setMaxBuildingMessage] = useState("");
  const [exceedBuildingLimit, setExceedBuildingLimit] = useState(false);
  const [exceedPropertyLimit, setExceedPropertyLimit] = useState(false);
  const { accountStats, allPropertyCodes } = usePropertyContextCheck();

  const checkDataValidation = (data) => {
    let fileCorrect = true;
    const duplicatePropertyCodes = [];
    const duplicateBuildingCodes = [];
    let filteredData = [];

    // First check file format and collect duplicates
    data.forEach((property) => {
      const { property_code, legal_name, name, buildingsArray } = property;

      // Basic validation
      if (property_code && legal_name && name && buildingsArray.length > 0) {
        const building = buildingsArray[0];
        const { building_code, building_name } = building;

        if (building_code && building_name) {
          // Loose comparison for property codes
          const isDuplicateProperty = allPropertyCodes?.property_codes?.some(
            (code) => code == property_code // Using == for loose comparison
          );

          // Loose comparison for building codes
          const isDuplicateBuilding = allPropertyCodes?.building_codes?.some(
            (code) => code == building_code // Using == for loose comparison
          );

          if (isDuplicateProperty) {
            duplicatePropertyCodes.push(property_code);
            return;
          }

          if (isDuplicateBuilding) {
            duplicateBuildingCodes.push(building_code);
            return;
          }

          // If no duplicates, add to filtered data
          filteredData.push(property);
        } else {
          fileCorrect = false;
        }
      } else {
        fileCorrect = false;
      }

      // return null;
    });

    if (!fileCorrect) {
      toast.error(
        t(
          "common.pages.The file could not be read, please check that it follows the template"
        )
      );
      return false;
    }

    // If no valid data left after filtering
    if (filteredData.length === 0) {
      if (duplicatePropertyCodes.length > 0) {
        toast.error(
          t("Property with code {{code}} already exists", {
            code: duplicatePropertyCodes.join(", "),
          })
        );
      }

      if (duplicateBuildingCodes.length > 0) {
        toast.info(
          t("Building with code {{code}} already exists", {
            code: duplicateBuildingCodes.join(", "),
          })
        );
      }
      return false;
    }

    // Show messages for duplicates if any found
    if (duplicatePropertyCodes.length > 0) {
      toast.error(
        t("Property with code {{code}} already exists", {
          code: duplicatePropertyCodes.join(", "),
        })
      );
    }

    if (duplicateBuildingCodes.length > 0) {
      toast.info(
        t("Building with code {{code}} already exists", {
          code: duplicateBuildingCodes.join(", "),
        })
      );
    }

    // Check limits before returning filtered data
    if (checkExceedLimits(filteredData)) {
      return false;
    }

    return filteredData;
  };

  const handleCloseMaxProperty = () => {
    setShowMaxBuildingModal(false);
    setMaxBuildingMessage("");
  };

  // Common function to check limits
  const checkExceedLimits = (data) => {
    const propertyCount = data.length;
    const buildingCount = data.length;
    // data.reduce(
    //   (total, property) => total + (property?.buildingsArray?.length || 0),
    //   0
    // );

    const totalProperties = propertyCount + accountStats?.data?.propertyCount;
    const totalBuildings = buildingCount + accountStats?.data?.buildingCount;

    const isPropertyExceeded =
      totalProperties > accountStats?.data?.limits?.properties;
    const isBuildingExceeded =
      totalBuildings > accountStats?.data?.limits?.buildings;

    if (isPropertyExceeded) {
      setShowMaxBuildingModal(true);
      setMaxBuildingMessage(accountStats?.data?.messages?.properties);
      setExceedPropertyLimit(true);
      return true;
    }

    if (isBuildingExceeded) {
      setShowMaxBuildingModal(true);
      setMaxBuildingMessage(accountStats?.data?.messages?.buildings);
      setExceedBuildingLimit(true);
      return true;
    }

    setExceedPropertyLimit(false);
    setExceedBuildingLimit(false);
    return false;
  };

  const readFile = (selectedFile) => {
    setCsvFile(selectedFile);
    const user = JSON.parse(localStorage.getItem("user"));
    let f = selectedFile;
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const XLSX = await import("xlsx");
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!data || data.length < 2) {
          toast.error(
            t(
              "common.pages.The file could not be read, please check that it follows the template"
            )
          );
          return;
        }

        let removedElement = data.shift();
        let updateData = data?.filter((subArray) => subArray?.length > 0);

        let allData = updateData
          ?.map((arr) => {
            try {
              return {
                tenantId: user?._id,
                property_code: arr[10],
                legal_name: arr[11]?.toUpperCase(),
                name: arr[12]?.toUpperCase(),
                buildingsArray: [
                  {
                    tenantId: user?._id,
                    building_code: arr[0],
                    building_name: arr[1]?.toUpperCase(),
                    street_address: arr[2]?.toUpperCase(),
                    zip_code: arr[3],
                    city: arr[4]?.toUpperCase(),
                    construction_year: arr[5],
                    area_boa: arr[6],
                    area_loa: arr[7],
                    area_bra: arr[8],
                    area_bta: arr[9],
                    property_code: arr[10],
                  },
                ],
              };
            } catch (error) {
              console.error("Error processing row:", error);
              return null;
            }
          })
          .filter((item) => item !== null);

        if (!allData || allData.length === 0) {
          toast.error(
            t(
              "common.pages.The file could not be read, please check that it follows the template"
            )
          );
          return;
        }

        let validatedData = checkDataValidation(allData);
        if (
          validatedData !== false &&
          !exceedBuildingLimit &&
          !exceedPropertyLimit
        ) {
          setProperties(validatedData);
          setStopStep("PropertyTable");
          setStep(13);
        }
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error(
          t(
            "common.pages.The file could not be read, please check that it follows the template"
          )
        );
        document.getElementById("propImport").value = "";
      }
    };

    reader.onerror = () => {
      toast.error(
        t(
          "common.pages.The file could not be read, please check that it follows the template"
        )
      );
      document.getElementById("propImport").value = "";
    };

    try {
      reader.readAsBinaryString(f);
    } catch (error) {
      console.error("Error starting file read:", error);
      toast.error(
        t(
          "common.pages.The file could not be read, please check that it follows the template"
        )
      );
      document.getElementById("propImport").value = "";
    }
  };

  const handleChangeFile = (e) => {
    readFile(e.target.files[0]);
  };

  const hanldeBack = () => {
    setStopStep(null);
    setStep(3);
    setCsvFile(null);
  };

  const validateFileFormat = (file) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "application/vnd.ms-excel", // xls
      "text/csv", // csv
      "application/csv", // csv
    ];

    if (!validTypes.includes(file.type)) {
      toast.error(t("import.validation.Please upload only CSV or Excel file"));
      return false;
    }
    return true;
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFileFormat(file)) {
      readFile(file);
    }
  };

  return (
    <>
      <span
        class="material-symbols-outlined step_arrow_back"
        onClick={hanldeBack}
      >
        arrow_back
      </span>
      <div className="maintenance_main">
        <p className="maintenance_plan_head">
          {t("common.pages.Property data from file")}
        </p>
        <Form.Control
          type="file"
          name="image"
          id="propImport"
          onChange={(e) => handleChangeFile(e)}
          style={{ display: "none" }}
          accept=".xlsx,.csv,.xls"
          multiple={false}
        />
        <div
          className={`csv_uploader_main  cursor-pointer ${
            isDragging ? "dragging" : ""
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="csv_uploader  cursor-pointer" for="propImport">
            <span class="material-symbols-outlined csv_uploader_icon">
              add_notes
            </span>
            <p className="csv_uploader_head">
              {t("common.pages.Select a CSV or Excel file to import")}
            </p>
            <p className="csv_uploader_head csv_drag_head">
              {t("common.pages.or drag and drop it here")}
            </p>
          </label>
        </div>
        <p className="maintenance_plan_head missing_prop_head">
          {t(
            "common.pages.If you are missing the template, you can download it"
          )}{" "}
          <a
            href="https://janus-uploads.s3.eu-north-1.amazonaws.com/1725057753161-property_template.xlsx"
            target="_blank"
          >
            {t("common.pages.here!")}
          </a>
        </p>
      </div>
      {/* Maximum Buildings Modal  */}
      <LimitExceededModal
        show={showMaxBuildingModal}
        onHide={handleCloseMaxProperty}
        message={maxBuildingMessage}
      />
    </>
  );
};

export default PropertyImport;
