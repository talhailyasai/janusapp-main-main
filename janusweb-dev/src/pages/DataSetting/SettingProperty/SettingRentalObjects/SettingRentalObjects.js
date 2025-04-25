import api from "api";
import React, { useEffect, useState } from "react";
import Button from "components/common/Button";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import DataTable from "react-data-table-component";
import RentalObjectsSidePanel from "./RentalObjectsSidePanel";
import { Form } from "@themesberg/react-bootstrap";
import "./SettingRentalObjects.css";
import { t } from "i18next";
import { toast } from "react-toastify";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import DeleteModal from "components/PlanningPage/MaintainancePage/components/Report/ActivitesYear/DeleteModal";

const SettingRentalObjects = () => {
  const [rentalObjects, setRentalObjects] = useState([]);

  const [dupRentalObjects, setDupRentalObjects] = useState([]);

  const [rentalDrawer, setRentalDrawer] = useState(false);
  const [initalVal, setInitalVal] = useState(null);
  const [copy, setCopy] = useState(false);

  const [searchValue, setSearchValue] = useState(null);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const getRentalObjects = async () => {
    const res = await api.get("/datasetting-rentalObjects");
    setRentalObjects(res.data);
    setDupRentalObjects(res.data);
  };
  useEffect(() => {
    getRentalObjects();
  }, []);

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    let streetAddress = rentalObjects?.find(
      (obj) => obj.objectId === data?.objectId
    );
    if (streetAddress && (initalVal == null || copy)) {
      return toast("This Object ID Already Exist.", {
        type: "error",
      });
    }
    if (initalVal == null || copy) {
      if (copy) {
        data._id = undefined;
      }
      const res = await api.post("/datasetting-rentalObjects", data);
      let responseItem = [...rentalObjects, res.data];
      setRentalObjects(responseItem);
      setDupRentalObjects(responseItem);
      setCopy(false);
    } else {
      let res = await api.patch(
        `/datasetting-rentalObjects/${initalVal?._id}`,
        data
      );
      let responseItem = rentalObjects?.map((elem) => {
        if (elem._id == res.data._id) {
          return (elem = res.data);
        } else {
          return elem;
        }
      });
      setRentalObjects(responseItem);
      setDupRentalObjects(responseItem);
    }
    setRentalDrawer(false);
  };

  const handleNewProperty = (item) => {
    setInitalVal(item);
    SidePanelService.open(RentalObjectsSidePanel, {
      handleSubmit,
      initalVal,
      copy,
      handleClose: () => {
        setRentalDrawer(false);
        setCopy(false);
      },
    });
  };

  useEffect(() => {
    handleNewProperty();
  }, [rentalDrawer]);

  const handleDeleteModal = (item) => {
    setInitalVal(item);
    setDeleteModalShow(true);
  };

  const settingAddressColumn = [
    {
      name: t("property_page.Object_ID"),
      cell: (row, index, column, id) => {
        return <span>{row.objectId} </span>;
      },
      sortable: true,
      selector: "objectId",
      // width: "222px",
    },
    {
      name: t("property_page.Object_type"),
      cell: (row, index, column, id) => {
        return <span>{row.objectType} </span>;
      },
      sortable: true,
      selector: "objectType",
      width: "170px",
    },
    {
      name: t("property_page.Apartment_no"),
      cell: (row, index, column, id) => {
        return <span>{row.apartmentNo} </span>;
      },
      selector: "apartmentNo",
      sortable: true,
    },
    {
      name: t("property_page.Floor"),
      cell: (row, index, column, id) => {
        return <span> {row.floor} </span>;
      },
      sortable: true,
      selector: "floor",
    },
    {
      name: t("property_page.Rent"),
      cell: (row, index, column, id) => {
        return <span> {row.rent} </span>;
      },
      selector: "rent",
      // width: "130px",
      sortable: true,
    },
    {
      name: t("property_page.Contract_Area"),
      cell: (row, index, column, id) => {
        return <span> {row.contractArea} </span>;
      },
      sortable: true,
      selector: "contractArea",
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
      name: t("property_page.Building"),
      cell: (row, index, column, id) => {
        return <span> {row.building} </span>;
      },
      // width: "80px",
      sortable: true,
      selector: "building",
    },

    {
      name: t("property_page.address"),
      cell: (row, index, column, id) => {
        return <span> {row.address} </span>;
      },
      width: "200px",
      sortable: true,
      selector: "address",
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
                setRentalDrawer(true);
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
  const handleSearch = (e) => {
    let uValue = e.target.value.toUpperCase();
    setSearchValue(uValue);
    let val = e.target.value.toLowerCase();
    if (val === "") {
      setRentalObjects(dupRentalObjects);
    } else {
      setRentalObjects(
        dupRentalObjects?.filter((el) =>
          el?.address?.toLowerCase()?.includes(val)
        )
      );
    }
  };

  const deleteModalClose = () => {
    setDeleteModalShow(false);
  };

  const deleteRentalObjects = async (id) => {
    const res = await api.delete(`/datasetting-rentalObjects/${id}`);
    let newData = rentalObjects?.filter((elem) => {
      return elem._id !== id;
    });
    setRentalObjects(newData);
    deleteModalClose();
  };
  return (
    <div>
      {/* Search bar  */}
      <div className="rental_object_search_main">
        <Form.Control
          type="text"
          placeholder={t("common.pages.search")}
          // value={searchValue}
          onChange={(e) => handleSearch(e)}
          style={{ width: "17rem" }}
          className="rental_search"
        />
        <Button
          className="add_package_btn add_address"
          onClick={() => setRentalDrawer(true)}
        >
          <span class="material-symbols-outlined">add</span>
          {t(`data_settings.addObjects`)}
        </Button>
      </div>

      {rentalDrawer && <SidePanelRoot />}
      <DataTable
        data={rentalObjects}
        columns={settingAddressColumn}
        noDataComponent={t("common.pages.There are no records to display")}
        highlightOnHover
        responsive
        pagination
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
            `property_page.Are_you_sure_you_want_to_delete_this_rental_object?`
          )}
          modalHeader={t("property_page.Delete_rental_object")}
          deleteFunction={deleteRentalObjects}
          deleteItemId={initalVal}
        />
      )}
    </div>
  );
};

export default SettingRentalObjects;
