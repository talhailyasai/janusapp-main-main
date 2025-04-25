import { Button } from "@themesberg/react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import "./MaintenanceReport.css";
import api from "api";
import Loader from "components/common/Loader";
import { FileUploader } from "react-drag-drop-files";
import { useTranslation } from "react-i18next";
import { RxCross2 } from "react-icons/rx";
import { RotatingLines } from "react-loader-spinner";

const fileTypes = ["JPEG", "PNG", "jpg"];

const MaintenanceReports = () => {
  const [editorHtml, setEditorHtml] = useState(null);
  const [maintenanceReport, setMaintenanceReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageloading, setImageLoading] = useState(false);
  const { t } = useTranslation();
  const quillRef = useRef(null);

  const getMaintenanceReport = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await api.get(`/maintenance-report/${user?._id}`);
      setMaintenanceReport(res?.data);
      setEditorHtml(res?.data?.value);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleUploadImage = async (file) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      console.log("file[0]", file[0]);
      setImageLoading(true);
      const formData = new FormData();
      formData.append("image", file[0]);
      if (maintenanceReport) {
        const res = await api.patch(
          `/maintenance-report/${user?._id}`,
          formData
        );
        setMaintenanceReport(res?.data);
      } else {
        formData.append("tenantId", user?._id);
        const res = await api.post(`/maintenance-report`, formData);
        setMaintenanceReport(res?.data);
      }
      setImageLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMaintenanceReport();
  }, []);

  const handleChange = (html) => {
    setEditorHtml(html);
  };
  // Custom clipboard handler
  const handlePaste = (e) => {
    e.preventDefault();

    // Get plain text from clipboard
    const text = e.clipboardData.getData("text/plain");

    // Get the editor instance
    const editor = quillRef.current.getEditor();

    // Get current selection
    const range = editor.getSelection();

    // Insert text at current cursor position
    if (range) {
      editor.insertText(range.index, text);
    }
  };

  // Function to apply custom styles to the editorHtml
  const applyCustomStyles = (htmlContent) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Tags to process
    const tagsToCheck = ["p", "h1", "h2", "h3"];

    tagsToCheck.forEach((tag) => {
      // Find all specified tags
      const elements = tempDiv.querySelectorAll(tag);
      elements.forEach((element) => {
        // Check if the element contains only a <br> or <br />
        if (
          element.innerHTML.trim() === "<br>" ||
          element.innerHTML.trim() === "<br />"
        ) {
          // Replace the element with a <br>
          const br = document.createElement("br");
          element.parentNode.replaceChild(br, element);
        }
      });
    });

    // Return the modified HTML content
    return tempDiv.innerHTML;
  };
  const handleSubmit = async () => {
    try {
      if (editorHtml) {
        const modifiedHtml = applyCustomStyles(editorHtml);
        const user = JSON.parse(localStorage.getItem("user"));

        let data = { value: `${modifiedHtml}` };
        if (maintenanceReport) {
          const res = await api.patch(`/maintenance-report/${user?._id}`, data);
          setMaintenanceReport(res?.data);
          setEditorHtml(res?.data?.value);
        } else {
          data.tenantId = user?._id;
          const res = await api.post(`/maintenance-report`, data);
          setMaintenanceReport(res?.data);
          setEditorHtml(res?.data?.value);
        }
        toast(t("planning_page.Success"), { type: "success" });
      } else {
        return toast("Please Fill the Report!", { type: "error" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemovePic = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await api.patch(`/maintenance-report/${user?._id}`, {
      image: null,
    });
    setMaintenanceReport(res?.data);
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Header dropdown
      [{ list: "ordered" }, { list: "bullet" }], // Ordered and unordered lists
      ["clean"], // Clear formatting
    ],
  };

  return (
    <div className="reportMain">
      {maintenanceReport?.image ? (
        <>
          <h4> {t("planning_page.Report_Image")} </h4>
          <div className="reportImageMain">
            <img
              src={maintenanceReport?.image}
              alt="property_image"
              className="reportImage"
            />

            <RxCross2
              className="property_cross_icon"
              onClick={handleRemovePic}
            />
          </div>
        </>
      ) : imageloading ? (
        // <div style={{ marginBottom: "1rem", padding: "1rem 11rem" }}>
        <RotatingLines
          strokeColor="rgb(53, 199, 251)"
          strokeWidth="5"
          animationDuration="0.75"
          width="60"
          visible={true}
        />
      ) : (
        <>
          <h4 style={{ marginBottom: "0.5rem" }}>
            {t("planning_page.Report_Image")}
          </h4>
          <FileUploader
            multiple={true}
            handleChange={handleUploadImage}
            name="file"
            types={fileTypes}
            label={t("property_page.upload_or_drag")}
          />
        </>
      )}
      {loading ? (
        <Loader />
      ) : (
        <>
          <div
            className="submit-section"
          >
            <h4>
              {t("planning_page.Custom_Report_Text")}
            </h4>
            <div className="save">
                <Button
                  className="save_btn"
                  onClick={handleSubmit}
                >
                  <span class="material-symbols-outlined">save</span>
                  <div>
                    {t("data_settings.save")}
                  </div>
                </Button>
              </div>
          </div>
          <div className="maintain_report_editor_main">
            <ReactQuill
              ref={quillRef}
              value={editorHtml}
              onChange={handleChange}
              className="maintenance_text_editor"
              onPaste={handlePaste}
              modules={modules}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MaintenanceReports;
