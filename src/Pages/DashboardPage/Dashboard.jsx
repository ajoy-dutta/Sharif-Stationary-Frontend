import React, { useState, useEffect } from "react";
import { FaCubes, FaUsers, FaUserAlt, FaHome, FaLongArrowAltUp } from "react-icons/fa";
import AxiosInstance from "../../Components/AxiosInstance"; // Import Axios instance

// Reusable Stat Card Component
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
  // State variables to store fetched data
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalDueAmount, setTotalDueAmount] = useState(0);

  // Fetch Data from API when Component Mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total products
        const productResponse = await AxiosInstance.get("/products/count/");
        setTotalProducts(productResponse.data.total_products);
  
        // Fetch total suppliers
        // const supplierResponse = await AxiosInstance.get("/suppliers/count/");
        // setTotalSuppliers(supplierResponse.data.total_suppliers);
  
        // Fetch total customers
        const customerResponse = await AxiosInstance.get("/customers/count/");
        console.log("API Response (Customers):", customerResponse.data); // ✅ Debugging log
        setTotalCustomers(customerResponse.data.total_customers);
  
        // Fetch total due amount from customers
        const dueResponse = await AxiosInstance.get("/customers/total-due/");
        setTotalDueAmount(dueResponse.data.total_due);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
  
    fetchDashboardData();
  }, []);
  

  // Dynamic Stats Data
  const stats = [
    { icon: <FaCubes />, title: "Total Products", value: totalProducts, progress: 70, color: "progress-error text-pink-400" },
    // { icon: <FaUsers />, title: "Total Suppliers", value: totalSuppliers, progress: 65, color: "progress-info text-sky-500" },
    { icon: <FaUserAlt />, title: "Total Customers", value: totalCustomers, progress: 40, color: "progress-success text-green-500" },
    { icon: <FaHome />, title: "Total Due Amount", value: `৳ ${totalDueAmount}`, progress: 70, color: "progress-primary text-purple-500" },
  ];

  return (
    <div className="px-5 py-3">
      {/* Stats Grid */}
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

      {/* Info & Summary Section */}
      <div className="py-6 flex flex-col gap-5 lg:flex-row">
        {/* Info Section */}
        <div className="w-full lg:w-1/2 flex">
          <div className="w-1/3 h-80 bg-sky-400"></div>
          <div className="w-2/3 bg-white py-8 px-4 flex flex-col gap-12 shadow-md">
            <div>
              <h2 className="border-b-2 pb-2 font-semibold">Information</h2>
              <div className="pt-3 flex justify-between">
                <div className="flex flex-col">
                  <h2 className="text-sm text-gray-600">Email</h2>
                  <h3 className="font-medium">admin@gmail.com</h3>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm text-gray-600">Phone</h3>
                  <h3 className="font-medium">01793250485</h3>
                </div>
              </div>
            </div>
            <div>
              <h2 className="border-b-2 pb-2 font-semibold">Address</h2>
              <div className="flex justify-between pt-3">
                <h2>Village Name</h2>
                <h2>Municipality Name</h2>
              </div>
              <div className="flex justify-between">
                <h2>Post Office</h2>
                <h2>Post Code</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 gap-5">
          {[
            { color: "bg-green-400", title: "Daily Total Purchase", value: 27 },
            { color: "bg-sky-400", title: "Daily Total Sales", value: 126 },
            { color: "bg-red-400", title: "Daily Total Due", value: `৳ ${totalDueAmount}` },
            { color: "bg-orange-400", title: "Pending Payments", value: 121 },
          ].map((card, index) => (
            <div
              key={index}
              className={`${card.color} h-40 flex flex-col justify-center items-center rounded-lg shadow-md`}
            >
              <h2 className="text-2xl text-white">{card.title}</h2>
              <h2 className="flex text-white items-center">
                <FaLongArrowAltUp /> Count
              </h2>
              <h2 className="text-white text-lg">{card.value}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
