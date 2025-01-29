import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/products.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/reviews.model.js";

const allProducts = asyncHandler(async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const filter = req.body
  const options = {
    page,
    limit,
  };
  const result = await Product.paginate(filter, options);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `${page} page of products fetched successfully`,
        result
      )
    );
});

const product = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    throw new ApiError(400, "unable to fetch the product");
  }

  const product = await Product.findById(_id);

  if (!product) {
    throw new ApiError(404, "product not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "product fetched successfully", product));
});

const addProduct = asyncHandler(async (req, res) => {
  const { name, category, price, description } = req.body;

  if (
    [name, category, price].some((field) => field == null || field.trim() == "")
  ) {
    throw new ApiError(400, "Product details are required");
  }

  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Product image is required");
  }

  const uploadedImage = await uploadOnCloudinary(imageLocalPath);
  if (!uploadedImage) {
    throw new ApiError(500, "Error occured while saving image");
  }

  const product = await Product.create({
    name,
    category,
    price,
    description,
    image: uploadedImage.url,
  });

  if (!product) {
    throw new ApiError(500, "Unexpected error occured while adding product");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Product Added Successfully", product));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    throw new ApiError(400, "Product id is required");
  }

  const product = await Product.findById(_id).catch(() => {
    throw new ApiError(400, "invalid product id");
  });

  const publicId =
    "ShoeShack/" + product.image.split("/ShoeShack/")[1].split(".")[0];

  const deletedImage = await deleteFromCloudinary(publicId);
  if (!deletedImage) {
    throw new ApiError(500, "Error while deleting image from cloudinary");
  }

  const deletedProduct = await Product.findByIdAndDelete(_id);

  if (!deletedProduct) {
    throw new ApiError(500, "Unable to delete product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "product deleted successfully", deletedProduct));
});

const addReview = asyncHandler(async (req, res) => {
  const { _id, reviewText, rating } = req.body;
  if (!_id) {
    throw new ApiError(400, "Required product id for adding review");
  }

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "User not authorised to add review");
  }

  const review = await Review.create({
    user: user._id,
    reviewText,
    rating,
  });
  if (!review) {
    throw new ApiError(500, "Error while adding review");
  }
  const reviewId = review._id;
  const product = await Product.findByIdAndUpdate(_id, {
    $push: { reviews: reviewId },
  });
  if (!product) {
    throw new ApiError(500, "Error while updating product with review");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Review Added Successfully"));
});

// Assuming you're using Mongoose
const getReview = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    throw new ApiError(401, "Product id is required to fetch the reviews");
  }

  const reviews = await Product.findById(_id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'username'
      }
    });

  if (!reviews) {
    throw new ApiError(404, "Product not found");
  }
  return res.status(200).json(reviews.reviews);
});

const updateReview = asyncHandler(async (req, res) => {
  const { _id, reviewText, rating } = req.body;

  if (!_id) {
    throw new ApiError(400, "Required review id for updating review");
  }

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "User not authorized to update review");
  }

  // Find the review by its ID
  const review = await Review.findById(_id);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Check if the review belongs to the user making the request
  if (review.user.toString() !== user._id.toString()) {
    throw new ApiError(403, "User not authorized to update this review");
  }

  // Update the review with new data
  review.reviewText = reviewText || review.reviewText;
  review.rating = rating || review.rating;

  // Save the updated review
  const updatedReview = await review.save();

  if (!updatedReview) {
    throw new ApiError(500, "Error while updating review");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Review Updated Successfully", updatedReview));
});

export {
  allProducts,
  addProduct,
  deleteProduct,
  product,
  addReview,
  updateReview,
  getReview,
};
