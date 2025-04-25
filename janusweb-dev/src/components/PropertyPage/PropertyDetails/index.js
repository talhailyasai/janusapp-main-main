import { useEffect, useRef, useState } from "react";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { GetSingleBuildingByPropertyCode } from "lib/BuildingLib";
import {
  CreateNewProperty,
  DeletePropertyById,
  EditPropertyById,
  GetSinglePropertyByPropertyCode,
} from "lib/PropertiesLib";
import { ModalRoot, ModalService } from "components/common/Modal";
import DeleteModal from "components/common/Modals/DeleteModal";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import MainData from "./components/MainData";
import Info from "./components/Info";
import ModifyPropertySidePanel from "./SidePanels/ModifyPropertySidePanel";
import NewPropertySidePanel from "./SidePanels/NewPropertySidePanel";
import Loader from "components/common/Loader";
import { useTranslation } from "react-i18next";
import PropertyAttributesTab from "./propertyTabs/propertyAttributeTab";
import api from "api";
import { Button, Modal } from "@themesberg/react-bootstrap";
import { useUserContext } from "context/SidebarContext/UserContext";
import { useHistory } from "react-router-dom";

let initalVal = {};

const PropertyDetails = ({
  modifyAction,
  newTask,
  deleteAction,
  handleChangeAction,
  mainData,
  attributes,
  info,
}) => {
  const { user } = useUserContext();
  const [modifyProperty, setModifyProperty] = useState(initalVal);
  const [maxPropertyMessage, setMaxPropertyMessage] = useState("");
  const [showMaxPropertyModal, setShowMaxPropertyModal] = useState(false);
  const history = useHistory();
  const {
    propertyChange,
    setProperty,
    setPropertyAdded,
    propertyAdded,
    setPropertyChange,
    getWindowSize,
    windowDimension,
  } = usePropertyContextCheck();

  // Get single building by property code
  const { value: singlePropertyData, loading: propertyLoading } =
    GetSinglePropertyByPropertyCode(propertyChange || "", {}, [
      propertyChange,
      propertyAdded,
    ]);

  // Get buildings
  const { value: buildingsData } = GetSingleBuildingByPropertyCode(
    singlePropertyData?._id,
    {},
    [singlePropertyData]
  );

  const { t } = useTranslation();

  const handleCloseMaxProperty = () => {
    setShowMaxPropertyModal(false);
    setMaxPropertyMessage("");
  };

  const handleChange = (e) => {
    setModifyProperty((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.toUpperCase(),
    }));
  };

  const handleDeleteProperty = async (id) => {
    ModalService.open(DeleteModal, {
      type: "property",
      handleDelete: async () => {
        await DeletePropertyById(id);
        setProperty(null);
        setModifyProperty(initalVal);
        setPropertyChange(undefined);
        setPropertyAdded({});
        localStorage.removeItem("planning_property_code");
        localStorage.removeItem("planing_property");
        localStorage.removeItem("property");
        localStorage.removeItem("propertyObj");
      },
      handleClose: () => {
        handleChangeAction(null);
      },
    });
  };
  const handleSubmit = async (e, modifyProperty) => {
    e.preventDefault();
    let formData = new FormData();
    if (modifyProperty?.image) {
      for (const key in modifyProperty) {
        if (Array.isArray(modifyProperty[key])) {
          formData.append(key, JSON.stringify(modifyProperty[key]));
        } else {
          if (modifyProperty[key] !== null)
            formData.append(key, modifyProperty[key]);
        }
      }
    }
    if (modifyAction) {
      // Modify Api
      // await EditPropertyById(singlePropertyData?._id, {
      //   body: JSON.stringify(modifyProperty),
      // }).then(() => {
      //   window.location.reload();
      // });

      let response = await api.put(
        `/properties/${singlePropertyData?._id}`,
        modifyProperty?.image ? formData : modifyProperty
      );
      setPropertyAdded({});
      handleChangeAction(null);
      history.push("/property");
    } else if (newTask) {
      // Create Api
      let res = await api.post(
        "/properties/",
        modifyProperty?.image ? formData : modifyProperty
      );

      if (res?.response?.data?.message && res?.response?.data?.maxUser) {
        setMaxPropertyMessage(res?.response?.data?.message);
        return setShowMaxPropertyModal(true);
      } else if (res?.response?.data?.message && res?.response?.data?.error) {
        return;
      }
      localStorage.setItem("propertyObj", JSON.stringify(res?.data));
      localStorage.setItem("property", modifyProperty.property_code);
      localStorage.removeItem("buildingObj");
      localStorage.removeItem("building");
      localStorage.removeItem("component");
      localStorage.removeItem("compObj");

      // await CreateNewProperty({
      //   body: modifyProperty?.image ? formData : { a: 1 },
      // }).then(() => {
      //   localStorage.setItem("property", modifyProperty.property_code);
      //   // window.location.reload();
      // });
      // console.log("coming in close ing the new");
      setPropertyAdded(res?.data);
      handleChangeAction(null);
      history.push("/property");
    }

    // window.location.reload();
  };

  const handleNewProperty = () => {
    setModifyProperty(initalVal);
    SidePanelService.open(NewPropertySidePanel, {
      handleSubmit,
      initalVal,
      newTask,
      handleClose: () => {
        handleChangeAction(null);
        history.push("/property");
      },
    });
  };
  const handleModifyProperty = (singlePropertyData) => {
    setModifyProperty(singlePropertyData);
    SidePanelService.open(ModifyPropertySidePanel, {
      handleSubmit,
      singlePropertyData,
      newTask,
      handleClose: () => {
        handleChangeAction(null);
      },
    });
  };

  const handleUpgradePlan = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      (user?.plan === "Standard Plus" ||
        user?.plan === "Standard" ||
        user?.cancelSubscriptionDate) &&
      !user?.trialEnd
    ) {
      let res = await api.get(`/stripe/getCustomerPortal/${user?._id}`);
      window.location = res?.data;
    } else {
      history.push("/pricing-plan");
    }
  };

  useEffect(() => {
    setModifyProperty(singlePropertyData);
  }, [singlePropertyData]);

  useEffect(() => {
    if (modifyAction) handleModifyProperty(singlePropertyData);
    else if (newTask) handleNewProperty();
    else if (deleteAction) handleDeleteProperty(singlePropertyData._id);
    else setModifyProperty(singlePropertyData);
  }, [newTask, modifyAction, deleteAction]);

  const defaultProps = {
    disabled: modifyAction ? false : newTask ? false : true,
    required: false,
    handleChange: handleChange,
  };

  if (propertyLoading) return <Loader />;
  // if (!singlePropertyData)
  //   return `${t("property_page.Please_select_a_property")} ...`;
  return (
    <div className="d-flex flex-wrap flex-xl-nowrap gap-xl-4">
      {modifyProperty || singlePropertyData ? (
        mainData ? (
          <MainData
            defaultProps={defaultProps}
            newTask={newTask}
            modifyProperty={modifyProperty}
            singlePropertyData={singlePropertyData}
            buildingsData={buildingsData}
            mdCol={
              windowDimension
                ? windowDimension < 1024
                  ? 6
                  : windowDimension < 1800
                  ? 4
                  : 3
                : null
            }
          />
        ) : attributes ? (
          <PropertyAttributesTab
            defaultProps={defaultProps}
            newTask={newTask}
            modifyProperty={modifyProperty}
            singlePropertyData={singlePropertyData}
            buildingsData={buildingsData}
            mdCol={
              windowDimension
                ? windowDimension < 1024
                  ? 6
                  : windowDimension < 1500
                  ? 4
                  : windowDimension < 2000
                  ? 3
                  : 2
                : null
            }
          />
        ) : // <Attributes
        //   defaultProps={defaultProps}
        //   newTask={newTask}
        //   modifyProperty={modifyProperty}
        //   singlePropertyData={singlePropertyData}
        //   buildingsData={buildingsData}
        // />
        info ? (
          <Info
            defaultProps={defaultProps}
            newTask={newTask}
            modifyProperty={modifyProperty}
            singlePropertyData={singlePropertyData}
            mdCol={windowDimension && windowDimension < 1024 ? 6 : 4}
          />
        ) : (
          ""
        )
      ) : null}
      {!singlePropertyData && t("property_page.Please_select_a_property")}
      {deleteAction && <ModalRoot />}
      {(modifyAction || newTask) && <SidePanelRoot />}
      {/* Maximum properties Modal  */}
      <Modal
        show={showMaxPropertyModal}
        onHide={handleCloseMaxProperty}
        centered
        className="email_verification_modal_main"
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {maxPropertyMessage}
          {maxPropertyMessage !== "You cannot add more than 15 properties!" && (
            <div className="update_btn_main">
              {user?.role !== "user" && (
                // <a href="/pricing-plan" target="_blank">
                <Button
                  variant="primary"
                  onClick={handleUpgradePlan}
                  className="update_btn_change_plan mt-2"
                >
                  Upgrade Plan
                </Button>
                // </a>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

initalVal = {
  _id: "",
  property_code: "",
  legal_name: "",
  name: "",
  street_adress: "",
  zip_code: "",
  postal_address: "",
  maintenance_area: "",
  owner: "",
  address_label: "",
  administrative_area: "",
  area_lawn: "",
  area_plantation: "",
  area_land: "",
  area_park: "",
  area_hard: "",
  area_water: "",
  area_parking: "",
  built_percentage: "",
  sum_area_bta: "",
  sum_area_bra: "",
  sum_area_loa: "",
  sum_area_ova: "",
  sum_area_heating: "",
  sum_area_boa: "",
  sum_area_bia: "",
  sum_no_of_apartments: "",
  responsible_user: "",
  contract_exist: "",
  contract_sum: "",
  contract_sum_sqm: "",
  contract_excludes: "",
  latitude: "",
  longitude: "",
  changed_by: "",
  change_date: "",
};

export default PropertyDetails;
