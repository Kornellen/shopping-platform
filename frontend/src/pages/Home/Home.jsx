import { pagesVariant } from "../../assets/themes/themes";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAuth, useTheme } from "../../context";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Buttons } from "../../components";

import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";

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
  const [page, setPage] = useState(1);

  const pageSize = 4;
  const allPage = Math.ceil(data?.length / pageSize);

  if (isLoading) {
    return (
      <div
        className={`${pagesVariant[theme]} text-3xl w-full h-screen float-left text-center`}
      >
        <p className="text-center animate-pulse">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`${pagesVariant[theme]} text-3xl w-full h-screen float-left text-center`}
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
            data
              ?.slice((page - 1) * pageSize, page * pageSize)
              .map((product, index) => (
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
                      <Buttons
                        action={"remove"}
                        productID={product.productID}
                      />
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

          <div className="flex justify-center w-full h-full">
            <button
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="disabled:text-gray-500"
            >
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            <input
              type="text"
              value={+page}
              onChange={(event) => setPage(() => +event.target.value)}
              className="bg-transparent text-center w-20 outline-none"
            />
            <button
              disabled={allPage === page}
              onClick={() => {
                setPage((current) => current + 1);
              }}
              className="disabled:text-gray-500"
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
