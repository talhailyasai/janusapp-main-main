import { GetSingleActivityByComponentCode } from "lib/ActivityLib";
import {
  CreateNewComponent,
  DeleteComponentById,
  EditComponentById,
  GetSingleComponentByComponentCode,
} from "lib/ComponentLib";
import { DeleteActivityById } from "lib/ActivityLib";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { useEffect, useState } from "react";
import DeleteModal from "components/common/Modals/DeleteModal";
import { ModalRoot, ModalService } from "components/common/Modal";
import { SidePanelRoot, SidePanelService } from "components/common/SidePanel";
import MainData from "./components/MainData";
import Attributes from "./components/Attributes";
import Info from "./components/Info";
import NewComponentSidePanel from "./SidePanels/NewComponentSidePanel";
import ModifyComponentSidePanel from "./SidePanels/ModifyComponentSidePanel";
import Loader from "components/common/Loader";
import ActivityPanel from "components/ActivityPanel";
import NewPackageSidePanel from "components/PlanningPage/MaintainancePage/SidePanels/NewPackageSidePanel";
import NewCompPackageSidePanel from "components/PlanningPage/MaintainancePage/SidePanels/NewCompPackageSidePanel";
import { useTranslation } from "react-i18next";
import ComponentInfoTab from "./componentTabs/componentInfoTab";
import api from "api";
import { generateUniqueCode } from "lib/utils/generateUniqueCode";
import { Button, Modal } from "@themesberg/react-bootstrap";
import { useUserContext } from "context/SidebarContext/UserContext";
import { useHistory } from "react-router-dom";

let initalVal = {};

const ComponentDetails = ({
  modifyAction,
  newTask,
  deleteAction,
  newActivity,
  modifyActivity,
  deleteActivity,
  handleChangeAction,
  mainData,
  attributes,
  info,
  newPackage,
}) => {
  const { user } = useUserContext();
  const [modifyComponent, setModifyComponent] = useState(initalVal);
  const [selectedActivity, setSelectedActivity] = useState();
  const [maxCompMessage, setMaxCompMessage] = useState("");
  const [showMaxCompModal, setShowMaxCompModal] = useState(false);
  const history = useHistory();
  const {
    propertyChange,
    buildingChange,
    componentChange,
    setComponentChange,
    property,
    buildingObj,
    setComponentAdded,
    componentAdded,
    activityAdded,
    setActivityAdded,
    componentMessage,
    windowDimension,
  } = usePropertyContextCheck();
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  // Get single components by component code
  const { value: singleComponentData, loading } =
    GetSingleComponentByComponentCode(componentChange || undefined, {}, [
      buildingChange,
      componentChange,
      componentAdded,
      activityAdded,
    ]);

  const { value: activityData } = GetSingleActivityByComponentCode(
    singleComponentData?._id,
    {},
    [singleComponentData, activityAdded]
  );

  const getAllUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let allprofileUser = await api.get(`/users/adminId/${user?._id}`);
      let incrseuse = 3;
      setUsers(allprofileUser?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const handleCloseMaxComp = () => {
    setShowMaxCompModal(false);
    setMaxCompMessage("");
  };

  const handleChange = (e) => {
    setModifyComponent((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.toUpperCase(),
    }));
  };

  const handleDeleteComponent = async (id) => {
    ModalService.open(DeleteModal, {
      type: "component",
      handleDelete: async () => {
        await DeleteComponentById(id);
        setModifyComponent(initalVal);
        setComponentAdded({});
        localStorage.removeItem("component");
        localStorage.removeItem("componentObj");
      },
      handleClose: () => {
        handleChangeAction(null);
      },
    });
  };
  const handleDeleteActivity = async (id) => {
    if (id)
      ModalService.open(DeleteModal, {
        type: "activity",
        handleDelete: async () => {
          await DeleteActivityById(id);
          setSelectedActivity();
          setActivityAdded({});
        },
        handleClose: () => {
          handleChangeAction(null);
        },
      });
  };
  const handleSubmit = async (e, modifyComponent) => {
    e.preventDefault();
    if (!modifyComponent?.attendance_plan_date) {
      modifyComponent.attendance_plan_date =
        modifyComponent?.attendance_lastest_date;
    }
    if (!modifyComponent?.maintenance_plan_date) {
      modifyComponent.maintenance_plan_date =
        modifyComponent?.maintenance_lastest_date;
    }
    console.log("data in modifyComponent", modifyComponent);
    // return;
    modifyComponent.property_code = property?._id;
    modifyComponent.building_code = buildingObj?._id;

    let formData = new FormData();
    if (modifyComponent?.image) {
      for (const key in modifyComponent) {
        if (Array.isArray(modifyComponent[key])) {
          formData.append(key, JSON.stringify(modifyComponent[key]));
        } else {
          if (modifyComponent[key] !== null)
            formData.append(key, modifyComponent[key]);
        }
      }
    }
    if (modifyAction) {
      // Modify Api
      let res = await api.patch(
        `/components/${singleComponentData?._id}`,
        modifyComponent?.image ? formData : modifyComponent
      );

      if (res.status === 409) {
        alert("Component code already exists");
      }
      localStorage.setItem("component", res?.data?.component_code);
      setComponentAdded({});
      // await EditComponentById(singleComponentData?._id, {
      //   body: JSON.stringify(modifyComponent),
      // }).then((res) => {
      //   console.log(res);
      //   if (res.status === 409) {
      //     alert("Component code already exists");
      //   } else {
      //     window.location.reload();
      //   }
      // });
    } else if (newTask) {
      // Create Api

      let res = await api.post(
        "/components/",
        modifyComponent?.image ? formData : modifyComponent
      );

      if (res?.response?.data?.message) {
        setMaxCompMessage(res?.response?.data?.message);
        return setShowMaxCompModal(true);
      }

      localStorage.setItem("property", propertyChange);
      localStorage.setItem("building", buildingChange);
      if (modifyComponent.component_code)
        localStorage.setItem("component", modifyComponent.component_code);
      else
        localStorage.setItem(
          "component",
          res._id.toString().slice(-6).toUpperCase()
        );

      // ................................
      // await CreateNewComponent({
      //   body: JSON.stringify({
      //     property_code: propertyChange,
      //     building_code: buildingChange,
      //     ...modifyComponent,
      //   }),
      // }).then(async (res) => {
      //   const data = await res.json();
      //   localStorage.setItem("property", propertyChange);
      //   localStorage.setItem("building", buildingChange);
      //   if (modifyComponent.component_code)
      //     localStorage.setItem("component", modifyComponent.component_code);
      //   else
      //     localStorage.setItem(
      //       "component",
      //       data._id.toString().slice(-6).toUpperCase()
      //     );
      // });
      setComponentAdded(res?.data);
    }
    // window.location = `${process.env.REACT_APP_FRONT_END_URL}/property`;
  };

  const handleNewComponent = () => {
    setModifyComponent(initalVal);
    SidePanelService.open(NewComponentSidePanel, {
      handleSubmit,
      initalVal: { ...initalVal, component_code: generateUniqueCode() },
      handleClose: () => {
        handleChangeAction(null);
        // setComponentChange(null);
        history.push("/property");
      },
    });
  };
  const handleModifyComponent = (singleComponentData) => {
    setModifyComponent(singleComponentData);
    SidePanelService.open(ModifyComponentSidePanel, {
      handleSubmit,
      singleComponentData,
      handleClose: () => {
        handleChangeAction(null);
      },
    });
  };

  const handleModifyActivityModal = (selectedActivity) => {
    if (selectedActivity?._id) {
      SidePanelService.open(ActivityPanel, {
        selectedActivity,
        deleteActivity,
        newActivity,
        modifyActivity,

        handleSubmit,
        handleClose: () => {
          handleChangeAction(null);
        },
      });
    }
  };

  const handleNewActivityModal = (selectedActivity) => {
    SidePanelService.open(ActivityPanel, {
      deleteActivity,
      newActivity,
      modifyActivity,

      handleSubmit,
      handleClose: () => {
        handleChangeAction(null);
      },
    });
  };
  const handleNewPackageModal = () => {
    SidePanelService.open(NewCompPackageSidePanel, {
      handleSubmit,
      initalVal,
      handleClose: () => {
        handleChangeAction(null);
      },
    });
  };

  useEffect(() => {
    if (modifyAction) handleModifyComponent(singleComponentData);
    else if (newTask) handleNewComponent();
    else if (deleteAction) handleDeleteComponent(singleComponentData._id);
    else if (deleteActivity) handleDeleteActivity(selectedActivity?._id);
    else if (newActivity) handleNewActivityModal();
    else if (modifyActivity) handleModifyActivityModal(selectedActivity);
    else if (newPackage) handleNewPackageModal();
  }, [
    newTask,
    modifyAction,
    deleteAction,
    deleteActivity,
    newActivity,
    modifyActivity,
    newPackage,
  ]);
  useEffect(() => {
    setModifyComponent(singleComponentData);
  }, [singleComponentData]);

  const defaultProps = {
    disabled: modifyAction ? false : newTask ? false : true,
    required: false,
    handleChange: handleChange,
  };
  if (loading) return <Loader />;
  if (componentMessage)
    return (
      <>
        {/* {t(
          "property_page.No registered components in this building, select Action menu to add new"
        )} */}
        {t(`property_page.${componentMessage}`)}
        <SidePanelRoot style={{ width: newPackage && "77%" }} />
      </>
    );

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
  return (
    <>
      {(deleteAction || deleteActivity) && <ModalRoot />}
      {(modifyAction ||
        newTask ||
        newActivity ||
        modifyActivity ||
        newPackage) && <SidePanelRoot style={{ width: newPackage && "77%" }} />}
      {mainData ? (
        <MainData
          defaultProps={defaultProps}
          modifyComponent={modifyComponent}
          activityData={activityData}
          setSelectedActivity={setSelectedActivity}
          handleChangeAction={handleChangeAction}
          users={users}
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
      ) : attributes ? (
        <Attributes
          defaultProps={defaultProps}
          modifyComponent={modifyComponent}
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
      ) : info ? (
        <ComponentInfoTab
          defaultProps={defaultProps}
          modifyComponent={modifyComponent}
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
      ) : (
        // <Info defaultProps={defaultProps} modifyComponent={modifyComponent} />
        ""
      )}

      {/* Maximum Buildings Modal  */}
      <Modal
        show={showMaxCompModal}
        onHide={handleCloseMaxComp}
        centered
        className="email_verification_modal_main"
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {maxCompMessage}
          {maxCompMessage !== "You cannot add more than 50 buildings!" && (
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
    </>
  );
};

export default ComponentDetails;
