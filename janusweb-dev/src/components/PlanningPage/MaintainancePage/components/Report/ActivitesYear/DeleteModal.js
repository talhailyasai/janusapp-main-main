import React from "react";
import { Modal, Button } from "@themesberg/react-bootstrap";
import api from "api";
import { useTranslation } from "react-i18next";

const DeleteModal = ({
  deleteModalClose,
  show,
  modalBody,
  modalHeader,
  deleteFunction,
  deleteItemId,
  // ..............
  initalVal,
  maintainancePlan,
  setMaintainancePlan,
  activitesType,
  maintenanceCreate,
  propertyModal,
  setPopulateData,
  // DataSettingItemIntialVal,
  // DataSettingPkgIntialVal,
  // deleteMaintenancePackage,
  // deleteComponent,
  // DataSettingCompIntialVal,
  // deleteComponentPackage,
  // DataSettingCompPkgIntialVal,
}) => {
  const { t } = useTranslation();
  const maintenanceItemDelete = async () => {
    try {
      let res = await api.delete(
        `/planning_component/maintainance/activitesPerYear-delete/${initalVal?._id}?activitesType=${activitesType}`
      );

      let filterData = [];
      if (res?.data?.length > 0) {
        filterData = maintainancePlan?.map((el) => {
          if (el?._id === res?.data?.[0]?._id) {
            return res?.data[0];
          } else {
            return el;
          }
        });
      } else {
        filterData = maintainancePlan.map((el) => {
          const isRemovingFromThisPlan = el?.documents?.some(
            (plan) => plan._id === initalVal._id
          );
          return {
            ...el,
            totalCost: isRemovingFromThisPlan
              ? el?.totalCost - initalVal?.total_cost
              : el?.totalCost,
            documents: isRemovingFromThisPlan
              ? el?.documents?.filter((plan) => plan._id !== initalVal._id)
              : el?.documents,
          };
        });
      }
      setMaintainancePlan(filterData);
      deleteModalClose();
    } catch (error) {
      console.log(error);
    }
  };

  const evaluate = () => {
    if (propertyModal) {
      setPopulateData(true);
    } else if (modalBody) {
      deleteFunction(deleteItemId);
    } else {
      maintenanceItemDelete();
    }
  };

  return (
    <Modal show={show} onHide={deleteModalClose} animation={false} centered>
      <Modal.Header className="modal_delete_maintenanceItem_heading">
        <Modal.Title className="modaldelete_title">
          {maintenanceCreate
            ? "Select a building"
            : propertyModal
            ? t("common.pages.change_component_detail")
            : modalHeader
            ? modalHeader
            : t("planning_page.Delete_Maintenance_Item")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {maintenanceCreate
          ? "There is no active building,please select one and try again"
          : propertyModal
          ? t("common.pages.change_intervals_and_texts")
          : modalBody
          ? modalBody
          : t("planning_page.are_you_sure_you_delete_this_maintenance")}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            evaluate();
          }}
          className={
            maintenanceCreate
              ? "deletemodal_close_button modal_delete_maintenanceItem_heading createEditModel"
              : "deletemodal_close_button modal_delete_maintenanceItem_heading"
          }
        >
          {propertyModal ? t("common.pages.yes") : t("planning_page.delete")}
        </Button>
        <Button
          variant="primary"
          onClick={deleteModalClose}
          className="deletemodal_close_button"
        >
          {propertyModal ? t("common.pages.no") : t("planning_page.close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
