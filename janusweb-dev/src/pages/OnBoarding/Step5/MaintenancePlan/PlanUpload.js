import { Button, Form } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const PlanUpload = ({ setStep, setCsvFile, step, setStopStep }) => {
  const { t } = useTranslation();

  const handleChangeFile = (e) => {
    setCsvFile(e);
    // setStep(10);
    setStopStep("PlanTable");
  };

  const handleBack = () => {
    setStopStep(null);
    setStep(4);
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

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = () => {};

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && validateFileFormat(file)) {
      let f = {
        target: {
          files: [file],
        },
      };
      handleChangeFile(f);
    }
  };
  return (
    <>
      <span
        class="material-symbols-outlined step_arrow_back"
        onClick={handleBack}
      >
        arrow_back
      </span>
      <div className="maintenance_main">
        <p className="maintenance_plan_head">
          {t("common.pages.Maintenance plan from file")}
        </p>

        <Form.Control
          type="file"
          name="image"
          id="uploadExcelData"
          onChange={(e) => handleChangeFile(e)}
          style={{ display: "none" }}
          accept=".xlsx,.csv,.xls"
          multiple={false}
        />

        <div
          className="csv_uploader_main cursor-pointer"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="csv_uploader cursor-pointer" for="uploadExcelData">
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
            href="https://janus-uploads.s3.eu-north-1.amazonaws.com/maintenance_plan_template.xlsx"
            target="_blank"
          >
            {t("common.pages.here!")}
          </a>
        </p>
      </div>
    </>
  );
};

export default PlanUpload;
