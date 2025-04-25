import { Form, Table } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";

import Button from "components/common/Button";
import { useTranslation } from "react-i18next";
import { AiOutlineEdit } from "react-icons/ai";
import InputBoxDropDown from "components/common/InputBoxDropDown";
import { GetSearchUSystems } from "lib/USystemsLib";
import api from "api";
import { useEffect } from "react";
import TextAreaBox from "components/common/TextArea";
import CustomModal from "components/common/Modals/customModal";

let default_amounts = [
  "area_bta",
  "area_bra",
  "area_boa",
  "area_loa",
  "area_a-temp",
];

const NewMaintenanceItemSidePanel = ({
  handleSubmit,
  close,
  initalVal,
  newTask,
  handleClose,
  copy,
}) => {
  const [modifyProperty, setModifyProperty] = useState(initalVal);
  const [editDefaultAmount, setEditDefaultAmount] = useState(false);
  const [systemCodeChange, setSystemCodeChange] = useState(undefined);
  const [systemCodes, setSystemCodes] = useState(null);

  const [systemOpen, setSystemOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(null);
  const [state, setState] = useState(null);
  const [text, setText] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [size, setSize] = useState("lg");
  const [theme, setTheme] = useState("dark");
  const [dupCodeData, setDupCodeData] = useState([]);

  const [searchValue, setSearchValue] = useState(null);

  const { value: systemCodeData } = GetSearchUSystems(
    systemCodeChange || undefined,
    {},
    [systemCodeChange]
  );

  const { t } = useTranslation();

  const handleChange = (e) => {
    //debugger;
    setModifyProperty((prev) => ({
      ...prev,
      [e.target.name]: e.target.value?.toUpperCase(),
    }));
  };

  const handleEdit = () => {
    setEditDefaultAmount(!editDefaultAmount);
  };

  const changeDefaultAmount = (e) => {
    let val = e.target.value;
    setModifyProperty((prev) => ({
      ...prev,
      default_amount: val,
    }));
  };

  const handleSelectSystemItem = (item) => {
    // defaultProps.handleChange({
    //   target: { name: "u_system", value: item.system_code },
    // });
    setModifyProperty((prev) => ({
      ...prev,
      u_system: item?.system_code?.toUpperCase(),
    }));
  };
  const getUsystems = async () => {
    let val = systemCodeChange === "" ? undefined : systemCodeChange;
    let res = await api.get(`/u_systems/search/${val}`);
    setSystemCodes(res?.data);
  };

  useEffect(() => {
    getUsystems();
  }, [systemCodeChange]);

  const textSubmit = () => {
    setModifyProperty((prev) => ({
      ...prev,
      [state]: text,
    }));
    setOpen(false);
  };

  // useEffect(() => {
  //   console.log("modifyProperty", modifyProperty);
  // }, [modifyProperty]);
  const getBody = (
    <TextAreaBox
      mdCol={12}
      stylesTrue={false}
      rows={9}
      id={state}
      value={text?.toUpperCase()}
      handleChange={(e) => {
        setText(e.target.value.toUpperCase());
      }}
    />
  );
  const handleCheckRow = (elem) => {
    // console.log("selectedRow", selectedRow, "elem", elem);
    if (selectedRow?._id == elem?._id) {
      setSelectedRow(null);
    } else {
      setSelectedRow(elem);
    }
  };
  const handleTableSubmit = () => {
    if (!selectedRow) return;
    setModifyProperty((prev) => ({
      ...prev,
      u_system: selectedRow?.u_system || selectedRow?.system_code,
    }));
    setSystemOpen(false);
    setSelectedRow(null);
  };
  const handleCompChangeTable = (text, p) => {
    setSearchValue(text?.toUpperCase());
    //debugger;
    setDupCodeData(
      systemCodeData?.filter((el) =>
        el?.system_code?.toLowerCase()?.includes(text?.toLowerCase())
      )
    );
  };

  useEffect(() => {
    setDupCodeData(systemCodeData);
  }, [systemCodeData, systemOpen]);
  useEffect(() => {
    if (!systemOpen) {
      setSearchValue("");
    }
  }, [systemOpen]);
  const tableBody = (
    <div>
      <Form.Control
        type="text"
        placeholder={t("common.pages.search")}
        onChange={(e) => handleCompChangeTable(e.target.value)}
        style={{ width: "17rem", marginBottom: "1rem" }}
        value={searchValue?.toUpperCase()}
      />
      <div
        style={{
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <Table bordered hover>
          <thead>
            <tr>
              <th></th>
              <th>{t("property_page.system_code")}</th>
              <th>{t("common.pages.Name")}</th>
              <th>{t("planning_page.technical_life")}</th>
            </tr>
          </thead>

          <tbody>
            {dupCodeData?.length > 0 &&
              dupCodeData?.map((elem, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        style={{ transform: "scale(1.2)" }}
                        checked={elem?._id == selectedRow?._id ? true : false}
                        onChange={() => handleCheckRow(elem)}
                      />
                    </td>
                    <td>{elem?.system_code}</td>
                    <td>{elem?.system_name}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    </div>
  );

  return (
    <Form
      onSubmit={(e) => {
        handleSubmit(e, modifyProperty);
      }}
    >
      <SidePanel>
        <SidePanelHeader>
          {initalVal && !copy
            ? t("common.pages.modify")
            : copy
            ? t("common.pages.new")
            : t("common.pages.new")}
          {t("planning_page.maintenance_item")}{" "}
        </SidePanelHeader>
        <SidePanelBody>
          <div className="activity-input-container">
            <Form.Group>
              <Form.Label>{t("planning_page.article")}</Form.Label>
              <Form.Control
                name="article"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={
                  copy && initalVal?.article == modifyProperty?.article
                    ? null
                    : modifyProperty?.article
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                {t("planning_page.maintainence_activity")}
              </Form.Label>
              <Form.Control
                name="maintenance_activity"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.maintenance_activity}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Text</Form.Label>
              <Form.Control
                name="text"
                type="text"
                // required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.text}
                onClick={() => {
                  setState("text");
                  setTitle("Text");
                  setText(modifyProperty?.text);
                  setOpen(true);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> {t("planning_page.technical_life")}</Form.Label>
              <Form.Control
                name="technical_life"
                type="text"
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.technical_life}
              />
            </Form.Group>
            {/* <Form.Group>
              <Form.Label> SYSTEM</Form.Label>
              <Form.Control
                name="u_system"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.u_system}
              />
            </Form.Group> */}
            <InputBoxDropDown
              handleChange={(e) => handleChange(e)}
              mdCol={12}
              value={modifyProperty?.u_system}
              id={"u_system"}
              handleSubmit={(text) => setSystemCodeChange(text)}
              result={(handleClose) =>
                systemCodes?.map((item) => (
                  <li
                    onClick={() => {
                      handleSelectSystemItem(item);
                      handleClose();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {item.system_code +
                      " " +
                      item.system_name.split(" ").slice(0, 3).join(" ")}
                  </li>
                ))
              }
              text={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>{t("property_page.system_code")}</div>
                  <span
                    class="material-symbols-outlined text-black"
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "27px",
                    }}
                    onClick={() => {
                      setTitle(
                        `${
                          t("common.pages.search") +
                          " " +
                          t("property_page.system_code")
                        }`
                      );
                      setTheme("dark");
                      setSize("xl");
                      let element = systemCodeData?.find(
                        (el) => el?.system_code == modifyProperty?.u_system
                      );
                      if (element) setSelectedRow(element);
                      setSystemOpen(true);
                    }}
                  >
                    more_horiz
                  </span>
                </div>
              }
              LabelClassName={"w-100"}
            />
            <Form.Group>
              <div className="d-flex justify-content-between">
                <Form.Label>{t("data_settings.default_amount")}</Form.Label>
                <div onClick={handleEdit}>
                  {" "}
                  <AiOutlineEdit />{" "}
                </div>
              </div>
              {!editDefaultAmount ? (
                <Form.Select
                  name="default_amount"
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyProperty?.default_amount || ""}
                >
                  <option value="" disabled>
                    -
                  </option>
                  {default_amounts?.map((el) => {
                    return <option value={el}>{el}</option>;
                  })}
                </Form.Select>
              ) : (
                <Form.Control
                  type="text"
                  placeholder={"-"}
                  onChange={changeDefaultAmount}
                  value={modifyProperty?.default_amount}
                />
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("planning_page.unit")}</Form.Label>
              <Form.Control
                name="unit"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.unit}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("planning_page.price_per_unit")}</Form.Label>
              <Form.Control
                name="price_per_unit"
                type="text"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyProperty?.price_per_unit}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("planning_page.source")}</Form.Label>
              <Form.Control
                name="source"
                type="text"
                placeholder={"-"}
                onChange={handleChange}
                value={copy ? null : modifyProperty?.source}
              />
            </Form.Group>
          </div>
        </SidePanelBody>
        <SidePanelFooter>
          <Button main type="submit">
            {t("planning_page.submit")}
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
      <CustomModal
        theme={"light"}
        open={open}
        setOpen={setOpen}
        title={title}
        cancelText={t("property_page.cancel")}
        okText={t("property_page.submit")}
        handleOk={textSubmit}
        body={getBody}
        size="lg"
      />
      <CustomModal
        theme={theme}
        open={systemOpen}
        setOpen={setSystemOpen}
        title={title}
        cancelText={t("property_page.cancel")}
        okText={t("property_page.submit")}
        handleOk={handleTableSubmit}
        body={tableBody}
        size={size}
      />
    </Form>
  );
};

export default NewMaintenanceItemSidePanel;
