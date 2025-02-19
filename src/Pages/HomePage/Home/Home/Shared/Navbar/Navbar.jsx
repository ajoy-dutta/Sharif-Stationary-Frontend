// import { useContext } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../../../../../providers/AuthProvider";
// import { FaShoppingCart } from "react-icons/fa";
// import useCart from "../../../../../hooks/useCart";
// import useAdmin from "../../../../../hooks/useAdmin";
// import useChef from "../../../../../hooks/useChef";


// const Navbar = () => {
//   const { user, logOut } = useContext(AuthContext);
//   const [isAdmin] = useAdmin();
//   const [isChef] = useChef();
//   const [cart] = useCart();

//   const handleLogOut = () => {
//     logOut()
//       .then(() => { })
//       .catch(error => console.log(error));
//   }

//   const navOptions = <>
//     <li><Link to="/">Home</Link></li>
//     <li><Link to="/menu">Our Menu</Link></li>
//     <li><Link to="/order/salad">Order Food</Link></li>
//     {/* <li><Link to="/secret">Secret</Link></li> */}

//     {
//       user && isAdmin && <li><Link to = "/dashboard/adminHome">Dashboard 
//       </Link></li>
//     }
//     {
//       user && !isAdmin && !isChef && <li><Link to = "/dashboard/userHome">Dashboard 
//       </Link></li>
//     }
//    {
//       user && isChef && <li><Link to = "/dashboard/chef-home">Dashboard 
//       </Link></li>
//     }

//     <li>
//       <Link to="/dashboard/cart">
//         <button className="btn">
//           <FaShoppingCart className="mr-2"></FaShoppingCart>
//           <div className="badge badge-secondary">+{cart.length}</div>
//         </button>
//       </Link>
//      </li>



//     {
//       user ? <>
//       {/* photo add korar logic */}
//       {/* <span>{user?.displayName}</span> */}
//         <button onClick={handleLogOut} className="btn btn-ghost">LogOut</button>
//       </> : <>
//         <li><Link to="/login">Login</Link></li>

//       </>
//     }
//   </>
//   return (
//     <div>
//       <div className="navbar fixed z-10 max-w-screen-xl bg-opacity-30 bg-black text-white">
//         <div className="navbar-start">
//           <div className="dropdown">
//             <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
//             </div>
//             <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black rounded-box w-52">
//               {navOptions}
//             </ul>
//           </div>
//           <a className="btn btn-ghost text-xl">Just Cafe Foodies</a>
//         </div>
//         <div className="navbar-center hidden lg:flex">
//           <ul className="menu menu-horizontal px-1">
//             {navOptions}
//           </ul>
//         </div>
//         <div className="navbar-end">
//           <a className="btn">Get Started</a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
import { Link, NavLink, Outlet } from "react-router-dom";
import { MdDashboard, MdOutlineShoppingCart, MdOutlineAccountTree } from 'react-icons/md';
import { FaBalanceScale, FaUserTie } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
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
          {/* <Outlet /> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
