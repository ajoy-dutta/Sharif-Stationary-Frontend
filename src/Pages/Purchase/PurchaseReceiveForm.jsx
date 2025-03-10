import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AxiosInstance from "../../components/AxiosInstance"; 
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Provider/UserProvider";

function PurchaseReceiveForm() {
  const [companies, setCompanies] = useState([]); // Store fetched companies
  const [godowns, setGodowns] = useState([]); // Store fetched godowns
  const [products, setProducts] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [isBankPayment, setIsBankPayment] = useState(false);
  const [isChequePayment, setIsChequePayment] = useState(false);
  const [tables, setTables] = useState([1]);
  const [showAddButton, setShowAddButton] = useState(false);
  const [showInputForm, setShowInputForm] = useState(true);
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState(""); // 🔹 Fix: Define searchQuery
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Store selected product
  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true); // ✅ Open modal
  const handleCloseModal = () => setIsModalOpen(false); // ✅ Close modal

  const handleProductSelection = (product) => {
    setSelectedProduct(product); // ✅ Store selected product
    setIsModalOpen(false); // ✅ Close modal after selection
  };
  // 🔹 Fetch Companies & Godowns on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyResponse = await AxiosInstance.get("/companies/");
        setCompanies(companyResponse.data);
        console.log(companyResponse.data);
        const purchaseResponse = await AxiosInstance.get("/purchases/");
        setPurchases(purchaseResponse.data);
        console.log(setPurchases)

        const godownResponse = await AxiosInstance.get("/godowns/");
        setGodowns(godownResponse.data);

        const productResponse = await AxiosInstance.get("/products/");
        setProducts(productResponse.data);

        const paymentResponse = await AxiosInstance.get("/payment-types/");
        setPaymentTypes(paymentResponse.data);
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
    order_date: new Date().toISOString().split("T")[0], // Default to today's date
    order_no: "",
    invoice_challan_date: new Date().toISOString().split("T")[0], // No default, can be empty
    invoice_challan_no: "",
    transport_type: "Company Transport",
    delivery_date: new Date().toISOString().split("T")[0], // Default to today's date
    delivery_no: "",
    driver_name: "",
    driver_mobile_no: "",
    vehicle_no: "",
    godown: "", // ForeignKey (Godown ID)
    entry_by: user ? user.username : "", // If user exists, set entry_by to username
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

    // Item Details (Array of Objects) - Renamed to `PurchaseItem`
    PurchaseItem: [],
  });

  console.log(formData);

  // 🔹 Handle Change for Company
  const handleCompanyChange = (e) => {
    const selectedCompanyId = e.target.value;

    // Find the selected company object
    const selectedCompany = companies.find(
      (company) => company.id.toString() === selectedCompanyId
    );

    setFormData({
      ...formData,
      company: selectedCompanyId, // Store selected company ID
      company_name: selectedCompany ? selectedCompany.company_name : "", // Store company name
      previous_due: selectedCompany
        ? parseFloat(selectedCompany.previous_due)
        : 0, // Store previous due
    });
  };

  // 🔹 Handle Change for Godown
  const handleGodownChange = (e) => {
    setFormData({ ...formData, godown: e.target.value });
  };

  // ✅ State to store added items
  const [items, setItems] = useState([]);

  const [newItem, setNewItem] = useState({
    product: "",
    product_name: "",
    product_type: "",
    purchase_price: "",
    rim: "",
    dozen: "",
    only_sheet_piece: "",
    total_sheet_piece: "",
    per_dozen_price: "",
    per_rim_price: "",
    per_sheet_or_piece_price: "",

    additional_cost: "",
    profit: "",
    per_rim_sale_price: "",
    per_dozen_sale_price: "",
    per_piece_or_sheet_sale_price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update formData state
    setFormData({ ...formData, [name]: value });

    // Enable/Disable fields based on payment type selection
    if (name === "payment_type") {
      setIsBankPayment(value === "Bank");
      setIsChequePayment(value === "Cheque");
    }
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;

    // Convert input values to numbers where needed
    const numericValue = value === "" ? "" : parseFloat(value) || 0;

    let updatedItem = { ...newItem, [name]: numericValue };

    // 🔹 Auto-fill `product_name` and `product_type` based on `product_code`
    if (name === "product") {
      const selectedProduct = products.find((p) => p.product_code === value);
      if (selectedProduct) {
        updatedItem.product_name = selectedProduct.product_name;
        updatedItem.product_type = selectedProduct.product_type;
      } else {
        updatedItem.product_name = "";
        updatedItem.product_type = "";
      }
    }

    const isRimA4 = updatedItem.product_type === "RIM-A4";
    const isRimLegal = updatedItem.product_type === "RIM-LEGAL";
    const isDozen = updatedItem.product_type === "DOZEN";

    // 🔹 Handle Total Sheet/Piece Calculation
    if (isRimLegal) {
      // Convert Rim to Sheets for "RIM-LEGAL"
      updatedItem.total_sheet_piece =
        (updatedItem.rim || 0) * 500 + (updatedItem.only_sheet_piece || 0);
    } else if (isDozen) {
      // Convert Dozen to Sheets (1 Dozen = 12 Sheets)
      updatedItem.total_sheet_piece = (updatedItem.dozen || 0) * 12;
    } else {
      updatedItem.total_sheet_piece = updatedItem.rim || 0; // No sheet conversion for "RIM-A4"
    }

    // Avoid division by zero
    const totalSheetPiece = updatedItem.total_sheet_piece || 1;

    // 🔹 Calculate Prices Based on Product Type
    if (isRimLegal) {
      // If "RIM-LEGAL", calculate per sheet price and all values
      updatedItem.per_sheet_or_piece_price = parseFloat(
        ((updatedItem.purchase_price || 0) / totalSheetPiece).toFixed(2)
      );

      updatedItem.per_rim_price = parseFloat(
        (updatedItem.per_sheet_or_piece_price * 500).toFixed(2)
      );

      updatedItem.per_piece_or_sheet_sale_price = parseFloat(
        (
          (updatedItem.purchase_price +
            updatedItem.additional_cost +
            updatedItem.profit) /
          totalSheetPiece
        ).toFixed(2)
      );

      updatedItem.per_rim_sale_price = parseFloat(
        (updatedItem.per_piece_or_sheet_sale_price * 500).toFixed(2)
      );

      updatedItem.per_dozen_price = 0; // Not applicable for RIM-LEGAL
      updatedItem.per_dozen_sale_price = 0;
    } else if (isRimA4) {
      updatedItem.only_sheet_piece = 0; // No need for sheet count
      updatedItem.total_sheet_piece = 0;
      // If "RIM-A4", calculate only rim price and sale price
      updatedItem.per_rim_price = parseFloat(
        (updatedItem.purchase_price / (updatedItem.rim || 1)).toFixed(2)
      );

      updatedItem.per_rim_sale_price = parseFloat(
        (
          (updatedItem.purchase_price +
            updatedItem.additional_cost +
            updatedItem.profit) /
          (updatedItem.rim || 1)
        ).toFixed(2)
      );

      updatedItem.per_sheet_or_piece_price = 0; // No sheet conversion needed
      updatedItem.per_piece_or_sheet_sale_price = 0;
      updatedItem.per_dozen_price = 0; // Not applicable for RIM-A4
      updatedItem.per_dozen_sale_price = 0;
    } else if (isDozen) {
      // If "DOZEN", calculate per dozen price and per sheet price
      updatedItem.per_dozen_price = parseFloat(
        (updatedItem.purchase_price / (updatedItem.dozen || 1)).toFixed(2)
      );

      updatedItem.per_sheet_or_piece_price = parseFloat(
        ((updatedItem.purchase_price || 0) / totalSheetPiece).toFixed(2)
      );

      updatedItem.per_dozen_sale_price = parseFloat(
        (
          (updatedItem.purchase_price +
            updatedItem.additional_cost +
            updatedItem.profit) /
          (updatedItem.dozen || 1)
        ).toFixed(2)
      );

      updatedItem.per_sheet_or_piece_sale_price = parseFloat(
        (
          (updatedItem.purchase_price +
            updatedItem.additional_cost +
            updatedItem.profit) /
          totalSheetPiece
        ).toFixed(2)
      );

      updatedItem.per_rim_price = 0; // Not applicable for DOZEN
      updatedItem.per_rim_sale_price = 0;
    }

    // 🔹 Disable Fields Based on Product Type
    if (isRimA4) {
      updatedItem.only_sheet_piece = 0; // Disable only_sheet_piece
      updatedItem.dozen = 0; // Disable dozen
    } else if (isDozen) {
      updatedItem.rim = 0; // Disable rim
      updatedItem.only_sheet_piece = 0; // Disable only_sheet_piece
    }

    setNewItem(updatedItem);
  };

  // 🔹 Function to Filter Products Based on Search Query
  const handleSearchProduct = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // ✅ Update only `product_name` in newItem so the user can type
    setNewItem((prevItem) => ({
      ...prevItem,
      product_name: query,
    }));

    if (!query.trim()) {
      setFilteredProducts([]); // Reset when input is empty
      return;
    }

    const results = products.filter(
      (item) =>
        item.product_name.toLowerCase().includes(query) ||
        item.company_name.toLowerCase().includes(query)
    );

    setFilteredProducts(results);
  };

  // 🔹 Function to Select a Product from Search Results
  const selectProduct = (product) => {
    setNewItem((prevItem) => ({
      ...prevItem,
      product_name: product.product_name, // ✅ Set selected product
      product: product.id, // ✅ Store product ID (if needed)
      product_type: product.product_type,
    }));

    setSearchQuery(""); // ✅ Clear search query
    setFilteredProducts([]); // ✅ Hide dropdown
  };

  const handleSaveItem = (e) => {
    e.preventDefault(); // Prevent any form submission behavior

    if (!newItem.product || !newItem.product_name) {
      alert("Please enter a valid product and product name.");
      return; // Prevent adding incomplete items
    }

    setFormData((prevData) => {
      const updatedPurchaseItems = [...prevData.PurchaseItem, newItem];

      return {
        ...prevData,
        PurchaseItem: updatedPurchaseItems, // ✅ Properly update state
      };
    });

    // Clear the input form
    setNewItem({
      product: "",
      product_name: "",
      purchase_price: "",
      rim: "",
      dozen: "",
      only_sheet_piece: "",
      total_sheet_piece: "",
      per_rim_price: "",
      per_dozen_price: "",
      per_sheet_or_piece_price: "",
      additional_cost: "",
      profit: "",
      per_rim_sale_price: "",
      per_dozen_sale_price: "",
      per_sheet_or_piece_sell_price: "",
    });

    setShowInputForm(false); // Hide the form after saving
  };

  const handleRemoveRow = (indexToRemove) => {
    // Filter out the row to be removed
    const updatedTables = tables.filter((_, index) => index !== indexToRemove);
    setTables(updatedTables);

    // Update the PurchaseItem array to remove the corresponding item
    const updatedPurchaseItems = formData.PurchaseItem.filter(
      (_, index) => index !== indexToRemove
    );

    // Update the formData state
    setFormData({
      ...formData,
      PurchaseItem: updatedPurchaseItems,
    });
  };

  const formatDate = (date) => {
    if (!date) return ""; // Handle empty date
    return new Date(date).toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.company ||
      !formData.order_no ||
      !formData.invoice_challan_no ||
      !formData.delivery_no ||
      !formData.transport_type ||
      !formData.payment_type ||
      !formData.godown ||
      formData.PurchaseItem.length === 0
    ) {
      console.error("❌ Missing required fields.");
      alert(
        "Please fill all required fields and add at least one purchase item."
      );
      return;
    }

    try {
      const response = await AxiosInstance.post("/purchases/", {
        ...formData,
        order_date: formatDate(formData.order_date),
        invoice_challan_date: formatDate(formData.invoice_challan_date),
        delivery_date: formatDate(formData.delivery_date),
        cheque_date: formatDate(formData.cheque_date),

        // 🔹 Ensure `items` (PurchaseItem) is included in the request
        purchase_items: formData.PurchaseItem, // ✅ This should match your Django serializer
      });

      console.log("✅ Purchase Data Submitted Successfully:", response.data);
      alert("Purchase data submitted successfully!");

      // Optionally reset form
      setFormData({
        company: "",
        // order_date: "",
        order_date: new Date().toISOString().split("T")[0],
        order_no: "",
        invoice_challan_date: getTodayDate(),
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
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // ✅ Prevent form submission

      // ✅ Select all input and select fields
      const formElements = Array.from(document.querySelectorAll(".form-input"));

      // ✅ Find the current focused field
      const currentIndex = formElements.indexOf(e.target);

      // ✅ Move focus to the next field if available
      if (currentIndex !== -1 && currentIndex < formElements.length - 1) {
        formElements[currentIndex + 1].focus();
      }
    }
  };

  return (
    <div className="m-8 mb-0 mx-12">
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-bold">Purchase & Invoice Information</h2>
  <button
    onClick={() => navigate("/purchase-list")} // Adjust the path as needed
    className="bg-blue-950 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded"
  >
    Go to List
  </button>
</div>

      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="form-input"
      >
        <div className="p-4 rounded-xl grid grid-cols-7 gap-2 text-sm bg-white shadow-[0px_0px_30px_rgba(0,0,0,0.1) ] ">
          {/* 🔹 Company Selection (Dropdown) */}
          <div>
            <label className="block text-center">Company*</label>
            <select
              name="company"
              value={formData.company}
              onChange={handleCompanyChange}
              onKeyDown={handleKeyDown} // ✅ Handle Enter Key
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
            <label className="block text-center">Invoice/Challan No*</label>
            <input
              type="text"
              name="invoice_challan_no"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
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
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
              value={formData.invoice_challan_date}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 4. Transport Type */}
          <div>
            <label className="block text-center">Transport Type</label>
            <select
              name="transport_type"
              className="mt-1 text-xs w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
              value={formData.transport_type || "Company Transport"}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            >
              <option value="Company Transport">Company Transport</option>
              <option value="Sharif Paper & Stationary Transport">
                Sharif Paper & Stationary Transport
              </option>
              <option value="Other Transport">Other Transport</option>
            </select>
          </div>

          {/* 5. Order Date */}
          <div>
            <label className="block text-center">Order Date</label>
            <input
              type="date"
              name="order_date"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
              value={formData.order_date}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 6. Order No */}
          <div>
            <label className="block text-center">Order No</label>
            <input
              type="text"
              name="order_no"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
              placeholder="Enter Order No"
              value={formData.order_no}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 9. Delivery Date */}
          <div>
            <label className="block text-center">Delivery Date</label>
            <input
              type="date"
              name="delivery_date"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
              value={formData.delivery_date}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 10. Delivery No */}
          <div>
            <label className="block text-center">Delivery No</label>
            <input
              type="text"
              name="delivery_no"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
              placeholder="Enter Delivery No"
              value={formData.delivery_no}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 11. Vehicle No */}
          <div>
            <label className="block text-center">Vehicle No</label>
            <input
              type="text"
              name="vehicle_no"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
              placeholder="Enter Vehicle No"
              value={formData.vehicle_no}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 12. Godown (ForeignKey - ID) */}
          <div>
            <label className="block text-center">Godown</label>
            <select
              name="godown"
              value={formData.godown}
              onChange={handleGodownChange}
              onKeyDown={handleKeyDown}
              className="mt-1 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
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
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
              placeholder="Enter Entry By"
              value={formData.entry_by}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 14. Remarks */}
          <div>
            <label className="block text-center">Remarks</label>
            <input
              type="text"
              name="remarks"
              className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
              placeholder="Enter Remarks"
              value={formData.remarks}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Item Details
          </h3>

          <div className="container mx-auto shadow-[0px_0px_30px_rgba(0,0,0,0.1) ">
            {/* Single Table for Input and Saved Data */}
            <table className="w-full border-collapse border border-gray-300 shadow-md shadow-[0px_0px_30px_rgba(0,0,0,0.1) form-input">
              {/* Table Headings */}
              <thead>
                <tr className="bg-blue-100 text-center text-sm font-base">
                  <th className="border border-gray-300 p-2 font-medium">SI</th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Product Name
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Item Code
                  </th>

                  <th className="border border-gray-300 p-2 font-medium">
                    Rim
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Dozen
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Only Sheet/ Piece
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Total Sheet/ Piece
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Purchase Price
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Per Rim Price
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Per Dozen Price
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Per Sheet/ Piece Price
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Additional Cost
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Profit
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Per Rim Sale Price
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Per Dozen Sale Price
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Per Sheet/ Piece Sale Price
                  </th>
                  <th className="border border-gray-300 p-2 font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {/* New Item Input Row */}
                <tr className="text-sm text-center">
                  <td className="border border-gray-300 p-1">New</td>

                  {/* Product Name Search & Selection */}
                  <td className="border border-gray-300 p-1">
                    <div className="relative">
                      <input
                        type="text"
                        name="product_name"
                        value={newItem.product_name}
                        className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs bg-white text-gray-600 p-1 form-input"
                        onChange={handleSearchProduct}
                        onKeyDown={handleKeyDown}
                        placeholder="Search Product..."
                      />
                      {searchQuery && filteredProducts.length > 0 && (
                        <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto z-10">
                          {filteredProducts.map((product) => (
                            <li
                              key={product.id}
                              className="p-2 cursor-pointer hover:bg-blue-100"
                              onClick={() => selectProduct(product)}
                            >
                              {product.product_name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </td>

                  {/* Product Code */}
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      name="product"
                      value={newItem.product}
                      className="mt-1 p-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs form-input"
                      onKeyDown={handleKeyDown}
                      placeholder="Enter product code"
                      readOnly
                    />
                  </td>

                  {/* Rim Input - Disabled if DOZEN */}
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="rim"
                      value={newItem.rim}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                      placeholder="Enter rim quantity"
                      disabled={newItem.product_type === "DOZEN"}
                    />
                  </td>

                  {/* Dozen Input - Disabled if RIM */}
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="dozen"
                      value={newItem.dozen}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                      placeholder="Enter dozen quantity"
                      disabled={
                        newItem.product_type === "RIM-A4" ||
                        newItem.product_type === "RIM-LEGAL"
                      }
                    />
                  </td>

                  {/* Only Sheet/Piece Input - Disabled for RIM-A4 */}
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="only_sheet_piece"
                      value={newItem.only_sheet_piece}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                      placeholder="Enter sheet/piece quantity"
                      disabled={newItem.product_type === "RIM-A4"}
                    />
                  </td>

                  {/* Total Sheet/Piece - Readonly */}
                  <input
                    type="number"
                    name="total_sheet_piece"
                    value={newItem.total_sheet_piece}
                    onChange={handleItemChange}
                    className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                    placeholder="Enter total sheet piece"
                    readOnly={newItem.product_type === "RIM-A4"} // ✅ Disable when RIM-A4
                  />

                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="purchase_price"
                      value={newItem.purchase_price}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                      placeholder="Enter purchase price"
                    />
                  </td>

                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="per_rim_or_dozen_price"
                      value={newItem.per_rim_price}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                      placeholder="Enter rim per price"
                      readOnly
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="per_rim_or_dozen_price"
                      value={newItem.per_dozen_price}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                      placeholder="Enter dozen per price"
                      readOnly
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="per_sheet_or_piece_price"
                      value={newItem.per_sheet_or_piece_price}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                      placeholder="Enter sheet/piece per price"
                      readOnly
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="additional_cost"
                      value={newItem.additional_cost}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                      placeholder="Enter additional cost"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="profit"
                      value={newItem.profit}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                      placeholder="Enter profit"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="per_rim_sale_price"
                      value={newItem.per_rim_sale_price}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                      placeholder="Per rim sale price"
                      readOnly
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="per_dozen_sale_price"
                      value={newItem.per_dozen_sale_price}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                      placeholder="Per dozen sale price"
                      readOnly
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="per_sheet_or_piece_sale_price"
                      value={newItem.per_sheet_or_piece_sell_price}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input"
                      placeholder="Per sheet/piece sale price"
                      readOnly
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <button
                      className="btn bg-blue-500 text-white btn-sm w-full"
                      onClick={handleSaveItem}
                    >
                      Add
                    </button>
                  </td>
                </tr>

                {/* Display Saved Items - No Input Fields */}
                {formData.PurchaseItem.map((item, index) => (
                  <tr key={index} className="text-center text-sm">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {item.product}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.product_name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.purchase_price}
                    </td>
                    <td className="border border-gray-300 p-2">{item.rim}</td>
                    <td className="border border-gray-300 p-2">{item.dozen}</td>
                    <td className="border border-gray-300 p-2">
                      {item.only_sheet_piece}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.total_sheet_piece}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.per_rim_price}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.per_dozen_price}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.per_sheet_or_piece_price}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.additional_cost}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.profit}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.per_rim_sale_price}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.per_dozen_sale_price}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.per_piece_or_sheet_sale_price}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                        onClick={() => handleRemoveRow(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modal for Searching & Selecting a Product */}

        <h3 className="text-xl font-semibold my-4 text-center">
          Payment Information
        </h3>

        {/* Payment Section Wrapper */}
        <div className="p-4 bg-white shadow-[0px_0px_30px_rgba(0,0,0,0.1)] rounded-md mt-4">
          <div className="grid grid-cols-10 gap-2 items-center">
            {/* Company Name (Read-Only) */}
            <div>
              <label className="block text-center">Company Name</label>
              <input
                type="text"
                name="company_name"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm bg-gray-100 form-input"
                placeholder="Company Name"
                value={formData.company_name || ""}
                onKeyDown={handleKeyDown}
                readOnly
              />
            </div>

            {/* Previous Due (Read-Only) */}
            <div>
              <label className="block text-center">Previous Due</label>
              <input
                type="number"
                name="previous_due"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 bg-gray-100 placeholder:text-xs form-input"
                value={formData.previous_due}
                onKeyDown={handleKeyDown}
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
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 placeholder:text-xs form-input"
                placeholder="Enter amount"
                value={formData.invoice_challan_amount}
                onKeyDown={handleKeyDown}
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
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 placeholder:text-xs form-input"
                placeholder="Enter paid amount"
                value={formData.today_paid_amount}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
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
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 text-sm form-input"
                placeholder="Select Payment Type"
                value={formData.payment_type}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <datalist id="paymentOptions">
                {/* First option as a placeholder */}
                <option value="" disabled>
                  Select Payment Type
                </option>

                {/* Dynamically load payment types */}
                {paymentTypes.map((type) => (
                  <option key={type.id} value={type.payment_type} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm text-center whitespace-nowrap">
                Bank Name
              </label>
              <input
                type="text"
                name="bank_name"
                className="mt-1 p-2 w-full border border-gray-300 rounded h-9 placeholder:text-xs form-input"
                placeholder="Enter bank name"
                value={formData.bank_name}
                onChange={handleChange}
                disabled={!isBankPayment}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Account No - Enabled only if Bank is selected */}
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
                disabled={!isBankPayment}
              />
            </div>

            {/* Cheque No - Enabled only if Cheque is selected */}
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
                disabled={!isChequePayment}
              />
            </div>

            {/* Cheque Date - Enabled only if Cheque is selected */}
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
                disabled={!isChequePayment}
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
