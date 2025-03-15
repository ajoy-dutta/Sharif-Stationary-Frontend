import { useState, useEffect } from "react";
import AxiosInstance from "../../Components/AxiosInstance";

const PurchasesReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]); // Default: Today
  const [purchaseData, setPurchaseData] = useState([]);
  const [filteredPurchaseData, setFilteredPurchaseData] = useState([]);
  const [productData, setProductData] = useState([]); // Store product details
  const [isProductDataLoaded, setIsProductDataLoaded] = useState(false); // Ensure product data is ready
  const [companyData, setCompanyData] = useState([]); // Store company details
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Ensure product & company data is ready

  // Fetch purchase and sales data when component loads
  useEffect(() => {
    fetchProductData();
    fetchCompanyData();
  }, []);
  // Fetch purchases only after products are loaded
  useEffect(() => {
    if (isDataLoaded === 2) {
      fetchPurchaseData();
    }
  }, [isDataLoaded]);

  const fetchProductData = async () => {
    try {
      const response = await AxiosInstance.get("/products/");
      console.log("Product API Response:", response.data);
      setProductData(response.data);
      setIsDataLoaded((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setProductData([]);
      setIsDataLoaded((prev) => prev + 1);
    }
  };

  // Fetch company data from API
  const fetchCompanyData = async () => {
    try {
      const response = await AxiosInstance.get("/companies/");
      console.log("Company API Response:", response.data);
      setCompanyData(response.data);
      setIsDataLoaded((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching company data:", error);
      setCompanyData([]);
      setIsDataLoaded((prev) => prev + 1);
    }
  };

  // Fetch purchase data from API
  const fetchPurchaseData = async () => {
    try {
      const response = await AxiosInstance.get(`/purchases/`);
      console.log("Purchase API Response:", response.data);
  
      // ✅ Create a product lookup dictionary
      const productMap = new Map(productData.map((p) => [p.id, p]));
  
      const enrichedPurchases = response.data.map((purchase) => {
        const matchingCompany = companyData.find((c) => c.id === purchase.company);
  
        return {
          ...purchase,
          company_name: matchingCompany ? matchingCompany.company_name : "N/A",
          items: purchase.items.map((item) => {
            const matchingProduct = productMap.get(item.product); // Faster lookup
            return {
              ...item,
              product_code: matchingProduct ? matchingProduct.product_code : "N/A",
              product_name: matchingProduct ? matchingProduct.product_name : "N/A",
            };
          }),
        };
      });
  
      setPurchaseData(enrichedPurchases);
      setFilteredPurchaseData(enrichedPurchases);
    } catch (error) {
      console.error("Error fetching purchase data:", error);
      setPurchaseData([]);
      setFilteredPurchaseData([]);
    }
  };

  const filterPurchaseData = () => {
    if (!fromDate || !toDate) return;
  
    const from = new Date(fromDate);
    const to = new Date(toDate);
  
    const filtered = purchaseData.filter((item) => {
      const deliveryDate = new Date(item.delivery_date);
      return deliveryDate >= from && deliveryDate <= to;
    });
  
    setFilteredPurchaseData(filtered);
  };
  

  // Update data when dates change (onChange)
  useEffect(() => {
    filterPurchaseData();
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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Purchase Report</h2>
      <div className="flex gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium bg-gray-200 p-1 rounded">
            From Date:
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium bg-gray-200 p-1 rounded">
            To Date:
          </label>
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

      {/* Purchase Report Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Purchase Report
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">#</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Company Name/ Supplier</th>

              <th className="border border-gray-300 p-2">Product Code</th>
              <th className="border border-gray-300 p-2">Product Name</th>
              <th className="border border-gray-300 p-2">Product Quantity </th>

              <th className="border border-gray-300 p-2">Purchase Amount</th>
              <th className="border border-gray-300 p-2">Payment Method</th>

              <th className="border border-gray-300 p-2">Entry By</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchaseData.length > 0 ? (
              filteredPurchaseData.map((purchase, index) =>
                purchase.items.map((item, itemIndex) => (
                  <tr key={`${index}-${itemIndex}`} className="text-center">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {purchase.delivery_date || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {purchase.company_name || "N/A"}
                    </td>

                    <td className="border border-gray-300 p-2">
                      {item.product_code || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.product_name || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                     {/* list ante hbe */}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {parseFloat(purchase.invoice_challan_amount).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {purchase.payment_type|| "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {purchase.entry_by || "N/A"}
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
            {/* Total Row */}
            <tr className="bg-gray-100 font-semibold">
              <td
                colSpan="6"
                className="border border-gray-300 p-2 text-center"
              ></td>{" "}
              {/* Empty for alignment */}
              <td className="border border-gray-300 p-2 text-center">
                <span className="font-bold">Total : </span>
                {filteredPurchaseData
                  .reduce(
                    (sum, purchase) =>
                      sum +
                      purchase.items.reduce(
                        (subSum, item) =>
                          subSum + parseFloat(purchase.invoice_challan_amount || 0),
                        0
                      ),
                    0
                  )
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasesReport;
