import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../user/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
    } else {
      navigate("/");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  const fetchCartItems = () => {
    axios
      .get("http://localhost:5000/api/v1/users/cart", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const cartData = response.data.data.cartItems;
        setCartItems(cartData);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const calculateTotalPrice = () => {
    const total = cartItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);
    setTotalPrice(total);
  };

  const handleRemoveFromCart = (id) => {
    axios
      .patch(
        "http://localhost:5000/api/v1/users/remove-from-cart",
        { _id: id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setCartItems(cartItems.filter((item) => item.product._id !== id));
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
  };

  const handleCheckout = () => {
    axios
      .post(
        "http://localhost:5000/api/v1/users/confirm-order",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setCartItems([]);
        alert("Order placed successfully");
        navigate("/users/orders");
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (!cartItems.length) {
    return <div className="text-center text-xl">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-6 sm:px-12 lg:px-24">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">Your Cart</h1>
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-all duration-300 ease-in-out"
          >
            <img
              className="w-24 h-24 object-cover rounded-lg"
              src={item.product.image}
              alt={item.product.name}
            />
            <div className="ml-6 flex-grow">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {item.product.name}
              </h2>
              <p className="text-lg text-gray-600">₹{item.product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <button
              onClick={() => handleRemoveFromCart(item.product._id)}
              className="ml-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-200 ease-in-out"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <p className="text-2xl font-semibold text-gray-800">Total: ₹{totalPrice.toFixed(2)}</p>
        <button
          onClick={handleCheckout}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg text-xl hover:bg-blue-700 transition-all duration-200 ease-in-out"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
