import { useTheme } from "../../context/themeContext";
import {
  themesVariant,
  inputStyles,
  liStyles,
  themeChangerBtn,
} from "../../assets/themes/themes";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faHeart,
  faMagnifyingGlass,
  faMoon,
  faShoppingCart,
  faSun,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context";

const Nav = ({ handleSubimt, handleChange }) => {
  const { theme, changeTheme } = useTheme();

  const { auth } = useAuth();

  const navigate = useNavigate();

  const endpoints = [
    {
      name: "Wishlist",
      icon: <FontAwesomeIcon icon={faHeart} />,
      link: "/wishlist",
    },
    {
      name: "Cart",
      icon: <FontAwesomeIcon icon={faShoppingCart} />,
      link: "/cart",
    },
    {
      name: auth === "true" ? "Account" : "Login",
      icon: <FontAwesomeIcon icon={faCircleUser} />,
      link: auth === "true" ? "/account" : "/login",
    },
  ];

  return (
    <div className={`flex ${themesVariant[theme]} w-full h-20 flex`}>
      <header className="flex items-center text-center justify-center">
        <p
          onClick={() => navigate("/")}
          className="hover:cursor-pointer h-full w-80 text-2xl p-4 ring-2 ring-dark-200"
        >
          <FontAwesomeIcon icon={faShoppingCart} /> Shopping Platform
        </p>
      </header>

      <form onSubmit={handleSubimt} className="w-1/2 p-5 h-full flex">
        <input
          type="text"
          onChange={handleChange}
          name="itemName"
          placeholder="Search"
          className={`${inputStyles[theme]} h-8 w-64 p-2`}
        />
        <button
          type="submit"
          className="ml-2 mt-1 border-2 size-7 rounded-xl hover:animate-pulse"
        >
          {" "}
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>

      <ul className={"flex justify-end w-1/2 mr-4"}>
        <li className={`${themeChangerBtn[theme]}`}>
          <button type="button" className="" onClick={() => changeTheme()}>
            {theme === "light" ? (
              <FontAwesomeIcon icon={faMoon} />
            ) : (
              <FontAwesomeIcon icon={faSun} />
            )}
          </button>
        </li>
        {endpoints.map((endpoint, index) => (
          <li key={index} className={`${liStyles[theme]}`}>
            <Link to={endpoint.link}>{endpoint.icon}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Nav;
