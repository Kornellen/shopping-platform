import { useTheme } from "../../context/themeContext";
import { themesVariant, liStyles } from "../../assets/themes/themes";

const Footer = () => {
  const { theme } = useTheme();

  const endpoints = [
    "Home",
    "Shop",
    "Policies",
    "GitHub",
    "Sign In",
    "Sign Up",
  ];

  return (
    <div className={`${themesVariant[theme]} w-full h-1/3`}>
      <nav className="w-full">
        <ul className="flex justify-center">
          {endpoints.map((element, index) => (
            <li key={index} className={`${liStyles} m-4 list-disc text-2xl`}>
              <a href="">{element}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Footer;
