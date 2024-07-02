import { useTheme } from "../../context/themeContext";
import {
  themesVariant,
  inputStyles,
  liStyles,
} from "../../assets/themes/themes";
import { Link, Outlet } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context";

const Nav = ({ handleSubimt, handleChange }) => {
  const { theme } = useTheme();

  const { auth } = useAuth();

  //const userID = window.localStorage.getItem("userID");

  const endpoints = ["Home", "Shop", auth == "true" ? "Account" : "Login"];

  return (
    <>
      <div className={`flex ${themesVariant[theme]} w-full h-20`}>
        <form
          onSubmit={handleSubimt}
          method="post"
          className="w-1/2 p-5 h-full"
        >
          <input
            type="text"
            onChange={handleChange}
            name="itemName"
            placeholder="Search"
            className={`${inputStyles[theme]} h-8 w-64 rounded-xl`}
          />
          <button type="submit" className="m-3 border-2 w-8 h-8 rounded-xl">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
        <ul className={"flex justify-end w-1/2"}>
          {endpoints.map((element, index) => (
            <li key={index} className={`${liStyles[theme]}`}>
              <Link
                to={
                  "/" +
                  (element === "Home" ? "" : element.trim().replace(/\s+/g, ""))
                }
              >
                {element}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </>
  );
};

export default Nav;
