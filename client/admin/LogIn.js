import React, { useState, useEffect } from "react";
import { login } from "../helper/api-auth.js";
import auth from "../helper/auth-helper";
import { useNavigate, Navigate } from "react-router-dom";

export default function LogIn(props) {
  const [values, setValues] = useState({
    username: "",
    password: "",
    error: "",
  });

  const navigate = useNavigate();

  const onFormSubmit = (e) => {
    debugger
    e.preventDefault();
    const credentials = {
      username: values.username,
      password: values.password,
    };

    login(credentials).then((data) => {
      if (data.error) {
        if (data.error === "invalid_credentials")
          setValues({ ...values, error: "Invalid user and password" });
        else if (data.error === "disabled")
          setValues({ ...values, error: "User disabled" });
        else if (data.error === "invalid_ip")
          setValues({ ...values, error: "Invalid IP" });
        else setValues({ ...values, error: "Something went wrong" });
      } else {
        auth.authenticate(data, () => {
          navigate("/admin");
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value, error: "" });
  };

  return (
    <>
      {auth.isAuthenticated() && <Navigate to="/admin" replace={true} />}
      <div className="min-h-screen bg-gray-100">
        <div className="flex items-center justify-center pt-40">
          <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold ">Login to your account</div>
              <p className="h-4 text-red-500">{values.error}</p>
            </div>
            <form
              className="flex flex-col items-center justify-center gap-4"
              onSubmit={onFormSubmit}
            >
              <input
                type="text"
                placeholder="Username"
                value={values.username}
                onChange={handleChange("username")}
                className="px-4 py-2 border rounded-md w-44 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <input
                type="password"
                placeholder="password"
                value={values.password}
                onChange={handleChange("password")}
                className="px-4 py-2 border rounded-md w-44 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-900"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
