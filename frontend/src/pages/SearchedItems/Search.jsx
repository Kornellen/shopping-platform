import { pagesVariant } from "../../assets/themes/themes";

import { useAuth, useTheme } from "../../context";

import { Buttons } from "../../components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const SearchItems = ({ items }) => {
  const { theme } = useTheme();
  const { userID } = useAuth();

  const [page, setPage] = useState(1);

  const pageSize = 4;
  const allPage = Math.ceil(items?.length / pageSize);

  return (
    <div className={`${pagesVariant[theme]} text-3xl float-left p-2`}>
      <div className={`flex ${pagesVariant[theme]} p-0 flex-col`}>
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
                  <Buttons action={"remove"} productID={item.productID} />
                ) : (
                  <>
                    <Buttons
                      action={"addToWishlist"}
                      productID={item.productID}
                      userID={userID}
                    />
                    <Buttons
                      action={"addToCart"}
                      productID={item.productID}
                      userID={userID}
                    />
                  </>
                )}
              </div>
            </div>
          ))
        )}
        {allPage !== 0 ? (
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
        ) : null}
      </div>
    </div>
  );
};

export default SearchItems;
