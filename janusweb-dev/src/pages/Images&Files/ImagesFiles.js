import {
  Col,
  Container,
  Form,
  FormCheck,
  Row,
  Table,
} from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import "./ImagesFiles.css";
import { MdOutlineContentCopy } from "react-icons/md";
import Filter from "components/common/Filter";
import { t } from "i18next";
import api from "api";
import { toast } from "react-toastify";
import DeleteModal from "components/PlanningPage/MaintainancePage/components/Report/ActivitesYear/DeleteModal";
import Loader from "components/common/Loader";
import DataTable from "react-data-table-component";

const ImagesFiles = ({ handleChangeAction, deletefiles, setCurrentAction }) => {
  const [previewItem, setPreviewItem] = useState(null);
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const [imagesFiles, setImagesFiles] = useState([]);
  const [dupImagesFiles, setDupImagesFiles] = useState([]);
  const [show, setShow] = useState(false);
  const [initalVal, setInitalVal] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectPreview = (e, elem) => {
    if (e.target.checked) setPreviewItem(elem);
    else setPreviewItem(null);
  };

  useEffect(() => {
    if (deletefiles) {
      if (previewItem && previewItem !== "") {
        handleShow(previewItem);
      } else {
        toast(t("planning_page.please_select_at_least_one_item_to_perform"), {
          type: "error",
        });
        handleChangeAction(null);
      }
    }
  }, [deletefiles]);

  const getImageSize = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(`${img.width} x ${img.height}`);
      };
      img.onerror = () => {
        resolve("Unknown Size");
      };
      img.src = imageUrl;
    });
  };

  const handleFindClick = async () => {
    let updatedData = [...dupImagesFiles];

    if (
      filterValues?.belongsTo?.length ||
      filterValues?.properties?.length ||
      filterValues?.startDate ||
      filterValues?.endDate
    ) {
      if (filterValues?.belongsTo?.length) {
        updatedData = updatedData.filter((el) =>
          filterValues.belongsTo.includes(el.type)
        );
      }

      if (filterValues?.properties?.length) {
        updatedData = updatedData.filter((el) =>
          filterValues.properties.includes(el.property_code?.name)
        );
      }

      if (filterValues?.startDate && filterValues?.endDate) {
        updatedData = updatedData.filter((el) => {
          const createdAt = new Date(el?.image?.createdAt).setHours(0, 0, 0, 0);
          return (
            createdAt >=
              new Date(filterValues.startDate).setHours(0, 0, 0, 0) &&
            createdAt <= new Date(filterValues.endDate).setHours(0, 0, 0, 0)
          );
        });
      }
    }

    setImagesFiles(updatedData);
  };

  const getImagesFiles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/images-files");
      const data = [
        ...res.data.properties.map((el) => ({ ...el, type: "Property" })),
        ...res.data.buildings.map((el) => ({ ...el, type: "Building" })),
        ...res.data.components.map((el) => ({ ...el, type: "Component" })),
        ...res.data.activities.map((el) => ({ ...el, type: "Activity" })),
        ...res.data.maintenancePlans.map((el) => ({
          ...el,
          type: "Maintenance Plan",
        })),
      ];
      // Add size key dynamically
      const dataWithSizes = await Promise.all(
        data.map(async (item) => {
          const imageUrl = item.image?.link || item.files?.[0]?.image;
          const size = imageUrl ? await getImageSize(imageUrl) : "Unknown Size";
          return { ...item, size };
        })
      );
      setImagesFiles(dataWithSizes);
      setDupImagesFiles(dataWithSizes);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getImagesFiles();
  }, []);
  const handleShow = (item) => {
    setInitalVal(item);
    setShow(true);
  };
  // Delete Modal Function
  const deleteModalClose = () => {
    setCurrentAction();
    setInitalVal(null);
    setShow(false);
  };
  const deleteFiles = async (item) => {
    // console.log({ imagesFiles_item: item });
    // return;
    if (item.type === "Property") {
      await api.patch(`/images-files/${item?._id}`, { type: "Property" });
    } else if (item.type === "Building") {
      await api.patch(`/images-files/${item?._id}`, { type: "Building" });
    } else if (item.type === "Component") {
      await api.patch(`/images-files/${item?._id}`, { type: "Component" });
    } else if (item.type === "Activity") {
      await api.patch(`/images-files/${item?._id}`, { type: "Activity" });
    } else if (item.type === "Maintenance Plan") {
      await api.patch(
        `/images-files/${item?._id}?image_id=${
          item?.image?._id || item?.image?.link
        }`,
        {
          type: "Maintenance Plan",
        }
      );
    }

    // window.location.reload();
    let data = dupImagesFiles?.filter((elem) => {
      return elem?.image?.link !== item?.image?.link;
    });

    setImagesFiles(data);
    setDupImagesFiles(data);
    setPreviewItem(null);
    deleteModalClose();
  };
  console.log({ imagesFiles });
  const columns = [
    {
      name: (
        <span className="Images_header_name">
          {t("common.pages.Display Name")}
        </span>
      ),
      cell: (row, index) => (
        <div className="display_name_main">
          <FormCheck.Input
            type="checkbox"
            checked={previewItem?.image.link === row?.image?.link}
            onChange={(e) => handleSelectPreview(e, row)}
            className="images_checkbox"
          />
          <img
            src={row?.image?.link}
            alt="property"
            className="property_image"
          />
          <a href={row?.image?.link} target="_blank" rel="noreferrer">
            <span className="property_number">16598{index}</span>
          </a>
        </div>
      ),
      sortable: false,
    },
    {
      name: (
        <span className="Images_header_name">{t("common.pages.Property")}</span>
      ),
      cell: (row, index) => (
        <div className="Image_files_property">
          {`${row?.property_code?.property_code || ""} ${
            row?.property_code?.name || ""
          }`}
        </div>
      ),
      selector: (row) => row?.property_code?.property_code,
      sortable: true,
    },
    {
      name: (
        <span className="Images_header_name">
          {t("common.pages.Belongs to")}
        </span>
      ),
      cell: (row, index) => (
        <div className="Image_files_property">
          {t(`common.pages.${row?.type}`)}
        </div>
      ),
      selector: (row) => row?.type || "",
      sortable: true,
    },
    {
      name: (
        <span className="Images_header_name">{t("common.pages.Format")}</span>
      ),
      cell: (row, index) => (
        <div className="Image_files_property">
          {row?.image?.format?.toUpperCase()}
        </div>
      ),
      selector: (row) => row?.image?.format?.toUpperCase(),
      sortable: true,
    },
    {
      name: (
        <span className="Images_header_name">{t("common.pages.Size")}</span>
      ),
      cell: (row) => (
        <div className="Image_files_property">{row.size || "Unknown Size"}</div>
      ),
      selector: (row) => row.size || "Unknown Size",
      sortable: true,
    },
    {
      name: (
        <span className="Images_header_name">{t("common.pages.Created")}</span>
      ),
      cell: (row, index) => (
        <div className="Image_files_property">
          {new Date(row?.image?.createdAt).toLocaleDateString() || ""}
        </div>
      ),
      selector: (row) => new Date(row?.image?.createdAt).toLocaleDateString(),
      sortable: true,
    },
  ];

  return loading ? (
    <Loader />
  ) : (
    <div>
      <Row>
        <Col className="mt-5">
          <Filter
            handleFindClick={handleFindClick}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            ImagesFiles
          />
        </Col>
      </Row>
      <div className="Images_files_table_main" style={{ maxHeight: "422px" }}>
        <DataTable
          columns={columns}
          data={imagesFiles}
          // pagination
          fixedHeader
          fixedHeaderScrollHeight="422px"
          className="Images_files_react_table"
        />
      </div>

      {/* Delete Modal */}
      {show && (
        <DeleteModal
          deleteModalClose={deleteModalClose}
          show={show}
          modalBody={t("Are you sure you want to delete this Images Files?")}
          modalHeader={t("Delete Images Files")}
          deleteFunction={deleteFiles}
          deleteItemId={initalVal}
        />
      )}
    </div>
  );
};

export default ImagesFiles;
