import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AxiosInstance from "../../Components/AxiosInstance";

import { Link } from "react-router-dom";

const Sales = () => {
const [stockData, setStockData] = useState([]);

const [formData, setFormData] = useState({
  orderDate: "",
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
  product_info:[]
});

// Handle manual input changes
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({ ...prev, [name]: value })); 
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

  const selectedStock = stockData.find((stockitem) => stockitem.id === parseInt(stock)); 
  console.log("stock", stock)
  console.log("stockData", stockData)
  console.log("selectedStock",selectedStock.rim)

  if (selectedStock) {
    setItems((prev) => ({
      ...prev,
      rim: selectedStock.rim,
      sheet: selectedStock.sheet_or_piece,
      dozen: selectedStock.dozen,
      per_rim_sell_price: selectedStock.last_per_rim_price,
      per_dozen_sell_price: selectedStock.last_per_dozen_price,
      per_sheet_or_piece_sell_price: selectedStock.last_per_sheet_or_piece_price
    }));
  }

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
  
  const updatedProductSellInfo = formData.product_info.filter((_, i) => i !== index);

  setFormData((prev) => ({
    ...prev,
    product_info: updatedProductSellInfo,
  }));
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
              // onKeyDown={handleKeyDown}
            />
          </div>
          {/*2. Customer Id*/}
          <div>
            <label className="block text-center">Customer ID</label>
            <input
              name="customerID"
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={formData.customerID}
              onChange={handleChange}
            />
          </div>
          {/*3. Customer Name */}
          <div>
            <label className="block text-center">Customer Name</label>
            <input
              name="customerName"
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={formData.customerName}
              onChange={handleChange}
            />
          </div>

          {/** 4. Customer Address */}
          <div>
            <label className="block text-center">Customer Address</label>
            <input
              name="customerAddress"
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={formData.customerAddress}
              onChange={handleChange}
            />
          </div>

          {/* 5. Mobile No */}
          <div>
            <label className="block text-center">Phone No</label>
            <input
              name="mobile"
              type="number"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={formData.mobile}
              onChange={handleChange}
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
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Item Details
          </h3>
          <div className="p-4 rounded-md mt-2 w-full flex justify-center bg-white shadow-[0px_0px_30px_rgba(0,0,0,0.1)] ">
            <div className="overflow-x-auto w-[100%]">
              <table className="table border-collapse w-full">
                <tbody>
                  {/* First Row: Column Headings */}
                  <tr className="bg-gray-200 text-gray-700 text-sm">

                    <td className="p-2 text-center border">Product</td>

                    <td className="p-2 text-center border">Stock(Rim)</td>
                    <td className="p-2 text-center border">Stock(Dozen)</td>
                    <td className="p-2 text-center border">
                      Stock(Sheet/Piece)
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
                  </tr>
                      <tr className="border">
                        {/* Row Number */}

                        {/* Product Select Dropdown */}
                        <td className="border">
                          <select
                            name="product"
                            className="p-1 border border-gray-300 rounded w-full h-8"
                            value={items.product}
                            onChange={(e) => {
                              handleProductChange(e);  
                              handleItemChange(e);    
                            }}
                          >
                            <option value="">Select a product</option>
                            {stockData.map((stock) => (
                              <option key={stock.id} value={stock.id}>
                                 {stock.product_name} {/* Adjust this if you have a name */}
                              </option>
                            ))}
                          </select>
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
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={items.per_rim_sell_price}
                            onChange={handleItemChange}
                          />
                        </td>

                        {/* Per Dozen Sell Price */}
                        <td className="border">
                          <input
                            name="per_dozen_sell_price"
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={items.per_dozen_sell_price}
                            onChange={handleItemChange}
                          />
                        </td>

                        {/* Per Sheet or Piece Sell Price */}
                        <td className="border">
                          <input
                            name="per_sheet_or_piece_sell_price"
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={items.per_sheet_or_piece_sell_price}
                            onChange={handleItemChange}
                          />
                        </td>

                        
                        {/* Rim Sold (Manual Input) */}
                        <td className="border">
                          <input
                            name="rim_sold"
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={items.rim_sold} // Corrected `itemss.rim_sold` to `items.rim_sold`
                            onChange={handleItemChange}
                          />
                        </td>

                        {/* Dozen Sold (Manual Input) */}
                        <td className="border">
                          <input
                            name="dozen_sold"
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={items.dozen_sold}
                            onChange={handleItemChange}
                          />
                        </td>

                        {/* Sheet or Piece Sold (Manual Input) */}
                        <td className="border">
                          <input
                            name="sheet_or_piece_sold"
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={items.sheet_or_piece_sold}
                            onChange={handleItemChange}
                          />
                        </td>

                        {/* Total Price */}
                        <td className="border">
                          <input
                            name="total_price"
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={items.total_price}
                            onChange={handleItemChange}
                            readOnly
                          />
                        </td>
                      </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-center w-full mt-4">

                {/* Add Button - Right Side */}
                <button
                  type="button"
                  onClick={handleItemAdd}
                  className=" text-white px-4 rounded bg-blue-900 text-xs w-24 h-6"
                >
                  Add
                </button>
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
                          {stockData.find((stock) => stock.id === parseInt(item.product, 10))?.product_name || "Unknown"}
                        </td>
                        <td className="border p-2 text-center">{item.rim_sold}</td>
                        <td className="border p-2 text-center">{item.dozen_sold}</td>
                        <td className="border p-2 text-center">{item.sheet_or_piece_sold}</td>
                        <td className="border p-2 text-center">{item.per_rim_sell_price}</td>
                        <td className="border p-2 text-center">{item.per_dozen_sell_price}</td>
                        <td className="border p-2 text-center">{item.per_sheet_or_piece_sell_price}</td>
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
                <p className="text-gray-500 text-center mt-4">No products added yet.</p>
              )}

            </div>

          </div>
        </div>

        <h3 className="text-xl font-semibold my-4 text-center">
          Payment Information
        </h3>

        {/* Payment Section Wrapper */}
        <div className=" p-4 bg-white  shadow-[0px_0px_30px_rgba(0,0,0,0.1)] rounded-md mt-4">
          {/* Grid Layout for Payment Inputs */}
          <div className="grid grid-cols-10 gap-4">
            {/* Previous Due */}
            <div>
              <label className="block  text-center">Previous Due</label>
              <input
                type="number"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7 bg-gray-100"
                // value={previousDue}
                readOnly
              />
            </div>

            {/* Today Bill */}
            <div>
              <label className="block  text-center">
                Today Invoice/Challan Amount
              </label>
              <input
                name="todayBill"
                type="number"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={formData.todayBill}
                onChange={handleChange}
              />
            </div>

            {/* Today Paid */}
            <div>
              <label className="block  text-center">Total Due Amount</label>
              <input
                name="todayPaid"
                type="number"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={formData.todayPaid}
                onChange={handleChange}
              />
            </div>

            {/* Today Paid */}
            <div>
              <label className="block  text-center">Today Paid Amount</label>
              <input
                name="todayPaid"
                type="number"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={formData.todayPaid}
                onChange={handleChange}
              />
            </div>

            {/* Paid By (Dropdown) */}
            <div>
              <label className="block text-center">Paid By</label>
              <select
                name="paidBy"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 focus:ring-2 focus:ring-blue-500"
                value={formData.paidBy}
                onChange={handleChange}
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
              </select>
            </div>

            {/* Bank Name */}
            <div>
              <label className="block  text-center">Bank Name</label>
              <input
                name="bankName"
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={formData.bankName}
                onChange={handleChange}
              />
            </div>

            {/* Account No */}
            <div>
              <label className="block  text-center">Account No.</label>
              <input
                name="accountNo"
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={formData.accountNo}
                onChange={handleChange}
              />
            </div>

            {/* Cheque No */}
            <div>
              <label className="block  text-center">Cheque No</label>
              <input
                name="chequeNo"
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={formData.chequeNo}
                onChange={handleChange}
              />
            </div>

            {/* Cheque Date */}
            <div>
              <label className="block text-center">Cheque Date</label>
              <input
                name="chequeDate"
                type="date"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={formData.chequeDate}
                onChange={handleChange}
              />
            </div>

            {/* Balance Amount */}
            <div>
              <label className="block  text-center">Balance Amount</label>
              <input
                name="balanceAmount"
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={formData.balanceAmount}
                onChange={handleChange}
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
