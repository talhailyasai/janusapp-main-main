import { Col, Row } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import InputBox from "components/common/InputBox";
import TextAreaBox from "components/common/TextArea";
import { useTranslation } from "react-i18next";
import { FileUploader } from "react-drag-drop-files";
import { RxCross2 } from "react-icons/rx";
import { BsEyeFill } from "react-icons/bs";

const Info = ({ defaultProps, mdCol, modifyComponent }) => {
  const { t } = useTranslation();
  const fileTypes = ["JPEG", "PNG", "jpg"];
  const [compImgUrl, setCompImgUrl] = useState(null);
  const [compImg, setCompImg] = useState(modifyComponent?.image?.link);

  const handleRemovePic = () => {
    setCompImgUrl(null);
    setCompImg(null);
    modifyComponent.image = undefined;
  };

  const handleChange = (e) => {
    setCompImgUrl(URL.createObjectURL(e));
    modifyComponent.image = e;
  };

  return (
    <div className="d-flex flex-wrap flex-xl-nowrap flex-column">
      <Row>
        <Col lg={mdCol}>
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("common.pages.model")}
            id={"model"}
            value={modifyComponent?.model}
          />
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("common.pages.manufacturer")}
            id={"manufacturer"}
            value={modifyComponent?.manufacturer}
          />
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("common.pages.installation_date")}
            id={"installation_date"}
            value={modifyComponent?.installation_date}
          />
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("planning_page.technical_life")}
            id={"technical_life_span"}
            value={modifyComponent?.technical_life_span}
          />
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("common.pages.reconstruction_year")}
            id={"reconstruction_year"}
            value={modifyComponent?.reconstruction_year}
          />
        </Col>
        <Col lg={mdCol}>
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("common.pages.warranty_expires")}
            id={"warranty_expires"}
            value={modifyComponent?.warranty_expires}
          />

          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("common.pages.warrantor")}
            id={"warrantor"}
            value={modifyComponent?.warrantor}
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
                width: mdCol ? "100%" : "50%",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h5 className="mt-4">{t("property_page.image")}</h5>
          <div>
            {compImgUrl && (
              <a a href={compImgUrl} target="_blank">
                <BsEyeFill />
              </a>
            )}

            <RxCross2
              className="property_cross_icon"
              style={{ marginLeft: "0.3rem" }}
              onClick={handleRemovePic}
            />
          </div>
        </div>
        <div className="file_uploader component_image">
          {compImgUrl ? (
            <>
              <div className="sidepanel_property_image_main">
                <img
                  src={compImgUrl}
                  alt="property_image"
                  className="sidepanel_property_image"
                />
              </div>
            </>
          ) : compImg ? (
            <>
              <div className="sidepanel_property_image_main">
                <img
                  src={compImg}
                  alt="property_image"
                  className="sidepanel_property_image"
                />
              </div>
            </>
          ) : (
            <FileUploader
              multiple={false}
              handleChange={handleChange}
              name="image"
              types={fileTypes}
              label={t("property_page.upload_or_drag")}
            />
          )}
        </div>
      </Row>
    </div>
  );
};

export default Info;
