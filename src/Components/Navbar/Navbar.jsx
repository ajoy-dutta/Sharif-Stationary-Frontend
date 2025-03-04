import { Link, NavLink } from "react-router-dom";
import { useUser } from "../../Provider/UserProvider";
import { IoPersonRemoveSharp } from "react-icons/io5"; // Ensure correct import

const Navbar = () => {
  const { user, signOut } = useUser(); // Get user context

  return (
    <div className="navbar sticky top-0 bg-base-100 shadow-md">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/master">Master</NavLink></li>
            <li><NavLink to="/purchase">Purchase</NavLink></li>
            <li><NavLink to="/transfer">Transfer</NavLink></li>
            <li><NavLink to="/production">Production</NavLink></li>
            <li><NavLink to="/sales">Wholesale</NavLink></li>
            <li><NavLink to="/salesNew">Retail Sale</NavLink></li>
            <li><NavLink to="/report">Report</NavLink></li>
            <li><NavLink to="/stock">Stock</NavLink></li>
            <li><NavLink to="/warehouse">Warehouse</NavLink></li>
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-xl">Sharif Paper & Stationery</a>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li>
            <details>
              <summary>Master</summary>
              <ul className="p-2">
                <li><NavLink to="/products">Products</NavLink></li>
                <li><NavLink to="/company">Company</NavLink></li>
                <li><NavLink to="/payment-types">Payment Types</NavLink></li>
                <li><NavLink to="/warehouse">Warehouse</NavLink></li>
              </ul>
            </details>
          </li>
          <li><NavLink to="/purchase">Purchase</NavLink></li>
          <li><NavLink to="/transfer">Transfer</NavLink></li>
          <li><NavLink to="/production">Production</NavLink></li>
          <li><NavLink to="/sales">Wholesale</NavLink></li>
          <li><NavLink to="/salesNew">Retail Sale</NavLink></li>
          <li><NavLink to="/report">Report</NavLink></li>
          <li><NavLink to="/stock">Stock</NavLink></li>
        </ul>
      </div>

      {/* Authentication Buttons */}
      <div className="flex space-x-4">
        {user ? (
          <button onClick={signOut} className="text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white font-medium px-4 py-2 rounded-md">
            Sign out
          </button>
        ) : (
          <Link to="/signup">
            <button className="text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white font-medium px-4 py-2 rounded-md">
              Sign in
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
