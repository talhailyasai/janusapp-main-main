import { Col, Container, Form, Row } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";
import Button from "components/common/Button";
import api from "api";
import { BsFileImage } from "react-icons/bs";
import Loader from "components/common/Loader";
import { FileUploader } from "react-drag-drop-files";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const FilesSidePanel = ({ handleSubmit, close, initalVal, handleClose }) => {
  const [file, setFile] = useState(initalVal);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleChange = async (file) => {
    try {
      const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file[0]?.size > maxFileSize) {
        toast.info(t("common.size-warning"));
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("files", file[0]);
      let createImageFile = await api.post(
        `/planning_component/maintainance/activitesPerYear-files/${initalVal?._id}`,
        formData
      );

      setFile(createImageFile?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fileTypes = ["JPEG", "PNG", "jpg"];
  return (
    <Form
      onSubmit={(e) => {
        handleSubmit(e, file);
      }}
    >
      <SidePanel>
        <SidePanelHeader> {t("planning_page.files")}</SidePanelHeader>
        <SidePanelBody>
          <div className="files_side_panel_main">
            {loading ? (
              <div style={{ marginBottom: "1rem", padding: "1rem 11rem" }}>
                <Loader />
              </div>
            ) : (
              <FileUploader
                multiple={true}
                handleChange={handleChange}
                name="file"
                types={fileTypes}
                label={t("property_page.upload_or_drag")}
                disabled={file?.files?.length === 4}
              />
            )}
          </div>
          {/* <Container className="mt-7">
            <Row className="mt-3">
              {file?.files?.map((el) => {
                return (
                  <Col md={6} className="mb-3">
                    <a href={el?.image} target="_blank">
                      <div className="show_file_div">
                        <BsFileImage className="files_icon" />
                        {el?.name}
                      </div>
                    </a>
                  </Col>
                );
              })}
            </Row>
          </Container> */}
          <Container className="mt-7">
            <Row className="mt-3">
              {file?.files?.map((el) => {
                return (
                  <Col
                    style={{ width: "auto" }}
                    className="mb-3"
                    key={el?.id || el?.name}
                  >
                    <a
                      href={el?.image}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {/* <div className="show_file_div"> */}
                      {/* <div className="file-details"> */}
                      <img
                        src={el?.image}
                        alt={el?.name || "Thumbnail"}
                        // className="thumbnail-preview"
                        style={{
                          width: "200px",
                          height: "200px",
                          marginBottom: "8px",
                        }}
                      />
                      {/* </div> */}
                      {/* </div> */}
                    </a>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </SidePanelBody>
        <SidePanelFooter>
          <Button
            main
            onClick={() => {
              handleClose();
              close();
            }}
          >
            {t("planning_page.close")}
          </Button>
        </SidePanelFooter>
      </SidePanel>
    </Form>
  );
};
export default FilesSidePanel;
