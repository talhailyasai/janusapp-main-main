import api from "api";
import React, { useEffect, useState } from "react";
import Button from "components/common/Button";
import "./SettingAddresses.css";
import DataTable from "react-data-table-component";
import { t } from "i18next";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import SettingAddressesSidePanel from "./settingAddressesSidePanel.js";
import { AiFillEdit } from "react-icons/ai";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { toast } from "react-toastify";
import DeleteModal from "components/PlanningPage/MaintainancePage/components/Report/ActivitesYear/DeleteModal";

const SettingAddresses = () => {
  const [settingAddresses, setSettingAddresses] = useState([]);
  const [initalVal, setInitalVal] = useState(null);
  const [showSidepanel, setShowsidepanel] = useState(false);
  const [copy, setCopy] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const getSettingAddresses = async () => {
    const res = await api.get("/datasetting-addresses");
    setSettingAddresses(res.data);
  };
  useEffect(() => {
    getSettingAddresses();
  }, []);

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    let streetAddress = settingAddresses?.find(
      (obj) => obj.address === data?.address
    );

    if (streetAddress && (initalVal == null || copy)) {
      return toast(
        "Please Enter another Street Adress.This Address Already Exist. ",
        {
          type: "error",
        }
      );
    }

    if (initalVal == null || copy) {
      if (copy) {
        data._id = undefined;
      }
      const res = await api.post("/datasetting-addresses", data);
      let responseItem = [...settingAddresses, res.data];
      setSettingAddresses(responseItem);
      setCopy(false);
    } else {
      let res = await api.patch(
        `/datasetting-addresses/${initalVal?._id}`,
        data
      );
      let responseItem = settingAddresses?.map((elem) => {
        if (elem._id == res.data._id) {
          return (elem = res.data);
        } else {
          return elem;
        }
      });
      setSettingAddresses(responseItem);
    }
    setShowsidepanel(false);
  };

  const handleNewProperty = (item) => {
    setInitalVal(item);
    SidePanelService.open(SettingAddressesSidePanel, {
      handleSubmit,
      initalVal,
      copy,
      handleClose: () => {
        setShowsidepanel(false);
        setCopy(false);
      },
    });
  };

  useEffect(() => {
    handleNewProperty();
  }, [showSidepanel]);

  const handleDeleteModal = (item) => {
    setInitalVal(item);
    setDeleteModalShow(true);
  };

  const deleteModalClose = () => {
    setDeleteModalShow(false);
  };

  const deleteAddress = async (id) => {
    const res = await api.delete(`/datasetting-addresses/${id}`);
    let newData = settingAddresses?.filter((elem) => {
      return elem._id !== id;
    });
    setSettingAddresses(newData);
    deleteModalClose();
  };

  const settingAddressColumn = [
    {
      name: t("property_page.Street_Address"),
      cell: (row, index, column, id) => {
        return <span>{row.address} </span>;
      },
      sortable: true,
      selector: "address",
      minWidth: "222px",
    },
    {
      name: t("common.pages.Zip_Code"),
      cell: (row, index, column, id) => {
        return <span>{row.zipCode} </span>;
      },
      sortable: true,
      selector: "u_system",
      // width: "222px",
    },
    {
      name: t("property_page.Postal_address"),
      cell: (row, index, column, id) => {
        return <span>{row.postalAddress} </span>;
      },
      selector: "postalAddress",
      sortable: true,
      minWidth: "120px",
    },
    {
      name: t("property_page.Building"),
      cell: (row, index, column, id) => {
        return <span> {row.building} </span>;
      },
      // width: "80px",
      sortable: true,
      selector: "building",
    },
    {
      name: t("property_page.Property"),
      cell: (row, index, column, id) => {
        return <span> {row.property} </span>;
      },
      selector: "property",
      // width: "130px",
      sortable: true,
    },
    {
      name: t("common.pages.actions"),
      cell: (row, index, column, id) => {
        return (
          <>
            <RiEdit2Line
              className="data_setting_edit_icon"
              onClick={() => {
                handleNewProperty(row);
                setShowsidepanel(true);
              }}
            />
            <MdOutlineContentCopy
              className="data_setting_delete_icon"
              onClick={() => {
                setCopy(true);
                handleNewProperty(row);
                setShowsidepanel(true);
              }}
            />
            <RiDeleteBin6Line
              className="data_setting_delete_icon"
              onClick={() => handleDeleteModal(row?._id)}
            />
          </>
        );
      },
      // width: "123px",
    },
  ];
  return (
    <div>
      <Button
        className="add_package_btn add_address"
        onClick={() => setShowsidepanel(true)}
      >
        <span class="material-symbols-outlined">add</span>
        {t(`data_settings.add_objects`)}
      </Button>
      {showSidepanel && <SidePanelRoot />}
      <DataTable
        data={settingAddresses}
        columns={settingAddressColumn}
        noDataComponent={t("common.pages.There are no records to display")}
        highlightOnHover
        responsive
        pagination
        className="address_table"
        paginationComponentOptions={{
          rowsPerPageText: t("planning_page.rows_per_page"),
        }}
      />
      {/* // Delete Modal  */}
      {deleteModalShow && (
        <DeleteModal
          deleteModalClose={deleteModalClose}
          show={deleteModalShow}
          modalBody={t(
            `property_page.Are_you_sure_you_want_to_delete_this_address`
          )}
          modalHeader={t("property_page.Delete_Address_item")}
          deleteFunction={deleteAddress}
          deleteItemId={initalVal}
        />
      )}
    </div>
  );
};

export default SettingAddresses;
