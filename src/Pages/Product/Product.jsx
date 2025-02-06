const ProductForm = () => {
  return (
    <div className="container mx-auto p-4 mb-72">
      <h2 className="text-xl font-bold mb-4">Product Form</h2>
      <form className="space-y-4 border p-4 rounded-lg shadow-md">
        
        {/* Product Name */}
        <div>
          <label className="block font-semibold">Product Name</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded" 
            placeholder="Enter product name" 
          />
        </div>

        {/* Product ID */}
        <div>
          <label className="block font-semibold">Product ID</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded" 
            placeholder="Enter product ID" 
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-semibold">Price</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded" 
            placeholder="Enter price" 
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold">Category</label>
          <select className="w-full p-2 border rounded">
            <option value="">Select category</option>
            <option value="stationary">Stationary</option>
            <option value="office-supplies">Office Supplies</option>
            <option value="furniture">Furniture</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block font-semibold">Quantity</label>
          <input 
            type="number" 
            className="w-full p-2 border rounded" 
            placeholder="Enter quantity"
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block font-semibold">Product Description</label>
          <textarea 
            className="w-full p-2 border rounded" 
            rows="4" 
            placeholder="Enter product description"
          ></textarea>
        </div>

        {/* Product Image */}
        <div>
          <label className="block font-semibold">Product Image</label>
          <input 
            type="file" 
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button 
            type="submit" 
            className="w-full p-3 bg-blue-950 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300"
          >
            Submit
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProductForm;
