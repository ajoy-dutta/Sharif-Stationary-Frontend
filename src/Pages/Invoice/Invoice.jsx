import { useState } from "react";

const Invoice = () => {
  // Empty transactions list (starts with no data)

  const [transactions, setTransactions] = useState([]);
  const [customerName, setCustomerName] = useState([]);

  const [customerId, setCustomerId] = useState([]);
  const [address, setAddress] = useState([]);
  const [contactNo, setContactNo] = useState([]);
  const [email, setEmail] = useState([]);
  const [accountLedgerPeriod, setAccountLedgerPeriod] = useState([]);

  // Default column fields
  const defaultFields = [
    "id",
    "date",
    "Invoice No",
    "type",
    "debit",
    "credit",
    "balance",
  ];

  // Button Click Handler
  const handleInvoiceClick = () => {
    alert("Submitted Successfully"); // You can replace this with your actual logic
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-1 bg-blue-50 ">
    {/* Header */}
    <header className="text-center text-red-800 space-y-1 ">
      <h1 className="text-2xl font-bold text-red-600 leading-tight">
        Sharif Stationary
      </h1>
      <p className="text-sm text-blue-700 leading-tight">
        36, Gohata Road, Lohapotty, Jashore
      </p>
      <p className="text-sm text-red-600 leading-tight">
        Cell: 01854-341463, 01707-341463, 01711-334408
      </p>
      <p className="text-sm text-gray-800 leading-tight">
        Nagad & Bkash: 01707-341463 (Personal)
      </p>
    </header>
  
    {/* Table Container */}
    <div className="container mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold text-center text-blue-700 mb-1 -mt-2">
        Invoice System
      </h2>
  {/* Container for both sections */}
<div className="w-full flex flex-col items-center">
  {/* Customer Details Section */}
  <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden mx-auto">
    <div className="bg-gray-100 p-1 rounded-lg shadow-md w-full mt-0">
      <h3 className="text-md text-green-700 font-bold text-center  mb-2">
        Customer Details
      </h3>

      <div className="grid grid-cols-3 gap-8 w-full px-4">
        {/* Column 1 */}
        <div className="flex flex-col text-sm">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Customer Name&nbsp;:</span>
            <span className="text-gray-900">{customerName || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Invoice No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span className="text-gray-900">{accountLedgerPeriod || "N/A"}</span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col text-sm">
        <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Customer ID&nbsp;:</span>
            <span className="text-gray-900">{customerId || "N/A"}</span>
          </div>
         
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Contact No&nbsp;&nbsp;&nbsp;:</span>
            <span className="text-gray-900">{contactNo || "N/A"}</span>
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col text-sm">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Address&nbsp;:</span>
            <span className="text-gray-900">{address || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span className="text-gray-900">{email || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Transactions Table */}
  <div className="w-full max-w-4xl overflow-x-auto mt-6 mb-20 mx-auto">
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden table-fixed">
      <thead>
        <tr className="bg-gray-200 text-gray-700 text-sm">
          {defaultFields.map((field, index) => (
            <th key={index} className="px-4 py-2 border text-center capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              {defaultFields.map((field, idx) => (
                <td key={idx} className="border px-4 py-2 text-center">
                  {transaction[field]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={defaultFields.length} className="text-center p-4 text-gray-500">
              No transactions available.
            </td>
          </tr>
        )}
      </tbody>
    </table>

    {/* Right-side Invoice Button */}
    <div className="flex justify-end mt-4">
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all"
        onClick={handleInvoiceClick}
      >
        Invoice
      </button>
    </div>
  </div>
</div>



    </div>
  </div>
  
  );
};

export default Invoice;
