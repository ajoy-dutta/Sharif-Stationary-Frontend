import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AxiosInstance from "../../Components/AxiosInstance";

function PurchaseReceiveForm() {

  const [companies, setCompanies] = useState([]); // Store fetched companies
  const [godowns, setGodowns] = useState([]); // Store fetched godowns

  // 🔹 Fetch Companies & Godowns on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyResponse = await AxiosInstance.get("/companies/");
        setCompanies(companyResponse.data);
        console.log(companyResponse.data);

        const godownResponse = await AxiosInstance.get("/godowns/");
        setGodowns(godownResponse.data);
      } catch (error) {
        console.error("Error fetching companies or godowns:", error);
      }
    };
    fetchData();
  }, []);

  console.log(companies);


  const [formData, setFormData] = useState({
    // Purchase Details
    company: "", // ForeignKey (Company ID)
    order_date: "",
    order_no: "",
    invoice_challan_date: "",
    invoice_challan_no: "",
    transport_type: "",
    delivery_date: new Date().toISOString().split("T")[0],
    delivery_no: "",
    driver_name: "",
    driver_mobile_no: "",
    vehicle_no: "",
    godown: "", // ForeignKey (Godown ID)
    entry_by: "",
    remarks: "",

    // Payment Information
    previous_due: 0.0,
    invoice_challan_amount: 0.0,
    today_paid_amount: 0.0,
    payment_type: "",
    bank_name: "",
    account_no: "",
    cheque_no: "",
    cheque_date: "",
    balance_amount: 0.0,

    // ✅ Item Details (Array of Objects) - Renamed to `PurchaseItem`
    PurchaseItem: [],
  });

  console.log(formData);

    // 🔹 Handle Change for Company
    const handleCompanyChange = (e) => {
      setFormData({ ...formData, company: e.target.value });
    };
  
    // 🔹 Handle Change for Godown
    const handleGodownChange = (e) => {
      setFormData({ ...formData, godown: e.target.value });
    };

  // ✅ State to store added items
  const [items, setItems] = useState([]);

  const [newItem, setNewItem] = useState({
    product_code: "", // Corresponds to 'productCode'
    product_description: "", // Corresponds to 'productDescription'
    rim: "",
    dozen:"",
    sheet_or_piece: 0, // Corresponds to 'sheetQuantity'
    only_sheet_piece: 0, // Corresponds to 'onlySheetPiece'
    total_sheet_piece: 0, // Corresponds to 'totalSheetPiece'
    rim_or_dozen_per_price:0,
    sheet_or_piece_per_price:0,
    total_amount: 0.0, // Corresponds to 'totalAmount'
    

    transport_cost: 0.0, // Corresponds to 'transportCost'
    labour_cost: 0.0, // Corresponds to 'labourCost'
    road_cost: 0.0, // Corresponds to 'roadCost'
    other_cost: 0.0, // Corresponds to 'otherCost'
    total_extra_cost: 0.0, // Corresponds to 'totalCost'
    
    total_per_rim_cost :0.0,
    total_per_sheet_cost:0.0,

    rim_or_dozen_total_cost:0.0,
    sheet_or_piece_total_cost:0.0,

    rim_or_dozen_per_percentage:0.0,

    rim_or_dozen_per_sell_amount: 0.0, // Corresponds to 'totalRimCost'
    sheet_or_piece_per_sell_amount: 0.0, // Corresponds to 'totalSheetCost'
    remarks: "", // Remarks field remains the same
  });

  // ✅ Handle Change for Form Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle Change for New Item Inputs
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = (e) => {
    e.preventDefault(); // Prevent accidental form submission
  
    setFormData((prevData) => ({
      ...prevData,
      PurchaseItem: [...prevData.PurchaseItem, newItem], // Add new item
    }));
  
    setNewItem({
      product_code: "",
      product_description: "",
      rim: 0,
      dozen: "",
      sheet_or_piece: 0,
      only_sheet_piece: 0,
      total_sheet_piece: 0,
      rim_or_dozen_per_price: 0,
      sheet_or_piece_per_price: 0,
      total_amount: 0.0,
      transport_cost: 0.0,
      labour_cost: 0.0,
      road_cost: 0.0,
      other_cost: 0.0,
      total_extra_cost: 0.0,
      total_per_rim_cost: 0.0,
      total_per_sheet_cost: 0.0,
      rim_or_dozen_total_cost: 0.0,
      sheet_or_piece_total_cost: 0.0,
      rim_or_dozen_per_percentage: 0.0,
      rim_or_dozen_per_sell_amount: 0.0,
      sheet_or_piece_per_sell_amount: 0.0,
      remarks: "",
    });
  };
  

  const formatDate = (date) => {
    if (!date) return ""; // Handle empty date
    return new Date(date).toISOString().split("T")[0];
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   console.log(formData);
  
  //   try {
  //     const response = await AxiosInstance.post("/purchases/", {
  //       ...formData,
  //       order_date: formatDate(formData.order_date),
  //       invoice_challan_date: formatDate(formData.invoice_challan_date),
  //       delivery_date: formatDate(formData.delivery_date),
  //       cheque_date: formatDate(formData.cheque_date), // Ensuring correct format
  //       PurchaseItem: [...formData.PurchaseItem], // Ensure array format
  //     });


  
  //     console.log("✅ Purchase Data Submitted Successfully:", response.data);
  //     alert("Purchase data submitted successfully!");
  
  //     // Optionally, reset form after successful submission
  //     setFormData({
  //       company: "", // ForeignKey (Company ID)
  //       order_date: "",
  //       order_no: "",
  //       invoice_challan_date: "",
  //       invoice_challan_no: "",
  //       transport_type: "",
  //       delivery_date: new Date().toISOString().split("T")[0],
  //       delivery_no: "",
  //       driver_name: "",
  //       driver_mobile_no: "",
  //       vehicle_no: "",
  //       godown: "", // ForeignKey (Godown ID)
  //       entry_by: "",
  //       remarks: "",
    
  //       // Payment Information
  //       previous_due: 0.0,
  //       invoice_challan_Amount: 0.0,
  //       today_paid_amount: 0.0,
  //       payment_type: "",
  //       bank_name: "",
  //       account_no: "",
  //       cheque_no: "",
  //       cheque_date: "",
  //       balance_amount: 0.0,
    
  //       // ✅ Item Details (Array of Objects) - Renamed to `PurchaseItem`
  //       PurchaseItem: [],
  //     });
  //   } catch (error) {
  //     console.error("❌ Error submitting purchase data:", error);
  //     alert("Failed to submit purchase data. Please try again.");
  //   }
  // };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await AxiosInstance.post("/purchases/", {
        ...formData,
        order_date: formatDate(formData.order_date),
        invoice_challan_date: formatDate(formData.invoice_challan_date),
        delivery_date: formatDate(formData.delivery_date),
        cheque_date: formatDate(formData.cheque_date),
  
        // 🔹 Ensure `items` (PurchaseItem) is included in the request
        items: formData.PurchaseItem,  // ✅ This should match your Django serializer
      });
  
      console.log("✅ Purchase Data Submitted Successfully:", response.data);
      alert("Purchase data submitted successfully!");
  
      // Optionally reset form
      setFormData({
        company: "",
        order_date: "",
        order_no: "",
        invoice_challan_date: "",
        invoice_challan_no: "",
        transport_type: "",
        delivery_date: new Date().toISOString().split("T")[0],
        delivery_no: "",
        driver_name: "",
        driver_mobile_no: "",
        vehicle_no: "",
        godown: "",
        entry_by: "",
        remarks: "",
        previous_due: 0.0,
        invoice_challan_amount: 0.0,
        today_paid_amount: 0.0,
        payment_type: "",
        bank_name: "",
        account_no: "",
        cheque_no: "",
        cheque_date: "",
        balance_amount: 0.0,
        PurchaseItem: [], // Reset items array
      });
  
    } catch (error) {
      console.error("❌ Error submitting purchase data:", error.response?.data);
      alert("Failed to submit purchase data. Please try again.");
    }
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

  return (
    <div className="m-8 mb-0 mx-12">
      <h2 className="text-xl font-semibold mb-4 -mt-6 text-center">
        Purchase & Invoice Information
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="p-4 rounded-xl grid grid-cols-8 gap-2 text-sm bg-white shadow-[0px_0px_30px_rgba(0,0,0,0.1)]">
        
      {/* 🔹 Company Selection (Dropdown) */}
      <div>
        <label className="block text-center">Company</label>
        <select
          name="company"
          value={formData.company}
          onChange={handleCompanyChange}
          className="input h-7 input-bordered w-full input-md"
        >
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.company_name}
            </option>
          ))}
        </select>
      </div>

          {/* 2. Invoice/Challan No */}
          <div>
            <label className="block text-center">Invoice/Challan No</label>
            <input
              type="text"
              name="invoice_challan_no"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              placeholder="Enter Invoice/Challan No"
              value={formData.invoice_challan_no}
              onChange={handleChange}
            />
          </div>

          {/* 3. Invoice/Challan Date */}
          <div>
            <label className="block text-center">Invoice/Challan Date</label>
            <input
              type="date"
              name="invoice_challan_date"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              value={formData.invoice_challan_date}
              onChange={handleChange}
            />
          </div>

          {/* 4. Transport Type */}
          <div>
            <label className="block text-center">Transport Type</label>
            <input
              type="text"
              name="transport_type"
              list="transportOptions"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              placeholder="Select Transport Type"
              value={formData.transport_type}
              onChange={handleChange}
            />
            <datalist id="transportOptions">
              <option value="Company Transport" />
              <option value="Sharif Paper & Stationary Transport" />
              <option value="Other Transport" />
            </datalist>
          </div>

          {/* 5. Order Date */}
          <div>
            <label className="block text-center">Order Date</label>
            <input
              type="date"
              name="order_date"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              value={formData.order_date}
              onChange={handleChange}
            />
          </div>

          {/* 6. Order No */}
          <div>
            <label className="block text-center">Order No</label>
            <input
              type="text"
              name="order_no"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              placeholder="Enter Order No"
              value={formData.order_no}
              onChange={handleChange}
            />
          </div>

          {/* 7. Driver Name */}
          <div>
            <label className="block text-center">Driver Name</label>
            <input
              type="text"
              name="driver_name"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              placeholder="Enter Driver Name"
              value={formData.driver_name}
              onChange={handleChange}
            />
          </div>

          {/* 8. Driver Mobile No */}
          <div>
            <label className="block text-center">Driver Mobile No</label>
            <input
              type="text"
              name="driver_mobile_no"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              placeholder="Enter Driver Mobile No"
              value={formData.driver_mobile_no}
              onChange={handleChange}
            />
          </div>

          {/* 9. Delivery Date */}
          <div>
            <label className="block text-center">Delivery Date</label>
            <input
              type="date"
              name="delivery_date"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              value={formData.delivery_date}
              onChange={handleChange}
            />
          </div>

          {/* 10. Delivery No */}
          <div>
            <label className="block text-center">Delivery No</label>
            <input
              type="text"
              name="delivery_no"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              placeholder="Enter Delivery No"
              value={formData.delivery_no}
              onChange={handleChange}
            />
          </div>

          {/* 11. Vehicle No */}
          <div>
            <label className="block text-center">Vehicle No</label>
            <input
              type="text"
              name="vehicle_no"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              placeholder="Enter Vehicle No"
              value={formData.vehicle_no}
              onChange={handleChange}
            />
          </div>

          {/* 12. Godown (ForeignKey - ID) */}
          <div>
        <label className="block text-center">Godown</label>
        <select
          name="godown"
          value={formData.godown}
          onChange={handleGodownChange}
          className="input h-7 input-bordered w-full input-md"
        >
          <option value="">Select Godown</option>
          {godowns.map((godown) => (
            <option key={godown.id} value={godown.id}>
              {godown.godown_name}
            </option>
          ))}
        </select>
      </div>

          {/* 13. Entry By */}
          <div>
            <label className="block text-center">Entry By</label>
            <input
              type="text"
              name="entry_by"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              placeholder="Enter Entry By"
              value={formData.entry_by}
              onChange={handleChange}
            />
          </div>

          {/* 14. Remarks */}
          <div>
            <label className="block text-center">Remarks</label>
            <input
              type="text"
              name="remarks"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              placeholder="Enter Remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Item Details
          </h3>
          <div className=" rounded-md mt-2 w-full flex justify-center bg-white shadow-[0px_0px_30px_rgba(0,0,0,0.1)] ">
          <div className="grid grid-cols-8 gap-2 p-4 rounded-md">

  {/* Product Code */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Item/Product Code</label>
    <input
      type="text"
      name="product_code"
      value={newItem.product_code}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter product code"
    />
  </div>

  {/* Product Description */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Product Description</label>
    <input
      type="text"
      name="product_description"
      value={newItem.product_description}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter product description"
    />
  </div>

  {/* Rim */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Rim</label>
    <input
      type="number"
      name="rim"
      value={newItem.rim}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter rim quantity"
    />
  </div>

  {/* Dozen */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Dozen</label>
    <input
      type="number"
      name="dozen"
      value={newItem.dozen}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter dozen quantity"
    />
  </div>

  {/* Sheet or Piece */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Sheet/Piece</label>
    <input
      type="number"
      name="sheet_or_piece"
      value={newItem.sheet_or_piece}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter sheet/piece quantity"
    />
  </div>

  {/* Only Sheet Piece */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Only Sheet Piece</label>
    <input
      type="number"
      name="only_sheet_piece"
      value={newItem.only_sheet_piece}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter only sheet piece"
    />
  </div>

  {/* Total Sheet Piece */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Total Sheet Piece</label>
    <input
      type="number"
      name="total_sheet_piece"
      value={newItem.total_sheet_piece}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter total sheet piece"
    />
  </div>

  {/* Rim/Dozen Per Price */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Rim/Dozen Per Price</label>
    <input
      type="number"
      name="rim_or_dozen_per_price"
      value={newItem.rim_or_dozen_per_price}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter rim/dozen per price"
    />
  </div>

  {/* Sheet/Piece Per Price */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Sheet/Piece Per Price</label>
    <input
      type="number"
      name="sheet_or_piece_per_price"
      value={newItem.sheet_or_piece_per_price}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter sheet/piece per price"
    />
  </div>

  {/* Total Amount */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Total Amount</label>
    <input
      type="number"
      name="total_amount"
      value={newItem.total_amount}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter total amount"
    />
  </div>

  {/* Transport Cost */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Transport Cost</label>
    <input
      type="number"
      name="transport_cost"
      value={newItem.transport_cost}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter transport cost"
    />
  </div>

  {/* Labour Cost */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Labour Cost</label>
    <input
      type="number"
      name="labour_cost"
      value={newItem.labour_cost}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter labour cost"
    />
  </div>

  {/* Road Cost */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Road Cost</label>
    <input
      type="number"
      name="road_cost"
      value={newItem.road_cost}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter road cost"
    />
  </div>

  {/* Other Cost */}
  <div className="flex flex-col">
    <label className="text-sm text-center">Other Cost</label>
    <input
      type="number"
      name="other_cost"
      value={newItem.other_cost}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter other cost"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-center">Total Cost</label>
    <input
      type="number"
      name="total_extra_cost"
      value={newItem.total_extra_cost}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter other cost"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-center">Total Per Rim Cost</label>
    <input
      type="number"
      name="total_per_rim_cost"
      value={newItem.total_per_rim_cost}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter other cost"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-center">Total Per Sheet Cost</label>
    <input
      type="number"
      name="total_per_sheet_cost"
      value={newItem.total_per_sheet_cost}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter other cost"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-center">Rim/Dozen Total Cost</label>
    <input
      type="number"
      name="rim_or_dozen_total_cost"
      value={newItem.rim_or_dozen_total_cost}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter other cost"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-center">Sheet/Piece Total Cost</label>
    <input
      type="number"
      name="sheet_or_piece_total_cost"
      value={newItem.sheet_or_piece_total_cost}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter other cost"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-center">Percentage</label>
    <input
      type="number"
      name="rim_or_dozen_per_percentage"
      value={newItem.rim_or_dozen_per_percentage}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter other cost"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-center">Rim/Dozen Sell Amount</label>
    <input
      type="number"
      name="rim_or_dozen_per_sell_amount "
      value={newItem.rim_or_dozen_per_sell_amount }
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter other cost"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-center">Sheet/Piece Sell Amount</label>
    <input
      type="number"
      name="sheet_or_piece_per_sell_amount "
      value={newItem.sheet_or_piece_per_sell_amount }
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter other cost"
    />
  </div>

  {/* Remarks */}
  <div className="flex flex-col ">
    <label className="text-sm text-center">Remarks</label>
    <input
      type="text"
      name="remarks"
      value={newItem.remarks}
      onChange={handleItemChange}
      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs"
      placeholder="Enter remarks"
    />
  </div>

<div className="flex flex-end items-center justify-end">
<button
      onClick={handleAddItem}
      className="btn  bg-blue-500  text-white rounded hover:bg-green-600"
    >
      Add Item
    </button>
</div>
 

</div>

          </div>

          {formData.PurchaseItem.length > 0 && (
           <div className="overflow-x-auto mt-6 bg-white shadow-lg rounded-md p-4">
           <table className="table-auto w-full border-collapse">
             <thead>
               <tr className="bg-blue-500 text-white">
                 <th className="border text-sm font-medium p-2">Product Code</th>
                 <th className="border text-sm font-medium p-2">Product Description</th>
                 <th className="border text-sm font-medium p-2">Rim</th>
                 <th className="border text-sm font-medium p-2">Dozen</th>
                 <th className="border text-sm font-medium p-2">Sheet/Piece</th>
                 <th className="border text-sm font-medium p-2">Only Sheet Piece</th>
                 <th className="border text-sm font-medium p-2">Total Sheet Piece</th>
                 <th className="border text-sm font-medium p-2">Rim/Dozen Per Price</th>
                 <th className="border text-sm font-medium p-2">Sheet/Piece Per Price</th>
                 <th className="border text-sm font-medium p-2">Total Amount</th>
                 <th className="border text-sm font-medium p-2">Transport Cost</th>
                 <th className="border text-sm font-medium p-2">Labour Cost</th>
                 <th className="border text-sm font-medium p-2">Road Cost</th>
                 <th className="border text-sm font-medium p-2">Other Cost</th>
                 <th className="border text-sm font-medium p-2">Total Extra Cost</th>
                 <th className="border text-sm font-medium p-2">Total Per Rim Cost</th>
                 <th className="border text-sm font-medium p-2">Total Per Sheet Cost</th>
                 <th className="border text-sm font-medium p-2">Rim/Dozen Total Cost</th>
                 <th className="border text-sm font-medium p-2">Sheet/Piece Total Cost</th>
                 <th className="border text-sm font-medium p-2">Percentage (%)</th>
                 <th className="border text-sm font-medium p-2">Rim/Dozen Sell Amount</th>
                 <th className="border text-sm font-medium p-2">Sheet/Piece Sell Amount</th>
                 <th className="border text-sm font-medium p-2">Remarks</th>
                 <th className="border text-sm font-medium p-2">Actions</th>
               </tr>
             </thead>
             <tbody>
               {formData.PurchaseItem.map((item, rowIndex) => (
                 <tr key={rowIndex} className="border">
                   <td className="border p-2 text-center">{item.product_code}</td>
                   <td className="border p-2 text-center">{item.product_description}</td>
                   <td className="border p-2 text-center">{item.rim}</td>
                   <td className="border p-2 text-center">{item.dozen}</td>
                   <td className="border p-2 text-center">{item.sheet_or_piece}</td>
                   <td className="border p-2 text-center">{item.only_sheet_piece}</td>
                   <td className="border p-2 text-center">{item.total_sheet_piece}</td>
                   <td className="border p-2 text-center">{item.rim_or_dozen_per_price}</td>
                   <td className="border p-2 text-center">{item.sheet_or_piece_per_price}</td>
                   <td className="border p-2 text-center">{item.total_amount}</td>
                   <td className="border p-2 text-center">{item.transport_cost}</td>
                   <td className="border p-2 text-center">{item.labour_cost}</td>
                   <td className="border p-2 text-center">{item.road_cost}</td>
                   <td className="border p-2 text-center">{item.other_cost}</td>
                   <td className="border p-2 text-center">{item.total_extra_cost}</td>
                   <td className="border p-2 text-center">{item.total_per_rim_cost}</td>
                   <td className="border p-2 text-center">{item.total_per_sheet_cost}</td>
                   <td className="border p-2 text-center">{item.rim_or_dozen_total_cost}</td>
                   <td className="border p-2 text-center">{item.sheet_or_piece_total_cost}</td>
                   <td className="border p-2 text-center">{item.rim_or_dozen_per_percentage}</td>
                   <td className="border p-2 text-center">{item.rim_or_dozen_per_sell_amount}</td>
                   <td className="border p-2 text-center">{item.sheet_or_piece_per_sell_amount}</td>
                   <td className="border p-2 text-center">{item.remarks}</td>
                   <td className="border p-2 text-center">
                     <button
                       onClick={() =>
                         setFormData((prevData) => ({
                           ...prevData,
                           PurchaseItem: prevData.PurchaseItem.filter((_, i) => i !== rowIndex),
                         }))
                       }
                       className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                     >
                       Remove
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
         
          )}
        </div>

        <h3 className="text-xl font-semibold my-4 text-center">
          Payment Information
        </h3>

        {/* Payment Section Wrapper */}
        <div className="p-4 bg-white shadow-[0px_0px_30px_rgba(0,0,0,0.1)] rounded-md mt-4">
          <div className="grid grid-cols-10 gap-2 items-center">

          <div>
            <label className="block text-center">Company</label>
            <input
              type="text"
              name="company"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm"
              placeholder="Enter Company ID"
              value={formData.company}
              onChange={handleChange}
            />
          </div>


            {/* Previous Due (Read-Only) */}
            <div>
              <label className="block text-sm text-center whitespace-nowrap">
                Previous Due
              </label>
              <input
                type="number"
                name="previous_due"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 bg-gray-100 placeholder:text-xs"
                value={formData.previous_due}
                readOnly
              />
            </div>

            {/* Invoice/Challan Amount */}
            <div>
              <label className="block text-sm text-center whitespace-nowrap">
                Invoice/Challan Amount
              </label>
              <input
                type="number"
                name="invoice_challan_amount"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 placeholder:text-xs"
                placeholder="Enter amount"
                value={formData.invoice_challan_amount}
                onChange={handleChange}
              />
            </div>

            {/* Today Paid Amount */}
            <div>
              <label className="block text-sm text-center whitespace-nowrap">
                Today Paid Amount
              </label>
              <input
                type="number"
                name="today_paid_amount"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 placeholder:text-xs"
                placeholder="Enter paid amount"
                value={formData.today_paid_amount}
                onChange={handleChange}
              />
            </div>

            {/* Payment Type Dropdown */}
            <div>
              <label className="block text-sm text-center whitespace-nowrap">
                Payment Type
              </label>
              <input
                type="text"
                name="payment_type"
                list="paymentOptions"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 text-sm"
                placeholder="Select Payment Type"
                value={formData.payment_type}
                onChange={handleChange}
              />
              <datalist id="paymentOptions">
                <option value="Cash" />
                <option value="Bank" />
              </datalist>
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm text-center whitespace-nowrap">
                Bank Name
              </label>
              <input
                type="text"
                name="bank_name"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 placeholder:text-xs"
                placeholder="Enter bank name"
                value={formData.bank_name}
                onChange={handleChange}
              />
            </div>

            {/* Account No */}
            <div>
              <label className="block text-sm text-center whitespace-nowrap">
                Account No.
              </label>
              <input
                type="text"
                name="account_no"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 placeholder:text-xs"
                placeholder="Enter account no"
                value={formData.account_no}
                onChange={handleChange}
              />
            </div>

            {/* Cheque No */}
            <div>
              <label className="block text-sm text-center whitespace-nowrap">
                Cheque No
              </label>
              <input
                type="text"
                name="cheque_no"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 placeholder:text-xs"
                placeholder="Enter cheque no"
                value={formData.cheque_no}
                onChange={handleChange}
              />
            </div>

            {/* Cheque Date */}
            <div>
              <label className="block text-sm text-center whitespace-nowrap">
                Cheque Date
              </label>
              <input
                type="date"
                name="cheque_date"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9"
                value={formData.cheque_date}
                onChange={handleChange}
              />
            </div>

            {/* Balance Amount */}
            <div>
              <label className="block text-sm text-center whitespace-nowrap">
                Balance Amount
              </label>
              <input
                type="number"
                name="balance_amount"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 placeholder:text-xs"
                placeholder="Enter balance"
                value={formData.balance_amount}
                onChange={handleChange}
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

export default PurchaseReceiveForm;
