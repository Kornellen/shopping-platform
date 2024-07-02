import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../context/themeContext";
import axios from "axios";

import { Nav, Footer } from "../components/index";
import { Home, Login, Registry, SearchItems } from "../pages/index";

import { useNavigate } from "react-router-dom";

const AppRoutes = () => {
  const { theme } = useTheme();

  const [searchData, setSearchData] = useState({
    itemName: "",
  });
  const [foundItem, setFoundItem] = useState([]);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearchData({
      ...searchData,
      [name]: value,
    });
  };

  const handleSubimt = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5174/api/products?itemName=${searchData.itemName}`;
    const response = await axios.get(url);

    const data = await response.data;

    setFoundItem(data.result);
    navigate("/search");
  };

  return (
    <div className="App w-full h-full">
      <Nav handleChange={handleChange} handleSubimt={handleSubimt} />
      <Routes>
        <Route path="/" element={<Home theme={theme} />} />
        <Route path="/search" element={<SearchItems items={foundItem} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registry" element={<Registry />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default AppRoutes;
