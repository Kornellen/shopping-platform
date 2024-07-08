import { useEffect, useState } from "react";
import { pagesVariant } from "../../assets/themes/themes";
import { useTheme, useUser, useAuth } from "../../context";
import { formatDate } from "../../utils/date";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faMobileScreenButton,
  faUser,
  faCalendarDays,
  faLocationDot,
  faCircleInfo,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";

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

  return (
    <div
      className={`${pagesVariant[theme]} p-4 text-2xl flex flex-wrap justify-center`}
    >
      <div
        className={
          theme === "light"
            ? "bg-light-500 w-full p-2 m-2"
            : "bg-dark-500 w-full p-2 m-2"
        }
      >
        <p className="text-4xl p-2">
          <FontAwesomeIcon icon={faCircleInfo} /> Account Informations
        </p>
        <div className="text-3xl flex gap-28" id="account-info">
          <div className="user-info p-2 mt-3 gap-4 w-5/12">
            <div className="name p-2">
              <p className="font-bold">
                <FontAwesomeIcon icon={faUser} /> First & Last Name
              </p>
              <p>
                {userData.firstName} {userData.lastName}
              </p>
            </div>
            <div className="email p-2">
              <p className="font-bold">
                <FontAwesomeIcon icon={faAt} /> Email
              </p>
              <p>{userData.email}</p>
              <button
                onClick={() =>
                  navigate("/account/changeDatas?datatochange=email")
                }
                className="text-blue-400 text-2xl hover:animate-pulse hover:border-b-2 hover:border-blue-400"
              >
                Change
              </button>
            </div>
            <div className="phone p-2">
              <p className="font-bold">
                <FontAwesomeIcon icon={faMobileScreenButton} /> Phone
              </p>
              <p>{userData.phoneNumber}</p>
              <button
                onClick={() =>
                  navigate("/account/changeDatas?datatochange=phone")
                }
                className="text-blue-400 text-2xl hover:animate-pulse hover:border-b-2 hover:border-blue-400"
              >
                Change
              </button>
            </div>
          </div>

          <div className="login p-2 mt-3 gap-2 w-3/12">
            <p className="font-bold">
              <FontAwesomeIcon icon={faRightToBracket} /> Login
            </p>
            <p>{userData.username}</p>
            <button
              onClick={() =>
                navigate("/account/changeDatas?datatochange=username")
              }
              className="text-blue-400 text-2xl hover:animate-pulse hover:border-b-2 hover:border-blue-400"
            >
              Change
            </button>
          </div>

          <div className="account p-2 mt-3">
            <p className="font-bold">
              <FontAwesomeIcon icon={faCalendarDays} /> Account
            </p>
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
        {userAddresses !== undefined ? (
          <div className="address m-2 mt-3 p-2">
            <p className="font-bold">
              <FontAwesomeIcon icon={faLocationDot} /> Your Address
            </p>
            <p>{userAddresses?.addressLine}</p>
            <p>
              {userAddresses?.postalCode} {userAddresses?.city}
            </p>
            <p>{userAddresses?.country}</p>
            <button
              onClick={() =>
                navigate("/account/changeDatas?datatochange=address")
              }
              className="text-blue-400 text-2xl hover:animate-pulse hover:border-b-2 hover:border-blue-400"
            >
              Change
            </button>
          </div>
        ) : (
          <div className={`text-center text-red-600 w-full text-3xl`}>
            <pre>You don't have added addresses</pre>
            <button
              onClick={() =>
                navigate("/account/changeDatas?datatochange=address")
              }
              className="hover:border-b-2 hover:border-red-600 hover:animate-pulse"
            >
              Add Addresses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfos;
