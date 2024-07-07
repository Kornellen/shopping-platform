import { pagesVariant } from "../../assets/themes/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHeart,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth, useTheme } from "../../context";
import { useState } from "react";

const SearchItems = ({ items }) => {
  const { theme } = useTheme();
  const { userID } = useAuth();
  const [info, setInfo] = useState("");

  return (
    <div className={`${pagesVariant[theme]} text-3xl float-left`}>
      <div
        className={`flex ${pagesVariant[theme]} p-0 flex-wrap overflow-scroll`}
      >
        {items.length == 0 ? (
          <>
            <div className="">
              <pre>We don't have item that you looking for</pre>
            </div>
          </>
        ) : (
          items.map((item, index) => (
            <div
              className="w-full m-2 border-2 p-3 h-36 text-2xl flex"
              key={index}
            >
              <div className="m-2 w-52">
                <p>Name: {item.name}</p>
                <p>Price: {item.price}$</p>
              </div>
              <div className="border-2 w-1 "></div>
              <div className="m-2">
                <pre>Category: {item.categoryName}</pre>
                <p>Seller: {+userID === item.userID ? "You" : item.username}</p>

                <hr />
                <p>{item.description}</p>
              </div>
              <div className="buttons flex items-center">
                {+userID === item.userID ? (
                  <button
                    className="border-2 p-2 m-2 hover:animate-pulse"
                    onClick={() => {
                      axios.delete(`/api/product/remove`, {
                        data: { productID: product.productID },
                      });
                      setInfo("Success");
                    }}
                  >
                    <FontAwesomeIcon icon={faBan} />{" "}
                    {...info ? info : "Remove Product"}
                  </button>
                ) : (
                  <>
                    <button
                      className="border-2 p-2 m-2 hover:animate-pulse"
                      onClick={async () => {
                        const url = `/api/wishlist/${userID}/items/addTo`;

                        if (
                          userID !== null &&
                          userID !== "" &&
                          userID !== undefined
                        ) {
                          await axios.post(url, {
                            productID: product.productID,
                          });
                        } else {
                          return alert("You must be signed to add to wishlist");
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faHeart} /> Add to wishlist
                    </button>
                    <button
                      className="border-2 p-2 m-2 hover:animate-pulse"
                      onClick={async () => {
                        const url = `/api/cart/${userID}/addtocart`;

                        if (
                          userID !== null &&
                          userID !== "" &&
                          userID !== undefined
                        ) {
                          await axios.post(url, {
                            productID: product.productID,
                            quantity: 1,
                          });
                        } else {
                          return alert("You must be signed to add to cart");
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faCartShopping} /> Add to Cart
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchItems;
