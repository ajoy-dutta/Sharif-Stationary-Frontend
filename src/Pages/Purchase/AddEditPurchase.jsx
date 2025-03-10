import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";

const AddEditPurchase = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    items: [],
    order_date: "",
    order_no: "",
    invoice_challan_date: "",
    invoice_challan_no: "",
    transport_type: "",
    delivery_date: "",
    delivery_no: "",
    driver_name: "",
    driver_mobile_no: "",
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
    cheque_date: "",
    balance_amount: "",
    company: "",
    godown: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("Submitting data:", formData);
    const response = await AxiosInstance.post("/api/purchases/", formData);
    console.log("Response:", response.data);
    alert("Purchase saved successfully!");
    navigate("/purchase-list");
  } catch (error) {
    console.error("Error submitting form:", error.response ? error.response.data : error);
    alert("Failed to save purchase. Check console for details.");
  }
};


  return (
    <div className="mt-2 mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Purchase & Invoice Information</h2>
        <Link to="/purchase-list" className="btn bg-blue-600 text-white">
          Go to List
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="px-4 border rounded-lg shadow-md bg-white">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-4">
          {Object.keys(formData).map((key) => (
            key !== "items" && (
              <div key={key}>
                <label className="block mb-1">{key.replace(/_/g, ' ').toUpperCase()}</label>
                <input
                  type={key.includes("date") ? "date" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
            )
          ))}
        </div>
        <button type="submit" className="btn bg-blue-600 text-white mt-4">Submit</button>
      </form>
    </div>
  );
};

export default AddEditPurchase;
