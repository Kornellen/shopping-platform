import axios from "axios";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const userID = window.localStorage.getItem("userID");
  const [userData, setUserData] = useState({});
  const [userAddresses, setAddresses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUserDatas = async () => {
    try {
      const url = `/api/userData?userID=${userID}`;
      const response = await axios.get(url);

      const data = await response.data;

      setUserData(data.result[0]);
    } catch (err) {
      setError(err.response);
    } finally {
      setLoading(false);
    }
  };

  const loadUserAddresses = async () => {
    const url = `/api/addresses?userID=${userID}`;
    const response = await axios.get(url);

    const data = (await response).data;

    setAddresses(data.result);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        userAddresses,
        loading,
        error,
        loadUserDatas,
        loadUserAddresses,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
