/* eslint-disable */
import React from "react";
import { contentTexts, contentTextsVariables } from "utils/MaintenanceReport";
import leaf_icon from "../../../../../../assets/img/report/icon_leaf.png";
import money_icon from "../../../../../../assets/img/report/icon_money.png";
import risk_icon from "../../../../../../assets/img/report/icon_risk major.png";
import project_icon from "../../../../../../assets/img/report/icon_project.png";
import search_icon from "../../../../../../assets/img/report/icon_search.png";
import constructionImg from "../../../../../../assets/img/construction.png";
import { Bar, Line } from "react-chartjs-2";
import { Table } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";

const PrintData = ({
  selectedPoints,
  maintenanceReport,
  pageNumbering,
  filterValues,
  maintenanceSettings,
  uniquePropsAndBuilds,
  maintananceDiagramData,
  options,
  user,
  printData = [],
  breakIndexs,
  actvsPerTypeBreakIndexs,
  actvsPerTypePrintData,
  depOptions,
  depositionData,
  Usystems,
  allProperties,
  switchState,
}) => {
  const { t } = useTranslation();
  const data = {
    labels: depositionData?.depositions?.map((elem) => {
      return elem.deposition_year;
    }),
    datasets: [
      {
        label: t("data_settings.rec_deposition"),
        data: depositionData?.depositions?.map((elem) => {
          return elem.rec_value_fund;
        }),
        backgroundColor: "lightYellow",
        borderColor: "#FF9A25",
        borderWidth: 2,
      },
      {
        label: t("data_settings.current_deposition"),
        data: depositionData?.depositions?.map((elem) => {
          return elem.curr_value_fund;
        }),
        borderColor: "#413F41",
        backgroundColor: "navy",
        borderWidth: 2,
      },
    ],
  };
  return (
    <div>
      {selectedPoints?.includes("coverPage") && (
        <>
          {/* Cover Page  */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              columnGap: "1rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {maintenanceReport?.image ? (
              <img
                src={maintenanceReport?.image}
                style={{ width: "35rem", height: "25rem", marginTop: "14rem" }}
              />
            ) : (
              <img
                src={constructionImg}
                style={{ width: "25rem", height: "25rem", marginTop: "14rem" }}
              />
            )}
            <h1
              style={{
                marginTop: "2.5rem",
                fontWeight: "bold",
                fontSize: "2.5rem",
              }}
            >
              Underhållsplan
            </h1>
            <h2
              style={{
                marginTop: "1.5rem",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              {filterValues["start_year"] &&
              filterValues["start_year"]?.length > 0
                ? filterValues["start_year"]
                : `${Number(maintenanceSettings?.plan_start_year)}
                  - 
                  ${
                    Number(maintenanceSettings?.plan_start_year) +
                    Number(maintenanceSettings?.plan_duration)
                  }`}
            </h2>
          </div>
          <div style={{ pageBreakBefore: "always" }} />
        </>
      )}

      {selectedPoints?.includes("tableOfContent") && (
        <>
          {/*Table of Contents  */}
          <h2 className="pageLabel">Innehållsförteckning</h2>
          <div className="pageNumbers">
            {selectedPoints?.map((el) => {
              if (!contentTexts?.includes(el)) return;
              return (
                <div className="pageNo">
                  <h3>{contentTextsVariables[el]}</h3>
                  <h3>{pageNumbering[el]}</h3>
                </div>
              );
            })}
          </div>
          <div style={{ pageBreakBefore: "always" }} />
        </>
      )}

      {selectedPoints?.includes("planSettings") && (
        <>
          {/* Plan Settings and Filters  */}
          {Object.keys(filterValues).length > 0 && (
            <>
              <h2 className="pageLabel">Applied Filters</h2>
              <div className="pageNumbers settingsMain mt-3">
                {Object.keys(filterValues).map((key) => {
                  return (
                    <>
                      <div className="settingItem">
                        <h3 className="settingItemLabel w15">{key}</h3>
                        <h3 className="settingItemRight">
                          {filterValues[key]?.map((el) => `${el}, `)}
                        </h3>
                      </div>
                      <hr className="settingHr" />
                    </>
                  );
                })}
              </div>
            </>
          )}

          <h2
            className={`pageLabel ${
              Object.keys(filterValues).length > 0 && "mt-5"
            }`}
          >
            Plan {t("property_page.Settings")}
          </h2>
          <div
            className={`pageNumbers settingsMain ${
              Object.keys(filterValues).length > 0 && "mt-3"
            }`}
          >
            <div className="settingItem">
              <h3 className="settingItemLabel">Namn</h3>
              <h3 className="settingItemRight">
                {maintenanceSettings?.version_name}
              </h3>
            </div>
            <hr className="settingHr" />
            <div className="settingItem">
              <h3 className="settingItemLabel">Startår</h3>
              <h3 className="settingItemRight">
                {maintenanceSettings?.plan_start_year}
              </h3>
            </div>
            <hr className="settingHr" />

            <div className="settingItem">
              <h3 className="settingItemLabel">Längd, år</h3>
              <h3 className="settingItemRight">
                {maintenanceSettings?.plan_duration}
              </h3>
            </div>
            <hr className="settingHr" />

            <div className="settingItem">
              <h3 className="settingItemLabel">Generellt påslag, %</h3>
              <h3 className="settingItemRight">
                {maintenanceSettings?.general_surcharge}
              </h3>
            </div>
            <hr className="settingHr" />

            <div className="settingItem">
              <h3 className="settingItemLabel">Moms, %</h3>
              <h3 className="settingItemRight">
                {maintenanceSettings?.vat_percent}
              </h3>
            </div>
            <hr className="settingHr" />

            <div className="settingItem">
              <h3 className="settingItemLabel">Årlig uppräkning, %</h3>
              <h3 className="settingItemRight">
                {maintenanceSettings?.yearly_increase}
              </h3>
            </div>
            <hr className="settingHr" />

            <div className="settingItem">
              <h3 className="settingItemLabel">Basår index</h3>
              <h3 className="settingItemRight">
                {maintenanceSettings?.base_year_increase || "-"}
              </h3>
            </div>
          </div>
          <div style={{ pageBreakBefore: "always" }} />
        </>
      )}

      {/* {selectedPoints?.includes("myCustomText") &&
        maintenanceReport?.value?.map((el) => {
          return (
            <>
              <div
                dangerouslySetInnerHTML={{ __html: el }}
                style={{ marginTop: "7rem" }}
              />
              <div style={{ pageBreakBefore: "always" }} />
            </>
          );
        })} */}

      {selectedPoints?.includes("propertyAndBuildingData") && (
        <>
          {/* Property and Building Data  */}
          <h2 className="pageLabel">
            {t("property_page.Property_and_building_data")}
          </h2>
          <Table>
            <thead>
              <tr>
                <th>{t("property_page.Legal Name")}</th>
                <th>{t("common.pages.Address")}</th>
                <th>Area Boa</th>
                <th>{t("property_page.buildings")}</th>
              </tr>
            </thead>
            <tbody>
              {/* {uniquePropsAndBuilds?.map((el) => ( */}
              {filterValues?.properties && filterValues?.properties?.length > 0
                ? filterValues?.properties?.map((el) => {
                    let pfound = allProperties?.find((p) => p?.name === el);
                    return (
                      <tr>
                        <td> {pfound?.legal_name}</td>
                        <td>{pfound?.street_address}</td>
                        <td>{pfound?.sum_area_boa} </td>
                        <td>{pfound?.buildingCodes?.map((el) => `${el}, `)}</td>
                      </tr>
                    );
                  })
                : allProperties?.map((el) => (
                    <tr>
                      <td> {el?.legal_name}</td>
                      <td>{el?.street_address}</td>
                      <td>{el?.sum_area_boa} </td>
                      <td>{el?.buildingCodes?.map((el) => `${el}, `)}</td>
                    </tr>
                  ))}
            </tbody>
          </Table>
          <div style={{ pageBreakBefore: "always" }} />

          {/* {uniquePropsAndBuilds?.map((el, index) => {
            return (
              <>
                <div
                  className={`pageNumbers settingsMain ${
                    // index == 2 && "mrgnTop10"
                    index > 1 && index % 2 === 0 && "mrgnTop10"
                  }`}
                >
                  <div className="settingItem mt-3">
                    <h3 className="settingItemLabel">Legal Name</h3>
                    <h3 className="settingItemRight">
                      {el?.property?.legal_name}
                    </h3>
                  </div>
                  <hr className="settingHr" />
                  <div className="settingItem">
                    <h3 className="settingItemLabel">Address</h3>
                    <h3 className="settingItemRight">
                      {el?.property?.street_address}
                    </h3>
                  </div>
                  <hr className="settingHr" />
                  <div className="settingItem">
                    <h3 className="settingItemLabel">Area Boa</h3>
                    <h3 className="settingItemRight">
                      {el?.property?.sum_area_boa}
                    </h3>
                  </div>
                  <hr className="settingHr" />
                  <div className="settingItem">
                    <h3 className="settingItemLabel">Buildings</h3>
                    <h3 className="settingItemRight">
                      {el?.buildingCodes?.map((el) => `${el}, `)}
                    </h3>
                  </div>
                </div>
                {index % 2 !== 0 && index > 0 && (
                  <div style={{ pageBreakBefore: "always" }} />
                )}
              </>
            );
          })}
          {uniquePropsAndBuilds?.length % 2 !== 0 && (
            <div style={{ pageBreakBefore: "always" }} />
          )} */}
        </>
      )}

      {/* Maintanence Diagram  */}
      {selectedPoints?.includes("maintenanceDiagram") && (
        <>
          <h2 className="pageLabel">
            {t("property_page.Maintenance_diagram")}
          </h2>
          <div className="maintancne_diagram">
            <Bar data={maintananceDiagramData} options={options} />
          </div>
          <div style={{ pageBreakBefore: "always" }} />
        </>
      )}

      {/* Header */}
      <div className="header-for-print">
        <div></div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              marginBottom: "0px",
              color: "grey",
              fontWeight: "500px",
            }}
          >
            Underhållsplan
          </p>
          <h4>{user?.organization}</h4>
        </div>
        <hr className="printHrClr" />
      </div>

      {/* Activities Per Year  */}
      {selectedPoints?.includes("maintenanceActivitiesPerYear") && (
        <>
          <div>
            {printData?.map((elem, index) => (
              <div key={index}>
                {breakIndexs?.includes(index) && (
                  <div style={{ pageBreakBefore: "always" }} />
                )}
                <Table
                  className={
                    breakIndexs?.includes(index) || index == 0
                      ? "printTable"
                      : "mt-5"
                  }
                >
                  <thead>
                    <tr className="activites_start_year activites_year_cost_main">
                      <td>{elem._id}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className={"activitesYear_print article_right"}>
                        {switchState
                          ? t("common.pages.INC. VAT")
                          : t("common.pages.EX. VAT")}
                      </td>
                      <td className={"activitesYear_print article_right"}>
                        {`${elem.totalCost}`?.length <= 4
                          ? elem.totalCost
                          : elem.totalCost.toLocaleString().replace(/,/g, " ")}
                      </td>
                    </tr>
                    <tr className="activites_header">
                      <th>{t("planning_page.activity")}</th>
                      <th>{t("planning_page.article")}</th>
                      <th>SYSTEM</th>
                      <th>{t("planning_page.interval")}</th>
                      <th>{t("planning_page.flags")}</th>
                      <th>STATUS</th>
                      <th>{t("planning_page.total_cost")}</th>
                    </tr>
                  </thead>
                  <tbody className="activites_year_table_main">
                    <>
                      {elem?.documents?.map((item) => (
                        <>
                          <tr
                            className={
                              "activites_start_year activites_activity"
                            }
                          >
                            <td className="activitesYear_print activiCol">
                              <div style={{ textWrap: "wrap" }}>
                                {item.maintenance_activity?.length <= 73
                                  ? item.maintenance_activity
                                  : `${item.maintenance_activity.substring(
                                      0,
                                      50
                                    )}...`}
                                {/* {item.maintenance_activity} */}
                              </div>
                            </td>
                            <td className={"activitesYear_print article_right"}>
                              {item?.article}
                            </td>
                            <td className={"activitesYear_print article_right"}>
                              {item.u_system}
                            </td>
                            <td className={"activitesYear_print article_right"}>
                              {item.technical_life +
                                " " +
                                t("planning_page.years")}{" "}
                            </td>
                            <td className={"activitesYear_print article_right"}>
                              {item.energy_flag && (
                                <img
                                  src={leaf_icon}
                                  alt="leaf-icon"
                                  className={"activites_year_leaf"}
                                />
                              )}
                              {item.invest_flag && (
                                <img
                                  src={money_icon}
                                  alt="money-icon"
                                  className={"activites_year_leaf"}
                                />
                              )}
                              {item.risk_flag && (
                                <img
                                  src={risk_icon}
                                  alt="risk-icon"
                                  className={"activites_year_leaf"}
                                />
                              )}
                              {item.project_flag && (
                                <img
                                  src={project_icon}
                                  alt="project-icon"
                                  className={"activites_year_leaf"}
                                />
                              )}

                              {item.inspection_flag && (
                                <img
                                  src={search_icon}
                                  alt="search-icon"
                                  className={"activites_year_leaf"}
                                />
                              )}
                            </td>
                            <td>
                              <div className="status_color_main">
                                {item?.status === "Planerad" ? (
                                  <div className="plan_color_div dropdown_icon plan_color"></div>
                                ) : item?.status === "Akut" ? (
                                  <div className="plan_color_div dropdown_icon akut_color"></div>
                                ) : item?.status === "Eftersatt" ? (
                                  <div className="plan_color_div dropdown_icon efter_color"></div>
                                ) : item?.status === "Beslutad" ? (
                                  <div className="plan_color_div dropdown_icon beslu_color"></div>
                                ) : item?.status === "Utförd" ? (
                                  <div className="plan_color_div dropdown_icon utford_color"></div>
                                ) : null}
                                <span className="activitesYear_print">
                                  {!item.status || item.status === "Choose"
                                    ? t("common.pages.choose")
                                    : item.status}
                                </span>
                              </div>
                            </td>
                            <td className={"activitesYear_print article_right"}>
                              <div style={{ fontWeight: "bold" }}>
                                {`${item.total_cost}`?.length <= 4
                                  ? item.total_cost
                                  : item.total_cost
                                      .toLocaleString()
                                      .replace(/,/g, " ")}
                              </div>
                            </td>
                          </tr>
                        </>
                      ))}
                    </>
                  </tbody>
                </Table>
              </div>
            ))}
          </div>
          <div style={{ pageBreakBefore: "always" }} />
        </>
      )}

      {/* Actvities Per Type  */}
      {selectedPoints?.includes("maintenanceActivitiesPerSystem") && (
        <>
          <div>
            {actvsPerTypePrintData?.map((elem, index) => (
              <div key={index}>
                {actvsPerTypeBreakIndexs?.includes(index) && (
                  <div style={{ pageBreakBefore: "always" }} />
                )}
                <Table
                  className={
                    breakIndexs?.includes(index) || index == 0
                      ? "printTable"
                      : "mt-5"
                  }
                >
                  <thead>
                    <tr className="activites_start_year activites_year_cost_main">
                      <td> {`${elem._id} ${elem.uSystemName}`} </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className={"activitesYear_print article_right"}>
                        {`${elem?.totalCost}`?.length <= 4
                          ? elem.totalCost
                          : elem.totalCost
                              ?.toLocaleString()
                              ?.replace(/,/g, " ")}
                      </td>
                      <td></td>
                    </tr>
                    <tr className="activites_header">
                      <th>{t("planning_page.activity")}</th>
                      <th>{t("planning_page.article")}</th>
                      <th>SYSTEM</th>
                      <th>{t("planning_page.interval")}</th>
                      <th className="flags_header">
                        {t("planning_page.flags")}
                      </th>
                      <th>STATUS</th>
                      <th>{t("planning_page.total_cost")}</th>
                    </tr>
                  </thead>
                  <tbody className="activites_year_table_main">
                    <>
                      {elem?.documents?.map((item) => (
                        <tr className="activites_start_year activites_activity">
                          <td className="activitesYear_print activiCol">
                            <div style={{ textWrap: "wrap" }}>
                              {item.maintenance_activity?.length <= 73
                                ? item.maintenance_activity
                                : `${item.maintenance_activity.substring(
                                    0,
                                    50
                                  )}...`}
                              {/* {item.maintenance_activity} */}
                            </div>
                          </td>
                          <td className={"activitesYear_print article_right"}>
                            {item.article}
                          </td>
                          <td className={"activitesYear_print article_right"}>
                            {item.start_year}
                          </td>
                          <td className={"activitesYear_print article_right"}>
                            {item.technical_life +
                              " " +
                              t("planning_page.years")}{" "}
                          </td>
                          <td className={"activitesYear_print article_right"}>
                            {item.energy_flag && (
                              <img
                                src={leaf_icon}
                                alt="leaf-icon"
                                className={"activites_year_leaf"}
                              />
                            )}
                            {item.invest_flag && (
                              <img
                                src={money_icon}
                                alt="money-icon"
                                className={"activites_year_leaf"}
                              />
                            )}
                            {item.risk_flag && (
                              <img
                                src={risk_icon}
                                alt="risk-icon"
                                className={"activites_year_leaf"}
                              />
                            )}
                            {item.project_flag && (
                              <img
                                src={project_icon}
                                alt="project-icon"
                                className={"activites_year_leaf"}
                              />
                            )}

                            {item.inspection_flag && (
                              <img
                                src={search_icon}
                                alt="search-icon"
                                className={"activites_year_leaf"}
                              />
                            )}
                          </td>
                          <td className="reportYearTD">
                            <div className="status_color_main">
                              {item?.status === "Planerad" ? (
                                <div className="plan_color_div dropdown_icon plan_color"></div>
                              ) : item?.status === "Akut" ? (
                                <div className="plan_color_div dropdown_icon akut_color"></div>
                              ) : item?.status === "Eftersatt" ? (
                                <div className="plan_color_div dropdown_icon efter_color"></div>
                              ) : item?.status === "Beslutad" ? (
                                <div className="plan_color_div dropdown_icon beslu_color"></div>
                              ) : item?.status === "Utförd" ? (
                                <div className="plan_color_div dropdown_icon utford_color"></div>
                              ) : null}
                              <span className="activitesYear_print">
                                {!item.status || item.status === "Choose"
                                  ? t("common.pages.choose")
                                  : item.status}
                              </span>
                            </div>
                          </td>
                          <td className={"activitesYear_print article_right"}>
                            {`${item.total_cost}`?.length <= 4
                              ? item.total_cost
                              : item.total_cost
                                  ?.toLocaleString()
                                  ?.replace(/,/g, " ")}
                          </td>
                        </tr>
                      ))}
                    </>
                  </tbody>
                </Table>
              </div>
            ))}
          </div>
          <div style={{ pageBreakBefore: "always" }} />
        </>
      )}

      {/* Deposition Diagram  */}
      {selectedPoints?.includes("depositionsDiagram") && (
        <>
          <h2 className="pageLabel">Diagram avsättningar</h2>
          <div className="maintancne_diagram">
            <Line data={data} options={depOptions} />
          </div>
        </>
      )}

      {/* Footer */}
      <div className="footer-for-print">
        <hr className="printHr printHrClr" />

        <p style={{ marginBottom: "0px" }}>
          {t(
            "common.pages.This maintenance plan was created with the web application JANUS."
          )}
        </p>
        <p>
          {t("common.pages.More details at")}{" "}
          <a
            href="https://dinunderhallsplan.se"
            style={{ textDecoration: "none" }}
          >
            www.dinunderhallsplan.se
          </a>
        </p>
      </div>
    </div>
  );
};

export default PrintData;
