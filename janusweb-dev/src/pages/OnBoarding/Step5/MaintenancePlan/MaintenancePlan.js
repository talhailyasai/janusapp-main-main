import React, { useState } from "react";
import axios from "axios";
import "./MaintenancePlan.css";
import { useTranslation } from "react-i18next";
import { Button, Col, Row } from "@themesberg/react-bootstrap";
import { toast } from "react-toastify";

const MaintenancePlan = ({ setStep, step, setStopStep }) => {
  const [activeMethod, setActiveMethod] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filename, setFilename] = useState(null);
  const { t } = useTranslation();

  const handlePdfFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      setActiveMethod("pdf");
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post('http://localhost:5001/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response && response.data && response.data.filename) {
          console.log('Upload successful:', response.data.filename);
          setFilename(response.data.filename);
          toast.success('File uploaded successfully!', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(error.response?.data?.error || 'Failed to upload PDF file', {
          position: "top-center",
          autoClose: 3000
        });
        setActiveMethod(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <span
        class="material-symbols-outlined step_arrow_back"
        onClick={() => setStopStep("planCard")}
      >
        arrow_back
      </span>
      <div className="maintenance_main">
        <p className="maintenance_plan_head">
          {" "}
          {t("common.pages.Maintenance plan from file")}
        </p>
        <p className="maintenance_para">
          {t(
            "common.pages.the Import from PDF option is only available for 1-year"
          )}
        </p>

        <div className="import_card_main">
          {/* Import existing maintenance plan */}
          <Row
            className={`step_import_main ${
              activeMethod === "pdf" ? "active_import_div" : ""
            }`}
          >
            <Col className="stepimport_icon" xs={2}>
              <span className="material-symbols-outlined property_direction_icon">
                assistant_direction
              </span>
            </Col>
            <Col xs={10}>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfFileSelect}
                style={{ display: 'none' }}
                id="pdf-file-input"
              />
              <label htmlFor="pdf-file-input" style={{ cursor: 'pointer' }}>
                <p className="step_import_heading">
                  {t("common.pages.import from pdf")}
                </p>
                {t("common.pages.Existing plan available in PDF format")}
              </label>
            </Col>
          </Row>

          {/* Create a new maintenance plan from scratch */}
          <Row
            className={`step_import_main step_maintenance_main ${
              activeMethod === "csv" ? "active_import_div" : ""
            }`}
            onClick={() => setActiveMethod("csv")}
          >
            <Col className="stepimport_icon" xs={2}>
              <span class="material-symbols-outlined property_direction_icon csv_icon">
                csv
              </span>
            </Col>
            <Col xs={10}>
              <p className="step_import_heading">
                {t("common.pages.Import from Excel, CSV")}
              </p>
              {t(
                "common.pages.If you have a maintenance plan in Excel/CSV format"
              )}
            </Col>
          </Row>
        </div>

        <div className="step1_submit_btn_main maintenance_plan_btn_main">
          <Button
            className="step1_started_btn"
            onClick={() => setStopStep("process")}
            disabled={!activeMethod || isUploading || !filename}
          >
            {isUploading ? "Processing..." : t("common.pages.Continue")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default MaintenancePlan;
