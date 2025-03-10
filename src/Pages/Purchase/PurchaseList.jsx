import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";
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
        const purchaseDate = new Date(purchase.date);
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
                {company.name}
              </option>
            ))}
          </select>
          <input type="date" className="input input-bordered join-item" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input type="date" className="input input-bordered join-item" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      <div className="overflow-x-auto p-6">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-950 text-white text-sm">
              <th className="border p-2">তথ্যাদি</th>
              <th className="border p-2">SL</th>
              <th className="border p-2">রিসিপ্ট নং</th>
              <th className="border p-2">তারিখ</th>
              <th className="border p-2">কোম্পানির নাম</th>
              <th className="border p-2">পণ্যের নাম</th>
              <th className="border p-2">মোট দাম</th>
              <th className="border p-2">খরচের তথ্যাদি</th>
              <th className="border p-2">Edit</th>
              <th className="border p-2">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.map((purchase, index) => (
              <tr key={purchase.id} className="bg-gray-100 text-sm">
                <td className="border p-2 text-center">#</td>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 text-center">{purchase.receipt_number}</td>
                <td className="border p-2 text-center">{purchase.date}</td>
                <td className="border p-2 text-center">{companies.find((c) => c.id === purchase.company)?.name || "Unknown"}</td>
                <td className="border p-2 text-center">{products.find((product) => product.id === purchase.product_id)?.name || "Unknown"}</td>
                <td className="border p-2 text-center">{purchase.total_amount}</td>
                <td className="border p-2 text-center">Details</td>
                <td className="border p-2 text-center">✏</td>
                <td className="border p-2 text-center text-red-500"><IoMdPrint /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseList;