import { useCallback, useEffect, useState } from "react";
import { pagesVariant, themesVariant } from "../../assets/themes/themes";
import { useTheme, useAuth } from "../../context/index";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHeartCircleMinus,
} from "@fortawesome/free-solid-svg-icons";

const Wishlist = () => {
  const { userID } = useAuth();
  const { theme } = useTheme();

  const [wishlistData, setWishlistData] = useState([]);
  const [load, setLoad] = useState(true);

  async function getWishlistItems() {
    try {
      const url = `http://localhost:5174/api/wishlist/${userID}/items/`;

      const response = await axios.get(url);

      const data = await response.data;

      return data.wishlistItems;
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  }

  useEffect(() => {
    getWishlistItems().then((data) => {
      if (data) setWishlistData(data);
    });
  }, []);

  if (load) {
    return (
      <div
        className={`${pagesVariant[theme]} h-screen text-3xl text-center space-y-2`}
      >
        <p>Loading...</p>
      </div>
    );
  } else if (wishlistData.length == 0 || wishlistData == undefined) {
    return (
      <div
        className={`${pagesVariant[theme]} h-screen text-3xl text-center space-y-2`}
      >
        <h2>Your Wishlist seems empty</h2>
        {userID == null ? (
          <pre>You need to login to put items here!</pre>
        ) : (
          <pre>Add something here!</pre>
        )}
      </div>
    );
  } else {
    return (
      <div className={`${pagesVariant[theme]} h-screen text-3xl p-2`}>
        <div className="space-y-5 m-24">
          {wishlistData.map((item, index) => (
            <div
              className={`flex flex-wrap border-2 p-2 h-48 ${themesVariant[theme]}`}
              key={index}
            >
              <div className="p-2 w-full">
                <p>{item.name}</p>
              </div>
              <div className="p-2 w-full">
                <p className="text-2xl">{item.price}$</p>
              </div>
              <div className="w-full flex justify-end p-2">
                <button
                  className="border-2 p-2 m-2 hover:animate-pulse"
                  onClick={async () => {
                    const url = `http://localhost:5174/api/cart/${userID}/addtocart`;

                    if (userID !== null) {
                      const response = await axios.post(url, {
                        productID: item.productID,
                        quantity: 1,
                      });
                    } else {
                      return alert("You must be signed to add to cart");
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faCartShopping} /> Add to Cart
                </button>
                <button
                  className="border-2 p-2 m-2 hover:animate-pulse"
                  onClick={() => {
                    try {
                      if (userID !== null) {
                        const url = `http://localhost:5174/api/wishlist/${userID}/items/delete`;

                        const response = axios.delete(url, {
                          data: { productID: item.productID },
                        });
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faHeartCircleMinus} /> Remove from
                  Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default Wishlist;
