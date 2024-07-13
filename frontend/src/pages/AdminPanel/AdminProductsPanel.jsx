import { useEffect, useState } from "react";
import { useTheme } from "../../context";
import axios from "axios";
import { pagesVariant } from "../../assets/themes/themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const AdminProductsPanel = () => {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const pageSize = 10;
  const allPage = Math.ceil(products.length / pageSize);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/api/getallproducts");

      return setProducts(data.products);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div
      className={`${pagesVariant[theme]} text-3xl flex justify-center items-center flex-wrap`}
    >
      <table className="p-2">
        <thead className="p-2 divide-x-2 border-2 m-2">
          <tr className="border-2 divide-x-4 text-center">
            <th className="p-2">ProductID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Username</th>
            <th className="p-2">Stock Quantity (items)</th>
            <th className="p-2">Price</th>
          </tr>
        </thead>
        <tbody className="p-2 divide-x-2 border-2 m-2">
          {products
            .slice((page - 1) * pageSize, page * pageSize)
            .map((product) => (
              <tr
                key={product.productID}
                className="border-2 divide-x-4 text-center"
              >
                <td className="p-2">{product.productID}</td>
                <td
                  className="p-2 hover:text-blue-400 hover:cursor-pointer"
                  onClick={() =>
                    navigate(`/product?productID=${product.productID}`)
                  }
                >
                  {product.name}
                </td>
                <td className="p-2">{product.description}</td>
                <td className="p-2">{product.username}</td>
                <td className="p-2">{product.stockQuantity}</td>
                <td className="p-2">{product.price}$</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="p-2 space-x-4 w-full flex justify-center">
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
  );
};

export default AdminProductsPanel;
