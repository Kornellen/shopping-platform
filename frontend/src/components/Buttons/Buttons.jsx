import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faCartShopping,
  faHeart,
  faBan,
} from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

const Buttons = ({ action, productID, userID, totalAmount, products }) => {
  const [info, setInfo] = useState(null);

  const buttonStyles = {
    default: "border-2 p-2 m-2 hover:border-green-500 hover:text-green-500",
    remove: "border-2 p-2 m-2 hover:border-red-500 hover:text-red-500",
  };

  if (action === "addToWishlist") {
    return (
      <button
        className={`group ${buttonStyles.default}`}
        onClick={async () => {
          const url = `/api/wishlist/${userID}/items/addTo`;

          if (userID !== null && userID !== "" && userID !== undefined) {
            try {
              await axios.post(url, {
                productID: productID,
              });

              return setInfo("Added to Wishlist");
            } catch (error) {}
          } else {
            return setInfo("You must be signed to add to wishlist");
          }
        }}
      >
        <FontAwesomeIcon
          icon={faHeart}
          className="group-hover:animate-bounce"
        />{" "}
        {...info ? info : "Add to Wishlist"}
      </button>
    );
  } else if (action === "addToCart") {
    return (
      <button
        className={`group ${buttonStyles.default}`}
        onClick={async () => {
          const url = `/api/cart/${userID}/addtocart`;

          if (userID !== null && userID !== "" && userID !== undefined) {
            try {
              await axios.post(url, {
                productID: productID,
                quantity: 1,
              });

              setInfo("Added to Cart");
            } catch (error) {
              return setInfo(error);
            }
          } else {
            return setInfo("You must be signed to add to cart!");
          }
        }}
      >
        <FontAwesomeIcon
          icon={faCartShopping}
          className="group-hover:animate-bounce"
        />{" "}
        {...info ? info : "Add to Cart"}
      </button>
    );
  } else if (action === "remove") {
    return (
      <button
        className={`group ${buttonStyles.remove}`}
        onClick={async () => {
          await axios.delete(`/api/product/remove`, {
            data: { productID: productID },
          });
          return setInfo("Removed successfuly");
        }}
      >
        <FontAwesomeIcon icon={faBan} className="group-hover:animate-bounce" />{" "}
        {...info ? info : "Remove Product"}
      </button>
    );
  } else if (action === "order") {
    return (
      <button
        className={`group ${buttonStyles.remove}`}
        onClick={async () => {
          await axios.post(`/api/user/${userID}}/order/create`, {
            totalAmount: totalAmount,
            products: products,
          });
        }}
      >
        Order
      </button>
    );
  }
};

export default Buttons;
