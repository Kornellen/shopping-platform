import { useLocation } from "react-router-dom";
import { useTheme } from "../../context";
import { inputStyles, pagesVariant } from "../../assets/themes/themes";
import { useState } from "react";
import axios from "axios";

const Return = () => {
  const location = useLocation();
  const { userID, orderID } = location.state || {};
  const { theme } = useTheme();
  const [form, setForm] = useState({
    reason: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubimt = (event) => {
    event.preventDefault();
    try {
      axios.post(`/api/user/${userID}/order/${orderID}/requestreturn`, form);
      setSuccess("Request sent successfully");
    } catch (error) {
      setError(error);
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className={`${pagesVariant[theme]}`}>
      <form
        onSubmit={handleSubimt}
        className="form border-transparent text-center"
      >
        <label htmlFor="reason">
          Reason <span className="align-text-top text-sm">*required</span>
        </label>
        <br />
        <textarea
          type="text"
          name="reason"
          className={`${inputStyles[theme]} p-2 m-2`}
          onChange={handleChange}
          maxLength={200}
          placeholder="Max 200 characters"
          required={true}
        ></textarea>
        <br />
        <button
          className="buttons border-2 p-2 w-64 text-center h-14 m-2 hover:border-blue-400 hover:text-blue-400 rounded-md"
          type="submit"
        >
          Send Request
        </button>
      </form>
      <div className="text-center text-3xl">
        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Return;
