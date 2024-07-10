import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../context";
import { pagesVariant, inputStyles } from "../../assets/themes/themes";

const Payment = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const { userID } = useAuth();
  const { orderID, totalCoast } = location.state || {};
  const [paymentMethod, setPayment] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("1");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        const { data } = await axios.get(`/api/payment-methods`);
        setPayment(data.methods);
      } catch (error) {}
    };
    fetchPaymentMethod();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/user/${userID}/order/${orderID}/pay`,
        {
          amount: +totalCoast,
          paymentMethodID: +selectedPayment,
        }
      );

      if (data.info === "Success") {
        navigate("/cart");
      }
      console.log(data);
    } catch (error) {}
  };

  return (
    <div className={`${pagesVariant[theme]}`}>
      <form onSubmit={handleSubmit} className="form border-transparent">
        <div className="">
          <label htmlFor="payment-method">Payment Method: </label>
          <select
            name="payment-method"
            id="payment-method"
            className={`${
              theme == "light"
                ? "bg-light-500 text-dark-100"
                : "bg-dark-500 text-light-100"
            } p-2 rounded-xl text-xl`}
            onChange={(e) =>
              setSelectedPayment((prev) => (prev = e.target.value))
            }
          >
            {paymentMethod?.map((method, index) => (
              <option key={index} value={method.paymentMethodID}>
                {method.paymentMethod}
              </option>
            ))}
          </select>
        </div>
        <div className="">Total Amount: {totalCoast}$</div>
        {selectedPayment == 1 ? (
          <div className="card-input mt-10">
            <div className="card border-2 w-96 h-60 rounded-xl bg-dark-700 shadow-xl border-transparent space-y-5">
              <div className="mt-6 border-black bg-black h-10"></div>
              <div className="p-2">
                <div className="">
                  <div className="flex w-full space-x-5">
                    <input
                      name="firstName"
                      className={`${inputStyles[theme]} w-1/2`}
                      placeholder="First Name"
                      required
                    />
                    <input
                      name="lastName"
                      className={`${inputStyles[theme]} w-1/2`}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap">
                  <div className="">
                    <p className="w-full">Exp. Date</p>
                    <input
                      type="text"
                      name="month"
                      className={`${inputStyles[theme]} w-7 space-x-1`}
                      placeholder="_ _"
                      maxLength={2}
                      required
                    />
                    {"  "} <span className="ml-2 mr-2">/</span> {"  "}
                    <input
                      type="text"
                      name="year"
                      className={`${inputStyles[theme]} w-7`}
                      placeholder="_ _"
                      maxLength={2}
                      required
                    />
                  </div>
                  <div className="ml-40">
                    <p className="w-full">CVV</p>
                    <input
                      type="text"
                      className={`${inputStyles[theme]} w-12`}
                      placeholder="_ _ _"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedPayment == 2 ? (
          <div className="mt-10 w-60">
            <div className="border-8 border-black shadow-2xl w-60 h-96 rounded-xl flex flex-col">
              <div className="w-full bg-black h-6">
                <div className=""></div>
              </div>
              <div className="w-full bg-slate-600 h-full">
                <div className="flex justify-center items-center h-full">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="_ _ _ _ _ _"
                    className="w-36 text-3xl text-center bg-transparent border-b-2 outline-none"
                    pattern="\w{6}"
                    required
                  />
                </div>
              </div>
              <div className="h-8 w-full bg-black">
                <div className=""></div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="p-2 text-center">
          <button
            type="submit"
            className="buttons border-2 p-2 w-64 text-center h-14 m-2 hover:border-blue-400 hover:text-blue-400 rounded-md"
          >
            Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
