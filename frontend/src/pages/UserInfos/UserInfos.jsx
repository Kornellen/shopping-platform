import { useEffect, useState } from "react";
import { pagesVariant } from "../../assets/themes/themes";
import { useTheme, useUser } from "../../context";
import axios from "axios";

const UserInfos = () => {
  const { theme } = useTheme();
  const { userData, loadUserDatas } = useUser();
  const [userAddresses, setAddresses] = useState({});
  const userID = window.localStorage.getItem("userID");

  const loadUserAddresses = async () => {
    const url = `http://localhost:5174/api/addresses?userID=${userID}`;
    const response = await axios.get(url);

    const data = (await response).data;

    setAddresses(data.result);
  };

  useEffect(() => {
    loadUserAddresses();
  }, [userID]);

  useEffect(() => {
    loadUserDatas();
  }, []);

  if (userAddresses == undefined) {
    return (
      <div
        className={`${pagesVariant[theme]} text-red-600 w-full h-screen text-3xl`}
      >
        You don't have added addresses
      </div>
    );
  }

  return (
    <div
      className={`${pagesVariant[theme]} p-4 w-full text-2xl flex flex-wrap justify-center h-screen`}
    >
      <div
        className={
          theme === "light"
            ? "bg-light-500 w-full p-2 m-2"
            : "bg-dark-500 w-full p-2 m-2"
        }
      >
        <p className="text-4xl p-2">Account Informations</p>
        <div className="text-3xl flex" id="account-info">
          <div className="user-info p-2 mt-3">
            <div className="name p-2">
              <p className="font-bold">First & Last Name</p>
              <p>
                {userData.firstName} {userData.lastName}
              </p>
            </div>
            <div className="email p-2">
              <p className="font-bold">Email</p>
              <p>{userData.email}</p>
            </div>
            <div className="phone p-2">
              <p className="font-bold">Phone</p>
              <p>{userData.phoneNumber}</p>
            </div>
          </div>

          <div className="username p-2 mt-3">
            <p className="font-bold">Login</p>
            <p>{userData.username}</p>
          </div>
        </div>
      </div>
      <div
        className={
          theme === "light"
            ? "bg-light-500 w-full p-2 m-2"
            : "bg-dark-500 w-full p-2 m-2"
        }
        id="account-addresses"
      >
        <div className="address m-2 mt-3 p-2">
          <p className="font-bold">Your Address</p>
          <p>{userAddresses.addressLine}</p>
          <p>
            {userAddresses.postalCode} {userAddresses.city}
          </p>
          <p>{userAddresses.country}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfos;
