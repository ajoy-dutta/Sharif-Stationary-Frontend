import React, { useEffect, useState } from "react";
import AxiosInstance from "../../Components/AxiosInstance";
import { toast, Toaster } from "react-hot-toast";

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({}); // Holds product details mapped by ID
  const [searchTerm, setSearchTerm] = useState(""); // Stores search term
  const [backupStocks, setBackupStocks] = useState([]); // Stores original stock list
  const [filteredStocks, setFilteredStocks] = useState([]); // Holds filtered data

  // Fetch stock data
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await AxiosInstance.get("/stock/");
        if (Array.isArray(response.data)) {
          setStocks(response.data);
          setBackupStocks(response.data); // Store a backup for search reset
          setFilteredStocks(response.data); // Initially, filtered data is all stocks
        } else {
          console.error("API response is not an array:", response.data);
          setStocks([]);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
        toast.error("❌ Failed to fetch stock data!");
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  // Fetch product data separately
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AxiosInstance.get("/products/");
        console.log("🔍 Product API Response:", response.data);

        if (Array.isArray(response.data)) {
          const productMap = response.data.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
          }, {});
          setProduct(productMap);
        } else {
          console.error(
            "❌ Product API response is not an array:",
            response.data
          );
        }
      } catch (error) {
        console.error("❌ Error fetching product data:", error);
        toast.error("❌ Failed to fetch product data!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle Search Functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredStocks(backupStocks); // Reset data when search is cleared
      return;
    }

    const filtered = backupStocks.filter((stock) => {
      const prod = product[stock.product] || {};

      return (
        (prod.company?.company_name &&
          prod.company.company_name.toLowerCase().includes(term)) ||
        (prod.product_code && prod.product_code.toLowerCase().includes(term)) ||
        (prod.product_description &&
          prod.product_description.toLowerCase().includes(term))
      );
    });

    setFilteredStocks(filtered);
  };

  return (
    <div className="overflow-x-auto p-4">
      {/* Search Input */}
      <div className="join items-center">
                <input
          type="text"
          placeholder="Search Stock"
          value={searchTerm}
          onChange={handleSearch}
          className="input input-bordered text-sm rounded-s-md h-[30px] join-item"
          />
           <button className="btn btn-sm join-item bg-blue-950 text-white">
              Search
            </button>
      </div>
      

      <Toaster position="top-right" />
      <h2 className="text-blue-600 text-xl font-bold text-center mb-4">
        Stock Details
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading stock data...</p>
      ) : (
        <table className="w-full border border-gray-200 border-collapse text-sm">
          <thead>
            <tr className="bg-gray-700 text-white border border-gray-100">
              <th className="p-2 border border-gray-200">No</th>
              <th className="p-2 border border-gray-200">Company Name</th>
              <th className="p-2 border border-gray-200">Product Code</th>
              <th className="p-2 border border-gray-200">
                Product Description
              </th>
              <th className="p-2 border border-gray-200">Stock Rim</th>
              <th className="p-2 border border-gray-200">Stock Dozen</th>
              <th className="p-2 border border-gray-200">Stock Sheet/Piece</th>
              <th className="p-2 border border-gray-200">
                Last Purchase Rate Per Rim
              </th>
              <th className="p-2 border border-gray-200">
                Last Purchase+Additional Per Rim
              </th>
              <th className="p-2 border border-gray-200">
                Last Purchase Cost Per Dozen
              </th>
              <th className="p-2 border border-gray-200">
                Last Purchase+Additional Per Dozen
              </th>
              <th className="p-2 border border-gray-200">
                Last Purchase Cost Per Sheet/Piece
              </th>
              <th className="p-2 border border-gray-200">
                Last Purchase+Additional Per Sheet/Piece
              </th>
              <th className="p-2 border border-gray-200">Total Stock Amount</th>
              <th className="p-2 border border-gray-200">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock, index) => {
                const prod = product[stock.product] || {};
              
                return (
                  <tr
                    key={stock.id}
                    className="border border-gray-200 text-center"
                  >
                    <td className="p-2 border border-gray-200">{index + 1}</td>
                    <td className="p-2 border border-gray-200">
                      {prod.company?.company_name || "N/A"}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {prod.product_code || "N/A"}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {prod.product_name || "N/A"}
                    </td>
                    <td className="p-2 border border-gray-200">{stock.rim}</td>
                    <td className="p-2 border border-gray-200">
                      {stock.dozen}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {stock.sheet_or_piece || 0}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {stock.last_per_rim_price || "0.00"}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {stock.per_rim_total_cost || "0.00"}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {stock.last_per_dozen_price || "0.00"}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {stock.per_dozen_total_cost || "0.00"}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {stock.last_per_sheet_or_piece_price || "0.00"}
                    </td>
                    <td className="p-2 border border-gray-200">
                      {stock.per_sheet_or_piece_total_cost || "0.00"}
                    </td>
                    <td className="p-2 border border-gray-200">
                    {(stock.rim*stock.last_per_rim_price+stock.dozen*stock.last_per_dozen_price)+stock.sheet_or_piece*stock.last_per_sheet_or_piece_price }

                                </td>
                    <td className="p-2 border border-gray-200">
                      {stock.remarks || "N/A"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="15"
                  className="p-2 border border-gray-200 text-center"
                >
                  No stock data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Stock;
