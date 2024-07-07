import axios from "axios";
import { useTheme, useAuth } from "../../../context";
import { useState } from "react";
import Form from "./components/Form";

export default function PhoneForm() {
  const { userID } = useAuth();
  const [form, setForm] = useState({
    userID: +userID,
  });
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

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
      const { data, status } = await axios.patch("/api/updateuserdatas", form);

      if (status == 200) {
        setInfo(data.info);
        setError(null);
      }
    } catch (err) {
      setInfo(null);

      console.log(err);

      if (err.response) {
        setError(err.response?.data.error);
      } else {
        setError(err?.message);
      }
    }
  };

  return (
    <>
      <Form
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        type={"phone"}
      />
      <div className="text-3xl m-2">
        {error ? (
          <h1 className="text-red-500">{error}</h1>
        ) : (
          info && <h1 className="text-green-500">{info}</h1>
        )}
      </div>
    </>
  );
}
