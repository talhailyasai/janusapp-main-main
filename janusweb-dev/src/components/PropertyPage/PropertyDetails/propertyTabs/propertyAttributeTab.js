import React from "react";
import InputBox from "components/common/InputBox";
import { Row, Table } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

const PropertyAttributesTab = ({
  defaultProps,
  modifyProperty,
  mdCol,
  buildingsData,
  newTask,
  sidePanel,
}) => {
  const { setBuildingChange } = usePropertyContextCheck();
  const { t } = useTranslation();
  return (
    <Row

    // className="property_attribute"
    >
      {/* <div> */}
      <InputBox
        mdCol={
          mdCol
          // 12
        }
        {...defaultProps}
        text={t("property_page.total_area_bta")}
        id={"area_bta"}
        value={modifyProperty.sum_area_bta}
        // className="attribute_field"
      />
      <InputBox
        mdCol={mdCol}
        {...defaultProps}
        text={t("property_page.total_area_bra")}
        id={"associated_addresses"}
        value={modifyProperty.sum_area_bra}
      />
      <InputBox
        mdCol={mdCol}
        {...defaultProps}
        text={t("property_page.total_area_boa")}
        id={"sum_area_loa"}
        value={modifyProperty.sum_area_boa}
      />
      <InputBox
        mdCol={mdCol}
        {...defaultProps}
        text={t("property_page.total_area_loa")}
        id={"sum_area_loa"}
        value={modifyProperty.sum_area_loa}
      />
      <InputBox
        mdCol={mdCol}
        {...defaultProps}
        text={t("property_page.sum_area_heating")}
        id={"sum_area_heating"}
        value={modifyProperty.sum_area_heating}
      />

      <InputBox
        mdCol={mdCol}
        {...defaultProps}
        text={t("property_page.land_area")}
        id={"land_area"}
        value={modifyProperty.area_land}
      />
      <InputBox
        mdCol={mdCol}
        {...defaultProps}
        text={t("property_page.plantation_area")}
        id={"area_plantation"}
        type="number"
        value={modifyProperty.area_plantation}
      />

      <InputBox
        mdCol={mdCol}
        {...defaultProps}
        text={t("property_page.park_area")}
        id={"area_parking"}
        value={modifyProperty.area_parking}
      />

      <InputBox
        mdCol={mdCol}
        {...defaultProps}
        text={t("property_page.lawn_area")}
        id={"area_park"}
        value={modifyProperty.area_lawn}
      />
      <InputBox
        mdCol={mdCol}
        {...defaultProps}
        text={t("property_page.no_of_apartments")}
        id={"sum_no_of_apartments"}
        value={modifyProperty.sum_no_of_apartments}
      />
      <InputBox
        mdCol={mdCol}
        {...defaultProps}
        text={t("property_page.built_area_percentage")}
        id={"built_percentage"}
        value={modifyProperty.built_percentage}
      />
      {/* </div> */}
      {/*  */}

      {/* <div className={`col-md-${mdCol || 4}`}></div> */}

      {/* <div className={`col-md-${mdCol || 4}`}></div> */}
      {/*  
      {!sidePanel && (
        <div
          style={{
            width: "370px",
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
            <Table bordered hover>
              <thead>
                {buildingsData?.map((item, i) => (
                  <>
                    {/* <div
                  style={{ fontWeight: "bolder", cursor: "pointer" }}
                  key={i}
                  onClick={() => {
                    setBuildingChange(item?.building_code);
                    localStorage.setItem("building", item?.building_code);
                  }}
                  className="property_buildings"
                >
                  <div>{item?.building_code}</div>
                  <div>
                    {item?.name?.split(" ")[0]}{" "}
                    {`${item?.name?.split(" ")[1]}${item?.name?.split(" ")[2]}`}{" "}
                  </div>
                </div> 

                    <tr>
                      <th>{item?.building_code}</th>
                      <th>
                        {item?.name?.split(" ")[0]}
                        {`${item?.name?.split(" ")[1]} ${
                          item?.name?.split(" ")[2]
                        }`}
                      </th>
                    </tr>
                  </>
                ))}
              </thead>
            </Table>
          </div>
        </div>
      )}
    */}
    </Row>
  );
};

export default PropertyAttributesTab;
