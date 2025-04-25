import { OverlayTrigger, Table, Tooltip } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import { Form } from "@themesberg/react-bootstrap";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineContentCopy } from "react-icons/md";
import "./maintenanceItem.css";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import { useEffect } from "react";
import NewMaintenanceItemSidePanel from "./maintenanceItemSidePanel";
import api from "api";
import Loader from "components/common/Loader";
import { useTranslation } from "react-i18next";
import DeleteModal from "components/PlanningPage/MaintainancePage/components/Report/ActivitesYear/DeleteModal";
import Button from "components/common/Button";
import { BsFileEarmarkText } from "react-icons/bs";

const MaintenanceItem = ({ maintenanceItemPkgs, setMaintenanceItemPkgs }) => {
  const [showDrawerMaintenanceItem, setShowDrawerMaintenanceItem] =
    useState(false);
  const [initalVal, setInitalVal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allMaintenanceItem, setAllMaintenanceItem] = useState([]);
  const [dupMaintenanceItem, setdupMaintenanceItem] = useState([]);
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [copy, setCopy] = useState(false);

  const [searchValue, setSearchValue] = useState(null);

  const handleNewProperty = (item) => {
    setInitalVal(item);
    SidePanelService.open(NewMaintenanceItemSidePanel, {
      handleSubmit,
      initalVal,
      copy,
      // newTask,
      handleClose: () => {
        setShowDrawerMaintenanceItem(false);
        setCopy(false);
      },
    });
  };

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    if (initalVal == null || copy) {
      if (copy) {
        data._id = undefined;
      }
      data.order = allMaintenanceItem.length;

      const res = await api.post("/maintaince_items", data);
      let responseItem = [res.data, ...allMaintenanceItem];
      setAllMaintenanceItem(responseItem);
      setdupMaintenanceItem(responseItem);
      setMaintenanceItemPkgs([res.data, ...maintenanceItemPkgs]);
      setCopy(false);
    } else {
      let res = await api.patch(`/maintaince_items/${initalVal._id}`, data);
      let responseItem = allMaintenanceItem.map((elem) => {
        if (elem._id == res.data._id) {
          return (elem = res.data);
        } else {
          return elem;
        }
      });
      setAllMaintenanceItem(responseItem);
      setdupMaintenanceItem(responseItem);
      setMaintenanceItemPkgs(responseItem);
    }

    setShowDrawerMaintenanceItem(false);
  };

  const getAllMaintenanceItem = async () => {
    setLoading(true);
    const res = await api.get("/maintaince_items");
    setAllMaintenanceItem(res.data);
    setdupMaintenanceItem(res.data);
    setLoading(false);
  };

  useEffect(() => {
    handleNewProperty();
  }, [showDrawerMaintenanceItem]);
  useEffect(() => {
    getAllMaintenanceItem();
  }, []);

  const deleteMaintenanceItem = async (id) => {
    const res = await api.delete(`/maintaince_items/${id}`);
    let newData = dupMaintenanceItem.filter((elem) => {
      return elem._id !== id;
    });
    setAllMaintenanceItem(newData);
    setdupMaintenanceItem(newData);
    setMaintenanceItemPkgs(newData);
    deleteModalClose();
    setSearchValue("");
    // window.location.reload();
  };

  const handleSearch = (e) => {
    let uValue = e.target.value.toUpperCase();
    setSearchValue(uValue);
    let val = e.target.value.toLowerCase();
    if (val === "") {
      setAllMaintenanceItem(dupMaintenanceItem);
    } else {
      setAllMaintenanceItem(
        dupMaintenanceItem?.filter((el) => {
          if (
            el?.article?.toLowerCase()?.includes(val) ||
            el?.maintenance_activity?.toLowerCase()?.includes(val)
          ) {
            return el;
          }
        })
      );
    }
  };

  // Delete Modal Function
  const deleteModalClose = () => {
    setShow(false);
  };

  const handleShow = (item) => {
    setInitalVal(item);
    setShow(true);
  };

  return (
    <>
      {/* Search bar  */}
      <div className="d-flex align-items-center">
        <Form.Control
          type="text"
          placeholder={t("common.pages.search")}
          value={searchValue}
          onChange={(e) => handleSearch(e)}
          style={{ width: "17rem" }}
        />
      </div>

      <div className="maintenance_item_add_item">
        <Button
          className="maintenance_item_add_item_btn"
          onClick={() => setShowDrawerMaintenanceItem(true)}
        >
          <span class="material-symbols-outlined">add</span>

          {t("data_settings.add_item")}
        </Button>
      </div>
      {showDrawerMaintenanceItem && <SidePanelRoot />}
      <div className="maintenanceItem_Table">
        {loading ? (
          <div style={{ marginBottom: "1rem" }}>
            <Loader />
          </div>
        ) : (
          <>
            <Table>
              <thead>
                <tr style={{ color: "black" }}>
                  <th className="maintenance_item_article">
                    {t("planning_page.article")}
                  </th>
                  <th className="maintenance_item_activity">
                    {t("planning_page.maintainence_activity")}
                  </th>
                  <th className="maintenance_item_article">Text</th>
                  <th className="maintenance_item_article">
                    {t("planning_page.technical_life")}
                  </th>
                  <th className="maintenance_item_article">
                    {t("data_settings.default_amount")}
                  </th>
                  <th className="maintenance_item_article">
                    {t("planning_page.unit")}
                  </th>
                  <th className="maintenance_item_article">
                    {t("planning_page.price_per_unit")}
                  </th>
                  {/* <th className="maintenance_item_article">
                    {t("planning_page.source")}
                  </th> */}
                  <th className="maintenance_item_article">{t("common.pages.actions")}</th>
                  <th className="">System</th>
                </tr>
              </thead>

              <tbody className="components_main">
                {allMaintenanceItem?.map((el) => {
                  return (
                    <tr>
                      <td className="maintenance_item_article">
                        {el?.article}
                      </td>
                      <td className="maintenance_item_activity">
                        {el?.maintenance_activity}
                      </td>
                      <td className="maintenance_item_article">
                        {el?.text ? (
                          <OverlayTrigger
                            overlay={<Tooltip>{el?.text}</Tooltip>}
                          >
                            <BsFileEarmarkText className="text_attendenance_icon" />
                          </OverlayTrigger>
                        ) : null}
                      </td>
                      <td className="maintenance_item_article">
                        {el?.technical_life}
                      </td>
                      <td className="maintenance_item_article">
                        {el?.default_amount}
                      </td>
                      <td className="maintenance_item_article">{el?.unit}</td>
                      <td className="maintenance_item_article">
                        {el?.price_per_unit}
                      </td>
                      {/* <td className="maintenance_item_article">{el?.source}</td> */}
                      <td>
                        <div style={{ width: "6rem", textAlign: "left" }}>
                          {el?.tenantId && (
                            <RiEdit2Line
                              className="data_setting_edit_icon"
                              onClick={() => {
                                handleNewProperty(el);
                                setShowDrawerMaintenanceItem(true);
                              }}
                            />
                          )}

                          <MdOutlineContentCopy
                            className="data_setting_delete_icon"
                            onClick={() => {
                              setCopy(true);
                              handleNewProperty(el);
                              setShowDrawerMaintenanceItem(true);
                            }}
                          />
                          {el?.tenantId && (
                            <RiDeleteBin6Line
                              className="data_setting_delete_icon"
                              onClick={() => handleShow(el?._id)}
                            />
                          )}
                        </div>
                      </td>
                      <td className="" id={el?.u_system?.split(".")[0]}>
                        {el?.u_system}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {/* // Delete Modal  */}
            {show && (
              <DeleteModal
                deleteModalClose={deleteModalClose}
                show={show}
                modalBody={t(
                  "data_settings.Are you sure you want to delete this Maintenance Item?And Deleted from Maintenance Package."
                )}
                modalHeader={t("data_settings.Delete Maintenance Item")}
                deleteFunction={deleteMaintenanceItem}
                deleteItemId={initalVal}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MaintenanceItem;
