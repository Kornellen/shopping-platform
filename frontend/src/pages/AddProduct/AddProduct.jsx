import Form from "./components/Form";
import { pagesVariant } from "../../assets/themes/themes";
import { useAuth, useTheme } from "../../context";
import { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const { theme } = useTheme();
  const { userID } = useAuth();
  const [form, setForm] = useState({
    userID: userID,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(false);
      const { status } = await axios.post("/api/product/addproduct", form);

      if (status != 200) {
        setError("Something went wrong");
      }
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError(error.response.data.errors);
      setSuccess(false);
    }
  };

  return (
    <div
      className={`${pagesVariant[theme]} h-full flex items-center justify-center`}
    >
      <Form handleChange={handleChange} handleSubmit={handleSubmit} />

      <div className="text-2xl m-2">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : success ? (
          <p className="text-green-500">Success</p>
        ) : null}
      </div>
    </div>
  );
};

export default AddProduct;
