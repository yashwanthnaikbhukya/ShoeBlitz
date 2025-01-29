import { Order } from "../models/orders.model.js";
import { Product } from "../models/products.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {
  const { _id, quantity } = req.body;

  const user = req.user;
  if (!user) {
    console.log("user not found")
  }

  let cart = await Order.findOne({
    user: user._id,
    status: "In cart",
  });
  
  if (cart) {
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === _id
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: _id, quantity });
    }
    cart = await cart.save();
  } else {
    cart = await Order.create({
      user: user._id,
      products: [{ product: _id, quantity }],
      status: "In cart",
    });
  }

  return res.status(200).json(new ApiResponse(200, "Item added successfully"));
});


const removeFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  const user = req.user;
  if (!user) {
    throw new ApiError(404, "Login to remove product from cart");
  }

  let cart = await Order.findOne({
    user: user._id,
    status: "In cart",
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Remove the product from the cart
  cart.products = cart.products.filter((p) => p.product.toString() !== _id);

  // Save the updated cart
  cart = await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Item removed from cart successfully"));
});

const updateQuantity = asyncHandler(async (req, res) => {
  const { _id, quantity } = req.body;

  const user = req.user;
  if (!user) {
    throw new ApiError(404, "Login to update the product quantity");
  }

  let cart = await Order.findOne({
    user: user._id,
    status: "In cart",
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Find the index of the product in the cart
  const productIndex = cart.products.findIndex(
    (p) => p.product.toString() === _id
  );

  if (productIndex === -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  // Update the quantity of the product
  cart.products[productIndex].quantity = quantity;

  // Save the updated cart
  cart = await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Quantity updated successfully"));
});

const cart = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(400, "Login to see your cart");
  }
  const cart = await Order.findOne({
    user: user._id,
    status: "In cart",
  }).populate("products.product"); // Assuming 'products' is the array of items in the cart

  if (!cart) {
    return res.status(200).json({})
  }

  // Map cart items to include quantity and additional product details
  const cartItems = cart.products.map((item) => ({
    _id: item._id,
    product: {
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      // Include other product details as needed
    },
    quantity: item.quantity, // Include quantity here
  }));

  // Construct response
  const responseData = {
    _id: cart._id,
    user: cart.user,
    status: cart.status,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
    cartItems: cartItems,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, "Cart fetched successfully", responseData));
});

const isInCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  // Check if the user is logged in
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User not authenticated" });
  }

  try {
    // Find the user's cart with status "In cart"
    const cart = await Order.findOne({ user: userId, status: "In cart" });

    if (!cart) {
      // Cart not found or empty
      return res.status(200).json({ isInCart: false });
    }

    // Check if the specified product is in the cart
    const cartItem = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      // Product not found in the cart
      return res.status(200).json({ isInCart: false});
    }

    // Product found in the cart
    const quantity = cartItem.quantity;
    return res.status(200).json({ isInCart: true, quantity });
  } catch (error) {
    console.error("Error checking cart status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

const confirmOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(200, "Login to confirm your order");
  }
  const order = await Order.findOneAndUpdate(
    {
      user: user._id,
      status: "In cart",
    },
    {
      status: "Pending",
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Order placed successfully", order));
});

const allOrder = asyncHandler(async (req, res) => { 
  const user = req.user;
  if (!user) {
    throw new ApiError(400, "Login to check all your order history");
  }
  const orders = await Order.find({
    user: user._id,
    status: { $ne: "In cart" },
  }).populate('products.product');
  return res
    .status(200)
    .json(new ApiResponse(200, "All orders fetched", orders));
});
export {
  addToCart,
  removeFromCart,
  updateQuantity,
  cart,
  confirmOrder,
  allOrder,
  isInCart,
};
