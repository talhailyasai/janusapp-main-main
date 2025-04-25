import { useEffect, useState } from "react";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import {
  CreateNewBuilding,
  DeleteBuildingById,
  EditBuildingById,
  GetSingleBuildingByBuildingCode,
} from "lib/BuildingLib";
import { GetSingleComponentByBuildingId } from "lib/ComponentLib";
import { ModalRoot, ModalService } from "components/common/Modal";
import DeleteModal from "components/common/Modals/DeleteModal";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import MainData from "./components/MainData";
import Attributes from "./components/Attributes";
import Quantities from "./components/Quantities";
import NewBuildingSidePanel from "./SidePanels/NewBuildingSidePanel";
import ModifyBuildingSidePanel from "./SidePanels/ModifyBuildingSidePanel";
import Loader from "components/common/Loader";
import { useTranslation } from "react-i18next";
import api from "api";
import { Button, Modal, Table } from "@themesberg/react-bootstrap";
import { useUserContext } from "context/SidebarContext/UserContext";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

let initalVal = {};

const BuildingDetails = ({
  modifyAction,
  newTask,
  deleteAction,
  handleChangeAction,
  mainData,
  attributes,
  quantities,
  setBuildingChange,
}) => {
  const { t } = useTranslation();
  const { user } = useUserContext();
  const [modifyBuilding, setModifyBuilding] = useState(initalVal);
  const [maxBuildingMessage, setMaxBuildingMessage] = useState("");
  const [showMaxBuildingModal, setShowMaxBuildingModal] = useState(false);
  const {
    propertyChange,
    buildingChange,
    buildings,
    property,
    setBuildingObj,
    setCompObj,
    setComponentChange,
    setBuildingAdded,
    buildingAdded,
    windowDimension,
  } = usePropertyContextCheck();
  const history = useHistory();
  const { value: singleBuildingData, loading: buildingLoading } =
    GetSingleBuildingByBuildingCode(buildingChange || undefined, {}, [
      buildingChange,
      propertyChange,
      buildingAdded,
    ]);

  const { value: componentsData } = GetSingleComponentByBuildingId(
    singleBuildingData?._id,
    {},
    [singleBuildingData]
  );

  const handleCloseMaxProperty = () => {
    setShowMaxBuildingModal(false);
    setMaxBuildingMessage("");
  };
  // console.log({ modifyBuilding });
  const handleChange = (e) => {
    setModifyBuilding((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.toUpperCase(),
    }));
  };
  const handleDeleteBuilding = async (id) => {
    ModalService.open(DeleteModal, {
      type: "building",
      handleDelete: async () => {
        await DeleteBuildingById(id);
        setModifyBuilding(initalVal);
        setBuildingAdded({});
        localStorage.removeItem("building");
        localStorage.removeItem("buildingObj");
      },
      handleClose: () => {
        handleChangeAction(null);
      },
    });
  };
  const getQueryParam = (name) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
  };
  const handleSubmit = async (e, modifyBuilding) => {
    e.preventDefault();

    const selectPropId = getQueryParam("selectPropId");

    modifyBuilding.property_code = selectPropId || property?._id;

    let formData = new FormData();
    if (modifyBuilding?.image) {
      for (const key in modifyBuilding) {
        if (Array.isArray(modifyBuilding[key])) {
          formData.append(key, JSON.stringify(modifyBuilding[key]));
        } else {
          if (modifyBuilding[key] !== null)
            formData.append(key, modifyBuilding[key]);
        }
      }
    }
    if (modifyAction) {
      // Modify Api
      // await EditBuildingById(singleBuildingData?._id, {
      //   body: JSON.stringify(modifyBuilding),
      // });
      await api.put(`/buildings/${singleBuildingData?._id}`, modifyBuilding);
      setBuildingAdded({});
      handleChangeAction(null);
      history.push("/property");
    } else if (newTask) {
      // Create Api
      let res = await api.post("/buildings/", modifyBuilding);
      if (res?.response?.data?.message && res?.response?.data?.maxUser) {
        setMaxBuildingMessage(res?.response?.data?.message);
        setShowMaxBuildingModal(true);
        return;
      } else if (res?.response?.data?.message && res?.response?.data?.error) {
        return;
      }
      let buildStore = {
        ...res?.data,
        property_code: res?.data?.property_code?._id,
      };
      localStorage.setItem("building", res?.data?.building_code);
      setBuildingChange(res?.data?.building_code);
      localStorage.setItem("buildingObj", JSON.stringify(buildStore));
      setBuildingObj(buildStore);

      // await CreateNewBuilding({
      //   body: JSON.stringify({
      //     property_code: propertyChange,
      //     ...modifyBuilding,
      //   }),
      // });
      setBuildingAdded(res?.data);
      handleChangeAction(null);
      history.push("/property");
    }
    // window.location = `${process.env.REACT_APP_FRONT_END_URL}/property`;
  };

  const handleNewBuilding = () => {
    setModifyBuilding(initalVal);
    SidePanelService.open(NewBuildingSidePanel, {
      handleSubmit,
      initalVal: {
        ...initalVal,
        building_code: `${propertyChange}${buildings?.length < 9 ? "0" : ""}${
          buildings?.length > 0 ? buildings?.length + 1 : "1"
        }`,
      },
      newTask,
      handleClose: () => {
        handleChangeAction(null);
        // setBuildingChange(null);
        history.push("/property");
      },
    });
  };
  const handleModifyBuilding = (singleBuildingData) => {
    setModifyBuilding(singleBuildingData);
    SidePanelService.open(ModifyBuildingSidePanel, {
      handleSubmit,
      singleBuildingData,
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
    setModifyBuilding(singleBuildingData);
  }, [singleBuildingData]);
  // console.log("modifyAction", modifyAction);
  useEffect(() => {
    if (modifyAction) handleModifyBuilding(singleBuildingData);
    else if (newTask) handleNewBuilding();
    else if (deleteAction) handleDeleteBuilding(singleBuildingData?._id);
  }, [newTask, modifyAction, deleteAction]);

  const defaultProps = {
    disabled: modifyAction ? false : newTask ? false : true,
    required: false,
    handleChange: handleChange,
  };
  if (buildingLoading) return <Loader />;
  if (!singleBuildingData)
    return (
      <>
        {t("property_page.No_buildings")}
        <SidePanelRoot />
      </>
    );

  const handleNavigate = (comp) => {
    setCompObj(comp);
    setComponentChange(comp?.component_code);
    localStorage.setItem("compObj", JSON.stringify(comp));
    localStorage.setItem("component", comp?.component_code);
  };
  return (
    <div className="col flex-xl-nowrap">
      {mainData ? (
        <>
          <MainData
            defaultProps={defaultProps}
            newTask={newTask}
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
            modifyBuilding={modifyBuilding}
            singleBuildingData={singleBuildingData}
          />
          <div className="row gap-4 flex-nowrap component-obj-lists">
            <div className="building-component-box building_detail_rental w-50">
              <label
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "1px",
                  color: "black",
                  flex: "1 0 33%",
                }}
              >
                {t("property_page.rental_objects")}
              </label>
              <div
                className="buildingFieldContainer building_detail_rental_field"
                style={{
                  backgroundColor: "rgb(245, 248, 251)",
                  color: "black",
                  fontWeight: "bold",
                  // height: "fit-content",
                  border: "1px solid black",
                  marginTop: "0",
                  minWidth: "300px",
                  maxWidth: "500px",
                }}
              ></div>
            </div>
            <div className="building-component-box building_detail_rental w-50">
              <label
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "1px",
                  color: "black",
                }}
              >
                {t("property_page.components")}
              </label>
              <div
                className="buildingFieldContainer building_components building_detail_rental_field"
                style={{
                  // backgroundColor: "rgb(245, 248, 251)",
                  color: "black",
                  fontWeight: "bold",
                  height: "100%",
                  border: "1px solid black",
                  marginTop: "0",
                  minWidth: "300px",
                  maxWidth: "500px",
                }}
              >
                <Table bordered>
                  <thead>
                    {componentsData?.map((item, i) => (
                      // <p style={{ fontWeight: "bolder" }} key={i}>
                      //   {item?.building_code?.building_code}&nbsp;&nbsp;&nbsp;
                      //   {item?.name}
                      // </p>

                      <tr
                        onClick={() => handleNavigate(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <th className="build_comp">{item?.component_code}</th>
                        <th>{item?.name}</th>
                      </tr>
                    ))}
                  </thead>
                </Table>
              </div>
            </div>
          </div>
        </>
      ) : attributes ? (
        <Attributes
          defaultProps={defaultProps}
          newTask={newTask}
          modifyBuilding={modifyBuilding}
          singleBuildingData={singleBuildingData}
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
      ) : quantities ? (
        <>
          <Quantities
            defaultProps={defaultProps}
            newTask={newTask}
            modifyBuilding={modifyBuilding}
            singleBuildingData={singleBuildingData}
            imageUploader={true}
            handleChangeAction={handleChangeAction}
            setModifyBuilding={setModifyBuilding}
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
          {/* {!(newTask || modifyAction) && (
            <>
              <div className="building-component-box">
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginBottom: "1px",
                    color: "black",
                    flex: "1 0 33%",
                  }}
                >
                  {t("property_page.miscellanous_quantities")}
                </label>
                <div
                  className="buildingFieldContainer"
                  style={{
                    backgroundColor: "rgb(245, 248, 251)",
                    color: "black",
                    fontWeight: "bold",
                    height: "fit-content",
                    border: "1px solid black",
                    marginTop: "0",
                  }}
                ></div>
              </div>
            </>
          )} */}
        </>
      ) : (
        ""
      )}

      {deleteAction && <ModalRoot />}
      {(modifyAction || newTask) && <SidePanelRoot />}

      {/* Maximum Buildings Modal  */}
      <Modal
        show={showMaxBuildingModal}
        onHide={handleCloseMaxProperty}
        centered
        className="email_verification_modal_main"
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {maxBuildingMessage}
          {maxBuildingMessage !== "You cannot add more than 50 buildings!" && (
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

export default BuildingDetails;
