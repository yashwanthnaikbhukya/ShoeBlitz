import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../user/AuthContext";
import { useNavigate } from "react-router-dom";
import down from "../../assets/down.png";
import up from "../../assets/up.png";
const AllOrder = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
      setMessage(null);
    } else {
      setMessage("Please log in to view your order history.");
    }
  }, [isLoggedIn]);

  const fetchOrders = () => {
    axios
      .post(
        "http://localhost:5000/api/v1/users/all-order",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setOrders(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setMessage("Error fetching orders. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const calculateTotalPrice = (products) => {
    let totalPrice = 0;
    products.forEach((item) => {
      totalPrice += item.quantity * item.product.price;
    });
    return totalPrice.toFixed(2);
  };

  const toggleAccordion = (orderId) => {
    setActiveOrderId(orderId === activeOrderId ? null : orderId);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!orders.length) {
    return <div className="text-center">You have no orders yet.</div>;
  }

  if (message) {
    return <div className="text-center">{message}</div>;
  }
  return (
    <div className="container mx-auto py-6 px-24 ">
      <h1 className="text-4xl font-bold mb-4">Your Orders</h1>
      {orders.map((order) => (
        <div
          key={order._id}
          className="mb-4 p-4  rounded-lg shadow-md border border-gray-200"
        >
          <div
            className="cursor-pointer relative"
            onClick={() => toggleAccordion(order._id)}
          >
            <img
              className="absolute right-0 top-8 w-10 mr-6"
              src={activeOrderId ? up : down}
              alt={activeOrderId ? up : down}
            />
            <h2 className="text-2xl font-semibold mb-2">
              Order ID: {order._id}
            </h2>
            <p className="text-xl text-gray-800">
              Status:{" "}
              <span className="text-red-500 font-semibold ">
                {order.status}
              </span>{" "}
            </p>
            <p className="text-xl text-gray-800">
              Total Price: ₹{" "}
              <span className="font-semibold text-green-600 ">
                {calculateTotalPrice(order.products)}
              </span>
            </p>
          </div>
          <div
            className={`overflow-hidden transition-max-height ease-in-out duration-1000 ${
              activeOrderId === order._id ? "max-h-96" : "max-h-0"
            }`}
          >
            {activeOrderId === order._id && (
              <div className="mt-4 ">
                <h3 className="text-xl font-semibold">Items:</h3>
                {order.products.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center mb-2 bg-[#F0EEED] border rounded-md"
                  >
                    <img
                      className="w-20 h-20 object-cover rounded mr-4"
                      src={item.product.image}
                      alt={item.product.name}
                    />
                    <div className="flex-grow">
                      <h4 className="text-xl">{item.product.name}</h4>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-600">
                        Price: ₹{item.product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllOrder;
