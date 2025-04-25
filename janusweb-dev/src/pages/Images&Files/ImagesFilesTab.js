import React, { useEffect, useState } from "react";
import "./ImagesFiles.css";
import Tabs from "../../components/common/Tabs";
import ImagesFilesPage from "./index";
import DropdownComponent from "components/common/Dropdown";
import { useTranslation } from "react-i18next";

const ImagesFilesTab = () => {
  // // tab state
  const [ActiveComponent, setActiveComponent] = useState({
    Component: ImagesFilesPage,
    props: {},
  });
  const [currentAction, setCurrentAction] = useState();

  const [currentTab, setCurrentTab] = useState();
  const { t } = useTranslation();

  const deletefiles = currentAction === "delete_files" ? true : false;

  useEffect(() => {
    setActiveComponent({
      Component: ImagesFilesPage,
      props: {
        handleChangeAction,
        deletefiles,
        setCurrentAction,
      },
    });
  }, [currentAction]);

  const ImagesTabValues = [
    {
      name: t("common.pages.Images & Files"),
      id: "imagesfiles",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        imagesfiles: true,
        deletefiles,
      },
    },
  ];

  const handleChangeAction = (item) => {
    setCurrentAction(item);
  };

  const dropDownItems = [
    {
      // if: currentTab === "images",
      text: t("common.pages.delete"),
      id: "delete_files",
      icon: "delete",
      handleClick: (value) => handleChangeAction(value),
    },
  ];

  // ........................................................
  // useEffect(() => {
  //   const activeTabId = localStorage.getItem("activeTabIdImagesAndFiles");
  //   if (activeTabId) {
  //     setCurrentTab(activeTabId);
  //   } else {
  //     setCurrentTab(ImagesTabValues[0].id);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (currentTab) {
  //     localStorage.setItem("activeTabIdImagesAndFiles", currentTab);
  //   }
  // }, [currentTab]);

  // ......................................................
  return (
    <>
      <div style={{ marginTop: "2rem" }} className="Images_files_action_btn">
        <DropdownComponent
          handleClick={handleChangeAction}
          name={t("common.pages.actions")}
          items={dropDownItems}
          nameReset={currentAction ? true : true}
        />
      </div>

      <div className="mt-3">
        <Tabs
          tabValues={ImagesTabValues}
          activeTabId={currentTab}
          onTabChange={(item) => setCurrentTab(item)}
          colLg={12}
        />
      </div>
    </>
  );
};

export default ImagesFilesTab;
