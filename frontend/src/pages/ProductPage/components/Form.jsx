import { useState } from "react";
import { useAuth, useTheme } from "../../../context";
import { inputStyles, errorStyles } from "../../../assets/themes/themes";
import axios from "axios";

const Form = ({ productID }) => {
  const { userID } = useAuth();
  const { theme } = useTheme();
  const [form, setForm] = useState({
    userID: userID,
  });
  const [error, setError] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError(false);
      const url = `/api/product/${productID}/addcomment`;
      await axios.post(url, form);
    } catch (error) {
      setError(true);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <div className="border-transparent">
      <form onSubmit={handleSubmit} className="form border-transparent">
        <div className="">
          <input
            type="text"
            className={`${inputStyles[theme]} h-9 text-2xl p-2 border-b-2 bg-transparent outline-none text-dark-200`}
            name="comment"
            placeholder="Enter Comment"
            onChange={handleChange}
          />
          *Optional
          <div className="">
            <input
              type="number"
              placeholder="Rating 1-5"
              max={5}
              step={0.5}
              min={1}
              name="rating"
              onChange={handleChange}
              className={
                error
                  ? `${errorStyles[theme]} h-9 text-2xl p-2 `
                  : `${inputStyles[theme]} h-9 text-2xl p-2 `
              }
            />
            *Required
          </div>
        </div>
        <div className="">
          <button
            type="submit"
            className="m-2 border-2 p-1 h-12 w-44 rounded-xl text-xl hover:border-blue-400"
          >
            Add Comment
          </button>
        </div>
      </form>
    </div>
  );
};
export default Form;
