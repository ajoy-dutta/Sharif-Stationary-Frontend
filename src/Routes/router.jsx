import { createBrowserRouter } from "react-router-dom";

import Main from "../Layout/Main";
import Login from "../Login.jsx";
import Product from "../Pages/Product/Product.jsx";
import Home from "../Pages/HomePage/Home/Home/Home.jsx";
import SignUp from "../SignUp.jsx";
import Security from "../Pages/Security/Security.jsx";
import Dashboard from "../Pages/DashboardPage/Dashboard.jsx";
import Master from "../Pages/Master/Master.jsx";
import Purchase from "./../Pages/Purchase/Purchase";
import Transfer from "../Pages/Transfer/Transfer.jsx";
import Production from "../Pages/Production/Production.jsx";
import Sales from "../Pages/Sales/Sales.jsx";
import Posting from "../Pages/Posting/Posting.jsx";
import Account from "../Pages/Account/Account.jsx";

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
        element: <Purchase></Purchase>,
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
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/signup",
        element: <SignUp></SignUp>,
      },
    ],
  },
]);
