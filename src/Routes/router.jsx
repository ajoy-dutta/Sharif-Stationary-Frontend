import { createBrowserRouter } from "react-router-dom";

import Main from "../Layout/Main";

import Product from "../Pages/Product/Product.jsx";
import Home from "../Pages/HomePage/Home/Home/Home.jsx";
import SignUp from "../SignUp.jsx";
import Security from "../Pages/Security/Security.jsx";

import Master from "../Pages/Master/Master.jsx";

import Transfer from "../Pages/Transfer/Transfer.jsx";
import Production from "../Pages/Production/Production.jsx";
import Sales from "../Pages/Sales/Sales.jsx";
import Posting from "../Pages/Posting/Posting.jsx";
import PurchaseReceiveForm from "../Pages/Purchase/PurchaseReceiveForm.jsx";
import ShopkeeperProfile from "../ShopKeeper/ShopKeeperProfile.jsx";
import UserProfile from "../Users/UserProfile.jsx";
import AdminDashboard from "../Admin/AdminDashord/AdminDashboard.jsx";
import SalesNew from "../Pages/Sales/SalesNew.jsx";
import SignIn from "../SignIn.jsx";
import ForgotPassword from "../Authentication/ForgotPassword.jsx";
import Stock from "../Pages/Stock/Stock.jsx";
import Bill from "../Pages/Bill/Bill.jsx";
import Report from "../Pages/Report/Report.jsx";
import Invoice from "../Pages/Invoice/Invoice.jsx";
import Godown from "../Pages/Master/Godown.jsx";

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
        path: "/master",
        element: <Master></Master>,
      },
      {
        path: "/godown",
        element: <Godown></Godown>,
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
        path: "/forgot-password",
        element: <ForgotPassword></ForgotPassword>,
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
        path: "/bill",
        element: <Bill></Bill>,
      },
      {
        path: "/posting",
        element: <Posting></Posting>,
      },

      {
        path: "/report",
        element: <Report></Report>,
      },
      {
        path: "/invoice",
        element: <Invoice></Invoice>,
      },
      
      {
        path: "/stock",
        element: <Stock></Stock>
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
