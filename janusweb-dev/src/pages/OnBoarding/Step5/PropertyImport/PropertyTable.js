import { Button, Table } from "@themesberg/react-bootstrap";
import React from "react";
import { useTranslation } from "react-i18next";

const PropertyTable = ({ properties, setStep, step, setStopStep }) => {
  const { t } = useTranslation();

  return (
    <>
      <span
        class="material-symbols-outlined step_arrow_back"
        onClick={() => setStopStep("PropertyImport")}
      >
        arrow_back
      </span>
      <div className="maintenance_main">
        <p className="maintenance_plan_head">
          {t("common.pages.Check values, repeat import if necessary")}
        </p>
        <div className="import_table">
          <Table bordered hover>
            <thead>
              <tr>
                <th>{t("common.pages.Building No")}</th>
                <th>{t("common.pages.Building Name")}</th>
                <th>{t("common.pages.Address")}</th>
                <th>{t("common.pages.ZipCode")}</th>
                <th>{t("common.pages.City")}</th>
                <th>{t("common.pages.Construction Year")}</th>
                <th>BOA</th>
                <th>LOA</th>
                <th>BRA</th>
                <th>BTA</th>
                <th>{t("common.pages.PROPERTY CODE")}</th>
                <th>{t("common.pages.Legal Name")}</th>
              </tr>
            </thead>
            <tbody>
              {properties?.map((elem, index) => {
                if (elem?.buildingsArray?.length > 0) {
                  return (
                    <tr key={index}>
                      <td>{elem?.buildingsArray[0]?.building_code}</td>
                      <td>{elem?.buildingsArray[0]?.building_name}</td>
                      <td>{elem?.buildingsArray[0]?.street_address}</td>
                      <td>{elem?.buildingsArray[0]?.zip_code}</td>
                      <td>{elem?.buildingsArray[0]?.city}</td>
                      <td>{elem?.buildingsArray[0]?.construction_year}</td>
                      <td>{elem?.buildingsArray[0]?.area_boa}</td>
                      <td>{elem?.buildingsArray[0]?.area_loa}</td>
                      <td>{elem?.buildingsArray[0]?.area_bra}</td>
                      <td>{elem?.buildingsArray[0]?.area_bta}</td>
                      <td>{elem?.property_code}</td>
                      <td>{elem?.legal_name}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </Table>
        </div>

        <div className="step1_submit_btn_main step_4continue next_step_btn">
          <Button
            className="step1_started_btn"
            onClick={() => {
              setStep(4);
              setStopStep("no");
              // setStopStep("selectBuilding")
            }}
          >
            {t("common.pages.Continue")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default PropertyTable;
