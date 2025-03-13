import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AxiosInstance from "../../Components/AxiosInstance";
import axios from "axios";
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
  const [paymentTypes, setPaymentTypes] = useState([]);

  const [formData, setFormData] = useState({
    orderDate: new Date().toISOString().split("T")[0],
    customer: "",
    customerAddress: "",
    customerName: "",
    mobile: "",
    reference: "",
    remarks: "",
    today_paid_amount: 0,
    invoice_total_amount: 0,
    payment_type: "",
    bank_name: "",
    account_no: "",
    cheque_no: "",
    cheque_date: "",
    balance_amount: 0,
    total_due:0,
    product_info: [],
  });

// To use formData instead:
const isBankSelected = formData.payment_type === "Bank";
const isChequeSelected = formData.payment_type === "Cheque";

     const handleChange = (e) => {
      const { name, value } = e.target;
      const numericValue = value === "" ? "" : parseFloat(value) || 0;
  
      setFormData((prev) => {
          // ✅ Update form data while ensuring "payment_type" is a string
          const updatedForm = { ...prev, [name]: name === "payment_type" ? value : numericValue };
  
          const previousDue = prev.previous_due || 0;
          const invoiceTotal = prev.invoice_total_amount || 0;
          const todayPaid = prev.today_paid_amount || 0;
  
          const totalDue = invoiceTotal > 0 ? invoiceTotal - todayPaid : previousDue;
          const balanceAmount = (totalDue + previousDue).toFixed(2);
  
          return {
              ...updatedForm, // ✅ Spread updated form data
              total_due: totalDue,
              balance_amount: balanceAmount, // ✅ Ensure it's always 2 decimal places
              bank_name: prev.payment_type === "Bank" ? prev.bank_name : "",
              account_no: prev.payment_type === "Bank" ? prev.account_no : "",
              cheque_no: prev.payment_type === "Cheque" ? prev.cheque_no : "",
              cheque_date: prev.payment_type === "Cheque" ? prev.cheque_date : "",
          };
      });
  };
  

  
  // ✅ Fetch payment types from API
useEffect(() => {
  AxiosInstance.get("/payment-types/")
    .then((response) => {
      setPaymentTypes(response.data);
    })
    .catch((err) => {
      console.error("Error fetching payment types:", err);
    });
}, []);
  

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
    setFormData((prev) => {
      const previousDue = parseFloat(customer.due_amount) || 0;
      const totalDue = prev.invoice_total_amount > 0 ? prev.invoice_total_amount - prev.today_paid_amount : previousDue;
      const balanceAmount = (totalDue + previousDue).toFixed(2); // ✅ Ensure 2 decimal places
  
      return {
        ...prev,
        customerID: customer.id,
        customerName: customer.customer_name,
        customerAddress: customer.customer_address,
        mobile: customer.customer_phone_no,
        previous_due: previousDue,
        total_due: totalDue,
        balance_amount: balanceAmount, // ✅ Ensure 2 decimal places
      };
    });
  
    setSearchCustomerQuery(customer.customer_name);
    setFilteredCustomers([]);
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

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : parseFloat(value) || 0;
  
    setItems((prev) => {
      let updatedItems = { ...prev, [name]: numericValue };
  
      // 🔹 Total Price Calculation Logic
      let totalPrice = 0;
      if (updatedItems.rim_sold > 0) {
        totalPrice =
          updatedItems.rim_sold * updatedItems.per_rim_sell_price +
          updatedItems.per_sheet_or_piece_sell_price * updatedItems.sheet_or_piece_sold;
      } else if (updatedItems.dozen_sold > 0) {
        totalPrice =
          updatedItems.dozen_sold * updatedItems.per_dozen_sell_price +
          updatedItems.per_sheet_or_piece_sell_price * updatedItems.sheet_or_piece_sold;
      }
  
      return { ...updatedItems, total_price: totalPrice }; // ✅ Ensure total_price is updated
    });
  };
  

  const handleItemAdd = () => {
    setFormData((prev) => {
      const updatedProductInfo = [
        ...prev.product_info,
        {
          product: items.product,
          rim_sold: items.rim_sold,
          dozen_sold: items.dozen_sold,
          sheet_or_piece_sold: items.sheet_or_piece_sold,
          per_rim_sell_price: items.per_rim_sell_price,
          per_dozen_sell_price: items.per_dozen_sell_price,
          per_sheet_or_piece_sell_price: items.per_sheet_or_piece_sell_price,
          total_price: items.total_price,
        },
      ];
  
      const updatedInvoiceTotal = updatedProductInfo.reduce(
        (sum, item) => sum + (parseFloat(item.total_price) || 0),
        0
      );
  
      const totalDue = updatedInvoiceTotal - prev.today_paid_amount;
      const balanceAmount = (totalDue + (prev.previous_due || 0)).toFixed(2); // ✅ Ensure 2 decimal places
  
      return {
        ...prev,
        product_info: updatedProductInfo,
        invoice_total_amount: updatedInvoiceTotal,
        balance_amount: balanceAmount,
      };
    });
  
    // ✅ Reset item state and clear product search input
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
  
    setSearchQuery(""); // ✅ Clear the search query input
  };
  
  
  

  const handleDeleteItem = (index) => {
    setFormData((prev) => {
      const updatedProductInfo = prev.product_info.filter((_, i) => i !== index);
  
      // 🔹 Recalculate invoice_total_amount
      const updatedInvoiceTotal = updatedProductInfo.reduce(
        (sum, item) => sum + (parseFloat(item.total_price) || 0),
        0
      );
  
      return {
        ...prev,
        product_info: updatedProductInfo,
        invoice_total_amount: updatedInvoiceTotal, // ✅ Update invoice_total_amount
      };
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Prepare request payload
      const requestData = {
        ...formData,
        previous_due: parseFloat(formData.previous_due) || 0,
        todayBill: parseFloat(formData.todayBill) || 0,
        todayPaid: parseFloat(formData.todayPaid) || 0,
        balanceAmount: parseFloat(formData.balanceAmount) || 0,
        payment_type: formData.payment_type,
        bank_name: formData.bank_name,
        account_no: formData.account_no,
        cheque_no: formData.cheque_no,
        cheque_date: formData.cheque_date || null,
        product_info: formData.product_info.map((item) => ({
          product: item.product,
          rim_sold: parseFloat(item.rim_sold) || 0,
          dozen_sold: parseFloat(item.dozen_sold) || 0,
          sheet_or_piece_sold: parseFloat(item.sheet_or_piece_sold) || 0,
          per_rim_sell_price: parseFloat(item.per_rim_sell_price) || 0,
          per_dozen_sell_price: parseFloat(item.per_dozen_sell_price) || 0,
          per_sheet_or_piece_sell_price:
            parseFloat(item.per_sheet_or_piece_sell_price) || 0,
        })),
      };

      // ✅ Get CSRF token from cookies
      const getCSRFToken = () => {
        return document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];
      };

      // ✅ Send data using direct axios request
      const response = await axios.post(
        "http://127.0.0.1:8000/api/sales/",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(), // ✅ Send CSRF token in headers
          },
          withCredentials: true, // ✅ Ensures cookies (CSRF token) are sent
        }
      );

      console.log("✅ Sales Data Submitted Successfully:", response.data);
      alert("✅ Purchase, Items, and Payment Information Saved Successfully!");

      // ✅ Reset form after successful submission
      setFormData({
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
        bank_name: "",
        account_no: "",
        cheque_no: "",
        cheque_date: "",
        balanceAmount: 0,
        product_info: [],
      });
    } catch (error) {
      console.error("❌ Error submitting sales data:", error.response?.data);
      alert("❌ Error while saving data. Please try again.");
    }
  };

  return (
    <div className="m-8 mb-0 mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold mb-2 -mt-4  flex-grow text-center">
          Sale
        </h2>
        <Link
          to="/sale-list"
          className="btn bg-blue-950 text-white px-4 py-2 rounded-md text-sm"
        >
          Sale List
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-4 rounded-xl grid grid-cols-8 gap-2 text-sm bg-white  shadow-[0px_0px_30px_rgba(0,0,0,0.1)]">
          {/*1. Date */}
          <div>
            <label className="block text-center">Date</label>
            <input
              name="sale_date"
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={formData.sale_date}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Customer Name Search Input */}
          <div className="relative">
            <label className="block text-center">Customer Name</label>
            <input
              type="text"
              name="customer"
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
                    {customer.customer_name}
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
                  <td className="p-2 text-center border">Input Rim Quantity</td>

                  <td className="p-2 text-center border">
                    Input Dozen Quantity
                  </td>
                  <td className="p-2 text-center border">
                    Input Sheet/Piece Quantity
                  </td>
                  {/* <td className="p-2 text-center border">
                      Input Rim/Dozen Price
                    </td> */}
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
                                selectedIndex === index
                                  ? "bg-blue-200 font-semibold"
                                  : "hover:bg-blue-100"
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

                  {/* Rim Sold Input - Disable when Dozen is greater than 0 */}
                  <td className="border">
                    <input
                      name="rim_sold"
                      type="number"
                      className={`mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input ${
                        items.dozen > 0 ? "bg-gray-200 cursor-not-allowed" : ""
                      }`}
                      value={items.rim_sold}
                      placeholder="Enter rim quantity"
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      disabled={items.dozen > 0} // ✅ Disable if Dozen > 0
                    />
                  </td>

                  {/* Dozen Sold Input - Disable when Rim is greater than 0 */}
                  <td className="border">
                    <input
                      name="dozen_sold"
                      type="number"
                      className={`mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input ${
                        items.rim > 0 ? "bg-gray-200 cursor-not-allowed" : ""
                      }`}
                      value={items.dozen_sold}
                      placeholder="Enter dozen quantity"
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      disabled={items.rim > 0} // ✅ Disable if Rim > 0
                    />
                  </td>

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
                  <td className="border p-2 text-center">{item.rim_sold}</td>
                  <td className="border p-2 text-center">{item.dozen_sold}</td>
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
                  <td className="border p-2 text-center">{item.total_price}</td>
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
          <p className="text-gray-500 text-center mt-4"></p>
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
                value={formData.previous_due} 
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
                name="invoice_total_amount"
                type="number"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={formData.invoice_total_amount}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>

               {/* Today Paid */}
               <div>
              <label className="block text-sm text-center">
                Today Paid Amount
              </label>
              <input
                name="today_paid_amount"
                type="number"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={formData.today_paid_amount}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <label className="block text-sm text-center">
                Total Due Amount
              </label>
              <input
                name="total_due"
                type="number"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={formData.total_due}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>

         

            {/* Paid By (Dropdown) */}
            <div>
  <label className="block text-sm text-center">Paid By</label>
  <select
    name="payment_type"
    className="mt-1 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
    value={formData.payment_type}
    onChange={handleChange}
    onKeyDown={handleKeyDown}
  >
    <option value="">Select Payment Type</option> {/* Optional */}
    {paymentTypes.map((type) => (
      <option key={type.id} value={type.payment_type}>
        {type.payment_type}
      </option>
    ))}
  </select>
</div>


            {/* Bank Name */}
            <div>
              <label className="block text-sm text-center">Bank Name</label>
              <input
                name="bank_name"
                type="text"
                className={`mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input ${
                  !isBankSelected ? "bg-gray-200 cursor-not-allowed" : "bg-white"
                }`}
                value={formData.bank_name}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={!isBankSelected} 
              />
            </div>

            {/* Account No */}
            <div>
              <label className="block text-sm text-center">Account No.</label>
              <input
                name="account_no"
                type="text"
                className={`mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input ${
                  !isBankSelected ? "bg-gray-200 cursor-not-allowed" : "bg-white"
                }`}
                value={formData.account_no}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={!isBankSelected} 
              />
            </div>

            {/* Cheque No */}
            <div>
              <label className="block text-sm text-center">Cheque No</label>
              <input
                name="cheque_no"
                type="text"
                className={`mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input ${
                  !isChequeSelected ? "bg-gray-200 cursor-not-allowed" : "bg-white"
                }`}
                value={formData.cheque_no}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={!isChequeSelected} 
              />
            </div>

            {/* Cheque Date */}
            <div>
              <label className="block text-sm text-center">Cheque Date</label>
              <input
                name="cheque_date"
                type="date"
                className={`mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input ${
                  !isChequeSelected ? "bg-gray-200 cursor-not-allowed" : "bg-white"
                }`}
                value={formData.cheque_date}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={!isChequeSelected} 
              />
            </div>

            {/* Balance Amount */}
            <div>
              <label className="block text-sm text-center">
                Balance Amount
              </label>
              <input
                name="balance_amount"
                type="text"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                value={parseFloat(formData.balance_amount).toFixed(2)}
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
