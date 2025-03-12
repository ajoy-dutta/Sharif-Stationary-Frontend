import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AxiosInstance from "../../Components/AxiosInstance";

import { Link } from "react-router-dom";

const Sales = () => {
  const [customers, setCustomers] = useState([]); // Store all customers
  const [filteredCustomers, setFilteredCustomers] = useState([]); // Filtered customer list
  const [searchCustomerQuery, setSearchCustomerQuery] = useState(""); // Search input
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(-1); // Keyboard navigation index
  const [stockData, setStockData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Stores filtered product list
  const [searchQuery, setSearchQuery] = useState(""); // Input value
  const [selectedIndex, setSelectedIndex] = useState(-1); // Index for keyboard navigation

  const [formData, setFormData] = useState({
    orderDate: new Date().toISOString().split("T")[0],
    customerID: "",
    customerAddress: "",
    customerName: "",
    mobile: "",
    reference: "",
    remarks: "",
    todayBill: 0,
    todayPaid: 0,
    paidBy: "Cash",
    bankName: "",
    accountNo: "",
    chequeNo: "",
    chequeDate: "",
    balanceAmount: 0,
    product_info: [],
  });

  // Handle manual input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  // ✅ Fetch Customer Data
  useEffect(() => {
    AxiosInstance.get("/customers/")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
      });
  }, []);

  const handleSearchCustomer = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchCustomerQuery(query);

    if (!query.trim()) {
      setFilteredCustomers(customers); // Show all customers when empty
      setSelectedCustomerIndex(-1);
      return;
    }

    const results = customers.filter((customer) =>
      customer.customer_name.toLowerCase().includes(query)
    );

    setFilteredCustomers(results);
    setSelectedCustomerIndex(0);
  };

  // ✅ Handle Keyboard Navigation (Arrow Up, Down, Enter)
  const handleKeyDownCustomer = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedCustomerIndex((prev) => (prev + 1) % filteredCustomers.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedCustomerIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCustomers.length - 1
      );
    } else if (e.key === "Enter" && selectedCustomerIndex >= 0) {
      e.preventDefault();
      selectCustomer(filteredCustomers[selectedCustomerIndex]);
    }
  };

  // ✅ Handle Customer Selection
  const selectCustomer = (customer) => {
    setFormData((prev) => ({
      ...prev,
      customerID: customer.id,
      customerName: customer.customer_name,
      customerAddress: customer.customer_address,
      mobile: customer.customer_phone_no,
    }));

    setSearchCustomerQuery(customer.customer_name); // Update input field
    setFilteredCustomers([]); // Hide dropdown
  };



  // ✅ Dynamic Item List
  const [items, setItems] = useState({
    product: "",
    stock: 0,
    rim: 0,
    sheet: 0,
    rim_sold: "",
    dozen_sold: "",
    sheet_or_piece_sold: "",
    per_rim_sell_price: "",
    per_dozen_sell_price: "",
    per_sheet_or_piece_sell_price: "",
    total_price: "",
  });

  useEffect(() => {
    AxiosInstance.get("/stock/")
      .then((response) => {
        setStockData(response.data);
      })
      .catch((err) => {
        console.error("Error fetching stock:", err);
      });
  }, []);

  // Handle product selection & fetch stock data
  const handleProductChange = async (e) => {
    const stock = e.target.value;
    setItems((prev) => ({ ...prev, stock }));

    const selectedStock = stockData.find(
      (stockitem) => stockitem.id === parseInt(stock)
    );
    console.log("stock", stock);
    console.log("stockData", stockData);
    console.log("selectedStock", selectedStock.rim);

    if (selectedStock) {
      setItems((prev) => ({
        ...prev,
        rim: selectedStock.rim,
        sheet: selectedStock.sheet_or_piece,
        dozen: selectedStock.dozen,
        per_rim_sell_price: selectedStock.last_per_rim_price,
        per_dozen_sell_price: selectedStock.last_per_dozen_price,
        per_sheet_or_piece_sell_price:
          selectedStock.last_per_sheet_or_piece_price,
      }));
    }
  };

  // Handle Input Change (Search & Filtering)
  const handleSearchProduct = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredProducts(stockData); // Show all products when empty
      setSelectedIndex(-1); // Reset selection
      return;
    }

    const results = stockData.filter((product) =>
      product.product_name.toLowerCase().includes(query)
    );

    setFilteredProducts(results);
    setSelectedIndex(0);
  };

  // Handle Key Navigation (Up, Down, Enter)
  const handleKeyDownProduct = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredProducts.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredProducts.length - 1
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      selectProduct(filteredProducts[selectedIndex]);
    }
  };

  // Select Product
  const selectProduct = (product) => {
    setItems((prev) => ({
      ...prev,
      product: product.id,
      product_name: product.product_name,
      rim: product.rim,
      dozen: product.dozen,
      sheet: product.sheet_or_piece,
      per_rim_sell_price: product.last_per_rim_price,
      per_dozen_sell_price: product.last_per_dozen_price,
      per_sheet_or_piece_sell_price: product.last_per_sheet_or_piece_price,
    }));

    setSearchQuery(product.product_name); // Update input field
    setFilteredProducts([]); // Hide dropdown
  };

  // Handle manual input changes
  const handleItemChange = (e) => {
    const { name, value } = e.target;

    setItems((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemAdd = () => {
    setFormData((prev) => ({
      ...prev,
      product_info: [
        ...prev.product_info,
        {
          product: items.product,
          rim_sold: items.rim_sold,
          dozen_sold: items.dozen_sold,
          sheet_or_piece_sold: items.sheet_or_piece_sold,
          per_rim_sell_price: items.per_rim_sell_price,
          per_dozen_sell_price: items.per_dozen_sell_price,
          per_sheet_or_piece_sell_price: items.per_sheet_or_piece_sell_price,
        },
      ],
    }));

    // Reset the items state after adding to formData
    setItems({
      product: "",
      stock: 0,
      rim: 0,
      sheet: 0,
      rim_sold: "",
      dozen_sold: "",
      sheet_or_piece_sold: "",
      per_rim_sell_price: "",
      per_dozen_sell_price: "",
      per_sheet_or_piece_sell_price: "",
      total_price: "",
    });
  };

  const handleDeleteItem = (index) => {
    const updatedProductSellInfo = formData.product_info.filter(
      (_, i) => i !== index
    );

    setFormData((prev) => ({
      ...prev,
      product_info: updatedProductSellInfo,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission

      // If the current input is total_price, focus on Previous Due
      if (e.target.name === "total_price") {
        document.getElementById("previous_due").focus();
        return;
      }

      // Otherwise, move to the next input field
      const formElements = Array.from(e.target.form.elements);
      const index = formElements.indexOf(e.target);

      if (index !== -1 && index < formElements.length - 1) {
        formElements[index + 1].focus();
      }
    }
  };

  // ✅ Generate PDF Export
  const handlePDFExport = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "No",
      "Item/Product Code",
      "Rim Quantity",
      "Sheet/Piece Quantity",
      "Rim/Dozen Price",
      "Sheet/Piece Price",
      "Total Amount",
      "Remarks",
    ];

    const tableRows = items.map((item) => [
      item.no,
      item.productDescription,
      item.productCode,
      item.rim_sold,
      item.sheet_or_piece_sold,
      item.per_rim_or_dozen_sell_price,
      item.per_sheet_or_piece_sell_price,
      item.total_price,
      item.remarks,
    ]);

    doc.text("Purchase Items Report", 14, 15);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("purchase_items.pdf");
  };

  // ✅ Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      alert("Purchase, Items, and Payment Information Saved Successfully!");
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Error while saving data. Please try again.");
    }
  };

  return (
    <div className="m-8 mb-0 mx-12">
     <div className="flex justify-between items-center mb-6">
  <h2 className="text-xl font-semibold mb-2 -mt-4 text-center flex-grow text-center">
    Sale
  </h2>
  <Link to="/sale-list" className="btn bg-blue-950 text-white px-4 py-2 rounded-md text-sm">
    Sale List
  </Link>
</div>

      
      <form onSubmit={handleSubmit}>
        <div className="p-4 rounded-xl grid grid-cols-8 gap-2 text-sm bg-white  shadow-[0px_0px_30px_rgba(0,0,0,0.1)]">
       
          {/*1. Date */}
          <div>
            <label className="block text-center">Date</label>
            <input
              name="orderDate"
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={formData.orderDate}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

            {/* Customer Name Search Input */}
            <div className="relative">
            <label className="block text-center">Customer Name</label>
            <input
              type="text"
              name="customerName"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={searchCustomerQuery}
              onChange={handleSearchCustomer}
              onKeyDown={handleKeyDownCustomer}
              onFocus={() => setFilteredCustomers(customers)} // ✅ Show all customers on focus
              placeholder="Search Customer..."
            />
            {/* Dropdown for customer selection */}
            {filteredCustomers.length > 0 && (
              <ul
                className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto z-50"
                style={{ position: "absolute", zIndex: 1000 }}
              >
                {filteredCustomers.map((customer, index) => (
                  <li
                    key={customer.id}
                    className={`p-2 cursor-pointer transition-all ${
                      selectedCustomerIndex === index
                        ? "bg-blue-200 font-semibold"
                        : "hover:bg-blue-100"
                    }`}
                    onMouseDown={() => selectCustomer(customer)}
                  >
                    {customer.customer_name} - {customer.customer_phone_no}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Customer ID (Auto-filled) */}
          <div>
            <label className="block text-center">Customer ID</label>
            <input
              name="customerID"
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={formData.customerID}
              readOnly
            />
          </div>

          {/* Customer Address (Auto-filled) */}
          <div>
            <label className="block text-center">Customer Address</label>
            <input
              name="customerAddress"
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={formData.customerAddress}
              readOnly
            />
          </div>

          {/* Phone Number (Auto-filled) */}
          <div>
            <label className="block text-center">Phone No</label>
            <input
              name="mobile"
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={formData.mobile}
              readOnly
            />
          </div>
        
          {/*6. Reference */}
          <div>
            <label className="block text-center">Reference</label>
            <input
              name="reference"
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={formData.reference}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 7. Remarks */}
          <div>
            <label className="block text-center">Remarks</label>
            <input
              name="remarks"
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={formData.remarks}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Item Details
          </h3>
          <div className="container mx-auto shadow-[0px_0px_30px_rgba(0,0,0,0.1)">
           
              <table className="w-full border-collapse border border-gray-300 shadow-md shadow-[0px_0px_30px_rgba(0,0,0,0.1) form-input">
               <thead>
               <tr className="bg-blue-100 text-center text-sm font-base">
                    <td className="p-2 text-center border">Product</td>

                    <td className="p-2 text-center border">Stock (Rim)</td>
                    <td className="p-2 text-center border">Stock (Dozen)</td>
                    <td className="p-2 text-center border">
                      Stock (Sheet/Piece)
                    </td>
                    <td className="p-2 text-center border">
                      Rim Purchase Price with Additional Cost
                    </td>
                    <td className="p-2 text-center border">
                      Dozen Purchase Price with Additional Cost
                    </td>
                    <td className="p-2 text-center border">
                      Sheet/Piece Purchase Price with Additional Cost
                    </td>
                    <td className="p-2 text-center border">
                      Input Rim/Dozen Quantity
                    </td>
                    <td className="p-2 text-center border">
                      Input Sheet/Piece Quantity
                    </td>
                    <td className="p-2 text-center border">
                      Input Rim/Dozen Price
                    </td>
                    <td className="p-2 text-center border">Total Price</td>
                    <td className="p-2 text-center border">Action</td>
                  </tr>
               </thead>
               
                <tbody>
                  {/* First Row: Column Headings */}
               
                  <tr className="border">
                    {/* Row Number */}

                    {/* Product Select Dropdown */}
                    <td className="border border-gray-300 p-1">
                      <div className="relative">
                        <input
                          type="text"
                          name="product_name"
                          value={searchQuery}
                          className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs bg-white text-gray-600 p-1 form-input"
                          onChange={handleSearchProduct}
                          onKeyDown={handleKeyDownProduct}
                          onFocus={() => {
                            setFilteredProducts(stockData); // Show all products when focused
                            setSelectedIndex(-1);
                          }}
                          placeholder="Search or Select Product..."
                        />
                        {filteredProducts.length > 0 && (
                     <ul
                     className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto z-50"
                     style={{ position: "absolute", zIndex: 1000 }} // ✅ Ensure it's rendered above
                   >
                     {filteredProducts.map((product, index) => (
                       <li
                         key={product.id}
                         className={`p-2 cursor-pointer transition-all ${
                           selectedIndex === index ? "bg-blue-200 font-semibold" : "hover:bg-blue-100"
                         }`}
                         onMouseDown={() => selectProduct(product)}
                       >
                         {product.product_name}
                       </li>
                     ))}
                   </ul>
                   
                        )}
                      </div>
                    </td>

                    {/* Stock (Fetched from API) */}
                    <td className="border text-center">{items.rim}</td>

                    {/* Rim Stock (Fetched from API) */}
                    <td className="border text-center">{items.dozen}</td>

                    {/* Sheet Stock (Fetched from API) */}
                    <td className="border text-center">{items.sheet}</td>

                    {/* Per Rim Sell Price */}
                    <td className="border">
                      <input
                        name="per_rim_sell_price"
                        type="number"
                       className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs bg-white text-gray-600 p-1 form-input"
                        value={items.per_rim_sell_price}
                        onChange={handleItemChange}
                        onKeyDown={handleKeyDown}
                      />
                    </td>

                    {/* Per Dozen Sell Price */}
                    <td className="border">
                      <input
                        name="per_dozen_sell_price"
                        type="number"
                        className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs bg-white text-gray-600 p-1 form-input"
                        value={items.per_dozen_sell_price}
                        onChange={handleItemChange}
                        onKeyDown={handleKeyDown}
                      />
                    </td>

                    {/* Per Sheet or Piece Sell Price */}
                    <td className="border">
                      <input
                        name="per_sheet_or_piece_sell_price"
                        type="number"
                        className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs bg-white text-gray-600 p-1 form-input"
                        value={items.per_sheet_or_piece_sell_price}
                        onChange={handleItemChange}
                        onKeyDown={handleKeyDown}
                      />
                    </td>

                    {/* Rim Sold (Manual Input) */}
                    <td className="border">
                      <input
                        name="rim_sold"
                        type="number"
                        className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs bg-white text-gray-600 p-1 form-input"
                        value={items.rim_sold} // Corrected `itemss.rim_sold` to `items.rim_sold`
                        placeholder="Enter Quantity"
                        onChange={handleItemChange}
                        onKeyDown={handleKeyDown}
                      />
                    </td>

                    {/* Dozen Sold (Manual Input) */}
                    <td className="border">
                      <input
                        name="dozen_sold"
                        type="number"
                        className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs bg-white text-gray-600 p-1 form-input"
                        value={items.dozen_sold}
                        onChange={handleItemChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Quantity"
                      />
                    </td>

                    {/* Sheet or Piece Sold (Manual Input) */}
                    <td className="border">
                      <input
                        name="sheet_or_piece_sold"
                        type="number"
                        className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs bg-white text-gray-600 p-1 form-input"
                        value={items.sheet_or_piece_sold}
                        placeholder="Enter Quantity"
                        onChange={handleItemChange}
                        onKeyDown={handleKeyDown}
                      />
                    </td>

                    {/* Total Price */}
                    <td className="border">
                      <input
                        name="total_price"
                        type="number"
                        className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs bg-white text-gray-600 p-1 form-input"
                        value={items.total_price}
                        onChange={handleItemChange}
                        readOnly
                      />
                    </td>

                    <td>
                    <div className="flex items-center w-full ">
                {/* Add Button - Right Side */}
                <button
                  type="button"
                  onClick={handleItemAdd}
                  className=" text-white px-4 rounded bg-blue-900 text-xs w-20 h-7"
                >
                  Add
                </button>
              </div>
                    </td>
                  </tr>
                </tbody>
              </table>
         
          </div>
        </div>

        
        {formData.product_info && formData.product_info.length > 0 ? (
                <table className="w-full text-sm font-medium border-collapse border border-gray-300 mt-4">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">SL</th>
                      <th className="border p-2">Product</th>
                      <th className="border p-2">Rim Sold</th>
                      <th className="border p-2">Dozen Sold</th>
                      <th className="border p-2">Sheet/Piece Sold</th>
                      <th className="border p-2">Price (Rim)</th>
                      <th className="border p-2">Price (Dozen)</th>
                      <th className="border p-2">Price (Sheet/Piece)</th>
                      <th className="border p-2">Total</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.product_info.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2 text-center">{index + 1}</td>
                        <td className="border p-2">
                          {stockData.find(
                            (stock) => stock.id === parseInt(item.product, 10)
                          )?.product_name || "Unknown"}
                        </td>
                        <td className="border p-2 text-center">
                          {item.rim_sold}
                        </td>
                        <td className="border p-2 text-center">
                          {item.dozen_sold}
                        </td>
                        <td className="border p-2 text-center">
                          {item.sheet_or_piece_sold}
                        </td>
                        <td className="border p-2 text-center">
                          {item.per_rim_sell_price}
                        </td>
                        <td className="border p-2 text-center">
                          {item.per_dozen_sell_price}
                        </td>
                        <td className="border p-2 text-center">
                          {item.per_sheet_or_piece_sell_price}
                        </td>
                        <td className="border p-2 text-center">
                          {item.total_price}
                        </td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => handleDeleteItem(index)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center mt-4">
              
                </p>
              )}

        <h3 className="text-xl font-semibold my-4 text-center">
          Payment Information
        </h3>

        {/* Payment Section Wrapper */}
        <div className=" p-2 py-4 bg-white  shadow-[0px_0px_30px_rgba(0,0,0,0.1)] rounded-md mt-4">
          {/* Grid Layout for Payment Inputs */}
          <div className="grid grid-cols-10 gap-1">
            {/* Previous Due */}
            <div>
              <label className="block text-sm text-center">Previous Due</label>
              <input
                id="previous_due"
                name="previous_due"
                type="number"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                // value={previousDue}
                readOnly
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Today Bill */}
            <div>
              <label className="block text-sm text-center text-nowrap">
                Invoice/ Challan Amount
              </label>
              <input
                name="todayBill"
                type="number"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={formData.todayBill}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Today Paid */}
            <div>
              <label className="block text-sm text-center">Total Due Amount</label>
              <input
                name="todayPaid"
                type="number"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={formData.todayPaid}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Today Paid */}
            <div>
              <label className="block text-sm text-center">Today Paid Amount</label>
              <input
                name="todayPaid"
                type="number"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={formData.todayPaid}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Paid By (Dropdown) */}
            <div>
              <label className="block text-sm text-center">Paid By</label>
              <select
                name="paidBy"
                className="mt-1  w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={formData.paidBy}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
              </select>
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm text-center">Bank Name</label>
              <input
                name="bankName"
                type="text"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={formData.bankName}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Account No */}
            <div>
              <label className="block text-sm text-center">Account No.</label>
              <input
                name="accountNo"
                type="text"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={formData.accountNo}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Cheque No */}
            <div>
              <label className="block text-sm text-center">Cheque No</label>
              <input
                name="chequeNo"
                type="text"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={formData.chequeNo}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Cheque Date */}
            <div>
              <label className="block text-sm text-center">Cheque Date</label>
              <input
                name="chequeDate"
                type="date"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={formData.chequeDate}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Balance Amount */}
            <div>
              <label className="block text-sm text-center">Balance Amount</label>
              <input
                name="balanceAmount"
                type="text"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={formData.balanceAmount}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="mt-6 flex justify-between space-x-4">
          <button
            type="button"
            onClick={handlePDFExport}
            className="bg-blue-500 text-white p-2 rounded flex-1"
          >
            Export to PDF
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex-1"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => alert("Form Cancelled")}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sales;
