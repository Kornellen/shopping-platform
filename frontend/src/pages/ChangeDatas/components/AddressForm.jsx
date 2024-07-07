import Form from "./components/Form";
import { useAuth, useUser } from "../../../context";
import { useState } from "react";

import axios from "axios";

export default function AddressForm() {
  const { userID } = useAuth();
  const { userAddresses } = useUser();
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
      if (userAddresses !== undefined) {
        const { data, status } = await axios.patch(
          "/api/updateaddresses",
          form
        );

        if (status == 200) {
          setInfo(data.info);
          setError(null);
        }
      } else {
        const { data, status } = await axios.post("/api/addaddress", form);
        if (status == 200) {
          setInfo(data.info);
          setError(null);
        }
      }
    } catch (err) {
      setInfo(null);

      console.log(err);

      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <>
      <Form
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        type={"address"}
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
