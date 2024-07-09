import axios from "axios";
import { useEffect, useState } from "react";
import { inputStyles } from "../../../assets/themes/themes";
import { useTheme } from "../../../context";

const Form = ({ handleChange, handleSubmit }) => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getCategories() {
    try {
      const { data, status } = await axios.get("/api/categories");
      if (status === 200 && data) {
        setError(null);
        setCategories(data.categories);
      }
    } catch (error) {
      setError(error.message);
      setCategories(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-2xl text-center text-red-500">
        <h1>An error occurred: {error}...</h1>
        <pre>We're working on it! Try later...</pre>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form space-y-4">
      <h1 className="text-center">Add Item</h1>
      <div className="space-y-4">
        <div className="category">
          <label htmlFor="categoryID">
            Select product category: <br />
          </label>
          <select
            name="categoryID"
            className={`bg-dark-500 p-2 rounded-xl m-2 text-center ml-10`}
            id=""
            onChange={handleChange}
          >
            {categories?.map((category, index) => (
              <option key={index} value={category.categoryID}>
                {category.categoryID} - {category.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="name">
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            className={`${inputStyles[theme]} p-2`}
            onChange={handleChange}
          />
        </div>
        <div className="desc">
          <input
            type="text"
            name="desc"
            placeholder="Enter product description"
            className={`${inputStyles[theme]} p-2`}
            onChange={handleChange}
          />
        </div>
        <div className="price">
          <input
            type="number"
            name="price"
            placeholder="Enter product price"
            className={`${inputStyles[theme]} p-2`}
            onChange={handleChange}
          />
        </div>
        <div className="stock-quantity">
          <input
            type="number"
            name="stockQuantity"
            placeholder="Enter product quantity"
            className={`${inputStyles[theme]} p-2`}
            onChange={handleChange}
          />
        </div>
        <div className="text-center">
          <button type="submit" className="text-blue-300 hover:text-blue-500">
            Add Product
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
