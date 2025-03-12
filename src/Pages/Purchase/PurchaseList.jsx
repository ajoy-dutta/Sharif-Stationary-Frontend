import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../../Components/AxiosInstance";
import { IoMdPrint } from "react-icons/io";
import { FaPlus } from "react-icons/fa";

const PurchaseList = () => {
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [expandedRow, setExpandedRow] = useState(null); // Track expanded row

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await AxiosInstance.get("/companies/");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AxiosInstance.get("/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await AxiosInstance.get("/purchases/");
        setPurchases(response.data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };
    fetchPurchases();
  }, []);

  useEffect(() => {
    let filtered = [...purchases];
    if (selectedCompany) {
      filtered = filtered.filter((purchase) => purchase.company === Number(selectedCompany));
    }
    if (fromDate || toDate) {
      filtered = filtered.filter((purchase) => {
        const purchaseDate = new Date(purchase.order_date);
        const startDate = fromDate ? new Date(fromDate) : null;
        const endDate = toDate ? new Date(toDate) : null;

        return (
          (!startDate || purchaseDate >= startDate) &&
          (!endDate || purchaseDate <= endDate)
        );
      });
    }
    setFilteredPurchases(filtered);
  }, [selectedCompany, fromDate, toDate, purchases]);

  return (
    <div className="mt-8 mx-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">পণ্য ক্রয় তালিকা</h2>
        <Link to="/add-purchase" className="btn bg-blue-950 text-white">
          Add Purchase
        </Link>
      </div>

      <div className="flex justify-between mb-4">
        <div className="join">
          <div className="btn bg-blue-950 rounded-l-md rounded-r-none text-white">
            Search Here
          </div>
          <select
            className="select select-bordered join-item"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Select Company</option>
            {companies?.map((company) => (
              <option key={company.id} value={company.id}>
                {company.company_name}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="input input-bordered join-item"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="input input-bordered join-item"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto p-6">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-950 text-white text-sm">
              <th className="border p-2">#</th>
              <th className="border p-2">SL No</th>
              <th className="border p-2">Receipt No</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Company Name</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Total Items</th>
              <th className="border p-2">Item Details</th>
              <th className="border p-2">Edit</th>
              <th className="border p-2">Invoice</th>
            </tr>
          </thead>

          <tbody>
            {filteredPurchases.map((purchase, index) => (
              <React.Fragment key={purchase.id}>
                <tr className="bg-gray-100 text-sm">
                  <td className="border p-2 text-center">#</td>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 text-center">{purchase.order_no || "N/A"}</td>
                  <td className="border p-2 text-center">{purchase.order_date}</td>
                  <td className="border p-2 text-center">
                    {companies.find((c) => c.id === purchase.company)?.company_name || "Unknown"}
                  </td>
                  <td className="border p-2 text-center">{purchase.invoice_challan_amount}</td>
                  <td className="border p-2 text-center">{purchase.items.length}</td>
                  <td className="border p-2 text-center">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                    >
                      {expandedRow === index ? "Hide Details" : "View Details"}
                    </button>
                  </td>
                  <td className="border p-2 text-center">
                    <span className="text-blue-500 cursor-pointer">✏ Edit</span>
                  </td>
                  <td className="border p-2 text-center">
                    <span className="text-red-500 cursor-pointer">
                      <IoMdPrint />
                    </span>
                  </td>
                </tr>

                {/* Expandable Item Details */}
                {expandedRow === index && (
                  <tr className="bg-gray-200">
                    <td colSpan="10" className="border p-4">
                      <table className="table-auto w-full border-collapse border border-gray-400">
                        <thead>
                          <tr className="bg-gray-300">
                            <th className="border p-2">Product</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Unit Price</th>
                            <th className="border p-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchase.items.map((item, i) => (
                            <tr key={i}>
                              <td className="border p-2">{products.find((p) => p.id === item.product)?.name || "N/A"}</td>
                              <td className="border p-2">{item.quantity}</td>
                              <td className="border p-2">{item.unit_price}</td>
                              <td className="border p-2">{item.total_price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseList;
