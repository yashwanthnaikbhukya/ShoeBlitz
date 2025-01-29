import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    axios
      .post("http://localhost:5000/api/v1/users/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        setMessage(response.data.message);
        setTimeout(() => navigate("/users/login"), 1000);
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data);
      });
    reset();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("email", { required: true })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Email"
          />
          <input
            {...register("username", { required: true })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Username"
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
            Register
          </button>
        </form>
        {message && (
          <div className="text-center mt-4 text-gray-700">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
