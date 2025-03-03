import { NavLink } from "react-router-dom";
import { IoMdPersonAdd } from "react-icons/io";

const Navbar = () => {
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
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-800"
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/master"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-800"
                }
              >
                Master
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/purchase"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-800"
                }
              >
                Purchase
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/transfer"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-800"
                }
              >
                Transfer
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/production"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-800"
                }
              >
                Production
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sales"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-800"
                }
              >
                Wholesale
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/salesNew"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-800"
                }
              >
                RetailSale
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/report"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-800"
                }
              >
                Report
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/stock"
                className={({ isActive }) =>
                  isActive ? "text-blue-600 font-bold" : "text-gray-800"
                }
              >
                Stock
              </NavLink>
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
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold px-3"
                  : "text-gray-800 hover:text-blue-500 font-medium px-3"
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li tabIndex={0}>
            <details>
              <summary>Master</summary>
              <ul className="p-2">
                <li>
                  <NavLink
                    to="/products"
                    className={({ isActive }) =>
                      isActive ? "text-blue-600 font-bold" : "text-gray-800"
                    }
                  >
                    Products
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/company"
                    className={({ isActive }) =>
                      isActive ? "text-blue-600 font-bold" : "text-gray-800"
                    }
                  >
                    Company
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/payment-types"
                    className={({ isActive }) =>
                      isActive ? "text-blue-600 font-bold  text-nowrap" : "text-gray-800  text-nowrap"
                    }
                  >
                    Payment Types
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/warehouse"
                    className={({ isActive }) =>
                      isActive ? "text-blue-600 font-bold" : "text-gray-800"
                    }
                  >
                    Warehouse
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <NavLink
              to="/purchase"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold px-3"
                  : "text-gray-800 hover:text-blue-500 font-medium px-3"
              }
            >
              Purchase
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/transfer"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold px-3"
                  : "text-gray-800 hover:text-blue-500 font-medium px-3"
              }
            >
              Transfer
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/production"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold px-3"
                  : "text-gray-800 hover:text-blue-500 font-medium px-3"
              }
            >
              Production
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/sales"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold px-3"
                  : "text-gray-800 hover:text-blue-500 font-medium px-3"
              }
            >
              Wholesale
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/salesNew"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold px-3"
                  : "text-gray-800 hover:text-blue-500 font-medium px-3"
              }
            >
              RetailSale
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/report"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold px-3"
                  : "text-gray-800 hover:text-blue-500 font-medium px-3"
              }
            >
              Report
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/stock"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold px-3"
                  : "text-gray-800 hover:text-blue-500 font-medium px-3"
              }
            >
              Stock
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Sign-in Button */}
      <div className="navbar-end">
        <NavLink to="/sign-in">
          <button className="text-white bg-blue-500 hover:bg-blue-600 font-medium px-4 py-2 rounded-md">
            <IoMdPersonAdd />
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
