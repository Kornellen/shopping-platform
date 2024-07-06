import { useEffect, useState } from "react";
import { pagesVariant } from "../../assets/themes/themes";
import { useTheme, useUser, useAuth } from "../../context";
import { formatDate } from "../../utils/date";
import { useNavigate } from "react-router-dom";

const UserInfos = () => {
  const { theme } = useTheme();
  const { userData, userAddresses, loadUserDatas, loadUserAddresses } =
    useUser();
  const { userID } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    loadUserDatas();
  }, [userID]);

  useEffect(() => {
    loadUserAddresses();
  }, [userID]);

  if (userAddresses == undefined) {
    return (
      <div
        className={`${pagesVariant[theme]} text-red-600 w-full h-screen text-3xl`}
      >
        You don't have added addresses {userAddresses}
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
        <div className="text-3xl flex gap-28" id="account-info">
          <div className="user-info p-2 mt-3 gap-4 w-5/12">
            <div className="name p-2">
              <p className="font-bold">First & Last Name</p>
              <p>
                {userData.firstName} {userData.lastName}
              </p>
            </div>
            <div className="email p-2">
              <p className="font-bold">Email</p>
              <p>{userData.email}</p>
              <button
                onClick={() =>
                  navigate("/account/changeDatas?datatochange=email")
                }
              >
                Change
              </button>
            </div>
            <div className="phone p-2">
              <p className="font-bold">Phone</p>
              <p>{userData.phoneNumber}</p>
              <button
                onClick={() =>
                  navigate("/account/changeDatas?datatochange=phone")
                }
              >
                Change
              </button>
            </div>
          </div>

          <div className="login p-2 mt-3 gap-2 w-3/12">
            <p className="font-bold">Login</p>
            <p>{userData.username}</p>
            <button
              onClick={() =>
                navigate("/account/changeDatas?datatochange=username")
              }
            >
              Change
            </button>
          </div>

          <div className="account p-2 mt-3">
            <p className="font-bold">Account</p>
            <p>With us since {formatDate(userData.createdAt)}</p>
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
