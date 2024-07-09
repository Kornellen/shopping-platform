import { useSearchParams } from "react-router-dom";
import { useAuth, useTheme } from "../../context";
import { useEffect, useState } from "react";
import axios from "axios";
import { pagesVariant } from "../../assets/themes/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfStroke,
  faBan,
  faCommentSlash,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import Form from "./components/Form";

import { Buttons } from "../../components/index";

const Product = () => {
  const [searchParams] = useSearchParams();
  const productID = searchParams.get("productID");
  const { theme } = useTheme();
  const [productData, setProductData] = useState(null);
  const [productReviews, setProductReviews] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userID } = useAuth();
  const [info, setInfo] = useState("");

  const reviews = productReviews?.map((review) => review.rating) || [];

  const totalRating =
    reviews?.reduce((acc, review) => acc + review, 0) / reviews.length || 0;

  const fetchProductData = async () => {
    try {
      const url = `/api/product/${productID}`;
      const response = await axios.get(url);

      setProductData(response.data.productDatas);
      setProductReviews(response.data.comments);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  if (loading) {
    return (
      <div
        className={`${pagesVariant[theme]} text-3xl w-full overflow-y-scroll p-2 float-left`}
      >
        <pre className="animate-pulse">Loading...</pre>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${pagesVariant[theme]} text-3xl w-full overflow-y-scroll p-2 float-left`}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className={`${pagesVariant[theme]} text-3xl w-full overflow-y-scroll p-2 float-left`}
    >
      <div className="">
        <div className="">
          <div className="border-2 p-2 text-3xl flex">
            <div className="w-1/2 border-r-2 h-full">
              <p className="p-2 w-full">{productData?.name}</p>
              <hr />
              <p>Desc: {productData?.description}</p>
              <p>Price: {productData?.price}$</p>
              <p>Quantity: {productData?.stockQuantity}</p>
              <p>Added At: {productData?.addedAt}</p>
              <p>
                Seller:{" "}
                {+userID === productData?.userID
                  ? "You"
                  : productData?.username}
              </p>
            </div>
            <div className="p-2 w-1/2 text-end">
              {+userID === productData?.userID ? (
                <Buttons action={"remove"} />
              ) : (
                <>
                  <Buttons
                    action={"addToWishlist"}
                    userID={userID}
                    productID={productData?.productID}
                  />
                  <Buttons
                    action={"addToCart"}
                    userID={userID}
                    productID={productData?.productID}
                  />
                </>
              )}
            </div>
          </div>
          <br />
          <div className="text-2xl space-y-4">
            <div className="p-2">
              <p>
                Total Rating:{" "}
                {totalRating !== 0 ? (
                  <>
                    {[...Array(Math.floor(totalRating))].map((_, index) => (
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-500"
                      />
                    ))}
                    {totalRating % 1 !== 0 && (
                      <FontAwesomeIcon
                        icon={faStarHalfStroke}
                        className="text-yellow-500"
                      />
                    )}
                  </>
                ) : (
                  "No reviews"
                )}
              </p>
            </div>
            <div className="border-2 p-2">
              <p>
                <FontAwesomeIcon icon={faComment} /> Comments:{" "}
              </p>
              <div className="divide-y-2">
                {productReviews?.length === 0 ? (
                  <div className="p-2">Product does not have reviews</div>
                ) : (
                  productReviews?.map((review, index) => (
                    <div key={index} className="p-2 text-3 space-y-2 m-2">
                      <p>
                        <b>
                          {review.username == productData.username
                            ? `${review.username} (Seller)`
                            : review.username}
                        </b>{" "}
                        -&gt; <q>{review.comment}</q>
                      </p>
                      <p>
                        {review.rating}{" "}
                        {Array.from({ length: review.rating }, (_, i) => (
                          <FontAwesomeIcon
                            icon={faStar}
                            className="text-yellow-500"
                          />
                        ))}
                        {review.rating % 1 !== 0 && (
                          <FontAwesomeIcon
                            icon={faStarHalfStroke}
                            className="text-yellow-500"
                          />
                        )}
                      </p>
                      <p>{review.createdAt}</p>
                      {review.userID === +userID ? (
                        <button
                          className="border-2 p-1 h-12 w-56 rounded-xl text-xl hover:border-blue-400"
                          onClick={() => {
                            try {
                              const url = `/api/review/${review.reviewID}`;
                              axios.delete(url);
                            } catch {}
                          }}
                        >
                          <FontAwesomeIcon icon={faBan} /> Remove Comment
                        </button>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="border-2 p-2">
              <p className="text-3xl">
                {productReviews.length === 0
                  ? "Be first and leave a review"
                  : "Leave a review"}
              </p>
              <Form productID={productID} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Product;
