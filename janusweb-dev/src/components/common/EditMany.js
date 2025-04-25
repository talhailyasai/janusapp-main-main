import React, { useState } from "react";
import InputBoxDropDown from "./InputBoxDropDown";
import InputBox from "./InputBox";
import CheckBox from "./CheckBox";
import { EditManyPlanning } from "lib/PlanningLib";
import { GetSingleMaintainceItemByArticleCode } from "lib/MaintainceItemLib";
import { GetSearchUSystems } from "lib/USystemsLib";
import { useTranslation } from "react-i18next";
import leaf_icon from "assets/img/report/icon_leaf.png";
import money_icon from "assets/img/report/icon_money.png";
import project_icon from "assets/img/report/icon_project.png";
import risk_icon from "assets/img/report/icon_risk major.png";
import search_icon from "assets/img/report/icon_search.png";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import plan from "../../assets/img/report/plan.png";
import decided from "../../assets/img/report/decided.png";
import urgent from "../../assets/img/report/urgent.png";
import fulfill from "../../assets/img/report/fulfill.png";
import defered from "../../assets/img/report/defered.png";
import { useEffect } from "react";
import { Col, Row, Spinner } from "@themesberg/react-bootstrap";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";
import DisabledInputBox from "components/common/InputBox";
import Button from "components/common/Button";
import { toast } from "react-toastify";

const EditMany = ({
  reducedCheckedRows,
  checkedRows,
  data,
  setData,
  setCheckedRows,
  handleDataSubmit,
  handleClose,
  close,
}) => {
  const [updateValues, setUpdateValues] = useState({});
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [editMany, setEditMany] = useState(false);
  const [loading, setLoading] = useState(false);
  const [articleCodeChange, setArticleCodeChange] = useState();
  const [systemCodeChange, setSystemCodeChange] = useState();
  const { value: articleCodeData } = GetSingleMaintainceItemByArticleCode(
    articleCodeChange || undefined,
    {},
    [articleCodeChange]
  );

  const { value: systemCodeData } = GetSearchUSystems(
    systemCodeChange || undefined,
    {},
    [systemCodeChange]
  );
  const { t } = useTranslation();
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    if (name === "unit" || "article" || "u_system") {
      setUpdateValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    } else {
      setUpdateValues((prevValues) => ({ ...prevValues, [name]: value }));
    }
  };

  const expectedText = `change all ${data?.data?.length} items`;

  const handleEditMany = async () => {
    if (!isConfirmed) {
      toast.info(t("planning_page.please_confirm_changes"));
      return;
    }

    setLoading(true);
    function cleanObject(obj) {
      const newObj = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (value !== null && value !== "" && value != 0) {
          newObj[key] = value;
        }
      });
      return newObj;
    }
    const res = await EditManyPlanning({
      body: JSON.stringify({
        filter: data?.data.map((item) => item._id),
        update: cleanObject(updateValues),
      }),
    });
    const resData = await res.json();
    setData((prev) => ({ ...prev, data: resData.result }));
    setEditMany(false);
    setUpdateValues({});
    handleClose();
    close();
  };

  const handleSelectArticleItem = (item) => {
    setUpdateValues({
      ...updateValues,
      article: item.article,
      maintenance_activity: item.maintenance_activity,
      technical_life: item.technical_life,
      u_system: item.u_system,
      unit: item.unit,
      price_per_unit: item.price_per_unit,
    });
  };
  const handleSelectSystemItem = (item) => {
    setUpdateValues({
      ...updateValues,
      u_system: item.system_code,
    });
  };

  const editManyAnimations = {
    maxHeight: "100%",
    opacity: "1",
    visibility: "visible",
    transition: "max-height 0.5s ease-out, opacity 0.5s ease-out",
  };
  return (
    <SidePanel>
      <SidePanelHeader>{t("planning_page.edit_many")}</SidePanelHeader>

      <SidePanelBody>
        <div>
          <div style={editManyAnimations}>
            <>
              <div className="h-100 activity-input-container maintenance_item_sidepanel_main">
                <div className="">
                  <SingleEditItem
                    t={t}
                    name="u_system"
                    defaultValue={reducedCheckedRows?.u_system}
                    value={updateValues?.u_system}
                    handleChange={handleUpdateChange}
                    handleSubmit={(text) =>
                      setSystemCodeChange(text?.toUpperCase())
                    }
                    title="System"
                    dropdown
                    result={(handleClose) =>
                      systemCodeData?.map((item) => (
                        <li
                          onClick={() => {
                            handleSelectSystemItem(item);
                            handleClose();
                          }}
                          style={{ cursor: "pointer", listStyle: "none" }}
                        >
                          {item.system_code +
                            " " +
                            item.system_name.split(" ").slice(0, 3).join(" ")}
                        </li>
                      ))
                    }
                  />
                  <SingleEditItem
                    t={t}
                    name="article"
                    defaultValue={reducedCheckedRows?.article}
                    value={updateValues?.article}
                    handleChange={handleUpdateChange}
                    title={t("planning_page.article")}
                    handleSubmit={(text) =>
                      setArticleCodeChange(text?.toUpperCase())
                    }
                    dropdown
                    result={(handleClose) =>
                      articleCodeData?.map((item) => (
                        <li
                          onClick={() => {
                            handleSelectArticleItem(item);
                            handleClose();
                          }}
                          style={{ cursor: "pointer", listStyle: "none" }}
                        >
                          {item.article +
                            " " +
                            item.maintenance_activity
                              .split(" ")
                              .slice(0, 3)
                              .join(" ")}
                        </li>
                      ))
                    }
                  />
                  <SingleEditItem
                    t={t}
                    name="start_year"
                    defaultValue={reducedCheckedRows?.start_year}
                    value={updateValues?.start_year}
                    handleChange={handleUpdateChange}
                    title={t("planning_page.start_year")}
                    type="number"
                  />
                  <SingleEditItem
                    t={t}
                    name="technical_life"
                    defaultValue={reducedCheckedRows?.technical_life}
                    value={updateValues?.technical_life}
                    handleChange={handleUpdateChange}
                    title={t("planning_page.technical_life")}
                  />
                  <SingleEditItem
                    t={t}
                    name="previous_year"
                    defaultValue={reducedCheckedRows?.previous_year}
                    value={updateValues?.previous_year}
                    handleChange={handleUpdateChange}
                    title={t("planning_page.previous_year")}
                    type="number"
                  />
                </div>
                <div className=""></div>

                <div className="">
                  <SingleEditItem
                    t={t}
                    name="status"
                    value={
                      updateValues?.status
                        ? t(`common.pages.${updateValues?.status}`)
                        : null
                    }
                    defaultValue={
                      reducedCheckedRows?.status
                        ? t(`common.pages.${reducedCheckedRows?.status}`)
                        : null
                    }
                    handleChange={handleUpdateChange}
                    title="Status"
                    readonly={true}
                    result={(handleClose) =>
                      [
                        {
                          text: t("common.pages.planned"),
                          value: "Planerad",
                          icon: plan,
                        },
                        {
                          text: t("common.pages.urgent"),
                          value: "Akut",
                          icon: urgent,
                        },
                        {
                          text: t("common.pages.deffered"),
                          value: "Eftersatt",
                          icon: defered,
                        },
                        {
                          text: t("common.pages.decided"),
                          value: "Beslutad",
                          icon: decided,
                        },
                        {
                          text: t("common.pages.fulfilled"),
                          value: "Utförd",
                          icon: fulfill,
                        },
                      ]?.map((item) => (
                        <li
                          key={item.value}
                          onClick={() => {
                            setUpdateValues((prev) => ({
                              ...prev,
                              status: item.value,
                            }));
                            handleClose();
                          }}
                          style={{
                            cursor: "pointer",
                            listStyle: "none",
                            width: "100%",
                          }}
                          className="m-2"
                        >
                          <img
                            src={item.icon}
                            alt={item.text}
                            className="mx-1"
                          />
                          {item.text}
                        </li>
                      ))
                    }
                    dropdown
                  />
                  <SingleEditItem
                    t={t}
                    name="quantity"
                    defaultValue={reducedCheckedRows?.quantity}
                    value={updateValues?.quantity}
                    handleChange={handleUpdateChange}
                    title={t("planning_page.quantity")}
                  />
                  <SingleEditItem
                    t={t}
                    name="unit"
                    defaultValue={reducedCheckedRows?.unit}
                    value={updateValues?.unit}
                    handleChange={handleUpdateChange}
                    title={t("planning_page.unit")}
                  />
                  <SingleEditItem
                    t={t}
                    name="price_per_unit"
                    defaultValue={reducedCheckedRows?.price_per_unit}
                    value={updateValues?.price_per_unit}
                    handleChange={handleUpdateChange}
                    title={t("planning_page.unit_cost")}
                  />
                </div>
                <div className=""></div>

                <div className="d-flex flex-column">
                  <SingleEditItem
                    t={t}
                    name="energy_flag"
                    defaultValue={reducedCheckedRows?.energy_flag}
                    value={updateValues?.energy_flag}
                    handleChange={handleUpdateChange}
                    title={t("planning_page.energy_savings")}
                    checkbox
                    bachEditingFlag={true}
                    energy_flag
                  />
                  <SingleEditItem
                    t={t}
                    name="invest_flag"
                    defaultValue={reducedCheckedRows?.invest_flag}
                    value={updateValues?.invest_flag}
                    handleChange={handleUpdateChange}
                    title={t("planning_page.investment")}
                    checkbox
                    bachEditingFlag={true}
                    invest_flag
                  />
                  <SingleEditItem
                    t={t}
                    name="risk_flag"
                    defaultValue={reducedCheckedRows?.risk_flag}
                    value={updateValues?.risk_flag}
                    handleChange={handleUpdateChange}
                    title={t("planning_page.risk")}
                    checkbox
                    bachEditingFlag={true}
                    risk_flag
                  />
                  <SingleEditItem
                    t={t}
                    name="project_flag"
                    defaultValue={reducedCheckedRows?.project_flag}
                    value={updateValues?.project_flag}
                    handleChange={handleUpdateChange}
                    title={t("planning_page.project")}
                    checkbox
                    bachEditingFlag={true}
                    project_flag
                  />
                  <SingleEditItem
                    t={t}
                    name="inspection_flag"
                    defaultValue={reducedCheckedRows?.inspection_flag}
                    value={updateValues?.inspection_flag}
                    handleChange={handleUpdateChange}
                    title={t("planning_page.inspect")}
                    checkbox
                    bachEditingFlag={true}
                    inspection_flag
                  />
                </div>

                <div className="confirmation-section">
                  <div className="d-flex align-items-center gap-2">
                    <CheckBox
                      type="checkbox"
                      checked={isConfirmed}
                      onChange={(e) => setIsConfirmed(e.target.checked)}
                      id="confirm-changes"
                    />
                    <label htmlFor="confirm-changes" className="mb-0">
                      {t("planning_page.confirm_batch_update", {
                        count: data?.data?.length || 0,
                      })}
                    </label>
                  </div>
                </div>
              </div>
              {/* <div className="batchediting_change_btn_main">
                <button
                  style={{ width: "10rem", marginRight: "2rem" }}
                  onClick={handleEditMany}
                  className="btn btn-secondary text-center text-white rounded-pill batch_edit_change_btn"
                >
                  <span>{t("planning_page.change")}</span>
                </button>
                <button
                  style={{ width: "10rem" }}
                  onClick={() => setEditMany(!editMany)}
                  className="btn bg-white text-secondary border-secondary rounded-pill batch_edit_change_btn"
                >
                  <span>{t("planning_page.cancel")}</span>
                </button>
              </div> */}
            </>
          </div>
        </div>
      </SidePanelBody>
      <SidePanelFooter>
        <Button main onClick={handleEditMany}>
          {loading ? (
            <Spinner
              animation="border"
              size="sm"
              className="comp_pkg_spinner"
            />
          ) : (
            t("planning_page.change")
          )}
        </Button>
        <Button
          secondary
          type="button"
          onClick={() => {
            handleClose();
            close();
          }}
        >
          {t("planning_page.cancel")}
        </Button>
      </SidePanelFooter>
    </SidePanel>
  );
};

const SingleEditItem = ({
  t,
  title,
  checkbox,
  name,
  handleChange,
  defaultValue,
  value,
  result,
  dropdown,
  handleSubmit,
  bachEditingFlag,
  energy_flag,
  invest_flag,
  risk_flag,
  project_flag,
  inspection_flag,
  readonly,
  type,
}) => (
  <>
    {bachEditingFlag ? null : (
      <div className="d-flex align-items-center justify-content-center my-2">
        <p
          className="bg-primary px-3 py-1 rounded"
          style={{ width: "100%", color: "#35C7FB", textAlign: "center" }}
        >
          {title}
        </p>
      </div>
    )}

    <div
      className="d-flex align-items-center mb-4 colGap"
      style={{ flexWrap: "nowrap" }}
    >
      {checkbox ? (
        <>
          <div className="flag_image_back">
            {energy_flag ? (
              <img src={leaf_icon} alt="flag_image" className="flag_image" />
            ) : invest_flag ? (
              <img src={money_icon} alt="flag_image" className="flag_image" />
            ) : risk_flag ? (
              <img src={risk_icon} alt="flag_image" className="flag_image" />
            ) : project_flag ? (
              <img src={project_icon} alt="flag_image" className="flag_image" />
            ) : inspection_flag ? (
              <img src={search_icon} alt="flag_image" className="flag_image" />
            ) : null}
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <label htmlFor={name} className="mx-1">
              {t("common.pages.yes")}:
            </label>
            <CheckBox
              type="radio"
              mdCol={6}
              defaultChecked={defaultValue ? true : false}
              value={true}
              id={name}
              onChange={handleChange}
            />
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <label htmlFor={name} className="mx-1">
              {t("common.pages.no")}:
            </label>
            <CheckBox
              type="radio"
              mdCol={6}
              defaultChecked={defaultValue ? false : true}
              value={false}
              id={name}
              onChange={handleChange}
            />
          </div>
        </>
      ) : dropdown ? (
        <>
          <div className="d-flex align-items-center justify-content-center">
            <label htmlFor={`${name}_from`}>
              {/* {t("common.pages.from")}: */}
            </label>
            <InputBox
              mdCol={12}
              mb={false}
              disabled
              value={defaultValue}
              id={`${name}_from`}
              placeholder={t("common.pages.from")}
            />
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <label htmlFor={name} className="text-end">
              {/* {t("common.pages.to")} : */}
            </label>
            <InputBoxDropDown
              mb={false}
              mdCol={12}
              top="29%"
              right={"5%"}
              defaultValue={defaultValue}
              value={value}
              id={name}
              handleSubmit={handleSubmit}
              inputMdCol={12}
              ulClass="position-absolute bg-white text-black z-2 w-auto end-0"
              result={result}
              handleChange={handleChange}
              // ml={"0.5rem"}
              placeholder={t("common.pages.to")}
              ulStyle={{
                maxWidth: "18rem",
              }}
              readonly={readonly}
            />
          </div>
        </>
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-center">
            <label htmlFor={`${name}_from`}>
              {/* {t("common.pages.from")}: */}
            </label>
            <InputBox
              mdCol={12}
              mb={false}
              disabled
              value={defaultValue}
              id={`${name}_from`}
              placeholder={t("common.pages.from")}
            />
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <label htmlFor={name}>{/* {t("common.pages.to")}: */}</label>
            <InputBox
              mdCol={12}
              mb={false}
              id={name}
              value={value}
              handleChange={handleChange}
              // ml={"0.5rem"}
              placeholder={t("common.pages.to")}
              type={type}
            />
          </div>
        </>
      )}
    </div>
  </>
);

export default EditMany;
