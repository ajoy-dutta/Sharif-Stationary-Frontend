import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast, Toaster } from "react-hot-toast";
import AxiosInstance from "../../Components/AxiosInstance";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    company_id: "",
    product_code: "",
    product_description: "",
    date: "",
  });

  const [editableProduct, setEditableProduct] = useState(null);

//   // Fetch products from API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await AxiosInstance.get("/products/");
//         setProducts(response.data);
//         setCompanies(companyResponse.data); // ✅ Update companies state
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);
  
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AxiosInstance.get("/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    const fetchCompanies = async () => {
      try {
        const response = await AxiosInstance.get("/companies/"); // ✅ Fetch from products API
        // const uniqueCompanies = response.data.map((product) => product.id); // ✅ Extract unique companies
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
  
    fetchProducts();
    fetchCompanies();
  }, []);
  

  // Add a new product
  const handleAddProduct = async () => {
    const { company_id, product_code, product_description, date } = newProduct;

    if (!company_id.trim() || !product_code.trim() || !product_description.trim() || !date.trim()) {
      toast.error("⚠️ All fields are required!");
      return;
    }

    try {
      const response = await AxiosInstance.post("/products/", newProduct);

      if (response.status === 201) {
        setProducts((prev) => [...prev, response.data]);
        setNewProduct({ company_id: "", product_code: "", product_description: "", date: "" });
        toast.success("Product added successfully!");
        document.getElementById("product_modal").close();
      } else {
        toast.error("Failed to add product!");
      }
    } catch (error) {
      console.error("Error adding product:", error.response?.data);
      toast.error("Failed to add product!");
    }
  };

  // Edit product
  const handleEditProduct = async () => {
    if (!editableProduct) return;
  
    const { company_id, product_code, product_description, date, id } = editableProduct;
  console.log("companyid",company_id)
    if (!company_id.trim() || !product_code.trim() || !product_description.trim() || !date.trim()) {
      toast.error("⚠️ All fields are required!");
      return;
    }
  
    try {
      const response = await AxiosInstance.put(`/products/${id}/`, editableProduct);
  
      if (response.status === 200) {
        setProducts((prev) => prev.map((item) => (item.id === id ? response.data : item)));
        toast.success("Product updated successfully!");
  
        // ✅ Clear Form Data
        setEditableProduct(null); // Clears form after updating
        setNewProduct({ company_id: "", product_code: "", product_description: "", date: "" });
  
        // ✅ Close Modal
        document.getElementById("product_modal").close();
      } else {
        toast.error("Failed to update product!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product!");
    }
  };
  

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      await AxiosInstance.delete(`/products/${id}/`);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product!");
    }
  };

  // Handle search
  const handleSearch = () => {
    const searchTerm = document.getElementById("productSearch").value;
    const filtered = products.filter(
      (item) =>
        item.product_code &&
        item.product_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProducts(filtered);
  };

  // const openProductModal = () => {
  //   setEditableProduct(null); // Reset edit mode
  //   setNewProduct({ company_id: "", product_code: "", product_description: "", date: "" }); // Reset form
  //   document.getElementById("product_modal").showModal();
  // };

  return (
    <div className="m-8">
      <h2 className="text-sm">Search Product:*</h2>
      <div className="flex justify-between items-center">
        <div className="join items-center">
          <input
            type="text"
            id="productSearch"
            placeholder="Enter product code"
            className="input input-bordered text-sm rounded-s-md h-[30px] join-item"
          />
          <button className="btn btn-sm bg-blue-700 text-white" onClick={handleSearch}>
            Search
          </button>
        </div>
        <button
  className="btn btn-sm bg-blue-700 text-white"
  onClick={() => {
    setEditableProduct(null); // Reset editing mode
    setNewProduct({ company_id: "", product_code: "", product_description: "", date: "" }); // Clear form
    document.getElementById("product_modal").showModal(); // Open modal
  }}
>
  <TiPlus /> Add Product
</button>

      </div>

      <div className="m-8 text-center font-bold text-gray-700 border-b-[1px] pb-2">
        <h2 className="text-lg">List of Products</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-sm text-sm table-zebra table-fixed table-compact w-3/4 mx-auto">
          <thead className="bg-blue-700 text-white font-md font-normal">
            <tr className="text-center">
              <th>SL</th>
              <th>Company ID</th>
              <th>Added Date</th>
              <th>Product Code</th>
              <th>Product Description</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {products.length > 0 ? (
              products.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.company.company_name}</td>
                  <td>{item.date}</td>
                  <td>{item.product_code}</td>
                  <td>{item.product_description}</td>
                  <td>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        setEditableProduct(item);
                        document.getElementById("product_modal").showModal();
                      }}
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button className="text-red-500 hover:underline" onClick={() => handleDeleteProduct(item.id)}>
                      <ImCross />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-gray-500">
                  No products found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
     {/* Modal */}
{/* Modal */}
<dialog id="product_modal" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box relative p-6">
    {/* Close Button */}
    <button
      className="absolute top-4 right-4 text-lg"
      onClick={() => document.getElementById("product_modal").close()}
    >
      <ImCross />
    </button>

    <h3 className="font-bold text-lg my-5 text-center">
      {editableProduct ? "Edit Product" : "Add Product"}
    </h3>

    <div className="space-y-4">
      {/* 🔹 Company Name Dropdown */}
{/* Debugging - Log editableProduct to check data */}

  {/* 🔹 Company Name Dropdown */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Company Name</label>
    <select
      className="select select-bordered w-full p-2"
      value={editableProduct ? editableProduct.company?.id : newProduct.company_id} // ✅ FIXED: Use company.id
      onChange={(e) =>
        editableProduct
          ? setEditableProduct((prev) => ({
              ...prev,
              company: { ...prev.company, id: e.target.value }, // ✅ FIX: Ensure object structure remains intact
            }))
          : setNewProduct((prev) => ({ ...prev, company_id: e.target.value }))
      }
    >
      <option value="">Select Company</option>
      {companies.map((company) => (
        <option key={company.id} value={company.id}>
          {company.company_name}
        </option>
      ))}
    </select>
  </div>


      {/* 🔹 Product Code */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Product Code</label>
        <input
          type="text"
          className="input input-bordered w-full p-2"
          placeholder="Enter Product Code"
          value={editableProduct ? editableProduct.product_code : newProduct.product_code}
          onChange={(e) =>
            editableProduct
              ? setEditableProduct((prev) => ({ ...prev, product_code: e.target.value }))
              : setNewProduct((prev) => ({ ...prev, product_code: e.target.value }))
          }
        />
      </div>

      {/* 🔹 Product Description */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Product Description</label>
        <input
          type="text"
          className="input input-bordered w-full p-2"
          placeholder="Enter Product Description"
          value={editableProduct ? editableProduct.product_description : newProduct.product_description}
          onChange={(e) =>
            editableProduct
              ? setEditableProduct((prev) => ({ ...prev, product_description: e.target.value }))
              : setNewProduct((prev) => ({ ...prev, product_description: e.target.value }))
          }
        />
      </div>

      {/* 🔹 Date Picker */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          className="input input-bordered w-full p-2"
          value={editableProduct ? editableProduct.date : newProduct.date}
          onChange={(e) =>
            editableProduct
              ? setEditableProduct((prev) => ({ ...prev, date: e.target.value }))
              : setNewProduct((prev) => ({ ...prev, date: e.target.value }))
          }
        />
      </div>
    </div>

    {/* 🔹 Action Buttons */}
    <div className="modal-action justify-center mt-6">
      <button className="btn bg-blue-700 text-white w-full p-2" onClick={editableProduct ? handleEditProduct : handleAddProduct}>
        {editableProduct ? "Update Product" : "Add Product"}
      </button>
    </div>
  </div>
  <Toaster position="top-center" reverseOrder={false} />
</dialog>

<Toaster position="top-center" reverseOrder={false} />


    </div>
  );
};

export default Products;
