import { useState , useEffect} from "react";
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ChevronDown } from 'lucide-react';


const Sales = () => {
  // State Variables
  const [companyName, setCompanyName] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [driverMobile, setDriverMobile] = useState("");
  const [reference, setReference] = useState("");
  const [previousDue, setPreviousDue] = useState(0);
  const [todayBill, setTodayBill] = useState(0);
  const [todayPaid, setTodayPaid] = useState(0);
  const [paidBy, setPaidBy] = useState("Cash");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTable, setshowTable] = useState(false);



  const [items, setItems] = useState([
    {
      no: 1,
      productDescription: "",
      productCode: "",
      stockRim: "",
      stockDozen: "",
      stockSheetPiece: "",
      rimDozenPrice: "",
      sheetPiecePrice: "",
      inputRimDozenQty: "",
      inputSheetPieceQty: "",
      inputRimDozenPrice: "",
      inputSheetPiecePrice: "",
      totalPrice: "",
    },
  ]);

  const handleChange = (e, index, field) => {
    const updatedItems = [...items];
    updatedItems[index][field] = e.target.value;
    setItems(updatedItems);
  };

  const addRow = () => {
    setItems([
      ...items,
      {
        no: items.length + 1,
        productDescription: "",
        productCode: "",
        stockRim: "",
        stockDozen: "",
        stockSheetPiece: "",
        rimDozenPrice: "",
        sheetPiecePrice: "",
        inputRimDozenQty: "",
        inputSheetPieceQty: "",
        inputRimDozenPrice: "",
        inputSheetPiecePrice: "",
        totalPrice: "",
      },
    ]);
  };

  const removeRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handlePDFExport = () => {
    const invoiceWindow = window.open("", "_blank"); // Open new window
  
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Sales Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { width: 80%; margin: auto; border: 1px solid #ddd; padding: 20px; }
            .header { text-align: center; }
            .title { font-size: 20px; font-weight: bold; }
            .details { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
            .total { font-size: 16px; font-weight: bold; margin-top: 20px; text-align: right; }
            .buttons { text-align: center; margin-top: 20px; }
            .buttons button { padding: 10px 15px; margin: 5px; cursor: pointer; }
            .total-row td { font-weight: bold; background-color: #f2f2f2; }
            .total-text { text-align: center; } /* Total text alignment */
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>SHARIF PAPER & STATIONARY</h2>
              <p>36-GOHATA ROAD, LOHAPOTTY, JASHORE</p>
              <p>Shop Contact: 01854-341463</p>
            </div>
  
            <div class="title">SALES INVOICE</div>
  
            <div class="details">
              <p><strong>Served By:</strong> YEASIN ARAFAT</p>
              <p><strong>Date & Time:</strong> 29/01/25 10:35 PM</p>
              <p><strong>Invoice No:</strong> SSP.INV.00003210.25</p>
              <p><strong>Pay Method:</strong> Cash</p>
            </div>
  
            <div class="details">
              <p><strong>Customer:</strong> Likhoni</p>
              <p><strong>Address:</strong> RAZGONG-AMINUR</p>
              <p><strong>Phone No:</strong> 01545545555</p>
            </div>
  
            <table id="invoiceTable">
              <thead>
                <tr>
                  <th>Sl. No</th>
                  <th>Item Code</th>
                  <th>Title</th>
                  <th>Unit Qty</th>
                  <th>Name</th>
                  <th>Discount %</th>
                  <th>Conversion Qty</th>
                  <th>Rim Rate</th>
                  <th>Sheet Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>00000368</td>
                  <td>16 OFFSET REGISTER</td>
                  <td>2</td>
                  <td>Dz</td>
                  <td>Dz</td>
                  <td>Dz</td>
                  <td>Dz</td>
                  <td>624.00</td>
                  <td class="amount">1248.00</td>
                </tr>
                <!-- Additional rows can be added dynamically -->
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="9" class="total-text">Total</td>
                  <td id="totalAmount">0.00</td>
                </tr>
              </tfoot>
            </table>
  
            <div class="total">
              <p>Net Amount: <span id="netAmount">1248.00</span></p>
              <p>Due Amount: 1248.00</p>
              <p>Previous Due: 0.00</p>
              <p>Current Due: 1248.00</p>
            </div>
  
            <div class="buttons">
              <button onclick="window.print()">Print</button>
              <button onclick="downloadPDF()">Download PDF</button>
            </div>
  
            <script>
              function calculateTotal() {
                let total = 0;
                document.querySelectorAll(".amount").forEach(cell => {
                  total += parseFloat(cell.innerText) || 0;
                });
                document.getElementById("totalAmount").innerText = total.toFixed(2);
                document.getElementById("netAmount").innerText = total.toFixed(2);
              }
  
              function downloadPDF() {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                doc.text("Sales Invoice", 14, 15);
                doc.autoTable({ html: "#invoiceTable" });
                doc.save("invoice.pdf");
              }
  
              calculateTotal(); // Call function to calculate total
            </script>
          </div>
        </body>
      </html>
    `);
  
    invoiceWindow.document.close();
  };
  
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Purchase, Items, and Payment Information Saved Successfully!");
  };;

  useEffect(() => {
    setOrderDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formElements = Array.from(document.querySelectorAll("input, select"));
      const index = formElements.indexOf(e.target);
      if (index >= 0 && index < formElements.length - 1) {
        formElements[index + 1].focus();
      }
    }
  };
  const handleSelectCashSale = () => {
    setCustomerName('Cash Sale');
    setShowDropdown(false);
    setshowTable(true);
  };
  
    // "Cash Sale" সিলেক্টের পর অন্য কাজ থাকলে এখানে লিখুন

  
  return (
    <div className="m-8 mb-0 mx-12">
      <h2 className="text-xl font-semibold mb-2 -mt-4 text-center">Sale</h2>
      <form onSubmit={handleSubmit}
                    onKeyDown={handleKeyDown}
>
        {/* sale */}
        <div className="p-4 rounded-xl grid grid-cols-8 gap-2 text-sm bg-white shadow-[0px_0px_30px_rgba(0,0,0,0.1)]">
          <div>
            <label className="block text-center">Date</label>
            <input
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <label className="block text-center">Customer ID</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7 bg-gray-200"
              value={customerID}
              readOnly
              placeholder="Auto-generated"
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="relative">
  <label className="block text-center">Customer Name</label>
  <input
    type="text"
    className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
    value={customerName}
    onChange={(e) => setCustomerName(e.target.value)}
    onKeyDown={handleKeyDown}
  />
  <button
    type="button"
    className="absolute right-2 top-7"
    onClick={() => setShowDropdown((prev) => !prev)}
  >
    <ChevronDown size={18} />
  </button>

  {showDropdown && (
    <div className="absolute bg-white border border-gray-300 rounded w-full mt-1 shadow-md">
      <div
        className="p-2 hover:bg-gray-200 cursor-pointer"
        onClick={handleSelectCashSale}
      >
        Cash Sale
      </div>
    </div>
  )}

  {showTable && (
    <div className="mt-4 p-4 border rounded shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Customer Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">
              {/* backend data here */}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )}
</div>

          <div>
            <label className="block text-center">Customer Address</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <label className="block text-center">Phone No</label>
            <input
              type="number"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={driverMobile}
              onChange={(e) => setDriverMobile(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <label className="block text-center">Reference</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <label className="block text-center">Remarks</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              onKeyDown={handleKeyDown}
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
                        <td className="p-2 text-center border">No</td>
                        <td className="p-2 text-center border">
                          Product Description
                        </td>
                        <td className="p-2 text-center border">Product Code</td>
                        
                        <td className="p-2 text-center border">Stock(Rim)</td>
                        <td className="p-2 text-center border">Stock(Dozen)</td>
                        <td className="p-2 text-center border">
                          Stock(Sheet/Piece)
                        </td>
                        <td className="p-2 text-center border">
                          Rim/Dozen Purchase Price with Additional Cost
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
                        <td className="p-2 text-center border">
                          Input only sheet/piece Price
                        </td>
                        <td className="p-2 text-center border">Total Price</td>
                      </tr>
                      {items.map((item, index) => (
                        <React.Fragment key={index}>
                      {/* Second Row: Input Fields */}
                      <tr className="border">
                        <td className="border text-center">{index + 1}</td>
                       
                        <td className="border">
                          <select
                            className="p-1 border border-gray-300 rounded w-full h-8"
                            value={item.productDescription}
                            onChange={(e) =>
                              handleChange(e, index, "productDescription")
                            }
                          >
                            <option value="">Select</option>
                            <option value="Other">Other</option>
                          </select>
                          {item.productDescription === "Other" && (
                            <input
                              type="text"
                              className="p-1 border border-gray-300 rounded w-full h-8 mt-1"
                              placeholder="Enter custom description"
                              value={item.customProductDescription || ""}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  index,
                                  "customProductDescription"
                                )
                              }
                            />
                          )}
                        </td>
                        <td className="border">
                          <select
                            className="p-1 border border-gray-300 rounded w-full h-8"
                            value={item.productCode}
                            onChange={(e) =>
                              handleChange(e, index, "productCode")
                            }
                          >
                            <option value="">Select</option>
                            <option value="Other">Other</option>
                          </select>
                          {item.productCode === "Other" && (
                            <input
                              type="text"
                              className="p-1 border border-gray-300 rounded w-full h-8 mt-1"
                              placeholder="Enter custom product code"
                              value={item.customProductCode || ""}
                              onChange={(e) =>
                                handleChange(e, index, "customProductCode")
                              }
                            />
                          )}
                        </td>


                        <td className="border">
                          <input
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={item.stockRim}
                            onChange={(e) => handleChange(e, index, "stockRim")}
                          />
                        </td>

                        <td className="border">
                          <input
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={item.stockDozen}
                            onChange={(e) =>
                              handleChange(e, index, "stockDozen")
                            }
                          />
                        </td>

                        <td className="border">
                          <input
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={item.stockSheetPiece}
                            onChange={(e) =>
                              handleChange(e, index, "stockSheetPiece")
                            }
                          />
                        </td>

                        <td className="border">
                          <input
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={item.rimDozenPrice}
                            onChange={(e) =>
                              handleChange(e, index, "rimDozenPrice")
                            }
                          />
                        </td>

                        <td className="border">
                          <input
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={item.sheetPiecePrice}
                            onChange={(e) =>
                              handleChange(e, index, "sheetPiecePrice")
                            }
                          />
                        </td>

                        <td className="border">
                          <input
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={item.inputRimDozenQty}
                            onChange={(e) =>
                              handleChange(e, index, "inputRimDozenQty")
                            }
                          />
                        </td>

                        <td className="border">
                          <input
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={item.inputSheetPieceQty}
                            onChange={(e) =>
                              handleChange(e, index, "inputSheetPieceQty")
                            }
                          />
                        </td>

                        <td className="border">
                          <input
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={item.inputRimDozenPrice}
                            onChange={(e) =>
                              handleChange(e, index, "inputRimDozenPrice")
                            }
                          />
                        </td>

                        <td className="border">
                          <input
                            type="number"
                            className="p-1 border border-gray-300 rounded w-full h-8 text-center"
                            value={item.inputSheetPiecePrice}
                            onChange={(e) =>
                              handleChange(e, index, "inputSheetPiecePrice")
                            }
                          />
                        </td>

                        <td className="border">
                          <input
                            type="number"
                            className="p-1 w-full h-8 border border-gray-300 rounded text-center"
                            value={item.totalPrice}
                          />
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center w-full mt-4">
                {/* Remove Button - Left Side */}
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="bg-red-500 text-white px-4 rounded hover:bg-red-600 text-xs w-24 h-6"
                >
                  Remove
                </button>

                {/* Add Button - Right Side */}
                <button
                  type="button"
                  onClick={addRow}
                  className="bg-blue-500 text-white px-4 rounded bg-blue-900 text-xs w-24 h-6"
                >
                  Add
                </button>
              </div>
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
                value={previousDue}
                readOnly
              />
            </div>

            {/* Today Bill */}
            <div>
              <label className="block  text-center">
                Today Invoice/Challan Amount
              </label>
              <input
                type="number"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={todayBill}
                onChange={(e) => setTodayBill(e.target.value)}
              />
            </div>

            {/* Today Paid */}
            <div>
              <label className="block  text-center">Total Due Amount</label>
              <input
                type="number"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={todayPaid}
                onChange={(e) => setTodayPaid(e.target.value)}
              />
            </div>

            {/* Today Paid */}
            <div>
              <label className="block  text-center">Today Paid Amount</label>
              <input
                type="number"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={todayPaid}
                onChange={(e) => setTodayPaid(e.target.value)}
              />
            </div>

            {/* Paid By (Dropdown) */}
            <div>
              <label className="block text-center">Paid By</label>
              <select
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 focus:ring-2 focus:ring-blue-500"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
              </select>
            </div>

            {/* Bank Name */}
            <div>
              <label className="block  text-center">Bank Name</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>

            {/* Account No */}
            <div>
              <label className="block  text-center">Account No.</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
              />
            </div>

            {/* Cheque No */}
            <div>
              <label className="block  text-center">Cheque No</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={chequeNo}
                onChange={(e) => setChequeNo(e.target.value)}
              />
            </div>

            {/* Cheque Date */}
            <div>
              <label className="block text-center">Cheque Date</label>
              <input
                type="date"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={chequeDate}
                onChange={(e) => setChequeDate(e.target.value)}
              />
            </div>

            {/* Balance Amount */}
            <div>
              <label className="block  text-center">Balance Amount</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
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
}

export default Sales;
