import { useState } from "react";
import { pagesVariant, errorStyles } from "../../assets/themes/themes";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth, useTheme } from "../../context/index";
import { useMutation } from "@tanstack/react-query";

const Login = () => {
  const { theme } = useTheme();

  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const { data, status } = await axios.post("/api/login", formData);

      return { data, status };
    },
    onSuccess: (response) => {
      const { data, status } = response;

      if (status === 202) {
        login(true, data.userID);
        navigate("/account");
      }
    },
    onError: (error) => {
      setLoginError(error.response.data.error);
    },
    mutationKey: ["user", formData.username],
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    loginMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div
      className={`${pagesVariant[theme]} w-full h-svh flex items-center justify-center`}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-content p-2 border-2">
          <div className="form-inputs">
            <div className="username m-10">
              <input
                className={
                  loginError === "User Not Found"
                    ? `${errorStyles.error} outline-none h-9 text-2xl p-2 text-dark-200`
                    : "h-9 text-2xl outline-none p-2 text-dark-200 border-b-2"
                }
                type="text"
                name="username"
                onChange={handleChange}
                placeholder="Login"
              />
            </div>
            <div className="password m-10">
              <input
                className={
                  loginError === "Incorect Password"
                    ? `${errorStyles.error} h-9 text-2xl outline-none p-2 border-b-2 text-dark-200`
                    : "h-9 text-2xl p-2 border-b-2 outline-none text-dark-200"
                }
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Password"
              />{" "}
            </div>

            <br />
          </div>
          {loginError !== "" ? (
            <div className="error text-red-600 text-4xl text-center">
              {loginError}!
            </div>
          ) : null}

          <div className="form-buttons m-10 flex">
            <button
              type="submit"
              className="m-2 border-2 p-1 h-12 rounded-xl w-1/2 text-xl"
            >
              Login
            </button>
            <button
              type="button"
              className="m-2 ml-24 border-2 p-1 h-12 w-1/2 rounded-xl text-xl"
              onClick={() => navigate("/registry")}
            >
              Registry
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
