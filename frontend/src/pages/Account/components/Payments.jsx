import { useEffect, useState } from "react";
import { useAuth, useTheme } from "../../../context";
import axios from "axios";
import { pagesVariant } from "../../../assets/themes/themes";
import { Link, useNavigate } from "react-router-dom";

const Payments = () => {
  const { theme } = useTheme();
  const { userID } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelButtonText, setCancelButtonText] = useState("");

  const navigate = useNavigate();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`/api/user/${userID}/order/orders/`);

      setPayments(data.orders);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className={`${pagesVariant[theme]} text-center`}>Loading...</div>
    );
  }

  if (error) {
    return <div className={`${pagesVariant[theme]}`}>Error: {error}</div>;
  }

  if (payments === "You don't have orders") {
    return <div className="text-center p-2">You don't have orders</div>;
  }
  return (
    <div className={"h-4/6"}>
      {payments?.map((payment, index) => (
        <div key={index} className="payment space-y-3 divide-y-2 m-2">
          <div className="p-2 overflow-auto border-2">
            <div className="text-center">Order #{index + 1}</div>
            {payment.products.split(", ").map((product, subindex) => (
              <div className="p-2 m-2" key={subindex}>
                <p className="border-2 p-2">
                  <span className="w-full flex text-2xl">
                    <Link
                      to={`/product?productID=${
                        payment.productIDs.split(", ")[subindex]
                      }`}
                      className="text-3xl hover:text-blue-600 hover:border-blue-600 w-1/2 text-center p-2 m-2"
                    >
                      {product}
                    </Link>
                    <span className="border-2 p-2 m-2 w-1/2 text-center">
                      Quantity:{" "}
                      {payment.quantity.split(", ")[subindex] === undefined
                        ? 1
                        : payment.quantity.split(", ")[subindex]}
                    </span>
                  </span>{" "}
                  <div className="flex space-x-2">
                    <div className="border-2 w-1/2  p-2">
                      <div className="">
                        <span>
                          Price:{" "}
                          {+payment.productPrices.split(", ")[subindex] + "$"}
                        </span>{" "}
                      </div>
                      <div className="">
                        <span>
                          Price in order:{" "}
                          {isNaN(
                            +payment.productPrices.split(", ")[subindex] *
                              +payment.quantity.split(", ")[subindex]
                          )
                            ? +payment.productPrices.split(", ")[subindex] + "$"
                            : +payment.productPrices.split(", ")[subindex] *
                                +payment.quantity.split(", ")[subindex] +
                              "$"}
                        </span>
                      </div>
                    </div>
                  </div>
                </p>
              </div>
            ))}
            <div className="w-full text-center flex justify-center items-center">
              <button
                className="border-2 p-2 w-full m-2 hover:border-red-500 hover:text-red-500 disabled:border-gray-500 disabled:text-gray-500"
                disabled={payment.status === "cancelled" ? true : false}
                onClick={async () => {
                  try {
                    const { data } = await axios.get(
                      `api/user/${userID}/order/orderstatus/${payment.orderID}/cancel`
                    );

                    setCancelButtonText((current) => data.info);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                {...cancelButtonText ? cancelButtonText : "Cancel"}
              </button>
              <Link
                className="border-2 p-2 w-full m-2 hover:border-red-500 hover:text-red-500 disabled:border-gray-500 disabled:text-gray-500"
                to={"/return"}
                state={{ userID: userID, orderID: payment.orderID }}
              >
                Return
              </Link>
            </div>
            <div className="p-2">
              <p>
                <span>Paid At: {payment.paymentDate}</span>
              </p>

              <p>
                <span>Total Amount: {payment.amount}$</span>
              </p>

              <p>
                <span>Payment Method: {payment.paymentMethod}</span>
              </p>
              <p>
                <span>
                  Status:{" "}
                  {payment.status.charAt(0).toUpperCase() +
                    payment.status.slice(1)}
                </span>
              </p>
              <p>
                <span>
                  Shipping Method: {payment.shippingMethodName} (
                  {payment.shippingMethodCost}$)
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Payments;
