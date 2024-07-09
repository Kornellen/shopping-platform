import { pagesVariant } from "../../assets/themes/themes";

import { useAuth, useTheme } from "../../context";

import { Buttons } from "../../components";

const SearchItems = ({ items }) => {
  const { theme } = useTheme();
  const { userID } = useAuth();

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
      </div>
    </div>
  );
};

export default SearchItems;
