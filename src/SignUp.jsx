import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import toast from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";

const SignUp = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    phone1: "",
    phone2: "",
    email: "",
    password: "",
    confirmPassword: "",
    extraField1: "",
    extraField2: "",
    extraField3: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/signup", formData);
      if (response.data.success) {
        toast.success("Sign up successful!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Error signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-blue-950 mb-6">
        Sign Up Form for Sharif Stationary Shopkeeper's
        </h2>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Company Name", name: "companyName" },
            { label: "Owner Name", name: "ownerName" },
            { label: "Phone Number 1", name: "phone1", type: "tel" },
            { label: "Phone Number 2", name: "phone2", type: "tel" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Confirm Password", name: "confirmPassword", type: "password" },
            { label: "Extra Field 1", name: "extraField1" },
            { label: "Extra Field 2", name: "extraField2" },
            { label: "Extra Field 3", name: "extraField3" },
          ].map(({ label, name, type = "text" }) => (
            <div className="mb-4" key={name}>
              <label className="block text-gray-700" htmlFor={name}>
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${label.toLowerCase()}`}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-950 text-white py-2 rounded-lg mt-4 hover:bg-blue-800 focus:outline-none"
            disabled={loading}
          >
            {loading ? (
              <TbFidgetSpinner className="animate-spin mx-auto" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-gray-700">Already have an account? </span>
          <Link to="/login" className="text-blue-950 font-semibold">
            Log In
          </Link>
        </div>

        <div className="text-center mt-6">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 w-full">
            <FcGoogle className="text-2xl" />
            Sign Up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
