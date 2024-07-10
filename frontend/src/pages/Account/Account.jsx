import { useAuth, useTheme, useUser } from "../../context";
import { pagesVariant, themesVariant } from "../../assets/themes/themes";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faCoins,
  faRightFromBracket,
  faUserSecret,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { Payments } from "./components";

const Account = () => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const { loading, userData, error, loadUserDatas } = useUser();
  const navigate = useNavigate();
  const [showPayments, setShowPayments] = useState(false);

  const endpoints = [
    {
      titles: ["Your Datas", "Addresses"],
      descriptions: [
        "Information about you and your account",
        "Your Delivery Addresses",
      ],
      links: ["yourdatas#account-info", "yourdatas#account-addresses"],
    },
  ];

  useEffect(() => {
    loadUserDatas();
  }, [window.localStorage.getItem("userID")]);

  if (error) {
    return (
      <div className="">
        <p>{error}</p>
      </div>
    );
  }

  if (loading && !userData) {
    return (
      <div className="">
        <p>Loading...</p>
      </div>
    );
  } else if (!userData) {
    return (
      <div className="error">
        <p>Internal Server Error</p> <pre>Press Ctrl+F5 to refresh</pre>
      </div>
    );
  } else {
    return (
      <div className={`${pagesVariant[theme]} text-2xl h-full flex w-full p-2`}>
        <div className="w-10/12 text-2xl">
          <div className="greetings text-5xl p-2">
            <div className="username font-bold">
              <p>Hello {userData.username}!</p>
            </div>
            <div
              className={
                theme === "light"
                  ? "text-dark-500 text-2xl"
                  : "text-light-500 text-2xl"
              }
            >
              <p>{userData.email}</p>
            </div>
            <p className="text-2xl">{userData.role}</p>
          </div>

          <div
            className={
              theme === "light"
                ? "bg-light-500 w-1/2 mt-40 m-2 p-2"
                : "bg-dark-500 w-1/2 mt-40 m-2 p-2"
            }
          >
            <h2 className="p-2">
              <FontAwesomeIcon icon={faGears} /> Account Settings
            </h2>
            {endpoints.map((element, index) => (
              <div
                key={index}
                className={theme === "light" ? "bg-light-500" : "bg-dark-500"}
              >
                {element.links.map((link, subindex) => (
                  <div className="option p-2 h-25 flex w-full" key={subindex}>
                    <div className="w-10/12">
                      <p>{element.titles[subindex]}</p>
                      <p
                        className={
                          theme === "light"
                            ? "text-dark-700 text-1xl italic"
                            : "text-light-700 text-1xl italic"
                        }
                      >
                        {element.descriptions[subindex]}
                      </p>
                    </div>
                    <div className="w-2/12 p-2">
                      <Link to={link} className="hover:text-light-500">
                        Change
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {userData.role === "Head Admin" ||
          userData.role === "Admin" ||
          userData.role === "Moderator" ? (
            <div
              className={
                theme === "light"
                  ? "bg-light-500 w-1/2 mt-5 m-2 p-2"
                  : "bg-dark-500 w-1/2 mt-5 m-2 p-2"
              }
            >
              <div className="flex flex-wrap">
                <p className="w-full">
                  <FontAwesomeIcon icon={faUserSecret} /> {userData.role}{" "}
                  Functions
                </p>
                <div className="w-7/12">
                  <p>Admin Panel</p>
                  <p
                    className={
                      theme === "light"
                        ? "text-dark-700 text-1xl italic"
                        : "text-light-700 text-1xl italic"
                    }
                  >
                    Your admin panel
                  </p>{" "}
                </div>
                <div className="w-3/12 text-end ml-20">
                  <Link
                    to={"/admin/"}
                    className="hover:text-light-500 text-end"
                  >
                    Check
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="w-5/12 h-full">
          <div className="w-full p-2 flex justify-end h-2/6">
            <div className="buttons border-2 p-2 w-64 text-center h-14 m-2 hover:border-blue-400 hover:text-blue-400">
              <button
                type="button"
                onClick={() => navigate("/account/addproduct")}
              >
                <FontAwesomeIcon icon={faCoins} /> Add Product
              </button>
            </div>
            <div className="buttons border-2 p-2 w-64 text-center h-14 m-2 hover:border-red-700 hover:text-red-700">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <FontAwesomeIcon icon={faRightFromBracket} /> Log Out
              </button>
            </div>
          </div>
          <div className="flex w-full h-4/6 flex-col overflow-scroll border-2">
            <div
              className={`${themesVariant[theme]} border-b-2 h-1/6 flex justify-center items-center w-full text-4xl sticky top-0 `}
            >
              <h1
                className="p-3"
                onClick={() => setShowPayments((current) => !current)}
              >
                <FontAwesomeIcon icon={faWallet} /> Payments
              </h1>
            </div>
            <div className="h-4/6">{showPayments && <Payments />}</div>
          </div>
        </div>
      </div>
    );
  }
};

export default Account;
