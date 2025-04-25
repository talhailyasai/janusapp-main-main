import { Col, Row } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import InputBox from "components/common/InputBox";
import TextAreaBox from "components/common/TextArea";
import { useTranslation } from "react-i18next";
import { FileUploader } from "react-drag-drop-files";
import { RxCross2 } from "react-icons/rx";

const ComponentInfoTab = ({ defaultProps, mdCol, modifyComponent }) => {
  const { t } = useTranslation();
  const fileTypes = ["JPEG", "PNG", "jpg"];
  const [compImgUrl, setCompImgUrl] = useState(null);
  const [compImg, setCompImg] = useState(modifyComponent?.image?.link);

  const handleRemovePic = () => {
    setCompImgUrl(null);
    setCompImg(null);
    modifyComponent.image = undefined;
  };

  return (
    <div className="d-flex flex-wrap flex-xl-nowrap flex-column">
      <Row>
        <Col lg={4}>
          <InputBox
            {...defaultProps}
            // mdCol={mdCol}
            text={t("common.pages.model")}
            id={"model"}
            value={modifyComponent?.model}
            infoTab={true}
          />
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("common.pages.manufacturer")}
            id={"manufacturer"}
            value={modifyComponent?.manufacturer}
            infoTab={true}
          />
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("common.pages.installation_date")}
            id={"installation_date"}
            value={modifyComponent?.installation_date}
            infoTab={true}
          />
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("planning_page.technical_life")}
            id={"technical_life_span"}
            value={modifyComponent?.technical_life_span}
            infoTab={true}
          />
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("common.pages.reconstruction_year")}
            id={"reconstruction_year"}
            value={modifyComponent?.reconstruction_year}
            infoTab={true}
          />
        </Col>

        <Col lg={4}>
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("common.pages.warranty_expires")}
            id={"warranty_expires"}
            value={modifyComponent?.warranty_expires}
            infoTab={true}
          />

          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("common.pages.warrantor")}
            id={"warrantor"}
            value={modifyComponent?.warrantor}
            infoTab={true}
          />
          <div>
            <label
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                color: "black",
              }}
            >
              {t("common.pages.warranty_notes")}
            </label>
            <div
              className="component-activity-details"
              style={{
                backgroundColor: "rgb(245, 248, 251)",
                padding: "0",
                color: "black",
                fontWeight: "bold",
                width: mdCol ? "100%" : "90%",
                height: "fit-content",
                border: "1px solid black",
                marginTop: 0,
                maxHeight: "20vh",
              }}
            >
              <div className="d-flex justify-content-between">
                <TextAreaBox
                  styles={{ height: "20vh" }}
                  {...defaultProps}
                  stylesTrue={false}
                  mdCol={12}
                  id={"warranty_notes"}
                  value={modifyComponent?.responsible_user}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div className="file_uploader mt-4">
        {compImg && (
          <>
            <div className="sidepanel_property_image_main">
              <img
                src={compImg}
                alt="property_image"
                className="sidepanel_property_image"
              />
              {/* <RxCross2
                  className="property_cross_icon"
                  onClick={handleRemovePic}
                /> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComponentInfoTab;
