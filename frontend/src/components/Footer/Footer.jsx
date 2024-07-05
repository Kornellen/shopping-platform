import { useTheme } from "../../context/themeContext";
import { themesVariant, liStyles } from "../../assets/themes/themes";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";

const Footer = () => {
  const { theme } = useTheme();

  const endpoints = ["Home", "Policies", "Sign In", "Sign Up"];

  return (
    <div className={`${themesVariant[theme]} w-full h-25 float-left`}>
      <nav className="w-full">
        <ul className="flex justify-center">
          {endpoints.map((element, index) => (
            <li
              key={index}
              className={`${liStyles[theme]} m-4 list-disc text-2xl`}
            >
              <Link
                to={
                  "/" + element === "Home"
                    ? ""
                    : element.trim().replace(/\s+/g, "")
                }
              >
                {element.trim()}
              </Link>
            </li>
          ))}
          <li className={`${liStyles[theme]} m-4 list-disc text-2xl`}>
            <Link to={"https://github.com/Kornellen"}>
              <FontAwesomeIcon icon={faGithub} /> Github{" "}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Footer;
