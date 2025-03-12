import { useState, useEffect } from "react";
import AxiosInstance from "../../Components/AxiosInstance";

const Report = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]); // Default to Today
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [salesData, setSalesData] = useState([]);


  // Fetch data when the component loads
  useEffect(() => {
    fetchReportData();
  }, []);
  
  // Fetch data when the component loads
  useEffect(() => {
    fetchSalesData();
  }, []);

  // Fetch purchase data from API
  const fetchReportData = async () => {
    try {
      const response = await AxiosInstance.get(`/purchases/`);
      console.log("API Response:", response.data); // Debugging purpose
      setReportData(response.data);
      setFilteredData(response.data); // Initially set filteredData to all data
    } catch (error) {
      console.error("Error fetching report data:", error);
      setReportData([]);
      setFilteredData([]);
    }
  };
   // Fetch sales data from API
   const fetchSalesData = async () => {
    try {
      const response = await AxiosInstance.get(`/sales/`);
      console.log("API Response:", response.data); // Debugging purpose
      setSalesData(response.data);
      setFilteredData(response.data); // Initially set filteredData to all data
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setSalesData([]);
      setFilteredData([]);
    }
  };

  // Function to filter data based on selected date range
  const filterData = () => {
    if (!fromDate || !toDate) return;

    const filtered = reportData.filter((item) => {
      return item.delivery_date >= fromDate && item.delivery_date <= toDate;
    });

    setFilteredData(filtered);
  };

  // Update data when dates change (onChange)
  useEffect(() => {
    filterData();
  }, [fromDate, toDate]); // Automatically update when dates change

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Purchase Report</h2>
      
      {/* Date Filters */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
      </div>

      {/* Data Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">#</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Purchase Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{item.delivery_date || "N/A"}</td>
                <td className="border border-gray-300 p-2">{parseFloat(item.invoice_challan_amount).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">No data available</td>
            </tr>
          )}
          {/* Total Row ONLY under "Purchase Amount" column */}
          <tr className="bg-gray-300 font-semibold">
            <td className="border border-gray-300 p-2 text-center"></td> {/* Empty for Serial */}
            <td className="border border-gray-300 p-2 text-center"></td> {/* Empty for Date */}
            <td className="border border-gray-300 p-2 text-center">
              <span className="font-bold">Total:</span> {filteredData.reduce((sum, item) => sum + parseFloat(item.invoice_challan_amount || 0), 0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Sales Report</h2> {/* Heading added */}

 
      {/* Data Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">#</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Sales Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{item.delivery_date || "N/A"}</td>
                <td className="border border-gray-300 p-2">
                  {isNaN(parseFloat(item.invoice_challan_number_value))
                    ? "0.00"
                    : parseFloat(item.invoice_challan_number_value).toFixed(2)}
                </td>              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">No data available</td>
            </tr>
          )}
          {/* Total Row ONLY under "Sales Amount" column */}
          <tr className="bg-gray-300 font-semibold">
            <td className="border border-gray-300 p-2 text-center"></td> {/* Empty for Serial */}
            <td className="border border-gray-300 p-2 text-center"></td> {/* Empty for Date */}
            <td className="border border-gray-300 p-2 text-center">
              <span className="font-bold">Total:</span> {filteredData.reduce((sum, item) => sum + parseFloat(item.invoice_challan_number_value || 0), 0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
    
  );
};

export default Report;
