import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import toast from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Track password visibility

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/auth/signin/", formData, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (response.data.success) {
        toast.success("Sign in successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-blue-950 mb-6">
          Sign In to Sharif Stationary Shop Keeper
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field with Show/Hide Button */}
          <div className="mb-4 relative">
            <label className="block text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"} // Toggle input type
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Enter your password"
              required
            />
            {/* Eye Icon to Toggle Password Visibility */}
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-950 text-white py-2 rounded-lg mt-4 hover:bg-blue-800 focus:outline-none"
            disabled={loading}
          >
            {loading ? <TbFidgetSpinner className="animate-spin mx-auto" /> : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-gray-700">Don't have an account? </span>
          <Link to="/signup" className="text-blue-950 font-semibold">
            Sign Up
          </Link>
        </div>

        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-blue-950 font-semibold">
            Forgot Password?
          </Link>
        </div>

        <div className="text-center mt-6">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
            <FcGoogle className="text-2xl" />
            Sign In with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;