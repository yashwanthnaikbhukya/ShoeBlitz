import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import cart from "../../assets/cart.png";
import profileIcon from "../../assets/profile.png";
import menu from "../../assets/menu.png";
import close from "../../assets/close.png";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn, username } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/v1/users/logout", {}, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => setIsLoggedIn(false))
      .catch((error) => console.log("Error while logging out: ", error));
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-icon") && !event.target.closest(".dropdown-menu")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center w-full px-6 md:px-16 h-16 sticky top-0 z-10 bg-white border-b shadow-sm">
      {/* Logo */}
      <NavLink to="/" className="text-2xl font-bold text-gray-800">
        Shoe<span className="text-pink-600">Blitz</span>
      </NavLink>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        <NavLink to="/" className={({ isActive }) => 
          `text-gray-700 font-medium hover:text-pink-600 ${isActive ? "text-pink-600 font-semibold" : ""}`
        }>
          Products
        </NavLink>

        {isLoggedIn ? (
          <>
            <NavLink to="/users/cart" className={({ isActive }) => 
              `flex items-center text-gray-700 font-medium hover:text-pink-600 ${isActive ? "text-pink-600 font-semibold" : ""}`
            }>
              <img className="w-5 h-5 mr-2" src={cart} alt="Cart" />
              <span>Cart</span>
            </NavLink>

            {/* Profile & Dropdown */}
            <div className="relative">
              <div className="profile-icon flex items-center cursor-pointer hover:scale-105 transition duration-150" onClick={toggleDropdown}>
                <img className="w-7 h-7" src={profileIcon} alt="Profile" />
                <img className="w-6 h-6 ml-2" src={showDropdown ? close : menu} alt="Toggle" />
              </div>

              {showDropdown && (
                <div className="dropdown-menu absolute right-0 w-40 bg-white border border-gray-300 rounded-lg shadow-md mt-2 py-2">
                  <p className="text-center px-3 py-2 border-b text-gray-700">
                    User: <strong>{username}</strong>
                  </p>
                  <NavLink to="/users/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    All Orders
                  </NavLink>
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-red-500 hover:bg-red-100 text-left">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to="/users/login" className="text-gray-700 font-medium hover:text-pink-600">
              Login
            </NavLink>
            <NavLink to="/users/register" className="text-white bg-pink-600 px-4 py-2 rounded-lg hover:bg-pink-700 transition">
              Sign up
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
