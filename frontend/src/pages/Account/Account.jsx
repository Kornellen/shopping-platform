import { useAuth, useTheme, useUser } from "../../context";
import { pagesVariant } from "../../assets/themes/themes";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const Account = () => {
  const { theme } = useTheme();
  const { changeAuth } = useAuth();
  const { loading, userData, error, loadUserDatas } = useUser();
  const navigate = useNavigate();

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
      <div className={`${pagesVariant[theme]} text-2xl flex h-screen`}>
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
          </div>

          <div
            className={
              theme === "light"
                ? "bg-light-500 w-1/2 mt-40 m-2 p-2"
                : "bg-dark-500 w-1/2 mt-40 m-2 p-2"
            }
          >
            <h2 className="p-2">Account Settings</h2>
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
        </div>

        <div className="buttons border-2 p-2 w-2/12 text-center h-14 m-2">
          <button
            type="button"
            onClick={() => {
              changeAuth(false);
              navigate("/login");
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }
};

export default Account;
