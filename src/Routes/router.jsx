import { createBrowserRouter } from "react-router-dom";

import Main from "../Layout/Main";

import Product from "../Pages/Product/Product.jsx";
import Home from "../Pages/HomePage/Home/Home/Home.jsx";
import SignUp from "../../src/Authentication/SignUp.jsx";
import Security from "../Pages/Security/Security.jsx";

import Master from "../Pages/Master/Company.jsx";

import Transfer from "../Pages/Transfer/Transfer.jsx";
import Production from "../Pages/Production/Production.jsx";
import Sales from "../Pages/Sales/Sales.jsx";
import Posting from "../Pages/Posting/Posting.jsx";
import PurchaseReceiveForm from "../Pages/Purchase/PurchaseReceiveForm.jsx";
import ShopkeeperProfile from "../ShopKeeper/ShopKeeperProfile.jsx";
import UserProfile from "../Users/UserProfile.jsx";
import AdminDashboard from "../Admin/AdminDashord/AdminDashboard.jsx";
import SalesNew from "../Pages/Sales/SalesNew.jsx";
import ForgotPassword from "../Authentication/ForgotPassword.jsx";
import Stock from "../Pages/Stock/Stock.jsx";
import Bill from "../Pages/Bill/Bill.jsx";
import Report from "../Pages/Report/Report.jsx";
import Invoice from "../Pages/Invoice/Invoice.jsx";
import Products from "../Pages/Master/Products.jsx";
import Warehouse from "../Pages/Master/Warehouse.jsx";
import PaymentType from "../Pages/Master/PaymentType.jsx";
import Company from "../Pages/Master/Company.jsx";
import ProtectedRoute from "../Provider/ProtectedRoute.jsx"
import Customer from "../Pages/Master/Customer.jsx";
import Dashboard from "../Pages/DashboardPage/Dashboard.jsx"
import CompanyProducts from "../Pages/Master/CompanyProducts.jsx";
import PurchaseList from "../Pages/Purchase/PurchaseList.jsx";
import AddEditPurchase from "../Pages/Purchase/AddEditPurchase.jsx";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <SignUp />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute> 
        <Main /> {/* Ensure a Layout Component like Main is wrapped */}
      </ProtectedRoute>
    ),
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
        path: "/company",
        element: <Company></Company>,
      },

      {
        path:"/company/:companyId",
        element: <CompanyProducts></CompanyProducts>,
      },
      
      {
        path: "/dashboard",
        element: <Dashboard></Dashboard>,
      },

   
      {
        path: "/purchase",
        element: <PurchaseReceiveForm></PurchaseReceiveForm>,
      },
      {
        path: "/purchase-list",
        element: <PurchaseList></PurchaseList>,
      },
      {
        path: "/add-purchase",
        element: <AddEditPurchase></AddEditPurchase>,
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
        path: "/products",
        element: <Products></Products>,
      },
      {
        path: "/warehouse",
        element:<Warehouse></Warehouse>,
      },
      {
        path: "/customer",
        element:<Customer></Customer>,
      },

      {
        path: "/payment-types",
        element:<PaymentType></PaymentType>,
      },
  
    ],
  },
]);
