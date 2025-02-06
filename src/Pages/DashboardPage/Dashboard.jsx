import { Link, NavLink, Outlet } from "react-router-dom";
import img from "../../assets/6.jpg"; 
import { MdOutlineShoppingCart, MdDashboard, MdOutlineAccountTree } from "react-icons/md";
import { FaBalanceScale, FaAngleUp, FaAngleDown } from "react-icons/fa";
import { IoReorderThreeOutline } from "react-icons/io5";
import { FaUserTie } from "react-icons/fa6";
import { useState } from "react";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [partyOpen, setPartyOpen] = useState(false);

  const toggleDropdown = (stateSetter) => {
    stateSetter(prevState => !prevState);
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main content area with sidebar */}
      <div className="drawer-content bg-gray-50 flex min-h-screen">
        
        {/* Sidebar */}
        <div className="drawer-side bg-white w-72">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="min-h-full space-y-6 py-6 px-4">
            <div className="flex items-center justify-between">
              <Link className="flex flex-col gap-2 items-start">
                <img className="h-12 w-20" src={img} alt="Logo" />
                <h3 className="font-semibold text-xl">শরীফ স্টেশনারি</h3>
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-2 p-3 bg-blue-950 text-white rounded-md"
                      : "flex items-center gap-2 p-3 hover:bg-blue-100 rounded-md"
                  }
                >
                  <MdDashboard className="text-white text-lg" />
                  Dashboard
                </NavLink>
              </li>

              {/* Master Dropdown */}
              <li>
                <div
                  onClick={() => toggleDropdown(setIsOpen)}
                  className="flex items-center justify-between gap-2 p-3 cursor-pointer hover:bg-blue-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <MdOutlineAccountTree className="text-lg" />
                    <span>মাস্টার</span>
                  </div>
                  {isOpen ? <FaAngleUp /> : <FaAngleDown />}
                </div>
                {isOpen && (
                  <ul className="pl-6 space-y-2">
                    <li><NavLink to="/dashboard/category" className={({ isActive }) => isActive ? "flex items-center gap-2 p-2 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-2 hover:bg-blue-100 rounded-md"}>ক্যাটাগরি</NavLink></li>
                    <li><NavLink to="/dashboard/supplier" className={({ isActive }) => isActive ? "flex items-center gap-2 p-2 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-2 hover:bg-blue-100 rounded-md"}>সরবরাহকারী</NavLink></li>
                    <li><NavLink to="/dashboard/product" className={({ isActive }) => isActive ? "flex items-center gap-2 p-2 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-2 hover:bg-blue-100 rounded-md"}>পণ্য</NavLink></li>
                  </ul>
                )}
              </li>

              {/* Party Dropdown */}
              <li>
                <div
                  onClick={() => toggleDropdown(setPartyOpen)}
                  className="flex items-center justify-between gap-2 p-3 cursor-pointer hover:bg-blue-100 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <MdOutlineAccountTree className="text-lg" />
                    <span>পার্টি সমূহ</span>
                  </div>
                  {partyOpen ? <FaAngleUp /> : <FaAngleDown />}
                </div>
                {partyOpen && (
                  <ul className="pl-6 space-y-2">
                    <li><NavLink to="/dashboard/customer" className={({ isActive }) => isActive ? "flex items-center gap-2 p-2 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-2 hover:bg-blue-100 rounded-md"}>গ্রাহক</NavLink></li>
                    <li><NavLink to="/dashboard/supplier" className={({ isActive }) => isActive ? "flex items-center gap-2 p-2 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-2 hover:bg-blue-100 rounded-md"}>সরবরাহকারী</NavLink></li>
                  </ul>
                )}
              </li>

              {/* Employee Section */}
              <li>
                <NavLink
                  to="/dashboard/employee"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-2 p-3 bg-blue-950 text-white rounded-md"
                      : "flex items-center gap-2 p-3 hover:bg-blue-100 rounded-md"
                  }
                >
                  <FaUserTie className="text-lg" />
                  কর্মরত ব্যাক্তি
                </NavLink>
              </li>
            </div>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-50 p-6">
          <div className="navbar bg-blue-950 p-4 flex items-center justify-between">
            <label htmlFor="my-drawer-2" className="drawer-button lg:hidden text-white text-2xl cursor-pointer">
              <IoReorderThreeOutline />
            </label>

            <div className="flex gap-4">
              <a className="btn btn-ghost text-white text-lg flex items-center gap-2">
                <MdOutlineShoppingCart className="text-2xl" />
                ক্রয়
              </a>
              <a className="btn btn-ghost text-white text-lg flex items-center gap-2">
                <FaBalanceScale className="text-2xl" />
                বিক্রয়
              </a>
            </div>
          </div>

          {/* Outlet for nested routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
