import { useState } from 'react';
 

const Sales = () => {
  const [formData, setFormData] = useState({
    invoiceNo: "",
    date: "",
    branch: "",
    servedBy: "",
    voucherNo: "",
    customer: "",
    customerAddress: "",
    remarks: "",
    deliveryAddress: "",
    temporaryCustomer: false,
    payMethod: "Cash",
    cardDetails: "",
    items: [
      {
        itemCode: "",
        title: "",
        cyCn: "",
        rim: 0,
        sheet: 0,
        qty: 0,
        balance: 0,
        uom: "",
        sheetRate: 0,
        convRim: 0,
        vat: 0,
        vatAmount: 0,
        itemTotal: 0,
        discount: 0,
        discountAmount: 0,
        quantityAmount: 0,
        unitQuantity: 0,
        name: "",
      },
    ],
    cardAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    totalAmount: 0,
    discount: 0,
    vatTotal: 0,
    exchangePoint: 0,
    netAmount: 0,
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedItems = [...prevData.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: value === "" ? "" : isNaN(value) ? value : Number(value), // Ensure numbers are stored properly
      };

      return { ...prevData, items: updatedItems };
    });
  };

  const addItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        {
          itemCode: "",
          title: "",
          cyCn: "",
          rim: 0,
          sheet: 0,
          qty: 0,
          balance: 0,
          uom: "",
          sheetRate: 0,
          convRim: 0,
          vat: 0,
          vatAmount: 0,
          itemTotal: 0,
          discount: 0,
          discountAmount: 0,
          quantityAmount: 0,
          unitQuantity: 0,
          name: "",
        },
      ],
    }));
  };

   // Delete a row
   const deleteItem = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Sales Form</h1>

      {/* Invoice Details Section */}
      <div className="grid grid-cols-4 gap-4 mb-6">
  <div>
    <label className="block text-sm font-medium">Invoice No.</label>
    <div className="flex">
      <input
        type="text"
        name="invoiceNo"
        value={formData.invoiceNo}
        onChange={handleChange}
        className="w-full px-8 py-1 border border-gray-300 rounded"
      />
      <button className="ml-2 px-8 py-1 bg-blue-500 text-white rounded">Search</button>
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium">Date</label>
    <input
      type="date"
      name="date"
      value={formData.date}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>

  <div>
    <label className="block text-sm font-medium">Branch</label>
    <input
      type="text"
      name="branch"
      value={formData.branch}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>

  <div>
    <label className="block text-sm font-medium">Served By</label>
    <input
      type="text"
      name="servedBy"
      value={formData.servedBy}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>
</div>

<div className="grid grid-cols-4 gap-4 mb-6">
  <div>
    <label className="block text-sm font-medium">Voucher No.</label>
    <input
      type="text"
      name="voucherNo"
      value={formData.voucherNo}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>

  <div>
    <label className="block text-sm font-medium">Pay Method</label>
    <select
      name="payMethod"
      value={formData.payMethod}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    >
      <option value="Cash">Cash</option>
      <option value="Card">Card</option>
      <option value="bKash">bKash</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium">Card Details</label>
    <input
      type="text"
      name="cardDetails"
      value={formData.cardDetails}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>

  <div className="flex items-center">
    <input
      type="checkbox"
      name="temporaryCustomer"
      checked={formData.temporaryCustomer}
      onChange={() => setFormData({ ...formData, temporaryCustomer: !formData.temporaryCustomer })}
      className="mr-2"
    />
    <label className="block text-sm font-medium">Temporary Customer</label>
  </div>
</div>

<div className="grid grid-cols-4 gap-4 mb-6">
  <div>
    <label className="block text-sm font-medium">Delivery Address</label>
    <input
      type="text"
      name="deliveryAddress"
      value={formData.deliveryAddress}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>

  <div>
    <label className="block text-sm font-medium">Customer</label>
    <input
      type="text"
      name="customer"
      value={formData.customer}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>

  <div>
    <label className="block text-sm font-medium">Customer Address</label>
    <input
      type="text"
      name="customerAddress"
      value={formData.customerAddress}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>

  <div>
    <label className="block text-sm font-medium">Remarks</label>
    <textarea
      name="remarks"
      value={formData.remarks}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>
</div>


      {/* Items Section */}
      <div>
      <h2>Items</h2>
      <table className="table-auto w-full mb-6 border">
        <thead>
        <tr>
  <th className="border px-8 py-1">Item Code</th>
  <th className="border px-8 py-1">Title</th>
  <th className="border px-8 py-1">CY/CN</th>
  <th className="border px-7 py-1">RIM</th>
  <th className="border px-8 py-1">SHEET</th>
  <th className="border px-7 py-1">Qty</th>
  <th className="border px-8 py-1">Balance</th>
  <th className="border px-7 py-1">UOM</th>
  <th className="border px-8 py-1">Sheet Rate</th>
  <th className="border px-8 py-1">Conv./RIM</th>
  <th className="border px-7 py-1">VAT %</th>
  <th className="border px-8 py-1">VAT Amount</th>
  <th className="border px-8 py-1">Item Total</th>
  <th className="border px-8 py-1">Discount %</th>
  <th className="border px-8 py-1">Discount Amount</th>
  <th className="border px-8 py-1">Quantity Amount</th>
  <th className="border px-8 py-1">Unit Quantity</th>
  <th className="border px-8 py-1">Name</th>
  <th className="border px-8 py-1">Action</th>
</tr>


        </thead>
        <tbody>
          {formData.items.map((item, index) => (
            <tr key={index}>
              {Object.keys(item).map((key) => (
                <td key={key} className="border px-8 py-1">
                  <input
                    type={typeof item[key] === "number" ? "number" : "text"}
                    name={key}
                    value={item[key]}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
              ))}
              <td className="border px-8 py-1 text-center">
                <button
                  onClick={() => deleteItem(index)}
                  className="px-4 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addItem}
        className="px-8 py-1 bg-green-500 text-white rounded mb-4"
      >
        Add Item
      </button>
    </div>
      {/* Payment and Summary Section */}
  <div className="grid grid-cols-4 gap-4 mb-6">
  <div>
    <label className="block text-sm font-medium">Card/bKash Amount</label>
    <input
      type="number"
      name="cardAmount"
      value={formData.cardAmount}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>
  <div>
    <label className="block text-sm font-medium">Paid Amount</label>
    <input
      type="number"
      name="paidAmount"
      value={formData.paidAmount}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>
  <div>
    <label className="block text-sm font-medium">Due Amount</label>
    <input
      type="number"
      name="dueAmount"
      value={formData.dueAmount}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>
  <div>
    <label className="block text-sm font-medium">Discount</label>
    <input
      type="number"
      name="discount"
      value={formData.discount}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>
</div>

<div className="grid grid-cols-4 gap-4 mb-6">
  <div>
    <label className="block text-sm font-medium">VAT</label>
    <input
      type="number"
      name="vatTotal"
      value={formData.vatTotal}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>
  <div>
    <label className="block text-sm font-medium">Exchange Point</label>
    <input
      type="number"
      name="exchangePoint"
      value={formData.exchangePoint}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>
  <div>
    <label className="block text-sm font-medium">Net Amount</label>
    <input
      type="number"
      name="netAmount"
      value={formData.netAmount}
      onChange={handleChange}
      className="w-full px-8 py-1 border border-gray-300 rounded"
    />
  </div>
</div>


      <div className="flex justify-between mt-4">
        <button className="px-8 py-1 bg-blue-500 text-white rounded">Preview Invoice</button>
        <button className="px-8 py-1 bg-red-500 text-white rounded">Chalan</button>
      </div>
    </div>
  );
};

export default Sales;