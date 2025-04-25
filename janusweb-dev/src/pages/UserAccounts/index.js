import React, { useState } from "react";
import Settings from "./settings/Settings";
import BillingInfo from "./billinginfo/BillingInfo";
import Myprofile from "./myprofile/myprofile";
import { useEffect } from "react";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import api from "api";
import "./userAccounts.css";
import { useUserContext } from "context/SidebarContext/UserContext";

const UserAccountsPage = ({
  myprofile,
  settings,
  Billinginfo,
  setCurrentTab,
  currentTab,
  setUser,
  ...props
}) => {
  const { selectedUser, setSelectedUser } = usePropertyContextCheck();
  const [users, setUsers] = useState([]);
  const [dupUsers, setDupUsers] = useState([]);
  const [admin, setAdmin] = useState(null);
  // const [fetchUsers, setFetchUsers] = useState(false);
  const {
    setUser: setCurrentUser,
    user: currentUser,
    setFetchResUsers,
    fetchResUsers,
  } = useUserContext();

  const getAllUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.role === "user") {
        // If role is user, only get their own profile
        let userProfile = await api.get(`/users/${user?._id}`);
        setUsers([userProfile?.data]);
        setDupUsers([userProfile?.data]);
        setSelectedUser(userProfile?.data);
      } else {
        // For admin/superadmin, get all users under them
        let allprofileUser = await api.get(
          `/users/adminId/${user?._id}?admin=${true}`
        );
        setUsers(allprofileUser?.data);
        setDupUsers(allprofileUser?.data);
        const defaultSelectedUser = allprofileUser?.data?.find(
          (user) => !user.role || user.role !== "user"
        );
        if (defaultSelectedUser && !selectedUser) {
          setSelectedUser(defaultSelectedUser);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, [fetchResUsers]);

  return (
    <div>
      {currentTab === "myprofile" ? (
        <Myprofile
          {...props}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          users={users}
          setUsers={setUsers}
          setCurrentTab={setCurrentTab}
          setUser={setUser}
          dupUsers={dupUsers}
          admin={admin}
          currentTab={currentTab}
          setFetchUsers={setFetchResUsers}
          fetchUsers={fetchResUsers}
        />
      ) : currentTab === "settings" ? (
        <Settings
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          users={users}
          setUsers={setUsers}
          setAdmin={setAdmin}
        />
      ) : currentTab === "Billinginfo" ? (
        <BillingInfo />
      ) : null}
    </div>
  );
};

export default UserAccountsPage;
