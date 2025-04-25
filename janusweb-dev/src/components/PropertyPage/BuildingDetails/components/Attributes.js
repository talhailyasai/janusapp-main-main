import React, { useEffect, useState } from "react";
import InputBox from "components/common/InputBox";
import { Form, Row } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import api from "api";
import InputDropdown from "components/common/InputDropdown";
const Attributes = ({
  defaultProps,
  modifyBuilding,
  mdCol,
  area = true,
  attributes = true,
  setBuildigDetail = () => {},
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const getAttributes = async () => {
    const res = await api.get("/datasetting-buildings");

    // console.log(res, "data hai");
    setData(res.data);
  };

  useEffect(() => {
    getAttributes();
  }, []);

  return (
    <Row>
      {area == true && (
        <div className="row">
          <h5
            style={{
              textAlign: "center",
              fontWeight: "700",
              margin: "1.5rem 0rem",
            }}
          >
            {t("property_page.Areas")}
          </h5>
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={"Area BTA"}
            id={"area_bta"}
            value={modifyBuilding?.area_bta}
          />
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={"Area BRA"}
            id={"area_bra"}
            value={modifyBuilding?.area_bra}
          />
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={"Area BOA"}
            id={"area_boa"}
            value={modifyBuilding?.area_boa}
          />
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={"Area LOA"}
            id={"area_loa"}
            value={modifyBuilding?.area_loa}
          />
          <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={"Area A-temp"}
            id={"area_a_temp"}
            value={modifyBuilding?.area_a_temp}
          />
        </div>
      )}
      {attributes == true && (
        <div className="row">
          <h5
            style={{
              textAlign: "center",
              fontWeight: "700",
              margin: "1.5rem 0rem",
            }}
          >
            {t("property_page.Attributes")}
          </h5>
          {/* <InputBox
            {...defaultProps}
            mdCol={mdCol}
            text={t("property_page.facade")}
            id={"u_facade"}
            value={modifyBuilding?.u_facade}
          /> */}

          <InputDropdown
            {...defaultProps}
            mdCol={mdCol}
            value={modifyBuilding?.u_facade}
            options={data?.find((el) => el?.attribute_type == "facade")?.value}
            id="u_facade"
            text={t("common.pages.Attribute Facade")}
          />

          <InputDropdown
            {...defaultProps}
            mdCol={mdCol}
            value={modifyBuilding?.u_windows}
            options={data?.find((el) => el?.attribute_type == "windows")?.value}
            id="u_windows"
            text={t("common.pages.Attribute Windows")}
          />

          <InputDropdown
            {...defaultProps}
            mdCol={mdCol}
            value={modifyBuilding?.u_doors}
            options={data?.find((el) => el?.attribute_type == "doors")?.value}
            id="u_doors"
            text={t("common.pages.Attribute Doors")}
          />

          <InputDropdown
            {...defaultProps}
            mdCol={mdCol}
            value={modifyBuilding?.u_roof}
            options={data?.find((el) => el?.attribute_type == "roof")?.value}
            id="u_roof"
            text={t("common.pages.Attribute Roof")}
          />

          <InputDropdown
            {...defaultProps}
            mdCol={mdCol}
            value={modifyBuilding?.u_foundation}
            options={
              data?.find((el) => el?.attribute_type == "foundation")?.value
            }
            id="u_foundation"
            text={t("common.pages.Attribute Foundation")}
          />

          <InputDropdown
            {...defaultProps}
            mdCol={mdCol}
            value={modifyBuilding?.u_electricity}
            options={
              data?.find((el) => el?.attribute_type == "electricity")?.value
            }
            id="u_electricity"
            text={t("common.pages.Attribute Electricity")}
          />

          <InputDropdown
            {...defaultProps}
            mdCol={mdCol}
            value={modifyBuilding?.u_heating}
            options={data?.find((el) => el?.attribute_type == "heating")?.value}
            id="u_heating"
            text={t("common.pages.Attribute Heating")}
          />

          <InputDropdown
            {...defaultProps}
            mdCol={mdCol}
            value={modifyBuilding?.u_heat_dist}
            options={
              data?.find((el) => el?.attribute_type == "heat_distribution")
                ?.value
            }
            id="u_heat_dist"
            text={t("common.pages.Attribute Heat Distribution")}
          />

          <InputDropdown
            {...defaultProps}
            mdCol={mdCol}
            value={modifyBuilding?.u_ventilation}
            options={
              data?.find((el) => el?.attribute_type == "ventilation")?.value
            }
            id="u_ventilation"
            text={t("common.pages.Attribute Ventilation")}
          />
          <InputDropdown
            {...defaultProps}
            mdCol={mdCol}
            value={modifyBuilding?.u_waste_disposal}
            options={
              data?.find((el) => el?.attribute_type == "waste management")
                ?.value
            }
            id="u_waste_disposal"
            text={t("common.pages.Attribute Waste")}
          />
        </div>
      )}
    </Row>
  );
};
export default Attributes;
