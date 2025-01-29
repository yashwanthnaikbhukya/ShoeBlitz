import mongoose, { Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description:{
      type:String,
    },
    image: {
      type: String,
      required: true
    },
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: "Review",
    }],
  },
  { timestamps: true }
);

productSchema.plugin(mongoosePaginate)

export const Product = mongoose.model("Product", productSchema);
