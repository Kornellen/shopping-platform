import { useTheme } from "../../context/themeContext";
import { themesVariant, liStyles } from "../../assets/themes/themes";

const Nav = () => {
  const { theme } = useTheme();

  const endpoints = ["Home", "Shop", "Account"];

  return (
    <div className={`${themesVariant[theme]} w-full h-1/3`}>
      <ul className={"flex justify-end"}>
        {endpoints.map((element, index) => (
          <li key={index} className={`${liStyles[theme]}`}>
            <a href="">{element}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Nav;
