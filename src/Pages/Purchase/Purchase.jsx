import  { useState } from "react";

function Purchase() {
  const [voucherNo, setVoucherNo] = useState("");
  const [date, setDate] = useState("");
  const [challanNo, setChallanNo] = useState("");
  const [challanDate, setChallanDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [branch, setBranch] = useState("");
  const [remarks, setRemarks] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemTitle, setItemTitle] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitSheetPurchaseRate, setUnitSheetPurchaseRate] = useState("");
  const [convSheetPurchaseRate, setConvSheetPurchaseRate] = useState("");
  const [amount, setAmount] = useState("");
  const [unitSheetSaleRate, setUnitSheetSaleRate] = useState("");
  const [convSheetSaleRate, setConvSheetSaleRate] = useState("");
  const [poNo, setPoNo] = useState("");
  const [total, setTotal] = useState(1);
  const [paidAmount, setPaidAmount] = useState("");
  const [dueAmount, setDueAmount] = useState(0);
  const [paidAccount, setPaidAccount] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [type, setType] = useState("Local");
  const [isNewSupplier, setIsNewSupplier] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
  };

  const handleSearch = () => {
    // Add search functionality here
    console.log("Search clicked");
  };

  return (
    <div className="p-8 bg-gray-100">
      {/* Search Button Above the Form */}
      <div className="mb-6">
        <button
          type="button"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Purchase Receive (Credit)</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block font-medium">Voucher No.</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              value={voucherNo}
              onChange={(e) => setVoucherNo(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium">Date</label>
            <input
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium">Type</label>
            <select
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Local">Local</option>
              <option value="Import">Import</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium">Challan No.</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              value={challanNo}
              onChange={(e) => setChallanNo(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium">Challan Date</label>
            <input
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              value={challanDate}
              onChange={(e) => setChallanDate(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium">Supplier</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
            <button
              type="button"
              className="mt-2 text-blue-500"
              onClick={() => setIsNewSupplier(true)}
            >
              New Supplier
            </button>
          </div>
          <div>
            <label className="block font-medium">Branch</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block font-medium">Remarks</label>
          <textarea
            className="mt-1 p-2  border border-gray-300 rounded"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* PO No and Retrieve Button */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="w-full">
            <label className="block font-medium">PO No.</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              value={poNo}
              onChange={(e) => setPoNo(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={() => alert("Retrieve action triggered")}
          >
            Retrieve
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold">Item Details</h3>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2">
              <label className="block font-medium">Item Code</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">Title</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">CY/CN</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">RIM</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">Shite</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-1">
              <label className="block font-medium">Qty</label>
              <input
                type="number"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label className="block font-medium">UOM</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">
                Unit/Sheet Purchase Rate
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={unitSheetPurchaseRate}
                onChange={(e) => setUnitSheetPurchaseRate(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">
                Conv./Rim Purchase Rate
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={convSheetPurchaseRate}
                onChange={(e) => setConvSheetPurchaseRate(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">Amount</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">Unit/Sheet Sale Rate</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={unitSheetSaleRate}
                onChange={(e) => setUnitSheetSaleRate(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium">Conv./Rim Sale Rate</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={convSheetSaleRate}
                onChange={(e) => setConvSheetSaleRate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Payment Information</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium">Total</label>
              <input
                type="number"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium">Paid Amount</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium">Due Amount</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={dueAmount}
                onChange={(e) => setDueAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-medium">Paid A/C</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={paidAccount}
                onChange={(e) => setPaidAccount(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium">Cheque No.</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                value={chequeNo}
                onChange={(e) => setChequeNo(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block font-medium">Cheque Date</label>
            <input
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              value={chequeDate}
              onChange={(e) => setChequeDate(e.target.value)}
            />
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            type="button"
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            onClick={() => alert("Form Cancelled")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Purchase;
