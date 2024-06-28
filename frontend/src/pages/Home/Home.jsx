import Footer from "../../components/Footer/Footer";
import Nav from "../../components/Nav/Nav";
import { useTheme } from "../../context/themeContext";

const Home = () => {
  const { theme } = useTheme();

  const themesVariant = {
    light: "bg-light-200 text-dark-100",
    dark: "bg-dark-200 text-light-100",
  };

  return (
    <div className={`${themesVariant[theme]} text-3xl w-full h-full`}>
      <Nav />
      <div className={`${themesVariant[theme]} h-1/3 p-0`}></div>
      <Footer />
    </div>
  );
};

export default Home;
