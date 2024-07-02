import { useEffect, useState } from "react";
import { pagesVariant } from "../../assets/themes/themes";
import { useTheme } from "../../context/themeContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const { theme } = useTheme();
  const [items, setItems] = useState([]);

  const fetchDatas = async () => {
    const response = await axios.get(
      "http://localhost:5174/api/getallproducts"
    );

    const data = await response.data;

    return data.products;
  };

  useEffect(() => {
    fetchDatas().then((data) => setItems(data));
  }, []);

  return (
    <div
      className={`${pagesVariant[theme]} text-3xl w-full h-screen float-left`}
    >
      <div className="Home">
        <h1 className="text-5xl text-center">Welcome!</h1>
        <div className={`flex ${pagesVariant[theme]} h-full p-0 flex-wrap`}>
          {items.length !== 0 ? (
            items.map((product, index) => (
              <div
                className="w-full m-2 border-2 p-3 h-36 text-2xl flex"
                key={index}
              >
                <div className="m-2">
                  <p>Name: {product.name}</p>
                  <p>Price: {product.price}$</p>
                </div>
                <div className="border-2 w-1 "></div>
                <div className="m-2">
                  <pre>Category: {product.categoryName}</pre>
                  <p>Seller: {product.username}</p>
                  <hr />
                  <p>{product.description}</p>
                </div>
                <div className="button">
                  <button
                    className="border-2 p-2 m-2"
                    onClick={async () => {
                      const userID = window.localStorage.getItem("userID");
                      const url = `http://localhost:5174/api/wishlist/${userID}/items/addTo`;

                      if (
                        userID !== null &&
                        userID !== "" &&
                        userID !== undefined
                      ) {
                        const response = await axios.post(url, {
                          productID: product.productID,
                        });
                      } else {
                        return alert("You must be signed to add to wishlist");
                      }
                    }}
                  >
                    Add to wishlist
                  </button>
                  <button
                    className="border-2 p-2 m-2"
                    onClick={async () => {
                      const userID = window.localStorage.getItem("userID");
                      const url = `http://localhost:5174/api/wishlist/${userID}/items/addTo`;

                      if (
                        userID !== null &&
                        userID !== "" &&
                        userID !== undefined
                      ) {
                        const response = await axios.post(url, {
                          productID: product.productID,
                          userID: userID,
                          qunatity: 1,
                        });
                      } else {
                        return alert("You must be signed to add to cart");
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faCartShopping} /> Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>
              <h1>Internal Server Error</h1>
              <p>Try Again Later</p>
              <pre>Press f5 for reload</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
