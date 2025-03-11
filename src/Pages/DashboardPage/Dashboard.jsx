import React, { useState, useEffect } from "react";
import { FaCubes, FaUserAlt, FaHome, FaBuilding } from "react-icons/fa";
import AxiosInstance from "../../Components/AxiosInstance"; // Import Axios instance

// ✅ Reusable Stat Card Component
const StatCard = ({ icon, title, value, progressValue, progressColor }) => {
  return (
    <div className="h-28 bg-white py-4 px-5 rounded-lg shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-700 flex flex-col text-xl">
          {icon}
          <span className="text-md">{title}</span>
        </h2>
        <h2 className={`text-3xl ${progressColor}`}>{value}</h2>
      </div>
      <progress className={`progress ${progressColor} w-full`} value={progressValue} max="100"></progress>
    </div>
  );
};

const Dashboard = () => {
  // 🟢 State variables
  const [products, setProducts] = useState(0); // Total Products
  const [customers, setCustomers] = useState(0); // Total Customers
  const [companies, setCompanies] = useState(0); // Total Companies (Suppliers)
  const [customerDue, setCustomerDue] = useState(0); // Customer Due Amount
  const [companyDue, setCompanyDue] = useState(0); // Supplier Due Amount
  const [loading, setLoading] = useState(true); // Loader state

  // 🟢 Fetch Data from API when Component Mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true); // Start loading

        // ✅ Fetch total products count
        const productResponse = await AxiosInstance.get("/products/");
        setProducts(productResponse.data.length);

        // ✅ Fetch total customers count and calculate due
        const customerResponse = await AxiosInstance.get("/customers/");
        setCustomers(customerResponse.data.length);

        // 🔹 Calculate **total customer due** by summing up all `due_amount`
        const totalCustomerDue = customerResponse.data.reduce(
          (sum, customer) => sum + parseFloat(customer.due_amount || 0),
          0
        );
        setCustomerDue(totalCustomerDue);

        // ✅ Fetch total companies (suppliers) count and calculate due
        const companyResponse = await AxiosInstance.get("/companies/");
        setCompanies(companyResponse.data.length);

        // 🔹 Calculate **total company due** by summing up all `due_amount`
        const totalCompanyDue = companyResponse.data.reduce(
          (sum, company) => sum + parseFloat(company.due_amount || 0),
          0
        );
        setCompanyDue(totalCompanyDue);

      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchDashboardData();
  }, []);

  // ✅ Calculate Total Due (Customer Due + Company Due)
  const totalDue = customerDue + companyDue;

  // 🟢 Dynamic Stats Data
  const stats = [
    { icon: <FaCubes />, title: "Total Products", value: products, progress: 70, color: "progress-error text-pink-400" },
    { icon: <FaUserAlt />, title: "Total Customers", value: customers, progress: 40, color: "progress-success text-green-500" },
    { icon: <FaBuilding />, title: "Total Companies (Suppliers)", value: companies, progress: 50, color: "progress-warning text-yellow-500" },
    { icon: <FaHome />, title: "Total Due Amount", value: `৳ ${totalDue.toLocaleString()}`, progress: 70, color: "progress-primary text-purple-500" },
  ];

  return (
    <div className="px-5 py-3">
      {/* ✅ Show Loader if Loading */}
      {loading ? (
        <div className="text-center text-lg text-gray-500">Loading Dashboard Data...</div>
      ) : (
        <>
          {/* ✅ Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                progressValue={stat.progress}
                progressColor={stat.color}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
