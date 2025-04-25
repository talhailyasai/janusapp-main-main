import React, { useEffect, useState } from "react";
import Tabs from "../../components/common/Tabs";
import { useTranslation } from "react-i18next";
import UserAccountsPage from "./index";
import DropdownComponent from "components/common/Dropdown";
import "../../components/PropertyPage/ComponentDetails/components/MainData.css";
const UserAccounts = () => {
  const [ActiveComponent, setActiveComponent] = useState({
    Component: UserAccountsPage,
    props: {},
  });

  const { t } = useTranslation();
  const [currentAction, setCurrentAction] = useState();
  const [currentTab, setCurrentTab] = useState("myprofile");
  const [user, setUser] = useState(null);

  const newItem = currentAction === "create_user" ? true : false;
  const editItem = currentAction === "edit_user" ? true : false;
  const deleteItem = currentAction === "delete_user" ? true : false;

  const handleChangeAction = (item) => {
    setCurrentAction(item);
  };

  const getQueryParam = (name) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
  };

  useEffect(() => {
    let currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);
    const tabValue = getQueryParam("tab");
    if (tabValue === "addNewUserAccount") {
      setTimeout(() => {
        handleChangeAction("create_user");
      }, 1000);
    }
  }, []);

  const UserAccountsTabValues = [
    {
      name: t("common.navbar.my_profile"),
      id: "myprofile",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        myprofile: true,
        newItem,
        editItem,
        deleteItem,
        handleChangeAction,
        setCurrentTab,
        currentTab,
        setUser,
      },
    },

    {
      name: t("data_settings.settings"),
      id: "settings",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        settings: true,
        setCurrentTab,
        currentTab,
      },
    },
    {
      name: t("common.navbar.billing_info"),
      id: "Billinginfo",
      Component: ActiveComponent.Component,
      props: {
        ...ActiveComponent.props,
        Billinginfo: true,
        setCurrentTab,
        currentTab,
      },
    },
  ];

  const dropDownItems = [
    {
      if: currentTab === "myprofile",
      id: "create_user",
      text: t("common.pages.create_user"),
      icon: "add",
      handleClick: (value) => handleChangeAction(value),
    },
    {
      if: currentTab === "myprofile",
      id: "edit_user",
      text: t("common.pages.edit_user"),
      icon: "edit",
      handleClick: (value) => handleChangeAction(value),
    },
    {
      if: currentTab === "myprofile",
      id: "delete_user",
      text: t("common.pages.delete_user"),
      icon: "delete",
      handleClick: (value) => handleChangeAction(value),
    },
  ];

  const userDropDownItems = [
    // {
    //   if: currentTab === "myprofile",
    //   id: "create_user",
    //   text: t("common.pages.create_user"),
    //   icon: "add",
    //   handleClick: (value) => handleChangeAction(value),
    // },
    {
      if: currentTab === "myprofile",
      id: "edit_user",
      text: t("common.pages.edit_user"),
      icon: "edit",
      handleClick: (value) => handleChangeAction(value),
    },
    // {
    //   if: currentTab === "myprofile",
    //   id: "delete_user",
    //   text: t("common.pages.delete_user"),
    //   icon: "delete",
    //   handleClick: (value) => handleChangeAction(value),
    // },
  ];

  // ........................................................
  // useEffect(() => {
  //   const activeTabId = localStorage.getItem("activeTabIdUserAccounts");
  //   if (activeTabId) {
  //     setCurrentTab(activeTabId);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (currentTab == "settings") {
  //     setActiveComponent({
  //       ...ActiveComponent,
  //       props: {
  //         settings: true,
  //         setCurrentTab,
  //       },
  //     });
  //   }
  // }, [currentTab]);

  // ......................................................
  return (
    <>
      <div className="userAccountActions d-flex justify-content-between ">
        {currentTab === "myprofile" ? (
          <>
            <div></div>
            <DropdownComponent
              handleClick={handleChangeAction}
              name={t("common.pages.actions")}
              items={user?.role !== "user" ? dropDownItems : userDropDownItems}
              nameReset={currentAction ? false : true}
            />
          </>
        ) : (
          <div className="useraccount_action_div"></div>
        )}
      </div>

      <div style={{ marginTop: "0.1rem" }}>
        <Tabs
          tabValues={
            user?.role === "user"
              ? UserAccountsTabValues?.filter(
                  (elem) => elem?.id === "myprofile"
                )
              : UserAccountsTabValues
          }
          activeTabId={currentTab}
          onTabChange={(item) => setCurrentTab(item)}
          colLg={12}
        />
      </div>
    </>
  );
};

export default UserAccounts;
