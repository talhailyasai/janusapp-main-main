import React, { useEffect, useState } from "react";
import InputBox from "components/common/InputBox";
import { Button, Row } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { FileUploader } from "react-drag-drop-files";
import { RxCross2 } from "react-icons/rx";
import api from "api";
import { GetSingleBuildingByBuildingCode } from "lib/BuildingLib";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { uploadFile } from "../../../../utils/helper";
import { BsEyeFill } from "react-icons/bs";

const Quantities = ({
  defaultProps,
  modifyBuilding,
  mdCol,
  imageUploader,
  sidePanel,
  handleChangeAction,
  setModifyBuilding,
}) => {
  const { t } = useTranslation();
  const fileTypes = ["JPEG", "PNG", "jpg"];

  const [buildingImgUrl, setBuildingImgUrl] = useState(null);
  // const [buildingImg, setBuildingImg] = useState(
  //   URL.createObjectURL(modifyBuilding?.image && modifyBuilding?.image)
  // );
  const [buildingImg, setBuildingImg] = useState(null);

  useEffect(() => {
    // console.log(modifyBuilding, "modifyBuilding");
    if (modifyBuilding?.image) {
      // console.log("yes yes");
      const objectUrl = modifyBuilding.image?.link;
      setBuildingImg(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      // setBuildingImg("path/to/default/image.jpg"); // Fallback image
    }
  }, [modifyBuilding]);

  const { propertyChange, buildingChange } = usePropertyContextCheck();

  //   Buiding Code
  const { value: singleBuildingData, loading: buildingLoading } =
    GetSingleBuildingByBuildingCode(buildingChange || undefined, {}, [
      buildingChange,
      propertyChange,
    ]);

  const handleRemovePic = () => {
    setBuildingImgUrl(null);
    setBuildingImg(null);
    modifyBuilding.image = undefined;
  };

  const handleChange = async (e) => {
    try {
      // uploadFile(e, (res, type) => {
      //   console.log(res);
      // modifyBuilding.image = {
      //   link: res?.Location,
      //   format: type || "jpg",
      //   key: res?.key,
      // };
      // });
      setBuildingImgUrl(URL.createObjectURL(e));
      // if (!sidePanel) {
      let formData = new FormData();
      formData.append("image", e);
      let res = await api.put(
        `/buildings/${singleBuildingData?._id}`,
        formData
      );
      //debugger;
      // modifyBuilding.image = {
      //   link: res?.data?.image?.link,
      //   format: res?.data?.image?.format || "jpg",
      //   key: res?.data?.image?.key,
      // };
      setModifyBuilding({
        ...modifyBuilding,
        image: {
          link: res?.data?.image?.link,
          format: res?.data?.image?.format || "jpg",
          key: res?.data?.image?.key,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Row>
      <h5
        style={{
          textAlign: "center",
          fontWeight: "700",
          margin: "1.5rem 0rem",
        }}
      >
        {sidePanel ? t("property_page.Quantities") : null}
      </h5>
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.no_of_windows")}
        id={"no_of_windows"}
        value={modifyBuilding?.no_of_windows}
      />
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.no_of_light_fixtures")}
        id={"no_of_light_fixtures"}
        value={modifyBuilding?.no_of_light_fixtures}
      />

      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.no_of_balconies")}
        id={"no_of_balconies"}
        value={modifyBuilding?.no_of_balconies}
      />
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.facade_area")}
        id={"facade_area"}
        value={modifyBuilding?.facade_area}
      />
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.no_of_entrance_doors")}
        id={"no_of_entrance_doors"}
        value={modifyBuilding?.no_of_entrance_doors}
      />

      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.no_of_stairwells")}
        id={"no_of_stairwells"}
        value={modifyBuilding?.no_of_stairwells}
      />

      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.no_of_ventilation_units")}
        id={"no_of_ventilation_units"}
        value={modifyBuilding?.no_of_ventilation_units}
      />

      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.no_of_laundries")}
        id={"no_of_laundries"}
        value={modifyBuilding?.no_of_laundries}
      />

      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.no_of_light_posts")}
        id={"no_of_light_posts"}
        value={modifyBuilding?.no_of_light_posts}
      />

      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.no_of_doors")}
        id={"no_of_doors"}
        value={modifyBuilding?.no_of_doors}
      />

      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.no_of_charging_posts")}
        id={"no_of_charging_posts"}
        value={modifyBuilding?.no_of_charging_posts}
      />
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.building_area")}
        id={"building_area"}
        value={modifyBuilding?.building_area}
      />
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.roof_area")}
        id={"roof_area"}
        value={modifyBuilding?.roof_area}
      />
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.no_of_appartments")}
        id={"no_of_appartments"}
        value={modifyBuilding?.no_of_appartments}
      />
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.no_of_elevators")}
        id={"no_of_elevators"}
        value={modifyBuilding?.no_of_elevators}
      />
      {imageUploader ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h5>{t("common.pages.Image")}</h5>
            <div>
              {buildingImgUrl && (
                <a a href={buildingImgUrl} target="_blank">
                  <BsEyeFill />
                </a>
              )}

              {/* <RxCross2
                className="property_cross_icon"
                style={{ marginLeft: "0.3rem" }}
                onClick={handleRemovePic}
              /> */}
            </div>
          </div>
          <div className="file_uploader">
            {buildingImgUrl && sidePanel ? (
              <>
                <div className="sidepanel_property_image_main">
                  <img
                    src={buildingImgUrl}
                    alt="property_image"
                    className={
                      // sidePanel ? "sidepanel_property_image" : "inTabImage"
                      "sidepanel_property_image"
                    }
                  />
                </div>
              </>
            ) : buildingImg ? (
              <>
                <div className="sidepanel_property_image_main">
                  <img
                    src={buildingImg}
                    alt="property_image"
                    className={
                      // sidePanel ? "sidepanel_property_image" : "inTabImage"
                      "sidepanel_property_image"
                    }
                  />
                  {sidePanel && (
                    <RxCross2
                      className="property_cross_icon"
                      onClick={handleRemovePic}
                    />
                  )}
                </div>
              </>
            ) : (
              <FileUploader
                multiple={false}
                handleChange={handleChange}
                name="image"
                // types={fileTypes}
                label={t("property_page.upload_or_drag")}
              />
            )}
          </div>
        </>
      ) : null}
    </Row>
  );
};
export default Quantities;
