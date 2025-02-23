import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      {/* Heading Above Navbar */}
      <div className="bg-gray-200 text-center py-3 -mt-2">
        <h1 className="text-3xl font-extrabold text-blue-600">
          Sharif Paper <span className="text-blue-600">& Stationery</span>
        </h1>
      </div>

      {/* Navbar */}
      <nav className="bg-white  h-2 p-2 mb-8">
        <div className="container mx-auto flex justify-between items-center">
     

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
                Wholesale
              </Link>
            </li>
            <li>
              <Link to="/salesNew" className="text-gray-800 hover:text-blue-500 font-medium px-3">
                RetailSale
              </Link>
            </li>
            <li>
              <Link to="/posting" className="text-gray-800 hover:text-blue-500 font-medium px-3">
                Posting
              </Link>
            </li>
            <li>
              <Link to="/report" className="text-gray-800 hover:text-blue-500 font-medium px-3">
                Report
              </Link>
            </li>
            <li>
              <Link to="/invoice" className="text-gray-800 hover:text-blue-500 font-medium px-3">
                Invoice
              </Link>
            </li>
            <li>
              <Link to="/stock" className="text-gray-800 hover:text-blue-500 font-medium px-3">
                Stock
              </Link>
            </li>
          </ul>

          {/* Authentication Buttons */}
          <div className="flex space-x-4">
            <Link to="/sign-in">
              <button className="text-white bg-blue-500 hover:bg-blue-600 font-medium px-4 py-2 rounded-md">
                SignIn
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
    </>
  );
};

export default Navbar;
