import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";

const AddEditPurchase = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [godowns, setGodowns] = useState([]);

  const [formData, setFormData] = useState({
    order_date: new Date().toISOString().split("T")[0],
    order_no: "",
    invoice_challan_date: new Date().toISOString().split("T")[0],
    invoice_challan_no: "",
    transport_type: "",
    delivery_date: new Date().toISOString().split("T")[0],
    delivery_no: "",
    driver_name: "",
    driver_mobile_no: "",
    vehicle_no: "",
    entry_by: "admin",
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
      [name]: value,
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
          
          {/* Static Input Fields */}
          <div>
            <label className="block mb-1">Order Date</label>
            <input type="date" name="order_date" value={formData.order_date} onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div>
            <label className="block mb-1">Order No</label>
            <input type="text" name="order_no" value={formData.order_no} onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div>
            <label className="block mb-1">Invoice Challan Date</label>
            <input type="date" name="invoice_challan_date" value={formData.invoice_challan_date} onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div>
            <label className="block mb-1">Invoice Challan No</label>
            <input type="text" name="invoice_challan_no" value={formData.invoice_challan_no} onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div>
            <label className="block mb-1">Transport Type</label>
            <input type="text" name="transport_type" value={formData.transport_type} onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div>
            <label className="block mb-1">Delivery Date</label>
            <input type="date" name="delivery_date" value={formData.delivery_date} onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div>
            <label className="block mb-1">Delivery No</label>
            <input type="text" name="delivery_no" value={formData.delivery_no} onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div>
            <label className="block mb-1">Driver Name</label>
            <input type="text" name="driver_name" value={formData.driver_name} onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div>
            <label className="block mb-1">Driver Mobile No</label>
            <input type="text" name="driver_mobile_no" value={formData.driver_mobile_no} onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div>
            <label className="block mb-1">Vehicle No</label>
            <input type="text" name="vehicle_no" value={formData.vehicle_no} onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div>
            <label className="block mb-1">Entry By</label>
            <input type="text" name="entry_by" value={formData.entry_by} onChange={handleChange} className="border p-2 w-full" />
          </div>

          <div>
            <label className="block mb-1">Remarks</label>
            <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} className="border p-2 w-full" />
          </div>

          {/* Company Dropdown */}
          <div>
            <label className="block mb-1">Company*</label>
            <select name="company" value={formData.company} onChange={handleChange} className="border p-2 w-full" required>
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Godown Dropdown */}
          <div>
            <label className="block mb-1">Godown*</label>
            <select name="godown" value={formData.godown} onChange={handleChange} className="border p-2 w-full" required>
              <option value="">Select Godown</option>
              {godowns.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Submit Button */}
        <button type="submit" className="btn bg-blue-600 text-white mt-4">Submit</button>
      </form>
    </div>
  );
};

export default AddEditPurchase;
