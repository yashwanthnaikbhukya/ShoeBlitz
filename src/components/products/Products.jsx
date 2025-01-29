import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState({
    docs: [],
    hasPrevPage: false,
    hasNextPage: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({});

  const limit = 9;

  useEffect(() => {
    fetchProducts(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, filter]);

  const fetchProducts = (page) => {
    axios
      .post(
        `http://localhost:5000/api/v1/products/allProducts?page=${page}&limit=${limit}`,
        filter,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const toggleCategory = (category) => {
    setFilter((prevFilter) => {
      const isCategoryUnselected = prevFilter.category === category;
      if (isCategoryUnselected) {
        const { category, ...rest } = prevFilter;
        return rest;
      } else {
        return {
          ...prevFilter,
          category: category,
        };
      }
    });
    setCurrentPage(1);
  };

  const toggleName = (name) => {
    setFilter((prevFilter) => {
      const isNameUnselected = prevFilter.name === name;
      if (isNameUnselected) {
        const { name, ...rest } = prevFilter;
        return rest;
      } else {
        return {
          ...prevFilter,
          name: name,
        };
      }
    });
    setCurrentPage(1);
  };

  const handlePriceChange = (event) => {
    const value = event.target.value;
    if (value === "") {
      setFilter((prevFilter) => {
        const newFilter = { ...prevFilter };
        delete newFilter.price;
        return newFilter;
      });
    } else {
      const [low, high] = value.split("-").map(Number);
      setFilter((prevFilter) => ({
        ...prevFilter,
        price: { $gte: low, $lte: high },
      }));
    }
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setFilter({});
  };

  return (
    <div className="min-h-screen px-6 py-3 flex flex-col">
      {/* Top Filter Bar */}
      <div className="bg-white shadow-md rounded-xl p-3 flex flex-wrap items-center justify-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <p className="font-bold text-lg text-black">Filters:</p>
          <button
            onClick={clearFilter}
            className="text-red-500 font-semibold underline"
          >
            Clear All
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            onChange={handlePriceChange}
            className="p-2 bg-gray-200 rounded-lg"
          >
            <option value="">All Prices</option>
            <option value="500-2500">500-2500</option>
            <option value="2500-5000">2500-5000</option>
            <option value="5000-7500">5000-7500</option>
            <option value="7500-10000">7500-10000</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-5">
          {["Nike", "Puma", "Adidas", "Campus", "Asian"].map((name) => (
            <button
              key={name}
              onClick={() => toggleName(name)}
              className={`px-4 py-2 rounded-lg ${
                filter.name === name ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Section */}
      <div className="mt-4 flex flex-col flex-grow">
        <div className="flex flex-wrap justify-center bg-gray-100 p-4 rounded-lg shadow-md">
          {products.docs.length > 0 ? (
            products.docs.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="text-gray-600 text-center w-full p-4">
              No products found.
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination flex justify-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || !products.hasPrevPage}
            className="bg-gray-400 p-2 rounded-l-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="p-2 bg-white border-t border-b border-gray-400">
            Page {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!products.hasNextPage}
            className="bg-gray-400 p-2 rounded-r-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
