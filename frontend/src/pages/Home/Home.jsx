import { pagesVariant } from "../../assets/themes/themes";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth, useTheme } from "../../context";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Buttons } from "../../components";

const Home = () => {
  const { theme } = useTheme();
  const { userID } = useAuth();

  const navigate = useNavigate();

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
          <p>
            {error.response.data.error.fatal === true
              ? "Fatal Internal Server Error"
              : "Internal Server Error"}
          </p>
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
                className="w-full m-2 border-2 p-3 h-36 text-2xl flex "
                key={index}
              >
                <div className="m-2 w-52 p-2">
                  <p
                    onClick={() =>
                      navigate(`/product?productID=${product.productID}`)
                    }
                    className="border-b-2 border-transparent hover:border-b-blue-400 hover:cursor-pointer"
                  >
                    Name: {product.name}
                  </p>
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
                    <Buttons action={"remove"} productID={product.productID} />
                  ) : (
                    <>
                      <Buttons
                        action={"addToWishlist"}
                        productID={product.productID}
                        userID={userID}
                      />
                      <Buttons
                        action={"addToCart"}
                        productID={product.productID}
                        userID={userID}
                      />
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
