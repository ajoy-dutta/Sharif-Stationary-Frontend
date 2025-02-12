import { createBrowserRouter } from "react-router-dom";

import Main from "../Layout/Main";

import Product from "../Pages/Product/Product.jsx";
import Home from "../Pages/HomePage/Home/Home/Home.jsx";
import SignUp from "../SignUp.jsx";
import Security from "../Pages/Security/Security.jsx";
import Dashboard from "../Pages/DashboardPage/Dashboard.jsx";
import Master from "../Pages/Master/Master.jsx";

import Transfer from "../Pages/Transfer/Transfer.jsx";
import Production from "../Pages/Production/Production.jsx";
import Sales from "../Pages/Sales/Sales.jsx";
import Posting from "../Pages/Posting/Posting.jsx";
import Account from "../Pages/Account/Account.jsx";
import PurchaseReceiveForm from "../Pages/Purchase/PurchaseReceiveForm.jsx";
import ShopkeeperProfile from "../ShopKeeper/ShopKeeperProfile.jsx";
import UserProfile from "../Users/UserProfile.jsx";
import AdminDashboard from "../Admin/AdminDashord/AdminDashboard.jsx";
import SalesNew from "../Pages/Sales/SalesNew.jsx";
import SignIn from "../SignIn.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/security",
        element: <Security></Security>,
      },
      {
        path: "/dashboard",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/master",
        element: <Master></Master>,
      },
      {
        path: "/purchase",
        element: <PurchaseReceiveForm></PurchaseReceiveForm>,
      },
      {
        path: "/transfer",
        element: <Transfer></Transfer>,
      },
      {
        path: "/production",
        element: <Production></Production>,
      },
      {
        path: "/sales",
        element: <Sales></Sales>,
      },
      {
        path: "/salesNew",
        element: <SalesNew></SalesNew>,
      },
      {
        path: "/posting",
        element: <Posting></Posting>,
      },

      {
        path: "/account",
        element: <Account></Account>,
      },
      {
        path: "/product",
        element: <Product></Product>,
      },
      {
        path: "/shop-keeper",
        element: <ShopkeeperProfile></ShopkeeperProfile>,
      },
      {
        path: "/user-profile",
        element: <UserProfile></UserProfile>,
      },
      {
        path: "/admin",
        element:<AdminDashboard></AdminDashboard>,
      },
    
      {
        path: "/sign-in",
        element: <SignIn></SignIn>,
      },
      {
        path: "/signup",
        element: <SignUp></SignUp>,
      },
    ],
  },
]);
