import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Sales() {
  const [voucherNo, setVoucherNo] = useState("");
  const [PurchaseChallanDate, setPurchaseChallanDate] = useState("");
  const [date, setDate] = useState("");
  const [challanDate, setChallanDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [remarks, setRemarks] = useState("");
  const [remarks_2, setRemarks_2] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemTitle, setItemTitle] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(1);
  const [paidAmount, setPaidAmount] = useState("");
  const [dueAmount, setDueAmount] = useState(0);
  const [paidAccount, setPaidAccount] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [type, setType] = useState("Local");
  const [companyName, setCompanyName] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [transport, setTransport] = useState("Company Transport");
  const [vehicleNo, setVehicleNo] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverMobile, setDriverMobile] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [productEntryDate, setProductEntryDate] = useState("");
  const [godownNo, setGodownNo] = useState("");
  const [previousDue, setPreviousDue] = useState(0);
  const [todayBill, setTodayBill] = useState(0);
  const [todayPaid, setTodayPaid] = useState(0);
  const [paidBy, setPaidBy] = useState("Cash");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");
// New Fields
const [transportCost, setTransportCost] = useState(0);
const [labourCost, setLabourCost] = useState(0);
const [roadCost, setRoadCost] = useState(0);
const [otherCost, setOtherCost] = useState(0);
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

    // Auto-calculate totalAmount when related fields change
    if (field === "rimDozenQty" || field === "rimDozenPurchaseRate") {
      updatedItems[index].totalAmount =
        updatedItems[index].rimDozenQty *
          updatedItems[index].rimDozenPurchaseRate || 0;
    }

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

    // Map table rows using correct object keys
    const tableRows = items.map((item) => [
      item.no, // Auto-incremented No.
      item.productDescription, // Product Description (Dropdown)
      item.productCode, // Item/Product Code
      item.rimQuantity, // Rim Quantity
      item.sheetQuantity, // Sheet/Piece Quantity
      item.rimPrice, // Rim/Dozen Price
      item.sheetPrice, // Sheet/Piece Price
      item.totalAmount, // Total Amount
      item.remarks, // Remarks
    ]);

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
        purchase_challan_date: formData.purchase_challan_date,
        supplier: formData.supplier,
        kind_of_product: formData.kind_of_product,
        name_of_product: formData.name_of_product,
        product_type: formData.product_type,
        product_entry_date: formData.product_entry_date,
        remarks_1: formData.remarks_1,
        remarks_2: formData.remarks_2,
      };

      const purchaseResponse = await axios.post(
        "http://127.0.0.1:8000/api/purchase-receive/",
        purchaseData
      );

      const purchaseId = purchaseResponse.data.id; // Get the purchase ID for linking

      // ✅ 2. Save Item Details (Each item linked to the purchase)
      const itemsData = items.map((item) => ({
        purchase_receive: purchaseId, // Link to Purchase Receive
        item_code: item.itemCode,
        title: item.title,
        rim_dozen_qty: item.rimDozenQty,
        sheet_piece_qty: item.sheetPieceQty,
        rim_dozen_purchase_rate: item.rimDozenPurchaseRate,
        sheet_piece_purchase_rate: item.sheetPiecePurchaseRate,
        rim_dozen_sales_rate: item.rimDozenSalesRate,
        sheet_piece_sales_rate: item.sheetPieceSalesRate,
        total_amount: item.totalAmount,
      }));

      await axios.post("http://127.0.0.1:8000/api/item-details/", itemsData);

      // ✅ 3. Save Payment Information
      const paymentData = {
        purchase_receive: purchaseId, // Link to Purchase Receive
        supplier: formData.supplier,
        previous_due: formData.previous_due,
        today_bill: formData.today_bill,
        today_paid: formData.today_paid,
        paid_by: formData.paid_by,
        paid_amount: formData.paid_amount,
        paid_ac: formData.paid_ac,
        cheque_no: formData.cheque_no,
        cheque_date: formData.cheque_date,
      };

      await axios.post("http://127.0.0.1:8000/api/payment-info/", paymentData);

      alert("Purchase, Items, and Payment Information Saved Successfully!");
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Error while saving data. Please try again.");
    }
  };

  const handleSubmitRow = (index) => {
    const submittedRow = items[index]; // Get the specific row data

    console.log("Submitted Row Data:", submittedRow); // Log data (for now)

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
    <div className="p-8 bg-gray-100 flex-grow">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Sale Receive 
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="border border-gray-400 p-4 rounded-md grid grid-cols-6 gap-4">
          {/* 1. Company Name */}
          <div>
            <label className="block font-medium text-center">
              Company Name
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-10"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* 2. Order Date */}
          <div>
            <label className="block font-medium text-center">Order Date</label>
            <input
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-10"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>

          {/* 3. Order No */}
          <div>
            <label className="block font-medium text-center">Order No</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-10"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
            />
          </div>

          {/* 4. Delivery Date */}
          <div>
            <label className="block font-medium text-center">
              Delivery Date
            </label>
            <input
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-10"
              value={deliveryDate}
              readOnly
            />
          </div>

          {/* 5. Transport Selection */}
          <div>
            <label className="block font-medium text-center">Transport</label>
            <select
              className="mt-1 p-2 w-full border border-gray-300 rounded h-10 text-sm"
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
            >
              <option value="Company Transport">Company Transport</option>
              <option value="Sharif Paper & Stationary Transport">
                Sharif Paper & Stationary Transport
              </option>
              <option value="Other Transport">Other Transport</option>
            </select>
          </div>

          {/* 6. Vehicle No */}
          <div>
            <label className="block font-medium text-center">Vehicle No</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-10"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
            />
          </div>

          {/* 7. Driver Name */}
          <div>
            <label className="block font-medium text-center">Driver Name</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-10"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
            />
          </div>

          {/* 8. Driver Mobile No */}
          <div>
            <label className="block font-medium text-center">
              Driver Mobile No
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-10"
              value={driverMobile}
              onChange={(e) => setDriverMobile(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium text-center">
              Invoice/Challan Date
            </label>
            <input
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-10"
              value={productEntryDate}
              onChange={(e) => setProductEntryDate(e.target.value)}
            />
          </div>
          {/* 9. Invoice/Challan No */}
          <div>
            <label className="block font-medium text-center">
              Invoice/Challan No
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-10"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </div>

          {/* 10. Product Entry Date */}
          <div>
            <label className="block font-medium text-center">
              Product Entry Date
            </label>
            <input
              type="date"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-10"
              value={productEntryDate}
              onChange={(e) => setProductEntryDate(e.target.value)}
            />
          </div>

          {/* 11. Godown No */}
          <div>
            <label className="block font-medium text-center">Godown No</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded h-10"
              value={godownNo}
              onChange={(e) => setGodownNo(e.target.value)}
            />
          </div>
        </div>

        <div className="p-8">
          <div className="border border-gray-400 p-4 rounded-md mt-4">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Item Details
            </h3>

            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border h-6">No</th>
                  <th className="px-4 py-2 border h-6">Product Description</th>
                  <th className="px-4 py-2 border h-6">Item/Product Code</th>
                  <th className="px-4 py-2 border h-6">Rim/Dozen</th>
                  <th className="px-4 py-2 border h-6">Sheet/Piece</th>
                  <th className="px-4 py-2 border h-6">Only Sheet Piece</th>
                  <th className="px-4 py-2 border h-6">Total Sheet Piece</th>
                  <th className="px-4 py-2 border h-6">Rim/Dozen Price</th>
                  <th className="px-4 py-2 border h-6">Sheet/Piece Price</th>
                  <th className="px-4 py-2 border h-6">Total Amount</th>
                  <th className="px-4 py-2 border h-6">Remarks</th>
                  <th className="px-4 py-2 border h-6 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    {/* No */}
                    <td className="px-4 py-2 border text-center">
                      {index + 1}
                    </td>

                    {/* Product Description (Dropdown) */}
                    <td className="px-4 py-2 border">
                      <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={item.productDescription}
                        onChange={(e) =>
                          handleChange(e, index, "productDescription")
                        }
                      >
                        <option value="">Select Product</option>
                        <option value="Paper A4">Paper A4</option>
                        <option value="Paper A3">Paper A3</option>
                        <option value="Notebook">Notebook</option>
                        <option value="Other">Other</option>
                      </select>
                    </td>

                    {/* Item/Product Code */}
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={item.productCode}
                        onChange={(e) => handleChange(e, index, "productCode")}
                      />
                    </td>

                    {/* Rim/Dozen */}
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={item.rimQuantity}
                        onChange={(e) => handleChange(e, index, "rimQuantity")}
                      />
                    </td>

                    {/* Sheet/Piece */}
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={item.sheetQuantity}
                        onChange={(e) =>
                          handleChange(e, index, "sheetQuantity")
                        }
                      />
                    </td>

                    {/* Only Sheet Piece */}
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={item.onlySheetPiece}
                        onChange={(e) =>
                          handleChange(e, index, "onlySheetPiece")
                        }
                      />
                    </td>

                    {/* Total Sheet Piece */}
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={item.totalSheetPiece}
                        onChange={(e) =>
                          handleChange(e, index, "totalSheetPiece")
                        }
                      />
                    </td>

                    {/* Rim/Dozen Price */}
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={item.rimPrice}
                        onChange={(e) => handleChange(e, index, "rimPrice")}
                      />
                    </td>

                    {/* Sheet/Piece Price */}
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={item.sheetPrice}
                        onChange={(e) => handleChange(e, index, "sheetPrice")}
                      />
                    </td>

                    {/* Total Amount */}
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                        value={item.totalAmount}
                        readOnly
                      />
                    </td>

                    {/* Remarks */}
                    <td className="px-4 py-2 border">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded"
                        value={item.remarks}
                        onChange={(e) => handleChange(e, index, "remarks")}
                      />
                    </td>

                    {/* Actions (Remove & Add) */}
                    <td className="px-4 py-2 border flex flex-col space-y-2 items-center">
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full"
                      >
                        Remove
                      </button>

                      {/* <button
                        type="button"
                        onClick={() => handleSubmitRow(index)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-full"
                      >
                        Add
                      </button> */}
                      <button
                type="button"
                onClick={addRow}
                className="bg-green-500 text-white p-2 rounded"
              >
                Add Row
              </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add Row Button */}
            <div className="mt-4">
              
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-4 text-center">Payment Information</h3>

{/* Payment Section Wrapper */}
<div className="border border-gray-400 p-4 rounded-md mt-4">

  {/* Grid Layout for Payment Inputs */}
  <div className="grid grid-cols-10 gap-4">

    {/* Supplier */}
    <div>
      <label className="block font-medium text-center">Company</label>
      <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded h-7" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
    </div>

    {/* Previous Due */}
    <div>
      <label className="block font-medium text-center">Previous Due</label>
      <input type="number" className="mt-1 p-2 w-full border border-gray-300 rounded h-7 bg-gray-100" value={previousDue} readOnly />
    </div>

    {/* Today Bill */}
    <div>
      <label className="block font-medium text-center">Invoice/Challan Amt.</label>
      <input type="number" className="mt-1 p-2 w-full border border-gray-300 rounded h-7" value={todayBill} onChange={(e) => setTodayBill(e.target.value)} />
    </div>

    {/* Today Paid */}
    <div>
      <label className="block font-medium text-center">Today Paid Amount</label>
      <input type="number" className="mt-1 p-2 w-full border border-gray-300 rounded h-7" value={todayPaid} onChange={(e) => setTodayPaid(e.target.value)} />
    </div>

    {/* Paid By (Dropdown) */}
    <div>
      <label className="block font-medium text-center">Paid By</label>
      <select className="mt-1 p-2 w-full border border-gray-300 rounded h-9 focus:ring-2 focus:ring-blue-500" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option value="Cash">Cash</option>
        <option value="Bank">Bank</option>
      </select>
    </div>

    {/* Bank Name */}
    <div>
      <label className="block font-medium text-center">Bank Name</label>
      <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded h-7" value={bankName} onChange={(e) => setBankName(e.target.value)} />
    </div>

    {/* Account No */}
    <div>
      <label className="block font-medium text-center">Account No.</label>
      <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded h-7" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
    </div>

    {/* Cheque No */}
    <div>
      <label className="block font-medium text-center">Cheque No</label>
      <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded h-7" value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} />
    </div>

    {/* Cheque Date */}
    <div>
      <label className="block font-medium text-center">Cheque Date</label>
      <input type="date" className="mt-1 p-2 w-full border border-gray-300 rounded h-7" value={chequeDate} onChange={(e) => setChequeDate(e.target.value)} />
    </div>

    {/* Balance Amount */}
    <div>
      <label className="block font-medium text-center">Balance Amount</label>
      <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded h-7" value={balanceAmount} onChange={(e) => setBalanceAmount(e.target.value)} />
    </div>

    {/* New Fields from Image */}

    {/* Transport Cost */}
    <div>
      <label className="block font-medium text-center">Transport Cost</label>
      <input type="number" className="mt-1 p-2 w-full border border-gray-300 rounded h-7" value={transportCost} onChange={(e) => setTransportCost(e.target.value)} />
    </div>

    {/* Labour Cost */}
    <div>
      <label className="block font-medium text-center">Labour Cost</label>
      <input type="number" className="mt-1 p-2 w-full border border-gray-300 rounded h-7" value={labourCost} onChange={(e) => setLabourCost(e.target.value)} />
    </div>

    {/* Road Cost */}
    <div>
      <label className="block font-medium text-center">Road Cost</label>
      <input type="number" className="mt-1 p-2 w-full border border-gray-300 rounded h-7" value={roadCost} onChange={(e) => setRoadCost(e.target.value)} />
    </div>

    {/* Other Cost */}
    <div>
      <label className="block font-medium text-center">Other Cost</label>
      <input type="number" className="mt-1 p-2 w-full border border-gray-300 rounded h-7" value={otherCost} onChange={(e) => setOtherCost(e.target.value)} />
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
