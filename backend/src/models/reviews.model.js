import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reviewText: {
      type: String,
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
