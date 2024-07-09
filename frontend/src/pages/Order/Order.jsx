import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../context";
import { pagesVariant } from "../../assets/themes/themes";
import { useEffect, useState } from "react";
import axios from "axios";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { userID } = useAuth();
  const { totalAmount, cartData } = location.state || {};
  const [form, setForm] = useState({
    products: cartData,
    totalAmount: +totalAmount,
    shippingMethod: 1,
  });

  const [shippingMethods, setShippingMethods] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(
        `http://localhost:5174/api/user/${userID}/order/create`,
        form
      );
      await navigate("/cart/order/payment", {
        state: { orderID: data.orderID, totalCoast: data.totalCoast },
      });
    } catch (error) {}
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    const fetchShippingMethods = async () => {
      const { data } = await axios.get("/api/shipping-methods");
      setShippingMethods(data.methods);
    };

    fetchShippingMethods();
  }, []);

  return (
    <div className={`${pagesVariant[theme]}`}>
      <form
        action=""
        onSubmit={handleSubmit}
        className="form  h-full border-transparent space-y-4"
      >
        <div className="text-center">
          <div className="">
            <label htmlFor="shipppingMethod">Select shipping method:</label>
            <select
              className={`bg-dark-500 p-2 rounded-xl`}
              name="shippingMethod"
              onChange={handleChange}
            >
              {shippingMethods?.map((shippingMethod, index) => (
                <option
                  key={index}
                  value={Number(shippingMethod.shippingMethodID)}
                >
                  {shippingMethod.name} {shippingMethod.cost}$
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-2 text-center">
          <button type="submit">Next</button>
        </div>
      </form>
    </div>
  );
};

export default Order;
