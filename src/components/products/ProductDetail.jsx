import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../user/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { _id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [prevQuantity, setPrevQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    fetchProduct(_id);
    fetchReview(_id);
    checkIfInCart(_id);
  }, [_id, isLoggedIn]);

  const fetchReview = (_id) => {
    axios
      .post(
        "http://localhost:5000/api/v1/products/product/get-review",
        { _id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchProduct = (id) => {
    axios
      .get(
        `http://localhost:5000/api/v1/products/product/${id}`
      )
      .then((response) => {
        setProduct(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const checkIfInCart = (id) => {
    axios
      .post(
        "http://localhost:5000/api/v1/users/check-cart",
        { productId: id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setIsInCart(response.data.isInCart);
        setPrevQuantity(response.data.quantity);
      })
      .catch((error) => {});
  };

  const submitReview = () => {
    axios
      .post(
        "http://localhost:5000/api/v1/users/product/add-review",
        {
          _id: product._id,
          rating,
          reviewText,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        fetchReview(_id);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
  };

  const handleAddToCart = () => {
    // Add the product to the cart logic here
    if (isLoggedIn) {
      axios
        .patch(
          "http://localhost:5000/api/v1/users/add-to-cart",
          { _id: product._id, quantity },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setIsInCart(true);
          setPrevQuantity(quantity);

          console.log(`Added ${quantity} quantity of ${product.name} to cart`);
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
        });
    } else {
      navigate("/users/login");
    }
  };

  const handleRemoveFromCart = () => {
    axios
      .patch(
        "http://localhost:5000/api/v1/users/remove-from-cart",
        { _id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setIsInCart(false);
      })
      .catch((error) => {
        navigate("/users/login");
      });
  };

  const handleUpdateQuanity = () => {
    axios
      .patch(
        "http://localhost:5000/api/v1/users/update-quantity",
        { _id, quantity },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        setPrevQuantity(quantity);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!product || !product.price) {
    return <div className="text-center">Product not found.</div>;
  }
  return (
    <div className="container mx-auto py-6 px-24 bg-[#F0EEED]">
      <div className="flex">
        <div className="w-1/2 p-4">
          <img
            className="w-full h-auto rounded-lg shadow-2xl"
            src={product.image}
            alt={product.name}
          />
        </div>
        <div className="w-1/2 p-4">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-gray-800 font-bold mb-4">
            ₹{product.price.toFixed(2)}
          </p>
          <p className="mb-4 text-xl">{product.description}</p>
          <div className="flex items-center mb-4">
            <label htmlFor="quantity" className="mr-2">
              Quantity:
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, e.target.value))}
              className="w-16 p-2 border border-gray-300 rounded"
              min="1"
            />
          </div>
          {!isInCart && (
            <button
              onClick={handleAddToCart}
              className={`mt-2 p-2 mx-2 rounded text bg-blue-500 hover:bg-blue-700 text-white`}
            >
              Add to Cart
            </button>
          )}
          {isInCart && (
            <button
              onClick={handleUpdateQuanity}
              className={`mt-2 p-2 mx-2 rounded text bg-green-600 hover:bg-green-700 text-white} disabled:opacity-50 disabled:bg-green-600`}
              disabled={prevQuantity === quantity}
            >
              Update Quanity
            </button>
          )}

          {isInCart && (
            <button
              onClick={handleRemoveFromCart}
              className={`mt-2 p-2 mx-2 rounded bg-red-500 text-white hover:bg-red-700`}
            >
              Remove from cart
            </button>
          )}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {isLoggedIn ? (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Write a Review</h3>
            <div className="flex items-center mb-2">
              <span>Rating: </span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`ml-2 text-xl ${
                    star <= rating ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-2"
              rows="4"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
            ></textarea>
            <button
              onClick={submitReview}
              className="mt-2 bg-blue-500 text-white p-2 rounded"
            >
              Submit Review
            </button>
          </div>
        ) : (
          <p className="text-red-500 my-4">Please log in to write a review.</p>
        )}
        <div>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="mb-4 p-4 bg-white rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">
                    {review.user
                      ? review.user.username || "Anonymous"
                      : "Anonymous"}
                  </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl ${
                        star <= review.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700">{review.reviewText}</p>
                <span className="text-sm text-gray-500">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
