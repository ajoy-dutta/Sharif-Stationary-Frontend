import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AxiosInstance from "../../Components/AxiosInstance";

const EditPurchase = () => {
  const { purchaseId } = useParams(); // ✅ Get purchase ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null); // ✅ Store fetched purchase data
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch existing purchase data
        const purchaseRes = await AxiosInstance.get(`/purchases/${purchaseId}/`);
        setFormData(purchaseRes.data);

        // ✅ Fetch additional data
        const [companiesRes, productsRes] = await Promise.all([
          AxiosInstance.get("/companies/"),
          AxiosInstance.get("/products/"),
        ]);

        setCompanies(companiesRes.data);
        setProducts(productsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching purchase data:", error);
      }
    };
    fetchData();
  }, [purchaseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.put(`/purchases/${purchaseId}/`, formData);
      alert("Purchase updated successfully!");
      navigate("/purchase-list"); // ✅ Redirect after update
    } catch (error) {
      console.error("Error updating purchase:", error);
      alert("Failed to update purchase. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-6">
      <h2 className="text-xl font-bold mb-4">Edit Purchase</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-4">
          {/* Supplier Selection */}
          <div>
            <label className="block">Supplier</label>
            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.company_name}
                </option>
              ))}
            </select>
          </div>

          {/* Invoice No */}
          <div>
            <label className="block">Invoice No</label>
            <input
              type="text"
              name="invoice_challan_no"
              value={formData.invoice_challan_no}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Payment Type */}
          <div>
            <label className="block">Payment Type</label>
            <input
              type="text"
              name="payment_type"
              value={formData.payment_type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Items Table */}
        <h3 className="text-lg font-semibold mt-6">Edit Items</h3>
        <table className="w-full mt-4 border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => {
              const product = products.find((p) => p.id === item.product);
              return (
                <tr key={index}>
                  <td className="border p-2">{product?.product_name || "N/A"}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      name="total_sheet_or_piece"
                      value={item.total_sheet_or_piece}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full border p-2 rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      name="purchase_price"
                      value={item.purchase_price}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full border p-2 rounded"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Purchase
        </button>
      </form>
    </div>
  );
};

export default EditPurchase;
