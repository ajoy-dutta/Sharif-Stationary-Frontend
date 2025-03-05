import { Link, NavLink } from "react-router-dom";
import { useUser } from "../../Provider/UserProvider";
import { IoPersonAdd, IoPersonRemoveSharp } from "react-icons/io5"; // Ensure correct import
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const { user, signOut } = useUser(); // Get user context
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown when clicking on the "Master" button
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar sticky top-0 bg-base-100 shadow-md  z-50">
      <div className="navbar-start">
        {/* Mobile Dropdown Menu */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/master">Master</NavLink>
            </li>
            <li>
              <NavLink to="/purchase">Purchase</NavLink>
            </li>
            <li>
              <NavLink to="/transfer">Transfer</NavLink>
            </li>
            <li>
              <NavLink to="/production">Production</NavLink>
            </li>
            <li>
              <NavLink to="/sales">Sale</NavLink>
            </li>
            <li>
              <NavLink to="/salesNew">Retail</NavLink>
            </li>
            <li>
              <NavLink to="/report">Report</NavLink>
            </li>
            <li>
              <NavLink to="/stock">Stock</NavLink>
            </li>
            <li>
              <NavLink to="/warehouse">Warehouse</NavLink>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-xl">
          Sharif Paper & Stationery
        </a>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li ref={dropdownRef} className="relative">
            <button onClick={toggleDropdown} className="px-4 py-2">
              Master
            </button>

            {isOpen && (
              <ul className="absolute top-10 left-0 mt-2 bg-white shadow-lg rounded p-2 w-48 z-50">
                <li>
                  <NavLink to="/products" onClick={() => setIsOpen(false)}>
                    Products
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/company" onClick={() => setIsOpen(false)}>
                    Company
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/payment-types" onClick={() => setIsOpen(false)}>
                    Payment Types
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/warehouse" onClick={() => setIsOpen(false)}>
                    Warehouse
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="/purchase">Purchase</NavLink>
          </li>
          <li>
            <NavLink to="/transfer">Transfer</NavLink>
          </li>
          <li>
            <NavLink to="/production">Production</NavLink>
          </li>
          <li>
            <NavLink to="/sales">Wholesale</NavLink>
          </li>
          <li>
            <NavLink to="/salesNew">Retail Sale</NavLink>
          </li>
          <li>
            <NavLink to="/report">Report</NavLink>
          </li>
          <li>
            <NavLink to="/stock">Stock</NavLink>
          </li>
        </ul>
      </div>

      {/* Authentication Buttons */}
      <div className="flex space-x-4">
        {user ? (
          <button
            onClick={signOut}
            className="w-10 text-black  hover:bg-black hover:text-white font-medium p-2 "
          >
            <IoPersonRemoveSharp />
          </button>
        ) : (
          <Link to="/signup">
            <button className="w-10 text-center p-2 text-black   hover:bg-black hover:text-white font-medium ">
              <IoPersonAdd />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
