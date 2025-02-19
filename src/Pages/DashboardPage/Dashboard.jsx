// import { Link, NavLink, Outlet } from "react-router-dom";
// import { MdDashboard, MdOutlineShoppingCart, MdOutlineAccountTree } from 'react-icons/md';
// import { FaBalanceScale, FaUserTie } from 'react-icons/fa';
// import { useState } from 'react';

// const Dashboard = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = (stateSetter) => {
//     stateSetter((prevState) => !prevState);
//   };

//   return (
//     <div className="drawer lg:drawer-open">
//       <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
//       <div className="drawer-content bg-gray-50 flex min-h-screen">
//         {/* Sidebar */}
//         <div className="drawer-side bg-white w-72">
//           <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
//           <ul className="min-h-full space-y-6 py-6 px-4">
//             <div className="flex items-center justify-between">
//               <Link className="flex flex-col gap-2 items-start">
//                 <h3 className="font-semibold text-xl">Sharif Paper & Stationary</h3>
//               </Link>
//             </div>

//             <div className="mt-6 space-y-4">
//               <li>
//                 <NavLink
//                   to="/dashboard"
//                   className={({ isActive }) =>
//                     isActive ? "flex items-center gap-2 p-3 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-3 hover:bg-blue-100 rounded-md"
//                   }
//                 >
//                   <MdDashboard className="text-white text-lg" />
//                   Dashboard
//                 </NavLink>
//               </li>

//               {/* Inventory Management */}
//               <li>
//                 <NavLink
//                   to="/dashboard/products"
//                   className={({ isActive }) =>
//                     isActive ? "flex items-center gap-2 p-3 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-3 hover:bg-blue-100 rounded-md"
//                   }
//                 >
//                   <MdOutlineAccountTree className="text-lg" />
//                   Product Management
//                 </NavLink>
//               </li>

//               {/* Sales */}
//               <li>
//                 <NavLink
//                   to="/dashboard/sales"
//                   className={({ isActive }) =>
//                     isActive ? "flex items-center gap-2 p-3 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-3 hover:bg-blue-100 rounded-md"
//                   }
//                 >
//                   <MdOutlineShoppingCart className="text-lg" />
//                   Wholesales
//                 </NavLink>
//               </li>

//               {/* Customers */}
//               <li>
//                 <NavLink
//                   to="/dashboard/customers"
//                   className={({ isActive }) =>
//                     isActive ? "flex items-center gap-2 p-3 bg-blue-950 text-white rounded-md" : "flex items-center gap-2 p-3 hover:bg-blue-100 rounded-md"
//                   }
//                 >
//                   <FaUserTie className="text-lg" />
//                   Customers
//                 </NavLink>
//               </li>
//             </div>
//           </ul>
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 bg-gray-50 p-6">
//           <div className="navbar bg-blue-950 p-4 flex items-center justify-between">
//             <label htmlFor="my-drawer-2" className="drawer-button lg:hidden text-white text-2xl cursor-pointer">
//               ☰
//             </label>

//             <div className="flex gap-4">
//               <a className="btn btn-ghost text-white text-lg flex items-center gap-2">
//                 <MdOutlineShoppingCart className="text-2xl" />
//                 Purchases
//               </a>
//               <a className="btn btn-ghost text-white text-lg flex items-center gap-2">
//                 <FaBalanceScale className="text-2xl" />
//                 Sales
//               </a>
//             </div>
//           </div>

//           {/* Outlet for nested routes */}
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }


//   export default Dashboard;
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      {/* Heading Above Navbar */}
      <div className="bg-gray-200 text-center py-3">
        <h1 className="text-4xl font-extrabold text-red-600">
          Sharif Paper <span className="text-red-600">& Stationery</span>
        </h1>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
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
                Wholesales
              </Link>
            </li>
            <li>
              <Link to="/salesNew" className="text-gray-800 hover:text-blue-500 font-medium px-3">
                SalesNew
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

export default Dashboard;

