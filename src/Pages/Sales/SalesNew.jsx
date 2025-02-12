import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesNew = () => {
  const [formData, setFormData] = useState({
    date: "",
    voucherNo: "",
    customer: "",
    customerAddress: "",
    phoneNumber: "",
    remarks: "",
    branch: "",
    servedBy: "",
    deliveryAddress: "",
    temporaryCustomer: false,
    payMethod: "Cash",
    cardDetails: "",
    totalAmount: "",
    discount: "",
    cardAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    vatTotal: 0,
    exchangePoint: 0,
    netAmount: 0,
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      productCode: "",
      productTitle: "",
      rim: "",
      sheet: "",
      balance: "",
      itemTotal: "",
      discount: "",
      vat: "",
      vatAmount: "",
      total: "",
    },
  ]);

  // Handling changes for both formData and products
  const handleChange = (e, index = null) => {
    const { name, value, type, checked } = e.target;

    if (index !== null) {
      const updatedProducts = [...products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: type === "checkbox" ? checked : value,
      };
      setProducts(updatedProducts);
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handlePreviewInvoice = () => {
    toast.info("Order item is cancelled");
  };

  // Handle adding a new product
  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: products.length + 1,
        productCode: "",
        productTitle: "",
        rim: "",
        sheet: "",
        balance: "",
        itemTotal: "",
        discount: "",
        vat: "",
        vatAmount: "",
        total: "",
      },
    ]);
  };

  // Handle deleting a product field
  const handleDelete = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleSubmit = () => {
    toast.success("Customer order Submitted Successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
<div className="text-center py-4">
  <span className="text-2xl font-bold text-gray-700">খুচরা বিক্রেতার জন্য</span>
</div>

      {/* Customer Section */}
      <div className="grid grid-cols-6 gap-4 mb-6 border p-8 rounded-lg shadow">
        {/* <h2 className="col-span-4 text-lg font-semibold">Customer</h2> */}

        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-1 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Voucher Number</label>
          <input
            type="text"
            name="voucherNo"
            value={formData.voucherNo}
            onChange={handleChange}
            className="w-full px-4 py-1 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            type="text"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            className="w-full px-4 py-1 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Customer Address</label>
          <input
            type="text"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleChange}
            className="w-full px-4 py-1 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-1 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Remarks</label>
          <input
            type="text"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="w-full px-4 py-1 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Product Details Section */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-lg font-semibold mb-4">Product Details</h2>

        {products.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 mb-4 border p-4 rounded-lg shadow"
          >
            <div>
              <label className="block text-sm font-medium">Product Code</label>
              <input
                type="text"
                name="productCode"
                value={product.productCode}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-1 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Product Title</label>
              <input
                type="text"
                name="productTitle"
                value={product.productTitle}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-1 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">RIM</label>
              <input
                type="text"
                name="rim"
                value={product.rim}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-1 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Sheet</label>
              <input
                type="text"
                name="sheet"
                value={product.sheet}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-1 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Balance</label>
              <input
                type="text"
                name="balance"
                value={product.balance}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-1 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Item Total</label>
              <input
                type="text"
                name="itemTotal"
                value={product.itemTotal}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-1 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Discount</label>
              <input
                type="text"
                name="discount"
                value={product.discount}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-1 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">VAT</label>
              <input
                type="text"
                name="vat"
                value={product.vat}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-1 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">VAT Amount</label>
              <input
                type="text"
                name="vatAmount"
                value={product.vatAmount}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-1 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Total</label>
              <input
                type="text"
                name="total"
                value={product.total}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-1 border border-gray-300 rounded"
              />
            </div>

            {/* Delete Button next to each product field */}
            <div className="col-span-4">
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="px-4 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Add New Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleAddProduct}
            className="px-6 py-1 bg-green-500 text-white rounded-lg"
          >
            Add New Product
          </button>
        </div>
      </div>

      {/* Payment and Summary Section */} 
      <div className="w-36 h-7 bg-green-500 text-white text-sm  flex items-center justify-center rounded-md shadow-md ml-2 mb-2">
  Payment Status
  <br />
</div>

      <div className="grid grid-cols-4 gap-4 mb-6">
   
        <div>
          <label className="block text-sm font-medium">Card/bKash Amount</label>
          <input
            type="number"
            name="cardAmount"
            value={formData.cardAmount}
            onChange={handleChange}
            className="w-full px-16 py-1 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Paid Amount</label>
          <input
            type="number"
            name="paidAmount"
            value={formData.paidAmount}
            onChange={handleChange}
            className="w-full px-16 py-1 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Due Amount</label>
          <input
            type="number"
            name="dueAmount"
            value={formData.dueAmount}
            onChange={handleChange}
            className="w-full px-16 py-1 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Discount</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full px-16 py-1 border border-gray-300 rounded"
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
            className="w-full px-16 py-1 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Exchange Point</label>
          <input
            type="number"
            name="exchangePoint"
            value={formData.exchangePoint}
            onChange={handleChange}
            className="w-full px-16 py-1 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Net Amount</label>
          <input
            type="number"
            name="netAmount"
            value={formData.netAmount}
            onChange={handleChange}
            className="w-full px-16 py-1 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviewInvoice}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default SalesNew;
