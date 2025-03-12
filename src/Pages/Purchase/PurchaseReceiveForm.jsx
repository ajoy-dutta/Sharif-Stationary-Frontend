import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AxiosInstance from "../../Components/AxiosInstance";

import { useUser } from "../../Provider/UserProvider";
import { Link } from "react-router-dom";

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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filteredCompanies, setFilteredCompanies] = useState([]); // Filtered companies
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(-1);
  const [companyQuery, setCompanyQuery] = useState("");

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

        const godownResponse = await AxiosInstance.get("/godowns/");
        setGodowns(godownResponse.data);
        console.log(godowns);

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

 

  const handleCompanySearch = (e) => {
    const query = e.target.value.toLowerCase();
    setCompanyQuery(query);

    if (!query.trim()) {
      setFilteredCompanies(companies); // Show all when empty
      setSelectedCompanyIndex(-1);
      return;
    }

    const results = companies.filter((company) =>
      company.company_name.toLowerCase().includes(query)
    );

    setFilteredCompanies(results);
    setSelectedCompanyIndex(0);
  };

  const selectCompany = (company) => {
    if (!company) {
      setFormData((prev) => ({
        ...prev,
        company: "",
        company_name: "",
        previous_due: 0, // Set a default value if no company is selected
      }));
      return;
    }
  
    setFormData((prev) => ({
      ...prev,
      company: company.id, // ✅ Store company ID
      company_name: company.company_name, // ✅ Store company name
      previous_due: parseFloat(company.previous_due) || 0, // ✅ Store previous due or default to 0
    }));
  
    setCompanyQuery(company.company_name); // ✅ Update input field
    setFilteredCompanies([]); // ✅ Hide dropdown
  
    // ✅ Filter products related to selected company
    const companyProducts = products.filter(
      (product) => product.company && product.company.id === company.id
    );
    setFilteredProducts(companyProducts);
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
    const numericValue = value === "" ? "" : parseFloat(value) || 0;
  
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };
  
      // ✅ Handle dynamic field enabling/disabling based on payment type
      if (name === "payment_type") {
        setIsBankPayment(value === "Bank");
        setIsChequePayment(value === "Cheque");
      }
  
      // ✅ Log invoice challan number updates
      if (name === "invoice_challan_no") {
        console.log("Updating invoice_challan_no to:", value);
      }
  
      // ✅ Recalculate `balance_amount` when `today_paid_amount` changes
      if (name === "today_paid_amount") {
        const previousDue = parseFloat(prevData.previous_due) || 0;
        const invoiceAmount = parseFloat(prevData.invoice_challan_amount) || 0;
        updatedData.balance_amount = invoiceAmount - numericValue + previousDue;
      }
  
      return updatedData;
    });
  
    console.log(`handleChange called for ${name} with value: ${value}`);
  };
  

  const handleItemChange = (e) => {
    const { name, value } = e.target;

    // Convert input values to numbers while keeping empty values as ""
    const numericValue = value === "" ? "" : parseFloat(value) || 0;

    let updatedItem = { ...newItem, [name]: numericValue };

    // 🔹 Reset dependent fields when product_name changes
    if (name === "product_name") {
      const selectedProduct = products.find(
        (p) => p.product_name.toLowerCase() === value.toLowerCase()
      );

      if (selectedProduct) {
        updatedItem = {
          product: selectedProduct.id,
          product_name: selectedProduct.product_name,
          product_type: selectedProduct.product_type,
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
        };
      }
    }

    const isRimA4 = updatedItem.product_type === "RIM-A4";
    const isRimLegal = updatedItem.product_type === "RIM-LEGAL";
    const isDozen = updatedItem.product_type === "DOZEN";

    // Convert numeric values for calculations
    const purchasePrice = parseFloat(updatedItem.purchase_price) || 0;
    const additionalCost = parseFloat(updatedItem.additional_cost) || 0;
    const profit = parseFloat(updatedItem.profit) || 0;
    const rim = parseFloat(updatedItem.rim) || 0;
    const dozen = parseFloat(updatedItem.dozen) || 0;
    const onlySheetPiece = parseFloat(updatedItem.only_sheet_piece) || 0;

    // 🔹 Handle Total Sheet/Piece Calculation
    if (isRimLegal) {
      updatedItem.total_sheet_piece = rim * 500 + onlySheetPiece || "";

      updatedItem.per_sheet_or_piece_price = purchasePrice
        ? parseFloat((purchasePrice / updatedItem.total_sheet_piece).toFixed(2))
        : "";

      updatedItem.per_rim_price = updatedItem.per_sheet_or_piece_price
        ? parseFloat((updatedItem.per_sheet_or_piece_price * 500).toFixed(2))
        : "";

      updatedItem.per_piece_or_sheet_sale_price = purchasePrice
        ? parseFloat(
            (
              (purchasePrice + additionalCost + profit) /
              updatedItem.total_sheet_piece
            ).toFixed(2)
          )
        : "";

      updatedItem.per_rim_sale_price = updatedItem.per_piece_or_sheet_sale_price
        ? parseFloat(
            (updatedItem.per_piece_or_sheet_sale_price * 500).toFixed(2)
          )
        : "";

      updatedItem.per_dozen_price = "";
      updatedItem.per_dozen_sale_price = "";
    } else if (isRimA4) {
      updatedItem.only_sheet_piece = "";
      updatedItem.total_sheet_piece = "";

      updatedItem.per_rim_price = purchasePrice
        ? parseFloat((purchasePrice / (rim || 1)).toFixed(2))
        : "";

      updatedItem.per_rim_sale_price = purchasePrice
        ? parseFloat(
            ((purchasePrice + additionalCost + profit) / (rim || 1)).toFixed(2)
          )
        : "";

      updatedItem.per_sheet_or_piece_price = "";
      updatedItem.per_piece_or_sheet_sale_price = "";
      updatedItem.per_dozen_price = "";
      updatedItem.per_dozen_sale_price = "";
    } else if (isDozen) {
      // ✅ Total Sheet/Piece Calculation
      updatedItem.total_sheet_piece = dozen * 12 + onlySheetPiece || "";

      // ✅ Per Sheet/Piece Price
      updatedItem.per_sheet_or_piece_price = purchasePrice
        ? parseFloat((purchasePrice / updatedItem.total_sheet_piece).toFixed(2))
        : "";

      // ✅ Per Dozen Price
      updatedItem.per_dozen_price = updatedItem.per_sheet_or_piece_price
        ? parseFloat((updatedItem.per_sheet_or_piece_price * 12).toFixed(2))
        : "";

      // ✅ Per Sheet/Piece Sale Price
      updatedItem.per_piece_or_sheet_sale_price = purchasePrice
        ? parseFloat(
            (
              (purchasePrice + additionalCost + profit) /
              updatedItem.total_sheet_piece
            ).toFixed(2)
          )
        : "";

      // ✅ Per Dozen Sale Price
      updatedItem.per_dozen_sale_price =
        updatedItem.per_piece_or_sheet_sale_price
          ? parseFloat(
              (updatedItem.per_piece_or_sheet_sale_price * 12).toFixed(2)
            )
          : "";

      updatedItem.per_rim_price = "";
      updatedItem.per_rim_sale_price = "";
    }

    // 🔹 Disable Fields Based on Product Type & Apply Gray-200 Style
    if (isRimA4) {
      updatedItem.only_sheet_piece = "";
      updatedItem.dozen = "";
    } else if (isDozen) {
      updatedItem.rim = "";
    }

    setNewItem(updatedItem);
  };

  const handleSearchProduct = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // ✅ Base list of products should respect selected company
    const baseProducts = formData.company
      ? products.filter(
          (product) =>
            product.company &&
            product.company.id.toString() === formData.company
        )
      : products;

    if (!query.trim()) {
      setFilteredProducts(baseProducts); // ✅ Show all when empty
      setSelectedIndex(-1);
      return;
    }

    // ✅ Apply search query filtering while respecting company selection
    const results = baseProducts.filter((item) =>
      item.product_name.toLowerCase().includes(query)
    );

    setFilteredProducts(results);
    setSelectedIndex(results.length > 0 ? 0 : -1);

    // ✅ Update new item with search query
    setNewItem((prev) => ({
      ...prev,
      product_name: query,
    }));
  };

  const selectProduct = (product) => {
    setNewItem((prevItem) => ({
      ...prevItem,
      product: product.id, // ✅ Auto-fill product code
      product_name: product.product_name,
      product_type: product.product_type,
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
    }));

    setSearchQuery(product.product_name); // ✅ Update input field
    setFilteredProducts([]); // ✅ Hide dropdown

    // ✅ Move focus to next input
    setTimeout(() => {
      const nextElement = document.querySelector(".form-input");
      if (nextElement) nextElement.focus();
    }, 100);
  };

  const handleKeyDown = (e) => {
    // Only prevent default for arrow keys and Enter
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
      e.preventDefault(); // Prevent default only for navigation keys
    }
  
    if (e.key === "Enter") {
      if (e.target.name === "product_name" && filteredProducts.length > 0) {
        selectProduct(filteredProducts[selectedIndex]);
      } else if (e.target.name === "company_name" && filteredCompanies.length > 0) {
        selectCompany(filteredCompanies[selectedCompanyIndex]);
      }
    } else if (e.key === "ArrowDown") {
      if (e.target.name === "product_name" && filteredProducts.length > 0) {
        const newIndex = (selectedIndex + 1) % filteredProducts.length;
        setSelectedIndex(newIndex);
        highlightDropdownItem("product-item", newIndex);
      } else if (e.target.name === "company_name" && filteredCompanies.length > 0) {
        const newIndex = (selectedCompanyIndex + 1) % filteredCompanies.length;
        setSelectedCompanyIndex(newIndex);
        highlightDropdownItem("company-item", newIndex);
      }
    } else if (e.key === "ArrowUp") {
      if (e.target.name === "product_name" && filteredProducts.length > 0) {
        const newIndex = selectedIndex > 0 ? selectedIndex - 1 : filteredProducts.length - 1;
        setSelectedIndex(newIndex);
        highlightDropdownItem("product-item", newIndex);
      } else if (e.target.name === "company_name" && filteredCompanies.length > 0) {
        const newIndex = selectedCompanyIndex > 0 ? selectedCompanyIndex - 1 : filteredCompanies.length - 1;
        setSelectedCompanyIndex(newIndex);
        highlightDropdownItem("company-item", newIndex);
      }
    }
  };
  
  const handleSaveItem = (e) => {
    e.preventDefault(); // Prevent form submission
  
    if (!newItem.product || !newItem.product_name) {
      alert("Please enter a valid product and product name.");
      return;
    }
  
    setFormData((prevData) => {
      // ✅ Add new item to the list
      const updatedPurchaseItems = [...prevData.PurchaseItem, newItem];
  
      // ✅ Calculate new `invoice_challan_amount`
      const newInvoiceAmount = updatedPurchaseItems.reduce(
        (total, item) => total + (parseFloat(item.purchase_price) || 0),
        0
      );
  
      // ✅ Calculate new `balance_amount`
      const previousDue = parseFloat(prevData.previous_due) || 0;
      const paidAmount = parseFloat(prevData.today_paid_amount) || 0;
      const newBalanceAmount = newInvoiceAmount - paidAmount + previousDue;
  
      return {
        ...prevData,
        PurchaseItem: updatedPurchaseItems,
        invoice_challan_amount: newInvoiceAmount,
        balance_amount: newBalanceAmount,
      };
    });
  
    // ✅ Clear the input form
    setNewItem({
      product: "",
      product_name: "",
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
  
    setShowInputForm(false); // Hide form after saving
  };
  

  const handleRemoveRow = (indexToRemove) => {
    setFormData((prevData) => {
      const updatedPurchaseItems = prevData.PurchaseItem.filter(
        (_, index) => index !== indexToRemove
      );
  
      // ✅ Recalculate `invoice_challan_amount`
      const newInvoiceAmount = updatedPurchaseItems.reduce(
        (total, item) => total + (parseFloat(item.purchase_price) || 0),
        0
      );
  
      // ✅ Recalculate `balance_amount`
      const previousDue = parseFloat(prevData.previous_due) || 0;
      const paidAmount = parseFloat(prevData.today_paid_amount) || 0;
      const newBalanceAmount = newInvoiceAmount - paidAmount + previousDue;
  
      return {
        ...prevData,
        PurchaseItem: updatedPurchaseItems,
        invoice_challan_amount: newInvoiceAmount,
        balance_amount: newBalanceAmount,
      };
    });
  };
  

  const formatDate = (date) => {
    if (!date) return ""; // Handle empty date
    return new Date(date).toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Function to properly format dates (handles empty dates)
      const formatDate = (date) => {
        if (!date || date === "") return null; // ✅ Return null for optional fields
        return new Date(date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
      };

      // Ensure proper conversion of numeric values
      const formattedItems = formData.PurchaseItem.map((item) => ({
        product: parseInt(item.product) || null,
        purchase_price: parseFloat(item.purchase_price) || 0,
        rim: parseInt(item.rim) || 0,
        dozen: parseInt(item.dozen) || 0,
        only_sheet_or_piece: parseInt(item.only_sheet_piece) || 0,
        total_sheet_or_piece: parseInt(item.total_sheet_piece) || 0,
        per_rim_price: parseFloat(item.per_rim_price) || 0,
        per_dozen_price: parseFloat(item.per_dozen_price) || 0,
        per_sheet_or_piece_price:
          parseFloat(item.per_sheet_or_piece_price) || 0,
        additional_cost: parseFloat(item.additional_cost) || 0,
        profit: parseFloat(item.profit) || 0,
        per_rim_sell_price: parseFloat(item.per_rim_sale_price) || 0,
        per_dozen_sell_price: parseFloat(item.per_dozen_sale_price) || 0,
        per_sheet_or_piece_sell_price:
          parseFloat(item.per_piece_or_sheet_sale_price) || 0,
      }));

      const requestData = {
        ...formData,
        previous_due: formData.previous_due || 0, 
        order_date: formatDate(formData.order_date),
        invoice_challan_date: formatDate(formData.invoice_challan_date),
        delivery_date: formatDate(formData.delivery_date),
        
        cheque_date:
          formData.payment_type === "Cheque"
            ? formatDate(formData.cheque_date)
            : null, // ✅ Only include cheque_date if payment_type is "Cheque"

        items: formattedItems.length > 0 ? formattedItems : undefined, // ✅ Avoid sending empty array
      };

      const response = await AxiosInstance.post("/purchases/", requestData);

      console.log("✅ Purchase Data Submitted Successfully:", response.data);
      alert("Purchase data submitted successfully!");

      // ✅ Reset form after successful submission
      setFormData({
        company: "",
        order_date: new Date().toISOString().split("T")[0],
        order_no: "",
        invoice_challan_date: new Date().toISOString().split("T")[0],
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
    <div className="m-6 mb-0 ">
      <div className="flex items-start justify-between mb-5">
        <h2 className="text-xl font-medium">Purchase Details</h2>
        <Link to="/purchase-list">
          <button className="btn bg-blue-950 text-xs btn-sm text-white">
            Purchase List
          </button>
        </Link>
      </div>
      <h2 className="text-xl font-semibold mb-4 -mt-6 text-center">
        Purchase & Invoice Information
      </h2>
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="form-input"
      >
        <div className="p-4 bg-white shadow-[0px_0px_30px_rgba(0,0,0,0.1)] rounded-md mt-4">
          <div className=" grid grid-cols-7 gap-2 text-sm  ">
            {/* Company Search Input */}
            <div className="relative">
              <label className="block text-center">Company*</label>
              <input
                type="text"
                name="company_name"
                value={companyQuery}
                className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs bg-white text-gray-600 p-1 form-input"
                onChange={handleCompanySearch}
                onKeyDown={handleKeyDown}
                onFocus={() => setFilteredCompanies(companies)} // ✅ Show all companies on focus
                placeholder="Search Company..."
              />
              {filteredCompanies.length > 0 && (
              <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto z-10">
              {filteredCompanies.map((company, index) => (
                <li
                  key={company.id}
                  className={`p-2 cursor-pointer transition-all ${
                    selectedCompanyIndex === index ? "bg-blue-200 font-semibold" : "hover:bg-blue-100"
                  }`}
                  onMouseDown={() => selectCompany(company)}
                >
                  {company.company_name}
                </li>
              ))}
            </ul>
              )}
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
                onKeyDown={handleKeyDown}
                required
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
                className="mt-1  w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
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
                        value={searchQuery}
                        className="mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs bg-white text-gray-600 p-1 form-input"
                        onChange={handleSearchProduct}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                          // When focused, show products for current company selection
                          const companyProducts = formData.company
                            ? products.filter(
                                (product) =>
                                  product.company &&
                                  product.company.id.toString() ===
                                    formData.company
                              )
                            : products;
                          setFilteredProducts(companyProducts);
                        }}
                        placeholder="Search Product..."
                      />
                      {filteredProducts.length > 0 && (
                       <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto z-10">
                       {filteredProducts.map((product, index) => (
                         <li
                           key={product.id}
                           className={`p-2 cursor-pointer transition-all ${
                             selectedIndex === index ? "bg-blue-200 font-semibold" : "hover:bg-blue-100"
                           }`}
                           onMouseDown={() => selectProduct(product)}
                         >
                           {product.product_name}
                         </li>
                       ))}
                     </ul>
                      )}
                    </div>
                  </td>

                  {/* Product Code (Read-only) */}
                  <td className="border border-gray-300 p-1">
                    <input
                      type="text"
                      name="product"
                      value={newItem.product}
                      className="mt-1 p-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs form-input bg-gray-100"
                      readOnly
                      placeholder="Enter product code"
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
                      className={`mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input ${
                        newItem.product_type === "DOZEN" ? "bg-gray-200" : ""
                      }`}
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
                      className={`mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input ${
                        newItem.product_type === "RIM-A4" ||
                        newItem.product_type === "RIM-LEGAL"
                          ? "bg-gray-200"
                          : ""
                      }`}
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
                      className={`mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input ${
                        newItem.product_type === "RIM-A4" ? "bg-gray-200" : ""
                      }`}
                      placeholder="Enter sheet/piece quantity"
                      disabled={newItem.product_type === "RIM-A4"}
                    />
                  </td>

                  {/* Total Sheet/Piece - Readonly */}
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="total_sheet_piece"
                      value={newItem.total_sheet_piece}
                      onChange={handleItemChange}
                      className={`mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input ${
                        newItem.product_type === "RIM-A4" ? "bg-gray-200" : ""
                      }`}
                      placeholder="Enter total sheet piece"
                      readOnly
                    />
                  </td>

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
                      className={`mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input ${
                        newItem.product_type === "DOZEN" ? "bg-gray-200" : ""
                      }`}
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
                      className={`mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input ${
                        newItem.product_type === "RIM-A4" ||
                        newItem.product_type === "RIM-LEGAL"
                          ? "bg-gray-200"
                          : ""
                      }`}
                      placeholder="Enter per dozen price"
                      disabled={
                        newItem.product_type === "RIM-A4" ||
                        newItem.product_type === "RIM-LEGAL"
                      }
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
                      className={`mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input ${
                        newItem.product_type === "RIM-A4" ? "bg-gray-200" : ""
                      }`}
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
                      className={`mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input ${
                        newItem.product_type === "DOZEN" ? "bg-gray-200" : ""
                      }`}
                      placeholder="Per rim sale price"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="per_dozen_sale_price"
                      value={newItem.per_dozen_sale_price}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className={`mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input ${
                        newItem.product_type === "RIM-A4" ? "bg-gray-200" : ""
                      }`}
                      placeholder="Per dozen sale price"
                    />
                  </td>
                  <td className="border border-gray-300 p-1">
                    <input
                      type="number"
                      name="per_piece_or_sheet_sale_price"
                      value={newItem.per_piece_or_sheet_sale_price}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      className={`mt-1 input-sm w-full border border-gray-300 rounded h-7 placeholder:text-xs p-1 form-input ${
                        newItem.product_type === "RIM-A4" ? "bg-gray-200" : ""
                      }`}
                      placeholder="Per sheet/piece sale price"
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
                      {item.product_name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.product}
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
        <div className="p-4 px-2 bg-white shadow-[0px_0px_30px_rgba(0,0,0,0.1)] rounded-md mt-4">
          <div className="grid grid-cols-10 gap-1 items-center">
            {/* Company Name (Read-Only) */}
            <div>
              <label className="block text-sm text-center">Company Name</label>
              <input
                type="text"
                name="company_name"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
                placeholder="Company Name"
                value={formData.company_name || ""}
                onKeyDown={handleKeyDown}
                readOnly
              />
            </div>

            {/* Previous Due (Read-Only) */}
            <div>
              <label className="block text-sm text-center">Previous Due</label>
              <input
                type="number"
                name="previous_due"
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
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
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
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
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
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
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
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
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
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
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
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
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
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
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
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
                className="mt-1 p-2 w-full border input-sm border-gray-300 rounded h-7 text-sm form-input"
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
