import axios from "axios";
import { inputStyles, pagesVariant } from "../../../assets/themes/themes";
import { useTheme, useAuth } from "../../../context";
import { useState } from "react";

export default function UsernameForm() {
  const { theme } = useTheme();
  const { userID } = useAuth();
  const [form, setForm] = useState({
    userID: userID,
  });
  const [error, setError] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const response = axios.patch("/api/updateusername", form);

      const data = response.then((data) => data.data);

      return data;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 p-5 text-2xl">
      <div className="">
        <h3 className="text-center p-2 m-2">Change Username</h3>
        <div className="">
          <input
            type="text"
            name="newUsername"
            placeholder="New Username"
            className={`${inputStyles[theme]} p-2 m-2`}
            onChange={handleChange}
          />
          *
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={`${inputStyles[theme]} p-2 m-2`}
            onChange={handleChange}
          />
          *
        </div>

        <button type="submit" className="w-full text-center">
          Change
        </button>
        <pre className="text-xs">* for required</pre>
      </div>
    </form>
  );
}
