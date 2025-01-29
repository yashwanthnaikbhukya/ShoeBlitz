import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen ">
  
      <Header />
      <div className="flex-grow ">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
