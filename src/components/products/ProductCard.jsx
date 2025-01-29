import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="w-[300px] h-[350px] bg-white m-2 p-4 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 cursor-pointer duration-200">
      <div className="w-full h-[200px] flex justify-center items-center">
        <img className="rounded-xl object-cover max-h-full " src={product.image} alt={product.name} />
      </div>
      <div className="mt-2 text-center">
        <h2 className="text-lg font-bold">{product.name}</h2>
        <p className="text-gray-600 font-bold">₹{product.price.toFixed(2)}</p>

      </div>
    </Link>
  );
};

export default ProductCard;
