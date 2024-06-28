import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "../context/themeContext";

import Home from "../pages/Home/Home";

const AppRoutes = () => {
  const { theme } = useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home theme={theme} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
