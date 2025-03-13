import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../../Components/AxiosInstance";
import { IoMdPrint } from "react-icons/io";
import { useNavigate } from "react-router-dom"; // ✅ Import for navigation
const PurchaseList = () => {
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [expandedSupplier, setExpandedSupplier] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null); // ✅ Track which purchase is being edited
const [editFormData, setEditFormData] = useState({}); // ✅ Form Data for Editing

  // const { purchaseId } = useParams();
  const [loading, setLoading] = useState(true); 
 

const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, productsRes, purchasesRes] = await Promise.all([
          AxiosInstance.get("/companies/"),
          AxiosInstance.get("/products/"),
          AxiosInstance.get("/purchases/")
        ]);

        setCompanies(companiesRes.data);
        setProducts(productsRes.data);
        setPurchases(purchasesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Group purchases by supplier
  const filteredPurchases = purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.order_date);
    const startDate = fromDate ? new Date(fromDate) : null;
    const endDate = toDate ? new Date(toDate) : null;
  
    const isCompanyMatch = selectedCompany ? purchase.company === Number(selectedCompany) : true;
    const isDateMatch =
      (!startDate || purchaseDate >= startDate) &&
      (!endDate || purchaseDate <= endDate);
  
    return isCompanyMatch && isDateMatch;
  });
  
  // Group purchases by supplier **after** filtering
  const groupedPurchases = filteredPurchases.reduce((acc, purchase) => {
    const supplierName = companies.find(c => c.id === purchase.company)?.company_name || "Unknown";
  
    if (!acc[supplierName]) {
      acc[supplierName] = {
        supplierName,
        totalAmount: 0,
        paidAmount: 0,
        balanceAmount: 0,
        paymentType: purchase.payment_type || "N/A",
        purchases: []
      };
    }
    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const requestData = {
      ...formData,
      previous_due: formData.previous_due || 0,
      items: formData.PurchaseItem,
    };

    if (purchaseId) {
      // ✅ Update existing purchase
      await AxiosInstance.put(`/purchases/${purchaseId}/`, requestData);
      alert("Purchase updated successfully!");
    } else {
      // ✅ Create new purchase
      await AxiosInstance.post("/purchases/", requestData);
      alert("Purchase data submitted successfully!");
    }

    navigate("/purchase-list"); // ✅ Redirect after save
  } catch (error) {
    console.error("❌ Error saving purchase data:", error.response?.data);
    alert("Failed to save purchase data. Please try again.");
  }
};

  
    acc[supplierName].totalAmount += Number(purchase.invoice_challan_amount) || 0;
    acc[supplierName].paidAmount += Number(purchase.today_paid_amount) || 0;
    acc[supplierName].balanceAmount += Number(purchase.balance_amount) || 0;
    acc[supplierName].purchases.push(purchase);
  
    return acc;
  }, {});
  

  return (
    <div className="mt-8 mx-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">পণ্য ক্রয় তালিকা</h2>
        <Link to="/add-purchase" className="btn bg-blue-950 text-white">
          Add Purchase
        </Link>
      </div>

      {/* Search Filters */}
      <div className="flex justify-between mb-4">
        <div className="join">
          <div className="btn bg-blue-950 rounded-l-md rounded-r-none text-white">
            Search Here
          </div>
          <select
            className="select select-bordered join-item"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Select Company</option>
            {companies?.map((company) => (
              <option key={company.id} value={company.id}>
                {company.company_name}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="input input-bordered join-item"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="input input-bordered join-item"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto p-6">
      <table className="table-auto w-full border-collapse border border-gray-300">
  <thead>
    <tr className="bg-blue-950 text-white text-sm">
      <th className="border p-2">SL No</th>
      <th className="border p-2">Supplier Name</th>
      <th className="border p-2">Total Amount</th>
      <th className="border p-2">Paid Amount</th>
      <th className="border p-2">Balance Amount</th>
      <th className="border p-2">Previous Due</th> {/* ✅ New Column */}
      <th className="border p-2">Payment Type</th>
      <th className="border p-2">Bank Name</th> {/* ✅ New Column */}
      <th className="border p-2">Account No.</th> {/* ✅ New Column */}
      <th className="border p-2">Cheque No.</th> {/* ✅ New Column */}
      <th className="border p-2">Cheque Date</th> {/* ✅ New Column */}
      <th className="border p-2">Item Details</th>
      <th className="border p-2">Edit</th>

      <td className="border p-2 text-center">

</td>

    </tr>
  </thead>

  <tbody>
    {Object.values(groupedPurchases).map((group, index) => (
      <React.Fragment key={group.supplierName}>
        <tr className="bg-gray-100 text-sm">
          <td className="border p-2 text-center">{index + 1}</td>
          <td className="border p-2 text-center">{group.supplierName}</td>
          <td className="border p-2 text-center">{group.totalAmount.toFixed(2)}</td>
          <td className="border p-2 text-center">{group.paidAmount.toFixed(2)}</td>
          <td className="border p-2 text-center">{group.balanceAmount.toFixed(2)}</td>
          <td className="border p-2 text-center">{group.previousDue?.toFixed(2) || "0.00"}</td> {/* ✅ New Data */}
          <td className="border p-2 text-center">{group.paymentType}</td>
          <td className="border p-2 text-center">{group.bankName || "N/A"}</td> {/* ✅ New Data */}
          <td className="border p-2 text-center">{group.accountNo || "N/A"}</td> {/* ✅ New Data */}
          <td className="border p-2 text-center">{group.chequeNo || "N/A"}</td> {/* ✅ New Data */}
          <td className="border p-2 text-center">{group.chequeDate || "N/A"}</td> {/* ✅ New Data */}
          
          <td className="border p-2 text-center">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
              onClick={() => setExpandedSupplier(expandedSupplier === index ? null : index)}
            >
              {expandedSupplier === index ? "Hide Details" : "View Details"}
            </button>
          </td>
          <td className="border p-2 text-center text-blue-500 cursor-pointer">
          <button 
  className="bg-green-500 text-white px-2 py-1 rounded text-xs"
  onClick={() => {
    const selectedPurchase = group.purchases[0]; // Pick first purchase in the group

    setEditingPurchase(selectedPurchase);
    setEditFormData({
      // General Purchase Information
      invoice_challan_no: selectedPurchase.invoice_challan_no || "N/A",
      order_date: selectedPurchase.order_date || "",
      invoice_challan_amount: selectedPurchase.invoice_challan_amount || 0,
      today_paid_amount: selectedPurchase.today_paid_amount || 0,
      balance_amount: selectedPurchase.balance_amount || 0,

      // Payment Information
      payment_type: selectedPurchase.payment_type || "N/A",
      bank_name: selectedPurchase.bank_name || "",
      account_no: selectedPurchase.account_no || "",
      cheque_no: selectedPurchase.cheque_no || "",
      cheque_date: selectedPurchase.cheque_date || "",

      // Items List (Store full items list)
      items: selectedPurchase.items.map((item) => ({
        product: item.product, 
        rim: item.rim || 0,
        dozen: item.dozen || 0,
        only_sheet_or_piece: item.only_sheet_or_piece || 0,
        total_sheet_or_piece: item.total_sheet_or_piece || 0,
        purchase_price: item.purchase_price || 0,
        per_rim_price: item.per_rim_price || 0,
        per_dozen_price: item.per_dozen_price || 0,
        per_sheet_or_piece_price: item.per_sheet_or_piece_price || 0,
        additional_cost: item.additional_cost || 0,
        profit: item.profit || 0,
        per_rim_sell_price: item.per_rim_sell_price || 0,
        per_dozen_sell_price: item.per_dozen_sell_price || 0,
        per_sheet_or_piece_sell_price: item.per_sheet_or_piece_sell_price || 0
      })),
    });
  }}
>
  Edit
</button>

</td>


        </tr>

        {expandedSupplier === index && (
  <tr className="bg-gray-200">
    <td colSpan="12" className="border p-4">
      {/* 🔹 Item Details Table */}
      <h3 className="text-lg font-semibold mb-2">📦 Item Details</h3>
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-300">
            <th className="border p-2">SL</th> {/* ✅ Added Serial Number */}
      
            <th className="border p-2">Date</th>
            <th className="border p-2">Item Code</th>
            <th className="border p-2">Product Name</th>
            <th className="border p-2">Rim</th>
            <th className="border p-2">Dozen</th>
            <th className="border p-2">Only Sheet/Piece</th>
            <th className="border p-2">Total Sheet/Piece</th>
            <th className="border p-2">Purchase Price</th>
            <th className="border p-2">Per Rim Price</th>
            <th className="border p-2">Per Dozen Price</th>
            <th className="border p-2">Per Sheet/Piece Price</th>
            <th className="border p-2">Additional Cost</th>
            <th className="border p-2">Profit</th>
            <th className="border p-2">Per Rim Sale Price</th>
            <th className="border p-2">Per Dozen Sale Price</th>
            <th className="border p-2">Per Sheet/Piece Sale Price</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {group.purchases.flatMap((purchase, i) =>
            purchase.items.map((item, j) => {
              const product = products.find((p) => p.id === item.product);
              return (
                <tr key={j}>
                  <td className="border p-2">{i + j + 1}</td> {/* ✅ SL Number */}
                  {/* <td className="border p-2">{purchase.invoice_challan_no || "N/A"}</td> */}
                  <td className="border p-2">{purchase.order_date}</td>
                  <td className="border p-2">{product?.id || "N/A"}</td>
                  <td className="border p-2">{product?.product_name || "N/A"}</td>
                  <td className="border p-2">{item.rim || "N/A"}</td>
                  <td className="border p-2">{item.dozen || "N/A"}</td>
                  <td className="border p-2">{item.only_sheet_or_piece || "N/A"}</td>
                  <td className="border p-2">{item.total_sheet_or_piece || "N/A"}</td>
                  <td className="border p-2">{item.purchase_price || "N/A"}</td>
                  <td className="border p-2">{item.per_rim_price || "N/A"}</td>
                  <td className="border p-2">{item.per_dozen_price || "N/A"}</td>
                  <td className="border p-2">{item.per_sheet_or_piece_price || "N/A"}</td>
                  <td className="border p-2">{item.additional_cost || "0"}</td>
                  <td className="border p-2">{item.profit || "0"}</td>
                  <td className="border p-2">{item.per_rim_sell_price || "N/A"}</td>
                  <td className="border p-2">{item.per_dozen_sell_price || "N/A"}</td>
                  <td className="border p-2">{item.per_sheet_or_piece_sell_price || "N/A"}</td>
                  <td className="border p-2">
                    {((item.total_sheet_or_piece || 1) * (item.purchase_price || 0)).toFixed(2)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </td>
  </tr>
)}

      </React.Fragment>
    ))}
  </tbody>
</table>
{editingPurchase && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">✏ Edit Purchase</h2>

      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await AxiosInstance.put(`/purchases/${editingPurchase.id}/`, editFormData);
            alert("✅ Purchase updated successfully!");
            setEditingPurchase(null); // Close form
            window.location.reload(); // Reload data
          } catch (error) {
            console.error("❌ Update failed:", error.response?.data);
            alert("⚠ Failed to update purchase.");
          }
        }}
      >

        {/* 🔹 Section 1: Purchase Information */}
        <div className="border-b pb-3 mb-3">
          <h3 className="text-md font-semibold">📜 Purchase Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block">Invoice No</label>
              <input type="text" className="w-full p-2 border rounded" value={editFormData.invoice_challan_no} readOnly />
            </div>

            <div>
              <label className="block">Order Date</label>
              <input type="date" className="w-full p-2 border rounded"
                value={editFormData.order_date}
                onChange={(e) => setEditFormData({ ...editFormData, order_date: e.target.value })}
              />
            </div>

            <div>
              <label className="block">Total Invoice Amount</label>
              <input type="number" className="w-full p-2 border rounded" value={editFormData.invoice_challan_amount} readOnly />
            </div>

            <div>
              <label className="block">Paid Amount</label>
              <input type="number" className="w-full p-2 border rounded"
                value={editFormData.today_paid_amount}
                onChange={(e) => setEditFormData({ ...editFormData, today_paid_amount: e.target.value })}
              />
            </div>

            <div>
              <label className="block">Balance Amount</label>
              <input type="number" className="w-full p-2 border rounded" value={editFormData.balance_amount} readOnly />
            </div>
          </div>
        </div>

        {/* 🔹 Section 2: Payment Information */}
        <div className="border-b pb-3 mb-3">
          <h3 className="text-md font-semibold">💰 Payment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block">Payment Type</label>
              <select className="w-full p-2 border rounded"
                value={editFormData.payment_type}
                onChange={(e) => setEditFormData({ ...editFormData, payment_type: e.target.value })}
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            {(editFormData.payment_type === "Bank Transfer" || editFormData.payment_type === "Cheque") && (
              <div>
                <label className="block">Bank Name</label>
                <input type="text" className="w-full p-2 border rounded"
                  value={editFormData.bank_name}
                  onChange={(e) => setEditFormData({ ...editFormData, bank_name: e.target.value })}
                />
              </div>
            )}

            {editFormData.payment_type === "Cheque" && (
              <>
                <div>
                  <label className="block">Account No.</label>
                  <input type="text" className="w-full p-2 border rounded"
                    value={editFormData.account_no}
                    onChange={(e) => setEditFormData({ ...editFormData, account_no: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block">Cheque No.</label>
                  <input type="text" className="w-full p-2 border rounded"
                    value={editFormData.cheque_no}
                    onChange={(e) => setEditFormData({ ...editFormData, cheque_no: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block">Cheque Date</label>
                  <input type="date" className="w-full p-2 border rounded"
                    value={editFormData.cheque_date}
                    onChange={(e) => setEditFormData({ ...editFormData, cheque_date: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* 🔹 Section 3: Purchased Items */}
        <div>
          <h3 className="text-md font-semibold">📦 Purchased Items</h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-300">
                  <th className="border p-2">Product Name</th>
                  <th className="border p-2">Rim</th>
                  <th className="border p-2">Dozen</th>
                  <th className="border p-2">Total Pieces</th>
                  <th className="border p-2">Purchase Price</th>
                  <th className="border p-2">Additional Cost</th>
                  <th className="border p-2">Profit</th>
                  <th className="border p-2">Sale Price</th>
                </tr>
              </thead>
              <tbody>
                {editFormData.items.map((item, index) => {
                  const product = products.find((p) => p.id === item.product);
                  return (
                    <tr key={index}>
                      <td className="border p-2">{product?.product_name || "N/A"}</td>
                      <td className="border p-2">{item.rim}</td>
                      <td className="border p-2">{item.dozen}</td>
                      <td className="border p-2">{item.total_sheet_or_piece}</td>
                      <td className="border p-2">
                        <input type="number" className="w-full p-1 border rounded"
                          value={item.purchase_price}
                          onChange={(e) => {
                            let updatedItems = [...editFormData.items];
                            updatedItems[index].purchase_price = e.target.value;
                            setEditFormData({ ...editFormData, items: updatedItems });
                          }}
                        />
                      </td>
                      <td className="border p-2">{item.additional_cost}</td>
                      <td className="border p-2">{item.profit}</td>
                      <td className="border p-2">{item.per_sheet_or_piece_sell_price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex justify-between mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
          <button type="button" className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setEditingPurchase(null)}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}






      </div>
    </div>
  );
};

export default PurchaseList;
