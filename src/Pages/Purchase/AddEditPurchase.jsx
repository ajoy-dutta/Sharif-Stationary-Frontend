import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
const AddEditPurchase = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [godowns, setGodowns] = useState([]);

  const [formData, setFormData] = useState({
    items: [],
    order_date: new Date().toISOString().split("T")[0],
    order_no: "",
    invoice_challan_date: new Date().toISOString().split("T")[0],
    invoice_challan_no: "",
    transport_type: "",
    delivery_date: new Date().toISOString().split("T")[0],
    delivery_no: "",
    vehicle_no: "",
    entry_by: "",
    remarks: "",
    previous_due: "",
    invoice_challan_amount: "",
    today_paid_amount: "",
    payment_type: "",
    bank_name: "",
    account_no: "",
    cheque_no: "",
    cheque_date: new Date().toISOString().split("T")[0],
    balance_amount: "",
    company: "",
    godown: "",
  });

  // Fetch Dropdown Data (Companies & Godowns)
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const companyResponse = await AxiosInstance.get("/companies/");
        setCompanies(companyResponse.data);

        const godownResponse = await AxiosInstance.get("/godowns/");
        setGodowns(godownResponse.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: ["previous_due", "invoice_challan_amount", "today_paid_amount", "balance_amount"].includes(name)
        ? parseFloat(value) || 0 // Convert to number
        : name.includes("date")
        ? new Date(value).toISOString().split("T")[0] // Convert date to YYYY-MM-DD
        : ["company", "godown"].includes(name)
        ? (value !== "" ? parseInt(value) : null) // Ensure foreign keys are integers or null
        : value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting Data:", formData);
      const response = await AxiosInstance.post("/purchases/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Purchase saved successfully!", { position: "top-right" }); // Show toast
      setTimeout(() => navigate("/purchase-list"), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error);
      toast.error("Failed to save purchase. Check console for details.");
    }
  };

  return (
    <div className="mt-2 mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Purchase & Invoice Information</h2>
        <Link to="/purchase-list" className="btn bg-blue-950 text-white">
          Go to List
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="px-4 border rounded-lg shadow-md bg-white">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-4">
          {/* Dynamic Fields */}
          {Object.keys(formData).map(
            (key) =>
              key !== "items" &&
              key !== "company" &&
              key !== "godown" &&
              key !== "driver_name" && // Removed driver_name
              key !== "driver_mobile_no" && ( // Removed driver_mobile_no
                <div key={key}>
                  <label className="block mb-1">
                    {key.replace(/_/g, " ").replace(/\b\w/, (char) => char.toUpperCase())}
                  </label>
                  <input
                    type={key.includes("date") ? "date" : "text"}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
              )
          )}
{/* Company Dropdown */}
<div>
  <label className="block mb-1 text-gray-700 font-medium">Company*</label>
  <select
    name="company"
    value={formData.company || ""}
    onChange={handleChange}
    className="border p-2 w-full bg-white text-black"
  >
    <option value="">Select Company</option>
    {companies.length > 0 ? (
      companies.map((c) => (
        <option key={c.id} value={c.id} className="text-black">
          {c.name}
        </option>
      ))
    ) : (
      <option disabled className="text-black">Loading...</option>
    )}
  </select>
</div>

{/* Godown Dropdown */}
<div>
  <label className="block mb-1 text-gray-700 font-medium">Godown*</label>
  <select
    name="godown"
    value={formData.godown || ""}
    onChange={handleChange}
    className="border p-2 w-full bg-white text-black"
  >
    <option value="">Select Godown</option>
    {godowns.length > 0 ? (
      godowns.map((g) => (
        <option key={g.id} value={g.id} className="text-black">
          {g.name}
        </option>
      ))
    ) : (
      <option disabled className="text-black">Loading...</option>
    )}
  </select>
</div>

        </div>

        {/* Submit Button */}
        <button type="submit" className="btn bg-blue-600 text-white mt-4">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddEditPurchase;
