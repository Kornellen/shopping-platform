import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAuth, useTheme } from "../../context";
import { pagesVariant } from "../../assets/themes/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const Cart = () => {
  const { theme } = useTheme();
  const { userID, auth } = useAuth();
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState([]);

  const totalAmount = cartData.reduce(
    (acc, item, index) => acc + item.price * quantity[index],
    0
  );

  const handleChange = (e, index, productID) => {
    const { value } = e.target;
    setQuantity((quantity) => {
      const qunatities = [...quantity];
      qunatities[index] = +value;
      return qunatities;
    });

    try {
      const url = `http://localhost:5174/api/cart/${userID}/product/${productID}/updateQuantity`;
      const response = axios.patch(url, { quantity: +value });
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (method, index, productID) => {
    setQuantity((quantities) => {
      const newQuantieties = [...quantities];

      if (method === "plus") {
        newQuantieties[index] += 1;

        try {
          const url = `http://localhost:5174/api/cart/${userID}/product/${productID}/updateQuantity`;
          const response = axios.patch(url, {
            quantity: newQuantieties[index],
          });
        } catch (err) {
          console.error(err);
        }
      } else {
        if (newQuantieties[index] > 0) {
          newQuantieties[index] -= 1;
          try {
            const url = `http://localhost:5174/api/cart/${userID}/product/${productID}/updateQuantity`;
            const response = axios.patch(url, {
              quantity: newQuantieties[index],
            });
          } catch (err) {
            console.error(err);
          }
        } else if (newQuantieties[index] == 0) {
          try {
            const url = `http://localhost:5174/api/cart/${userID}/deleteFromCart`;
            const body = { productID: productID };

            axios.delete(url, { data: body });
          } catch (error) {
            console.log(error);
          }
        }
      }

      return newQuantieties;
    });
  };

  const loadCart = useCallback(async () => {
    try {
      const url = `http://localhost:5174/api/cart/${userID}/`;
      const response = await axios.get(url);

      const data = await response.data.productsInCart;

      setCartData(data);

      setQuantity(() => data.map((quantity) => quantity.quantity));
    } catch (error) {
      console.log(error.response);
      setError(error.response);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [userID]);

  if (error) {
    return (
      <div className={`${pagesVariant[theme]} h-screen text-center`}>
        <h1 className="text-4xl">
          {error.data.errors === "UserID must be Integer"
            ? setError(null)
            : error.message}
        </h1>
        <pre className="text-2xl">We're working on it. Try Again Later</pre>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (cartData.length === 0) {
    return (
      <div className={`${pagesVariant[theme]} text-3xl h-screen text-center`}>
        <p>Your Cart seems empty!</p>
        {auth ? (
          <pre>Add something to see things here</pre>
        ) : (
          <pre>Login to add things here</pre>
        )}
      </div>
    );
  }

  return (
    <div className={`Cart ${pagesVariant[theme]} text-4xl h-screen`}>
      <p>Your Cart</p>
      <div className="cart-items m-10">
        <div className="border-2">
          {cartData.map((item, index) => (
            <>
              <div className="w-full p-4 m-4 flex gap-2" key={index}>
                <p className="w-32">{item.name}</p>
                <div className="flex gap-2 border-2 text-wrap ml-10 justify-center items-center">
                  <button
                    className="border-r-2 h-full w-16 text-4xl hover:animate-pulse"
                    onClick={() => handleClick("minus", index, item.productID)}
                  >
                    <span>&minus;</span>
                  </button>
                  <input
                    className="m-2 ml-4 mr-4 h-full w-10 text-center bg-transparent"
                    value={quantity[index]}
                    onChange={(e) => handleChange(e, index, item.productID)}
                  />
                  <button
                    className="border-l-2 h-full w-16 text-4xl hover:animate-pulse"
                    onClick={() => handleClick("plus", index, item.productID)}
                  >
                    &#43;
                  </button>
                </div>
                <p>{item.price}$</p>
                <div
                  className="w-full mr-5 flex justify-end
                "
                >
                  <button
                    className="hover:animate-pulse"
                    onClick={() => {
                      try {
                        const url = `http://localhost:5174/api/cart/${userID}/deleteFromCart`;
                        const body = { productID: item.productID };

                        axios.delete(url, { data: body });
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashCan} /> Remove From Cart
                  </button>
                </div>
              </div>
            </>
          ))}
        </div>

        <div className="p-2">
          <p>Total Amount: {totalAmount}$</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
