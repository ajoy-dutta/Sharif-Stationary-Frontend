import React, { useState, useEffect } from 'react';
import { FaBell, FaChartLine, FaBox } from 'react-icons/fa'; // React Icons for Notifications, Sales Chart, and Product
import { Line } from 'react-chartjs-2'; // Chart.js for the sales graph
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Simulating fetching data for the chart
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Sales',
        data: [12000, 15000, 13000, 18000, 22000, 21000, 25000],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  // Simulating recent activities data
  useEffect(() => {
    setRecentActivities([
      { id: 1, activity: 'New order received - Order #1023' },
      { id: 2, activity: 'Product stock updated - Stationary Items' },
      { id: 3, activity: 'New customer registered - customer@domain.com' },
    ]);
    setNotifications([
      { id: 1, message: 'You have 3 new orders pending' },
      { id: 2, message: 'A new product has been added to the inventory' },
    ]);
  }, []);

  return (
    <div className="container mx-auto p-6 mb-72">
      {/* Admin Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-lg text-gray-500">Welcome to your admin panel</p>
      </div>

      {/* Admin Info Section */}
      <div className="flex justify-center mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Admin Information</h3>
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              <strong>Name:</strong> Sharif Shop Keeper
            </p>
            <p className="text-lg text-gray-600">
              <strong>Email:</strong> admin@sharifshopkeeper.com
            </p>
          </div>
        </div>
      </div>

      {/* Shop Statistics Section */}
      <div className="flex justify-around mb-10">
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-lg shadow-md w-1/4">
          <h4 className="text-lg font-semibold text-gray-700">Total Sales</h4>
          <p className="text-xl font-bold text-green-600">৳ 50,000</p>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-lg shadow-md w-1/4">
          <h4 className="text-lg font-semibold text-gray-700">Total Products</h4>
          <p className="text-xl font-bold text-blue-600">120</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md w-1/4">
          <h4 className="text-lg font-semibold text-gray-700">Total Orders</h4>
          <p className="text-xl font-bold text-yellow-600">85</p>
        </div>
      </div>

      {/* Sales Data Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Sales Trend (Monthly)</h3>
        <Line data={salesData} />
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activities</h3>
        <ul className="space-y-3">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="text-gray-600">{activity.activity}</li>
          ))}
        </ul>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-700">Notifications</h3>
          <div className="text-blue-600 flex items-center cursor-pointer">
            <FaBell className="mr-2" /> View All
          </div>
        </div>
        <ul className="space-y-3 mt-4">
          {notifications.map((notification) => (
            <li key={notification.id} className="text-gray-600">{notification.message}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        <button className="px-6 py-3 bg-blue-950 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300 mb-4">
          Manage Products
        </button>
        <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-300">
          View Orders
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
