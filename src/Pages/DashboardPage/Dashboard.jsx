import { Link, NavLink, Outlet } from "react-router-dom";
import { MdDashboard, MdOutlineShoppingCart, MdOutlineAccountTree } from 'react-icons/md';
import { FaBalanceScale, FaUserTie } from 'react-icons/fa';
import { useState } from 'react';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (stateSetter) => {
    stateSetter((prevState) => !prevState);
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-gray-50 flex min-h-screen">
        {/* Sidebar */}
        <div className="drawer-side bg-white w-72">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="min-h-full space-y-6 py-6 px-4">
            <div className="flex items-center justify-between">
              <Link className="flex flex-col gap-2 items-start">
                <h3 className="font-semibold text-xl">Sharif Paper & Stationary</h3>
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? "flex items-center gap-2 p-3 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-3 hover:bg-blue-100 rounded-md"
                  }
                >
                  <MdDashboard className="text-white text-lg" />
                  Dashboard
                </NavLink>
              </li>

              {/* Inventory Management */}
              <li>
                <NavLink
                  to="/dashboard/products"
                  className={({ isActive }) =>
                    isActive ? "flex items-center gap-2 p-3 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-3 hover:bg-blue-100 rounded-md"
                  }
                >
                  <MdOutlineAccountTree className="text-lg" />
                  Product Management
                </NavLink>
              </li>

              {/* Sales */}
              <li>
                <NavLink
                  to="/dashboard/sales"
                  className={({ isActive }) =>
                    isActive ? "flex items-center gap-2 p-3 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-3 hover:bg-blue-100 rounded-md"
                  }
                >
                  <MdOutlineShoppingCart className="text-lg" />
                  Wholesales
                </NavLink>
              </li>

              {/* Customers */}
              <li>
                <NavLink
                  to="/dashboard/customers"
                  className={({ isActive }) =>
                    isActive ? "flex items-center gap-2 p-3 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-3 hover:bg-blue-100 rounded-md"
                  }
                >
                  <FaUserTie className="text-lg" />
                  Customers
                </NavLink>
              </li>
            </div>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-50 p-6">
          <div className="navbar bg-blue-950 p-4 flex items-center justify-between">
            <label htmlFor="my-drawer-2" className="drawer-button lg:hidden text-white text-2xl cursor-pointer">
              ☰
            </label>

            <div className="flex gap-4">
              <a className="btn btn-ghost text-white text-lg flex items-center gap-2">
                <MdOutlineShoppingCart className="text-2xl" />
                Purchases
              </a>
              <a className="btn btn-ghost text-white text-lg flex items-center gap-2">
                <FaBalanceScale className="text-2xl" />
                Sales
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
