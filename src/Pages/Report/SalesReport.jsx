import { useState, useEffect } from "react";
import AxiosInstance from "../../Components/AxiosInstance";

const SalesReport = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]); // Default: Today
const [salesData, setSalesData] = useState([]);
  const [filteredSalesData, setFilteredSalesData] = useState([]);
  useEffect(() => {

    fetchSalesData();


  }, []);
 // Fetch sales data from API
  const fetchSalesData = async () => {
    try {
      const response = await AxiosInstance.get(`/sales/`);
      console.log("Sales API Response:", response.data); // Debugging purpose
      setSalesData(response.data);
      setFilteredSalesData(response.data); // Initially set to all data
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setSalesData([]);
      setFilteredSalesData([]);
    }
  };
  // Function to filter sales data based on selected date range
  const filterSalesData = () => {
    if (!fromDate || !toDate) return;

    const filtered = salesData.filter((item) => {
      return item.sale_date >= fromDate && item.sale_date <= toDate;
    });

    setFilteredSalesData(filtered);
  };
    // Update data when dates change (onChange)
    useEffect(() => {
        
        filterSalesData();
      }, [fromDate, toDate]); // Automatically update when dates change
      
      const handleSearch = () => {
        // Ensure both dates are selected
        if (!fromDate || !toDate) {
          alert("Please select both From and To dates.");
          return;
        }
      
        // Perform search logic here
        console.log("Searching for data between:", fromDate, "and", toDate);
      };
      

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Purchase  Report</h2>
      <div className="flex gap-4 mb-6 items-end">
  <div>
    <label className="block text-sm font-medium bg-gray-200 p-1 rounded">From Date:</label>
    <input
      type="date"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      className="border rounded p-2"
    />
  </div>
  <div>
    <label className="block text-sm font-medium bg-gray-200 p-1 rounded">To Date:</label>
    <input
      type="date"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      className="border rounded p-2"
    />
  </div>
  {/* Search Button */}
  <button
    onClick={handleSearch} // Call search function on click
    className="bg-blue-500 text-white h-8 w-20 rounded bg-blue-950 hover:bg-blue-800 transition roundelg"
  >
    Search
  </button>
</div>
          {/* Sales Report Table */}
    <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Sales Report</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">#</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Sales Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalesData.length > 0 ? (
              filteredSalesData.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{item.sale_date || "N/A"}</td>
                  <td className="border border-gray-300 p-2">
                    {isNaN(parseFloat(item.invoice_total_amount))
                      ? "0.00"
                      : parseFloat(item.invoice_total_amount).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">No data available</td>
              </tr>
            )} 
            {/* Total Row */}
            <tr className="bg-gray-300 font-semibold">
             <td className="border border-gray-300 p-2 text-center"></td>
             <td className="border border-gray-300 p-2 text-center"></td>
      <td className="border border-gray-300 p-2 text-center">
               <span className="font-bold">Total:</span> {filteredSalesData.reduce((sum, item) => sum + parseFloat(item.invoice_total_amount || 0), 0).toFixed(2)}
             </td>
           </tr>
          </tbody> 
       </table> 
       </div> 
        </div>
    );
};

export default SalesReport;