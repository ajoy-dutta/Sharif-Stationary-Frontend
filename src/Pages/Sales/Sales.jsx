import { useState } from "react";
import React from "react";

import jsPDF from "jspdf";
import "jspdf-autotable";

const Sales = () => {
  const [remarks, setremarks] = useState("");
  const [customerID, setcustomerID] = useState("");
  const [customerAddress, setcustomerAddress] = useState("");
  const [customerName, setcustomerName] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [orderDate, setOrderDate] = useState("");

  const [driverMobile, setDriverMobile] = useState("");
  // const [productEntryDate, setProductEntryDate] = useState("");
  const [previousDue, setPreviousDue] = useState(0);
  const [todayBill, setTodayBill] = useState(0);
  const [todayPaid, setTodayPaid] = useState(0);
  const [paidBy, setPaidBy] = useState("Cash");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");

  const [items, setItems] = useState([
    {
      no: "", // No (Row Number)
      productDescription: "", // Product Description (Dropdown)
      productCode: "", // Item/Product Code
      rimQuantity: "", // Rim Quantity
      sheetQuantity: "", // Sheet/Piece Quantity
      rimPrice: "", // Rim/Dozen Price
      sheetPrice: "", // Sheet/Piece Price
      totalAmount: "", // Total Amount
      remarks: "", // Remarks
    },
  ]);

  // Handle input change for dynamic rows
  const handleChange = (e, index, field) => {
    const updatedItems = [...items];
    updatedItems[index][field] = e.target.value;

    setItems(updatedItems);
  };

  // Add a new row
  const addRow = () => {
    setItems([
      ...items,
      {
        no: items.length + 1, // Auto-increment row number
        productDescription: "", // Product Description (Dropdown)
        productCode: "", // Item/Product Code
        rimQuantity: "", // Rim Quantity
        sheetQuantity: "", // Sheet/Piece Quantity
        rimPrice: "", // Rim/Dozen Price
        sheetPrice: "", // Sheet/Piece Price
        totalAmount: "", // Total Amount
        remarks: "", // Remarks
      },
    ]);
  };

  // Remove a row
  const removeRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handlePDFExport = () => {
    const doc = new jsPDF();

    // Define table columns
    const tableColumn = [
      "No",
      "Product Description",
      "Item/Product Code",
      "Rim Quantity",
      "Sheet/Piece Quantity",
      "Rim/Dozen Price",
      "Sheet/Piece Price",
      "Total Amount",
      "Remarks",
    ];

    // // Map table rows using correct object keys
    // const tableRows = items.map((item) => [
    //   item.no, // Auto-incremented No.
    //   item.productDescription, // Product Description (Dropdown)
    //   item.productCode, // Item/Product Code
    //   item.rimQuantity, // Rim Quantity
    //   item.sheetQuantity, // Sheet/Piece Quantity
    //   item.rimPrice, // Rim/Dozen Price
    //   item.sheetPrice, // Sheet/Piece Price
    //   item.totalAmount, // Total Amount
    //   item.remarks, // Remarks
    // ]);

    // Add title to PDF
    doc.text("Purchase Items Report", 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Save the PDF
    doc.save("purchase_items.pdf");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // ✅ 1. Save Purchase Receive Data
      const purchaseData = {
        company_name: companyName,
        order_date: orderDate,
        order_no: orderNo,
        invoice_no: invoiceNo,
      };

      alert("Purchase, Items, and Payment Information Saved Successfully!");
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Error while saving data. Please try again.");
    }
  };
  const handleSubmitRow = (index) => {
    const submittedRow = items[index]; // Get the specific row data

    // Example: Send data to backend via API
    fetch("http://127.0.0.1:8000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submittedRow),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        alert(`Row ${index + 1} submitted successfully!`);
      })
      .catch((error) => {
        console.error("Error submitting row:", error);
      });
  };

  return (
    <div className="m-8 mb-0 mx-12">
      <h2 className="text-xl font-semibold mb-2 -mt-4 text-center">Sale</h2>
      <form onSubmit={handleSubmit}>
        <div className="p-4 rounded-xl grid grid-cols-8 gap-2 text-sm bg-white  shadow-[0px_0px_30px_rgba(0,0,0,0.1)]">
          {/*  Date */}
          <div>
            <label className="block text-center">Date</label>
            <input
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>
          {/* Customer Id*/}
          <div>
            <label className="block text-center">Customer ID</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={customerID}
              onChange={(e) => setcustomerID(e.target.value)}
            />
          </div>
          {/* Customer Name */}
          <div>
            <label className="block text-center">Customer Name</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={customerName}
              onChange={(e) => setcustomerName(e.target.value)}
            />
          </div>

          {/**Customer Address */}
          <div>
            <label className="block text-center">Customer Address</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={customerAddress}
              onChange={(e) => setcustomerAddress(e.target.value)}
            />
          </div>

          {/* 8. Driver Mobile No */}
          <div>
            <label className="block text-center">Phone No</label>
            <input
              type="number"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={driverMobile}
              onChange={(e) => setDriverMobile(e.target.value)}
            />
          </div>
          {/* Reference */}
          <div>
            <label className="block text-center">Reference</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={driverMobile}
              onChange={(e) => setDriverMobile(e.target.value)}
            />
          </div>

          {/* 12. Remarks */}
          <div>
            <label className="block text-center">Remarks</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
              value={remarks}
              onChange={(e) => setremarks(e.target.value)}
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
                        <td className="p-2 text-center border">Product Code</td>
                        <td className="p-2 text-center border">
                          Product Description
                        </td>
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
                  className="bg-green-500 text-white px-4 rounded bg-blue-900 text-xs w-24 h-6"
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
