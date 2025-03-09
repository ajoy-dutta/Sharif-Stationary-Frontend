import { useState , useEffect} from "react";
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
    const doc = new jsPDF();
    const tableColumn = [
      "No", "Product Description", "Product Code", "Stock (Rim)", "Stock (Dozen)", "Stock (Sheet)", "Rim Price", "Sheet Price", "Input Rim Qty", "Input Sheet Qty", "Input Rim Price", "Input Sheet Price", "Total Price"
    ];
    const tableRows = items.map(item => [
      item.no,
      item.productDescription,
      item.productCode,
      item.stockRim,
      item.stockDozen,
      item.stockSheetPiece,
      item.rimDozenPrice,
      item.sheetPiecePrice,
      item.inputRimDozenQty,
      item.inputSheetPieceQty,
      item.inputRimDozenPrice,
      item.inputSheetPiecePrice,
      item.totalPrice,
    ]);
    doc.text("Purchase Items Report", 14, 15);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("purchase_items.pdf");
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
          <div>
            <label className="block text-center">Customer Name</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
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
