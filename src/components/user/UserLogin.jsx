import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

import { AuthContext } from "./AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const { setIsLoggedIn, setUsername } = useContext(AuthContext);

  const onSubmit = (data) => {
    axios
      .post("http://localhost:5000/api/v1/users/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setUsername(response.data.data.username);
        setMessage(response.data.message);
        setIsLoggedIn(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((error) => {
        setMessage(error.response.data);
      });
    reset();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("email", { required: true })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Email"
          />
          <input
            {...register("password", { required: true })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Password"
            type="password"
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 transition duration-300"
          >
            Login
          </button>
        </form>
        {message && (
          <div className="text-center mt-4 text-gray-700">
            {message === "User is not registered" ? (
              <p>
                {message}. <NavLink to="/users/register" className="text-red-500 underline hover:text-red-700">Register here</NavLink>
              </p>
            ) : (
              <p>{message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
