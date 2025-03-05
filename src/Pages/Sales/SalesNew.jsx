import { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function PurchaseReceiveForm() {
  const [date, setDate] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [remarks, setRemarks] = useState("");
  
  const [items, setItems] = useState([
    {
      no: 1,
      productCode: "",
      productDescription: "",
      rimQuantity: "",
      dozenQuantity: "",
      sheetQuantity: "",
      onlySheetPiece: "",
      totalSheetPiece: "",
      rimPrice: "",
      dozenPrice: "",
      sheetPrice: "",
      totalAmount: "",
      remarks: "",
    },
  ]);

  const [previousDue, setPreviousDue] = useState(0);
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [todayPaidAmount, setTodayPaidAmount] = useState(0);
  const [paidBy, setPaidBy] = useState("Cash");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [chequeDate, setChequeDate] = useState("");
  const [balanceAmount, setBalanceAmount] = useState(0);

  const addRow = () => {
    setItems([
      ...items,
      {
        no: items.length + 1,
        productCode: "",
        productDescription: "",
        rimQuantity: "",
        dozenQuantity: "",
        sheetQuantity: "",
        onlySheetPiece: "",
        totalSheetPiece: "",
        rimPrice: "",
        dozenPrice: "",
        sheetPrice: "",
        totalAmount: "",
        remarks: "",
      },
    ]);
  };

  const removeRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleChange = (e, index, field) => {
    const updatedItems = [...items];
    updatedItems[index][field] = e.target.value;
    setItems(updatedItems);
  };

  const handlePDFExport = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "No",
      "Item/Product Code",
      "Product Description",
      "Rim Quantity",
      "Dozen Quantity",
      "Sheet Quantity",
      "Only Sheet Piece",
      "Total Sheet Piece",
      "Rim Price",
      "Dozen Price",
      "Sheet Price",
      "Total Amount",
      "Remarks",
    ];
    const tableRows = items.map((item) => [
      item.no,
      item.productCode,
      item.productDescription,
      item.rimQuantity,
      item.dozenQuantity,
      item.sheetQuantity,
      item.onlySheetPiece,
      item.totalSheetPiece,
      item.rimPrice,
      item.dozenPrice,
      item.sheetPrice,
      item.totalAmount,
      item.remarks,
    ]);

    doc.text("Purchase Items Report", 14, 15);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("purchase_items.pdf");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form Submitted Successfully!");
    console.log({
      date,
      customerID,
      customerName,
      customerAddress,
      phoneNo,
      remarks,
      items,
      previousDue,
      invoiceAmount,
      todayPaidAmount,
      paidBy,
      bankName,
      accountNo,
      chequeNo,
      chequeDate,
      balanceAmount,
    });
  };

  return (
    <div className="m-8 mb-0 mx-12">
      <h2 className="text-xl font-semibold mb-2 -mt-4 text-center">
        Sale & Invoice Information
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="p-4 rounded-xl grid grid-cols-8 gap-2 text-sm bg-white shadow-md">
          {/* Date */}
          <div>
            <label className="block text-center">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Customer ID */}
          <div>
            <label className="block text-center">Customer ID</label>
            <input
              type="text"
              value={customerID}
              onChange={(e) => setCustomerID(e.target.value)}
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-center">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* Customer Address */}
          <div>
            <label className="block text-center">Customer Address</label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>

          {/* Phone No */}
          <div>
            <label className="block text-center">Phone No</label>
            <input
              type="text"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-center">Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
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

export default PurchaseReceiveForm;
