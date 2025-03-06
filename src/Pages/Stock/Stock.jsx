import React, { useEffect, useState } from "react";
import axios from "axios";

const Stock = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    axios.get("/api/stocks") // Adjust the API endpoint as needed
      .then(response => {
        if (Array.isArray(response.data)) {
          setStocks(response.data);
        } else {
          console.error("API response is not an array:", response.data);
          setStocks([]); // Ensure it's an array to prevent map errors
        }
      })
      .catch(error => {
        console.error("Error fetching stock data:", error);
        setStocks([]); // Fallback to an empty array
      });
  }, []);

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-blue-600 text-xl font-bold  text-center mb-4">Stock Details</h2>
      <table className="w-full border  border-gray-200 border-collapse rounded-sm text-xs">
        <thead>
          <tr className="bg-gray-700 text-white rounded-sm border border-gray-100">
            <td className="p-1 border border-gray-100">No</td>
            <td className="p-1 border border-gray-200">Company Name</td>
            <td className="p-1 border border-gray-200">Product Code</td>
            <td className="p-1 border border-gray-200">Product Description</td>
            <td className="p-1 border border-gray-200">Stock Rim</td>
            <td className="p-1 border border-gray-200">Stock Dozen</td>
            <td className="p-1 border border-gray-200">Stock Sheet/Piece</td>
            <td className="p-1 border border-gray-200">Last Purchase Rate Wise Per Rim Cost</td>
            <td className="p-1 border border-gray-200">Last Purchase+Additional Cost Wise Per Rim Cost</td>
            <td className="p-1 border border-gray-200">Last Purchase Cost Wise Per Dozen Cost</td>
            <td className="p-1 border border-gray-200">Last Purchase+Additional Cost Wise Per Dozen Cost</td>
            <td className="p-1 border border-gray-200">Last Purchase Cost Wise Per Sheet/Piece Cost</td>
            <td className="p-1 border border-gray-200">Last Purchase+Additional Cost Wise Per Sheet/Piece Cost</td>
            <td className="p-1 border border-gray-200">Total Stock Amount</td>
            <td className="p-1 border border-gray-200">Remarks</td>
          </tr>
        </thead>
        <tbody>
          {stocks.length > 0 ? (
            stocks.map((stock, index) => (
              <tr key={index} className="border border-gray-200">
                <td className="p-1 border border-gray-200">{index + 1}</td>
                <td className="p-1 border border-gray-200">{stock.companyName}</td>
                <td className="p-1 border border-gray-200">{stock.productCode}</td>
                <td className="p-1 border border-gray-200">{stock.productDescription}</td>
                <td className="p-1 border border-gray-200">{stock.stockRim}</td>
                <td className="p-1 border border-gray-200">{stock.stockDozen}</td>
                <td className="p-1 border border-gray-200">{stock.stockSheetPiece}</td>
                <td className="p-1 border border-gray-200">{stock.lastPurchaseRatePerRim}</td>
                <td className="p-1 border border-gray-200">{stock.lastPurchaseAdditionalCostPerRim}</td>
                <td className="p-1 border border-gray-200">{stock.lastPurchaseCostPerDozen}</td>
                <td className="p-1 border border-gray-200">{stock.lastPurchaseAdditionalCostPerDozen}</td>
                <td className="p-1 border border-gray-200">{stock.lastPurchaseCostPerSheetPiece}</td>
                <td className="p-1 border border-gray-200">{stock.lastPurchaseAdditionalCostPerSheetPiece}</td>
                <td className="p-1 border border-gray-200">{stock.totalStockAmount}</td>
                <td className="p-1 border border-gray-200">{stock.remarks}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="15" className="p-1 border border-gray-200 text-center">No stock data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Stock;
