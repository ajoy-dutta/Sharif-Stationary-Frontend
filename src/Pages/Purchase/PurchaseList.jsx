import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import AxiosInstance from "../../components/AxiosInstance";
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
      <th className="border p-2">#</th>
      <th className="border p-2">SL No</th>
      <th className="border p-2">Receipt No</th>
      <th className="border p-2">Date</th>
      <th className="border p-2">Company Name</th>
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
    {filteredPurchases.map((purchase, index) => (
      <tr key={purchase.id} className="bg-gray-100 text-sm">
        <td className="border p-2 text-center">#</td>
        <td className="border p-2 text-center">{index + 1}</td>
        <td className="border p-2 text-center">{purchase.order_no || "N/A"}</td>
        <td className="border p-2 text-center">{purchase.order_date}</td>

        {/* Fetch Company Name */}
        <td className="border p-2 text-center">
          {companies.find((c) => c.id === purchase.company)?.name || "Unknown"}
        </td>

        {/* Fetch Product Name */}
        <td className="border p-2 text-center">
          {products.find((p) => p.id === purchase.items[0]?.product_id)?.name || "N/A"}
        </td>

        <td className="border p-2 text-center">{purchase.invoice_challan_amount}</td>
        <td className="border p-2 text-center">{purchase.previous_due}</td>
        <td className="border p-2 text-center">{purchase.today_paid_amount}</td>
        <td className="border p-2 text-center">{purchase.balance_amount}</td>

        <td className="border p-2 text-center">{purchase.payment_type}</td>
        <td className="border p-2 text-center">{purchase.bank_name || "N/A"}</td>
        <td className="border p-2 text-center">{purchase.cheque_no || "N/A"}</td>
        <td className="border p-2 text-center">{purchase.cheque_date || "N/A"}</td>

        {/* Edit Button - Fixed */}
        <td className="border p-2 text-center">
          <span className="text-blue-500 cursor-pointer">✏ Edit</span>
        </td>

        {/* Invoice Icon - Now Red */}
        <td className="border p-2 text-center">
          <span className="text-red-500 cursor-pointer">
            <IoMdPrint />
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>
    </div>
  );
};

export default PurchaseList;