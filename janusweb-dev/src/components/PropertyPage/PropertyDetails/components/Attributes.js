import React from "react";
import InputBox from "components/common/InputBox";
import { Row } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";

const Attributes = ({
  defaultProps,
  modifyProperty,
  mdCol,
  buildingsData,
  newTask,
  sidePanel,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Row>
        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.land_area")}
          id={"area_land"}
          value={modifyProperty.area_land}
          className="drawer_property_number"
        />
        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.plantation_area")}
          id={"area_plantation"}
          type="number"
          value={modifyProperty.area_plantation}
          className="drawer_property_number"
        />

        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.park_area")}
          id={"area_parking"}
          value={modifyProperty.area_parking}
          className="drawer_property_number"
        />
        <div className={`col-md-${mdCol || 4}`}></div>

        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.lawn_area")}
          id={"area_lawn"}
          value={modifyProperty.area_lawn}
          className="drawer_property_number"
        />
        <div className={`col-md-${mdCol || 4}`}></div>

        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.no_of_apartments")}
          id={"sum_no_of_apartments"}
          value={modifyProperty.sum_no_of_apartments}
          className="drawer_property_number"
        />

        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.built_area_percentage")}
          id={"built_percentage"}
          value={modifyProperty.built_percentage}
          className="drawer_property_number"
        />

        {/* <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.total_area_bta")}
          id={"area_bta"}
          value={modifyProperty.area_bta}
        />

        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.total_area_bra")}
          id={"associated_addresses"}
          value={modifyProperty.associated_addresses}
        />

        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.total_area_boa")}
          id={"sum_area_loa"}
          value={modifyProperty.sum_area_boa}
        />

        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.total_area_loa")}
          id={"sum_area_loa"}
          value={modifyProperty.sum_area_loa}
        />

        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.sum_area_heating")}
          id={"sum_area_heating"}
          value={modifyProperty.sum_area_heating}
        /> */}
      </Row>
      {!sidePanel && (
        <div
          style={{
            width: "900px",
            margin: "0 20px ",
          }}
        >
          <label
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "1px",
              color: "black",
            }}
          >
            {t("property_page.buildings")}
          </label>
          <div className="property-building-box" style={{ marginTop: "0" }}>
            {buildingsData?.map((item, i) => (
              <p style={{ fontWeight: "bolder" }} key={i}>
                {item.building_code + " " + item.name}
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Attributes;
