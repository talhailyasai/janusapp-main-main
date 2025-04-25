import api from "api";
import React, { createContext, useContext, useEffect, useState } from "react";
const UserContext = createContext();
export const useUserContext = () => useContext(UserContext);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [usertoken, setUserToken] = useState(false);
  const [fetchResUsers, setFetchResUsers] = useState(false);
  const getUser = async () => {
    let userId = JSON.parse(localStorage.getItem("user"))?._id;
    try {
      if (userId) {
        let res = await api.get(`/users/${userId}`);
        if (res?.data) {
          localStorage.setItem("user", JSON.stringify(res?.data));
          setUser(res?.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, [usertoken]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setUserToken,
        setFetchResUsers,
        fetchResUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
