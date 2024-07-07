import { pagesVariant } from "../../assets/themes/themes";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHeart,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth, useTheme } from "../../context";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Home = () => {
  const { theme } = useTheme();
  const { userID } = useAuth();
  const [info, setInfo] = useState("");

  const fetchDatas = async () => {
    const { data } = await axios.get("/api/getallproducts");

    return data.products;
  };

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchDatas,
  });

  if (isLoading) {
    return (
      <div
        className={`${pagesVariant[theme]} text-3xl w-full h-screen float-left`}
      >
        <p className="text-center animate-pulse">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`${pagesVariant[theme]} text-3xl w-full h-screen float-left`}
      >
        <div>
          <p>{error.message}</p>
          <p>Try Again Later</p>
          <pre>Press f5 for reload</pre>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${pagesVariant[theme]} text-3xl w-full overflow-y-scroll p-2 float-left`}
    >
      <div className="Home overflow-auto">
        <h1 className="text-5xl text-center p-2">Welcome!</h1>
        <div className={`flex ${pagesVariant[theme]} h-full p-0 flex-wrap`}>
          {data &&
            data.map((product, index) => (
              <div
                className="w-full m-2 border-2 p-3 h-36 text-2xl flex"
                key={index}
              >
                <div className="m-2 w-52 p-2">
                  <p>Name: {product.name}</p>
                  <p>Price: {product.price}$</p>
                </div>
                <div className="border-2 w-px "></div>
                <div className="m-2 w-72 p-2">
                  <pre>Category: {product.categoryName}</pre>
                  <p>
                    Seller:{" "}
                    {+userID === product.userID ? "You" : product.username}
                  </p>

                  <hr />
                  <p>{product.description}</p>
                </div>
                <div className="buttons flex items-center">
                  {+userID === product.userID ? (
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
                            return alert(
                              "You must be signed to add to wishlist"
                            );
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
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
