import { useState } from "react";
import { inputStyles, pagesVariant } from "../../assets/themes/themes";
import { useAuth, useTheme } from "../../context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Registry = () => {
  const { theme } = useTheme();
  const { login, logout } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rpassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "",
    gender: "",
  });
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/createuser", formData);

      console.log(response);

      if (response.status === 200) {
        login(true, response.data.userID);
        navigate("/account");
      } else {
        logout(false);
      }
    } catch (error) {
      setLoginError(error.response.data.errors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className={`${pagesVariant[theme]} `}>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center w-full h-full space-y-4"
        method="post"
      >
        <div className="form-content border-2 p-10">
          <div className="form-inputs">
            <div>
              <input
                type="text"
                className={`${inputStyles[theme]} text-2xl m-2`}
                placeholder="Enter an username"
                onChange={handleChange}
                name="username"
              />
            </div>
            <div>
              <input
                type="email"
                className={`${inputStyles[theme]} text-2xl m-2`}
                placeholder="Enter an email"
                onChange={handleChange}
                name="email"
              />
            </div>
            <div>
              <input
                type="password"
                className={`${inputStyles[theme]} text-2xl m-2`}
                placeholder="Enter a password"
                onChange={handleChange}
                name="password"
              />
            </div>
            <div>
              <input
                type="password"
                className={`${inputStyles[theme]} text-2xl m-2`}
                placeholder="Repeat a password"
                onChange={handleChange}
                name="rpassword"
              />
            </div>
            <div>
              <input
                type="text"
                className={`${inputStyles[theme]} text-2xl m-2`}
                placeholder="Enter your first name"
                onChange={handleChange}
                name="firstName"
              />
            </div>
            <div>
              <input
                type="text"
                className={`${inputStyles[theme]} text-2xl m-2`}
                placeholder="Enter your last Name"
                onChange={handleChange}
                name="lastName"
              />
            </div>
            <div>
              <input
                type="tel"
                className={`${inputStyles[theme]} text-2xl m-2`}
                placeholder="Enter a phone number"
                onChange={handleChange}
                name="phoneNumber"
              />
            </div>
            <div className="text-center">
              <label htmlFor="dob" className="text-2xl">
                Date of birthday
              </label>
              <br />
              <input
                type="date"
                className={`${inputStyles[theme]} text-2xl m-2`}
                onChange={handleChange}
                name="dob"
              />
            </div>
            <div className="text-center">
              <select
                name="geneder"
                className={`${
                  theme == "light"
                    ? "bg-light-500 text-dark-100"
                    : "bg-dark-500 text-light-100"
                } p-2 rounded-xl text-xl`}
                onChange={handleChange}
              >
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>
              <span className="m-2 text-xl">*Optional</span>
            </div>
          </div>
          <div className="errors text-red-600 text-2xl">{loginError}</div>
          <div className="form-buttons flex">
            <button
              type="submit"
              className="m-2 border-2 p-1 h-12 rounded-xl w-1/2 text-xl hover:border-blue-400"
            >
              Registry
            </button>
            <button
              type="button"
              className="m-2 ml-24 border-2 p-1 h-12 w-1/2 rounded-xl text-xl hover:border-blue-400"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Registry;
