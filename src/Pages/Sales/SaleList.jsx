import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../../Components/AxiosInstance";
import { IoMdPrint } from "react-icons/io";
import { FaPlus } from "react-icons/fa";

const SaleList = () => {
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  // Fetch Companies
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

  // Fetch Products
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

  // Fetch Sales
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await AxiosInstance.get("/sales/");
        setSales(response.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };
    fetchSales();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let filtered = [...sales];
    if (selectedCompany) {
      filtered = filtered.filter((sale) => sale.customer === Number(selectedCompany));
    }
    if (fromDate || toDate) {
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.cheque_date); // Ensure it's a Date object
        const startDate = fromDate ? new Date(fromDate) : null;
        const endDate = toDate ? new Date(toDate) : null;

        return (
          (!startDate || saleDate >= startDate) &&
          (!endDate || saleDate <= endDate)
        );
      });
    }
    setFilteredSales(filtered);
  }, [selectedCompany, fromDate, toDate, sales]);

  return (
    <div className="mt-8 mx-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Sales List</h2>
        <Link to="/add-sale" className="btn bg-blue-950 text-white">
          <FaPlus className="mr-1" /> Add Sale
        </Link>
      </div>

      {/* Filters */}
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
            <option value="">Select Customer</option>
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

      {/* Table */}
      <div className="overflow-x-auto p-6">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-950 text-white text-sm">
              <th className="border p-2">#</th>
              <th className="border p-2">SL No</th>
              <th className="border p-2">Reference</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Previous Due</th>
              <th className="border p-2">Paid Amount</th>
              <th className="border p-2">Balance</th>
              <th className="border p-2">Payment Type</th>
              <th className="border p-2">Bank Name</th>
              <th className="border p-2">Cheque No</th>
              <th className="border p-2">Cheque Date</th>
              <th className="border p-2">Edit</th>
              <th className="border p-2">Invoice</th>
            </tr>
          </thead>

          <tbody>
            {filteredSales.map((sale, index) => (
              <tr key={sale.id} className="bg-gray-100 text-sm">
                <td className="border p-2 text-center">#</td>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 text-center">{sale.reference || "N/A"}</td>
                <td className="border p-2 text-center">{sale.cheque_date || "N/A"}</td>

                {/* Fetch Customer Name */}
                <td className="border p-2 text-center">
                  {companies.find((c) => c.id === sale.customer)?.company_name || "Unknown"}
                </td>

                {/* Fetch Product Name from sale_items */}
                <td className="border p-2 text-center">
                  {sale.sale_items.length > 0
                    ? sale.sale_items.map((item) =>
                        products.find((p) => p.id === item.product_id)?.name || "N/A"
                      ).join(", ")
                    : "N/A"}
                </td>

                <td className="border p-2 text-center">{sale.invoice_total_amount}</td>
                <td className="border p-2 text-center">{sale.previous_due}</td>
                <td className="border p-2 text-center">{sale.today_paid_amount}</td>
                <td className="border p-2 text-center">{sale.balance_amount}</td>

                <td className="border p-2 text-center">{sale.payment_type}</td>
                <td className="border p-2 text-center">{sale.bank_name || "N/A"}</td>
                <td className="border p-2 text-center">{sale.cheque_no || "N/A"}</td>
                <td className="border p-2 text-center">{sale.cheque_date || "N/A"}</td>

                {/* Edit Button */}
                <td className="border p-2 text-center text-blue-500 cursor-pointer">
                  ✏ Edit
                </td>

                {/* Invoice Icon */}
                <td className="border p-2 text-center text-red-500 cursor-pointer">
                  <IoMdPrint />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaleList;
