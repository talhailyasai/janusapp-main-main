import React, { useState, Suspense, lazy } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Button, Col, Row } from "@themesberg/react-bootstrap";
import { toast } from "react-toastify";

// Lazy load recharts components
const Charts = lazy(() => import('./ProcessedCharts'));

const Processed = ({ setStep, step, setStopStep, filename }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState([]);
  const [view, setView] = useState("");
  const { t } = useTranslation();

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/process",
        { filename },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.summary) {
        setSummary(response.data.summary);
        setView("table");
        toast.success("File processed successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Processing error:", error);
      toast.error(error.response?.data?.error || "Failed to process file", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCleanup = async () => {
    try {
      await axios.delete("http://localhost:5001/api/cleanup", {
        data: { filename },
      });
      toast.info("Cleanup completed", {
        position: "top-center",
        autoClose: 3000,
      });
      setStopStep("planCard");
    } catch (error) {
      toast.error("Cleanup failed", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const renderChart = () => {
    if (view !== "chart" || !summary.length) return null;

    return (
      <Suspense fallback={<div>Loading charts...</div>}>
        <Charts data={summary} />
      </Suspense>
    );
  };

  return (
    <>
      <span
        className="material-symbols-outlined step_arrow_back"
        onClick={() => setStopStep("planCard")}
      >
        arrow_back
      </span>
      <div className="maintenance_main">
        <p className="maintenance_plan_head">
          {t("common.pages.Process Maintenance Plan")}
        </p>

        <div className="import_card_main">
          {!summary.length ? (
            <Button
              className="step1_started_btn"
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : t("common.pages.Process File")}
            </Button>
          ) : (
            <div className="controls">
              <Button onClick={() => setView("table")}>Statistical Summary</Button>
              <Button onClick={() => setView("chart")}>Graphs</Button>
              <Button onClick={handleCleanup}>Delete All</Button>
            </div>
          )}

          {view === "table" && summary.length > 0 && (
            <div className="summary-table-container">
              <table className="summary-table">
                <thead>
                  <tr>
                    {Object.keys(summary[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {summary.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {renderChart()}
        </div>
      </div>
    </>
  );
};

export default Processed;
