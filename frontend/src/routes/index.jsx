import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/themeContext";
import axios from "axios";

import { Nav, Footer } from "../components/index";
import {
  Account,
  AddProduct,
  AdminPanel,
  AdminProductsPanel,
  AdminUserPanel,
  Cart,
  ChangeDatas,
  Home,
  Login,
  Order,
  Payment,
  Product,
  Registry,
  Return,
  SearchItems,
  UserInfos,
  Wishlist,
} from "../pages/index";

import { useNavigate } from "react-router-dom";

const AppRoutes = () => {
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
    const { itemName } = searchData;

    try {
      if (itemName !== "") {
        const url = `/api/products?itemName=${itemName}`;
        const response = await axios.get(url);

        const data = await response.data;

        setFoundItem(data.result);
        navigate("/search");
      } else {
        navigate("/");
      }
    } catch (error) {}
  };

  return (
    <div className="App w-full h-screen flex flex-col">
      <Nav handleChange={handleChange} handleSubimt={handleSubimt} />
      <div className="w-full h-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchItems items={foundItem} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registry" element={<Registry />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/yourdatas" element={<UserInfos />} />
          <Route path="/account/changeDatas" element={<ChangeDatas />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart/order" element={<Order />} />
          <Route path="/cart/order/payment" element={<Payment />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account/addproduct" element={<AddProduct />} />
          <Route path="/product/" element={<Product />} />
          <Route path="/admin/" element={<AdminPanel />} />
          <Route path="/admin/users" element={<AdminUserPanel />} />
          <Route path="/admin/products" element={<AdminProductsPanel />} />
          <Route path="/return" element={<Return />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default AppRoutes;
