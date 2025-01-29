import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/user/UserLayout.jsx";
import Products from "./components/products/Products.jsx";
import UserLogin from "./components/user/UserLogin.jsx";
import UserRegister from "./components/user/UserRegister.jsx";
import ProductDetail from "./components/products/ProductDetail.jsx";
import { AuthProvider } from "./components/user/AuthContext.jsx";
import Cart from './components/user/Cart.jsx'
import AllOrder from "./components/user/AllOrder.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Products />,
      },
      {
        path: "/product/:_id",
        element: <ProductDetail />,
      },
      {
        path: "/users/register",
        element: <UserRegister />
      },
      {
        path: "/users/login",
        element: <UserLogin />
      },
      {
        path: "/users/cart",
        element: <Cart />
      },
      {
        path: "/users/orders",
        element: <AllOrder />
      }
    ],
  },
]);

function App() {
  return (
    <div className="App">
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
    </div>
  );
}

export default App;
