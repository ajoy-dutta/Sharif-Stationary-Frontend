import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf'; // Updated import

function PurchaseReceiveForm() {
  const [voucherNo, setVoucherNo] = useState('');
  const [date, setDate] = useState('');
  const [challanNo, setChallanNo] = useState('');
  const [challanDate, setChallanDate] = useState('');
  const [supplier, setSupplier] = useState('');
  const [branch, setBranch] = useState('');
  const [remarks, setRemarks] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitSheetPurchaseRate, setUnitSheetPurchaseRate] = useState('');
  const [convSheetPurchaseRate, setConvSheetPurchaseRate] = useState('');
  const [amount, setAmount] = useState('');
  const [unitSheetSaleRate, setUnitSheetSaleRate] = useState('');
  const [convSheetSaleRate, setConvSheetSaleRate] = useState('');
  const [poNo, setPoNo] = useState('');
  const [total, setTotal] = useState(1);
  const [paidAmount, setPaidAmount] = useState('');
  const [dueAmount, setDueAmount] = useState(0);
  const [paidAccount, setPaidAccount] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [chequeDate, setChequeDate] = useState('');
  const [type, setType] = useState('Local');
  const [isNewSupplier, setIsNewSupplier] = useState(false);
  const [items, setItems] = useState([
    {
      itemCode: '',
      title: '',
      cyCn: '',
      rim: '',
      shite: '',
      qty: 1,
      uom: '',
      unitSheetPurchaseRate: '',
      convSheetPurchaseRate: '',
      amount: '',
      unitSheetSaleRate: '',
      convSheetSaleRate: '',
    },
  ]);

  // Handle input change for dynamic rows
  const handleChange = (e, index, field) => {
    const updatedItems = [...items];
    updatedItems[index][field] = e.target.value;
    if (field === 'qty' || field === 'unitSheetPurchaseRate') {
      updatedItems[index].amount = updatedItems[index].qty * updatedItems[index].unitSheetPurchaseRate;
    }
    setItems(updatedItems);
  };

  // Add a new row
  const addRow = () => {
    setItems([
      ...items,
      {
        itemCode: '',
        title: '',
        cyCn: '',
        rim: '',
        shite: '',
        qty: 1,
        uom: '',
        unitSheetPurchaseRate: '',
        convSheetPurchaseRate: '',
        amount: '',
        unitSheetSaleRate: '',
        convSheetSaleRate: '',
      },
    ]);
  };

  // Remove a row
  const removeRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };
  const handlePDFExport = () => {
    const doc = new jsPDF();
    const tableColumn = ['Item Code', 'Title', 'CY/CN', 'RIM', 'Shite', 'Qty', 'UOM', 'Unit/Sheet Purchase Rate', 'Conv./Rim Purchase Rate', 'Amount', 'Unit/Sheet Sale Rate', 'Conv./Rim Sale Rate'];
    const tableRows = items.map(item => [
      item.itemCode, item.title, item.cyCn, item.rim, item.shite, item.qty, item.uom,
      item.unitSheetPurchaseRate, item.convSheetPurchaseRate, item.amount, item.unitSheetSaleRate, item.convSheetSaleRate
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('items.pdf');
  };

  const handleExcelExport = () => {
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Items');
    XLSX.writeFile(wb, 'items.xlsx');
  };

  const handleSearch = () => {
    // Add search functionality here
    console.log('Search clicked');
  };
  // Function to format date as "DD/MM/YYYY"
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-8 bg-gray-100">
      {/* Search Button Above the Form */}
    

      <h2 className="text-2xl font-semibold mb-4">Purchase Receive (Credit)</h2>
      <form onSubmit={handleSubmit}>
 {/* First row with 5 fields */}
 <div className="grid grid-cols-5 gap-6">
    {/* Product Entry Date */}
    <div>
      <label className="block font-medium">Purchase Challan Date</label>
      <input 
        type="date"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>
    
 
    {/* Supplier */}
    <div>
      <label className="block font-medium">Supplier</label>
      <input
        type="text"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
      />
    </div>

  {/* Purchase Voucher No. */}
    <div>
      <label className="block font-medium">Purchase Voucher No.</label>
      <input
        type="text"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={voucherNo}
        onChange={(e) => setVoucherNo(e.target.value)}
      />
    </div>

    {/* Product Type */}
    <div>
      <label className="block font-medium">Product Type</label>
      <select
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="Local">Local</option>
        <option value="Import">Import</option>
      </select>
    </div>

    {/* Purchase Challan Date */}
    <div>
      <label className="block font-medium">Product Entry Date</label>
      <input
        type="date"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={challanDate}
        onChange={(e) => setChallanDate(e.target.value)}
      />
    </div>
  </div>

  {/* Second row with 5 fields */}
  <div className="grid grid-cols-4 gap-6 mt-4">
    {/* Sharif Stationary Voucher No */}
    <div>
      <label className="block font-medium">Sharif Stationary Voucher No</label>
      <input
        type="text"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={voucherNo}
        onChange={(e) => setVoucherNo(e.target.value)}
      />
    </div>

    {/* Branch */}
    <div>
      <label className="block font-medium">Branch</label>
      <input
        type="text"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
      />
    </div>

    {/* Remarks */}
    <div>
      <label className="block font-medium">Remarks</label>
      <textarea
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
    </div>

    {/* PO No */}
    <div>
      <label className="block font-medium">PO No.</label>
      <input
        type="text"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={poNo}
        onChange={(e) => setPoNo(e.target.value)}
      />
    </div>

    {/* Retrieve Button */}
    {/* <div>
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        onClick={() => alert("Retrieve action triggered")}
      >
        Retrieve
      </button>
    </div> */}
  </div>

<div className="p-8">
<h3 className="text-xl font-semibold mb-4">Item Details</h3>
<table className="min-w-full border-collapse">
<thead>
  <tr>
  <th className="px-4 py-2 border h-7">Item Code</th>
  <th className="px-4 py-2 border h-7">Title</th>
  {/* <th className="px-4 py-2 border h-7">CY/CN</th> */}
  <th className="px-4 py-2 border h-7">RIM</th>
  <th className="px-4 py-2 border h-7">Shite</th>
  <th className="px-4 py-2 border h-7">Qty</th>
  <th className="px-4 py-2 border h-7">UOM</th>
  <th className="px-4 py-2 border h-7">Unit/Sheet Purchase Rate</th>
  <th className="px-4 py-2 border h-7">Conv./Rim Purchase Rate</th>
  <th className="px-4 py-2 border h-7">Amount</th>
  <th className="px-4 py-2 border h-7">Unit/Sheet Sale Rate</th>
  <th className="px-4 py-2 border h-7">Conv./Rim Sale Rate</th>
  <th className="px-4 py-2 border h-7">Actions</th>
</tr>

</thead>
<tbody>
  {items.map((item, index) => (
    <tr key={index}>
      <td className="px-4 py-2 border">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={item.itemCode}
          onChange={(e) => handleChange(e, index, 'itemCode')}
        />
      </td>
      <td className="px-4 py-2 border">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={item.title}
          onChange={(e) => handleChange(e, index, 'title')}
        />
      </td>
      <td className="px-4 py-2 border">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={item.cyCn}
          onChange={(e) => handleChange(e, index, 'cyCn')}
        />
      </td>
      <td className="px-4 py-2 border">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={item.rim}
          onChange={(e) => handleChange(e, index, 'rim')}
        />
      </td>
      <td className="px-4 py-2 border">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={item.shite}
          onChange={(e) => handleChange(e, index, 'shite')}
        />
      </td>
      <td className="px-4 py-2 border">
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded"
          value={item.qty}
          onChange={(e) => handleChange(e, index, 'qty')}
        />
      </td>
      <td className="px-4 py-2 border">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={item.uom}
          onChange={(e) => handleChange(e, index, 'uom')}
        />
      </td>
      <td className="px-4 py-2 border">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={item.unitSheetPurchaseRate}
          onChange={(e) => handleChange(e, index, 'unitSheetPurchaseRate')}
        />
      </td>
      <td className="px-4 py-2 border">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={item.convSheetPurchaseRate}
          onChange={(e) => handleChange(e, index, 'convSheetPurchaseRate')}
        />
      </td>
      <td className="px-4 py-2 border">
        <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={item.amount}
                  onChange={(e) => handleChange(e, index, 'amount')}
                  readOnly
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={item.unitSheetSaleRate}
                  onChange={(e) => handleChange(e, index, 'unitSheetSaleRate')}
                />
              </td>
              <td className="px-4 py-2 border">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={item.convSheetSaleRate}
                  onChange={(e) => handleChange(e, index, 'convSheetSaleRate')}
                />
              </td>
              <td className="px-4 py-2 border">
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          type="button"
          onClick={addRow}
          className="bg-green-500 text-white p-2 rounded"
        >
          Add Row
        </button>
      </div>

    </div>


      {/* Payment Section */}
<div className="mb-6">
  <h3 className="text-xl font-semibold mb-2">Payment Information</h3>
  <div className="flex flex-wrap gap-4">
        {/* Supplier */}
        <div>
      <label className="block font-medium">Supplier Name</label>
      <input
        type="text"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
      />
    </div>
     <div className="flex-1">
      <label className="block font-medium"> Previous Due </label>
      <input
        type="text"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={dueAmount}
        onChange={(e) => setDueAmount(e.target.value)}
      />
    </div>
     <div className="flex-1">
      <label className="block font-medium"> Today Bill </label>
      <input
        type="text"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={dueAmount}
        onChange={(e) => setDueAmount(e.target.value)}
      />
    </div>

        {/* Supplier */}
        <div className="flex-1">
      <label className="block font-medium"> Today Paid </label>
      <input
        type="text"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={dueAmount}
        onChange={(e) => setDueAmount(e.target.value)}
      />
    </div>

    <div className="flex-1">
  <label className="block font-medium">Paid By</label>
  <select
    className="mt-1 p-2 w-full border border-gray-300 rounded h-9 focus:ring-2 focus:ring-blue-500"
    // value={paidBy} // Set the default value to the state
    // onChange={(e) => setPaidBy(e.target.value)}
  >
    <option value="cash">Cash</option>
    <option value="bank">Bank</option>
  </select>
</div>



    <div className="flex-1">
      <label className="block font-medium">Paid Amount</label>
      <input
        type="text"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={paidAmount}
        onChange={(e) => setPaidAmount(e.target.value)}
      />
    </div>

    <div className="flex-1">
      <label className="block font-medium">Paid A/C</label>
      <input
        type="text"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={paidAccount}
        onChange={(e) => setPaidAccount(e.target.value)}
      />
    </div>
    <div className="flex-1">
      <label className="block font-medium">Cheque No.</label>
      <input
        type="text"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={chequeNo}
        onChange={(e) => setChequeNo(e.target.value)}
      />
    </div>
    <div className="flex-1">
      <label className="block font-medium">Cheque Date</label>
      <input
        type="date"
        className="mt-1 p-2 w-full border border-gray-300 rounded h-7"
        value={chequeDate}
        onChange={(e) => setChequeDate(e.target.value)}
      />
    </div>
  </div>
</div>
{/* Button Section */}
<div className="mt-6 flex justify-between items-center space-x-4">
  {/* Export to PDF Button */}
  <button
    type="button"
    onClick={handlePDFExport}
    className="bg-blue-500 text-white p-2 rounded flex-1"
  >
    Export to PDF
  </button>

  {/* Submit Button */}
  <button
    type="submit"
    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex-1"
  >
    Submit
  </button>

  {/* Cancel Button */}
  <button
    type="button"
    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex-1"
    onClick={() => alert('Form Cancelled')}
  >
    Cancel
  </button>
</div>


</form>
</div>
);
}

export default PurchaseReceiveForm;