import { useTheme } from "../../context/themeContext";
import {
  themesVariant,
  inputStyles,
  liStyles,
} from "../../assets/themes/themes";
import { Link, Outlet } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faMagnifyingGlassArrowRight,
  faMagnifyingGlassDollar,
  faMagnifyingGlassLocation,
} from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlassChart } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlassChart";

const Nav = ({ handleSubimt, handleChange }) => {
  const { theme } = useTheme();

  const endpoints = ["Home", "Shop", "Account"];

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
            className={`${inputStyles[theme]}`}
          />
          <button type="submit" className="m-3">
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
