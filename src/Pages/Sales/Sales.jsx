import React from "react";

const Sales = () => {
  return (
    <div className="bg-gray-200 p-4 w-full h-screen flex justify-center items-center">
      <div className="bg-white w-[90%] h-[90%] shadow-lg p-4 overflow-auto">
        <div className="bg-blue-700 text-white p-2 font-bold text-lg">SHARIF PAPER & STATIONARY</div>
        
        <div className="grid grid-cols-2 gap-4 p-2">
          <div className="flex flex-col">
            <label className="font-semibold">Invoice No.</label>
            <input type="text" className="border p-1" />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Date</label>
            <input type="date" className="border p-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-2">
          <div className="flex flex-col">
            <label className="font-semibold">Branch *</label>
            <input type="text" className="border p-1" />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Served By</label>
            <input type="text" className="border p-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-2">
          <div className="flex flex-col">
            <label className="font-semibold">Customer</label>
            <input type="text" className="border p-1" />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Voucher No</label>
            <input type="text" className="border p-1" />
          </div>
        </div>

        <div className="p-2">
          <label className="font-semibold">Remarks</label>
          <textarea className="border p-1 w-full" rows="2"></textarea>
        </div>

        <div className="overflow-auto border my-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-300">
                <th className="border p-1">Item Code</th>
                <th className="border p-1">Title</th>
                <th className="border p-1">Qty</th>
                <th className="border p-1">Rate</th>
                <th className="border p-1">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-1"><input type="text" className="w-full" /></td>
                <td className="border p-1"><input type="text" className="w-full" /></td>
                <td className="border p-1"><input type="number" className="w-full" /></td>
                <td className="border p-1"><input type="number" className="w-full" /></td>
                <td className="border p-1"><input type="number" className="w-full" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-3 gap-4 p-2">
          <div className="flex flex-col">
            <label className="font-semibold">Card/bKash Amount</label>
            <input type="number" className="border p-1" />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Paid Amount</label>
            <input type="number" className="border p-1" />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Due Amount</label>
            <input type="number" className="border p-1" />
          </div>
        </div>

        <div className="flex justify-between p-2">
          <button className="bg-gray-500 text-white px-4 py-2">Preview Invoice</button>
          <button className="bg-blue-500 text-white px-4 py-2">Chalan</button>
        </div>
      </div>
    </div>
  );
};

export default Sales;