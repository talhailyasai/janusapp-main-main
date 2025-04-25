import React, { useEffect, useState } from "react";
import InputBox from "components/common/InputBox";
import { Col, Row } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import TextAreaBox from "components/common/TextArea";
import { FileUploader } from "react-drag-drop-files";
import { RxCross2 } from "react-icons/rx";
import api from "api";
import { GetSinglePropertyByPropertyCode } from "lib/PropertiesLib";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { BsEyeFill } from "react-icons/bs";

const Info = ({
  defaultProps,
  modifyProperty,
  mdCol,
  newTask,
  buildingsData,
  sidePanel,
}) => {
  const { t } = useTranslation();
  const fileTypes = ["JPEG", "PNG", "jpg"];
  const { propertyChange } = usePropertyContextCheck();

  const { value: singlePropertyData, loading: propertyLoading } =
    GetSinglePropertyByPropertyCode(propertyChange || "", {}, [propertyChange]);

  const [propertyImgUrl, setPropertyImgUrl] = useState(null);
  const [propertyImg, setPropertyImg] = useState(modifyProperty?.image?.link);
  const [curUser, setCurUser] = useState(null);

  const getCurrentUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let res = await api.get(`/users/${user?._id}`);
      setCurUser(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleChange = async (e) => {
    try {
      setPropertyImgUrl(URL.createObjectURL(e));
      modifyProperty.image = e;
      if (!sidePanel) {
        let formData = new FormData();
        formData.append("image", e);

      const data =  await api.put(`/properties/${singlePropertyData?._id}`, formData);
        // window.location.reload();
        console.log("data?.image?.link", data?.data?.image?.link)
        setPropertyImg(data?.data?.image?.link)
        // setPropertyImgUrl(data?.image?.link);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemovePic = () => {
    setPropertyImgUrl(null);
    setPropertyImg(null);
    modifyProperty.image = undefined;
  };

  console.log("propertyImg", propertyImg, propertyImgUrl, sidePanel)
  return (
    <Col>
      <Row>
        {curUser?.plan === "Enterprise" && (
          <Col md={sidePanel ? 12 : 4}>
            <InputBox
              {...defaultProps}
              mdCol={mdCol || 8}
              text={t("property_page.property_type")}
              id={"property_type"}
              value={modifyProperty?.property_type}
            />
            <InputBox
              {...defaultProps}
              mdCol={mdCol || 8}
              text={t("property_page.property_type_code")}
              id={"contract_sum_sqm"}
              value={modifyProperty?.contract_sum_sqm}
            />

            <InputBox
              {...defaultProps}
              mdCol={mdCol || 8}
              text={t("property_page.contract_number")}
              id={"contract_number"}
              value={modifyProperty?.contract_number}
            />
          </Col>
        )}

        <Col md={sidePanel ? 12 : 8}>
          <Row>
            {curUser?.plan === "Enterprise" && (
              <Col>
                <div
                  // style={{
                  //   flex: sidePanel ? "1 0 100%" : "1 0 30%",
                  //   width: sidePanel ? "100%" : "auto",
                  //   height: "100%",
                  // }}
                  className="contact_includes_main"
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "black",
                    }}
                  >
                    {t("property_page.contract_includes")}
                  </label>
                  <div
                  // style={{
                  //   backgroundColor: "rgb(245, 248, 251)",
                  //   padding: "0",
                  //   color: "black",
                  //   fontWeight: "bold",
                  //   height: "fit-content",
                  //   border: "1px solid black",
                  //   marginTop: 0,
                  //   borderRadius: "10px",
                  // }}
                  >
                    <div style={{ marginTop: "0", height: "100%" }}>
                      <TextAreaBox
                        {...defaultProps}
                        mdCol={12}
                        stylesTrue={false}
                        rows={9}
                        // styles={{ height: "100%", width: "100", margin: 0 }}
                        id={"contract_includes"}
                        value={modifyProperty.contract_includes}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            )}

            <Col>
              <div
                // style={{
                //   flex: sidePanel ? "1 0 100%" : "1 0 30%",
                //   width: sidePanel ? "100%" : "auto",
                //   height: "100%",
                //   marginTop: "-76px",
                //   marginBottom: "-101px",
                // }}
                className="contact_includes_main"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <h5
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      marginBottom: "1px",
                      color: "black",
                    }}
                  >
                    {t("property_page.image")}
                  </h5>
                  <div>
                    {propertyImgUrl && (
                      <a a href={propertyImgUrl} target="_blank">
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
                <div className="file_uploader">
                  {propertyImgUrl && sidePanel ? (
                    <>
                      <div className="sidepanel_property_image_main">
                        <img
                          src={propertyImgUrl}
                          alt="property_image"
                          className="sidepanel_property_image"
                        />
                      </div>
                    </>
                  ) : propertyImg ? (
                    <>
                      <div className="sidepanel_property_image_main">
                        <img
                          src={propertyImg}
                          alt="property_image"
                          className="sidepanel_property_image"
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
                      types={fileTypes}
                      label={t("property_page.upload_or_drag")}
                    />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Col>
  );
};

export default Info;
