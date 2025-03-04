import React from "react";
import {
  FaCubes,
  FaUsers,
  FaUserAlt,
  FaHome,
  FaLongArrowAltUp,
} from "react-icons/fa";

// Reusable Card Component
const StatCard = ({ icon, title, value, progressValue, progressColor }) => {
  return (
    <div className="h-28 bg-white py-4 px-5 rounded-lg shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-700 flex flex-col text-2xl">
          {icon}
          <span className="text-lg">{title}</span>
        </h2>
        <h2 className={`text-3xl ${progressColor}`}>{value}</h2>
      </div>
      <progress
        className={`progress ${progressColor} w-full`}
        value={progressValue}
        max="100"
      ></progress>
    </div>
  );
};

const Dashboard = () => {
  const stats = [
    { icon: <FaCubes />, title: "Total Product", value: 1, progress: 70, color: "progress-error text-pink-400" },
    { icon: <FaUsers />, title: "Total Suppliers", value: 1, progress: 65, color: "progress-info text-sky-500" },
    { icon: <FaUserAlt />, title: "Total Customers", value: 100, progress: 40, color: "progress-success text-green-500" },
    { icon: <FaHome />, title: "Total Houses", value: 130, progress: 70, color: "progress-primary text-purple-500" },
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

      {/* Info & Summary */}
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
            { color: "bg-sky-400", title: "Daily Total Purchase", value: 27 },
            { color: "bg-red-400", title: "Daily Total Sale", value: 126 },
            { color: "bg-orange-400", title: "Daily Total Due", value: 121 },
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
