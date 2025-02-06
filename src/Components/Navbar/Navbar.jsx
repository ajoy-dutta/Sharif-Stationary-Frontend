import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-gray-800 text-2xl font-semibold">
          <h3 className="text-xl font-semibold mb-4">
            <span className="text-3xl text-red-600">Sharif Paper <br /> </span>
            <span className="text-3xl text-blue-500"> & Stationary</span>
          </h3>
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <Link to="/security" className="text-gray-800 hover:text-blue-500 font-medium px-3">
              Security
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="text-gray-800 hover:text-blue-500 font-medium px-3">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/master" className="text-gray-800 hover:text-blue-500 font-medium px-3">
              Master
            </Link>
          </li>
          <li>
            <Link to="/purchase" className="text-gray-800 hover:text-blue-500 font-medium px-3">
              Purchase
            </Link>
          </li>
          <li>
            <Link to="/transfer" className="text-gray-800 hover:text-blue-500 font-medium px-3">
              Transfer
            </Link>
          </li>
          <li>
            <Link to="/production" className="text-gray-800 hover:text-blue-500 font-medium px-3">
              Production
            </Link>
          </li>
          <li>
            <Link to="/sales" className="text-gray-800 hover:text-blue-500 font-medium px-3">
              Sales
            </Link>
          </li>
          <li>
            <Link to="/posting" className="text-gray-800 hover:text-blue-500 font-medium px-3">
              Posting
            </Link>
          </li>
          <li>
            <Link to="/account" className="text-gray-800 hover:text-blue-500 font-medium px-3">
              Account
            </Link>
          </li>
        </ul>

        {/* Authentication Buttons */}
        <div className="flex space-x-4">
          <Link to="/login">
            <button className="text-white bg-blue-500 hover:bg-blue-600 font-medium px-4 py-2 rounded-md">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white font-medium px-4 py-2 rounded-md">
              Signup
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
