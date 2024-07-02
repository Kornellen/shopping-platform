import { useState } from "react";
import { pagesVariant } from "../../assets/themes/themes";
import { useAuth, useTheme } from "../../context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Registry = () => {
  const { theme } = useTheme();
  const { changeAuth } = useAuth();

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
      const response = await axios.post(
        "http://localhost:5174/api/createuser",
        formData
      );

      if (response.status === 200) {
        changeAuth(true, response.data.userID);
        navigate("/profile");
      } else {
        changeAuth(false);
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
    <div className={`${pagesVariant[theme]} h-svh w-full`}>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center w-full h-full"
        method="post"
      >
        <div className="form-content border-2 p-10">
          <div className="form-inputs">
            <div>
              <input
                type="text"
                className="h-9 m-2 text-2xl outline-none p-2 text-dark-200 border-b-2"
                placeholder="username"
                onChange={handleChange}
                name="username"
              />
            </div>
            <div>
              <input
                type="email"
                className="h-9 m-2 text-2xl outline-none p-2 text-dark-200 border-b-2"
                placeholder="email"
                onChange={handleChange}
                name="email"
              />
            </div>
            <div>
              <input
                type="password"
                className="h-9 m-2 text-2xl outline-none p-2 text-dark-200 border-b-2"
                placeholder="password"
                onChange={handleChange}
                name="password"
              />
            </div>
            <div>
              <input
                type="password"
                className="h-9 m-2 text-2xl outline-none p-2 text-dark-200 border-b-2"
                placeholder="repeat password"
                onChange={handleChange}
                name="rpassword"
              />
            </div>
            <div>
              <input
                type="text"
                className="h-9 m-2 text-2xl outline-none p-2 text-dark-200 border-b-2"
                placeholder="first Name"
                onChange={handleChange}
                name="firstName"
              />
            </div>
            <div>
              <input
                type="text"
                className="h-9 m-2 text-2xl outline-none p-2 text-dark-200 border-b-2"
                placeholder="last Name"
                onChange={handleChange}
                name="lastName"
              />
            </div>
            <div>
              <input
                type="tel"
                className="h-9 m-2 text-2xl outline-none p-2 text-dark-200 border-b-2"
                placeholder="phone number"
                onChange={handleChange}
                name="phoneNumber"
              />
            </div>
            <div>
              <input
                type="date"
                className="h-9 m-2 text-2xl outline-none p-2 text-dark-200 border-b-2"
                onChange={handleChange}
                name="dob"
              />
            </div>
            <div>
              <select
                name="geneder"
                className="h-9 m-2 text-2xl outline-none p-2 text-dark-200 border-b-2"
                onChange={handleChange}
              >
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>
              <span className="m-2 text-2xl">*Optional</span>
            </div>
          </div>
          <div className="errors text-red-600 text-2xl">{loginError}</div>
          <div className="form-buttons flex">
            <button
              type="submit"
              className="m-2 border-2 p-1 h-12 rounded-xl w-1/2 text-xl"
            >
              Registry
            </button>
            <button
              type="button"
              className="m-2 ml-24 border-2 p-1 h-12 w-1/2 rounded-xl text-xl"
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
