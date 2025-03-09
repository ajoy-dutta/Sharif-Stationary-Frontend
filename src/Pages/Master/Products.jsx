import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast, Toaster } from "react-hot-toast";
import AxiosInstance from "../../Components/AxiosInstance";
import Swal from "sweetalert2";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    company_id: "",
    product_code: "",
    product_description: "",
    date: "",
  });
  const [originalProducts, setOriginalProducts] = useState([]); // Store all products
  const [editableProduct, setEditableProduct] = useState(null);
  const [searchResult, setSearchResult] = useState(null); // Store the searched product
  const [companies, setCompanies] = useState([]);
  const [productCodes, setProductCodes] = useState([]); // ✅ Add this
  const [selectedCode, setSelectedCode] = useState(""); // ✅ Fix: Add this state
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Add this
  const [company, setCompany] = useState([]); // List of companies
  const [backupCompany, setBackupCompany] = useState([]); // To store original company list

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AxiosInstance.get("/products/");
        setProducts(response.data);
        setOriginalProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await AxiosInstance.get("/companies/"); // ✅ Fetch from products API
        // const uniqueCompanies = response.data.map((product) => product.id); // ✅ Extract unique companies
        setCompanies(response.data);
        setBackupCompany(response.data);
        // ✅ Extract unique product codes from the fetched product list

        // ✅ Store original data for reset// ✅ Store original products for reset
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

    if (
      !company_id.trim() ||
      !product_code.trim() ||
      !product_description.trim() ||
      !date.trim()
    ) {
      toast.error("⚠️ All fields are required!");
      return;
    }

    try {
      const response = await AxiosInstance.post("/products/", newProduct);

      if (response.status === 201) {
        setProducts((prev) => [...prev, response.data]);
        setNewProduct({
          company_id: "",
          product_code: "",
          product_description: "",
          date: "",
        });
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
    if (!editableProduct || !editableProduct.id) {
      toast.error("No product selected for editing!");
      return;
    }

    const { company, product_code, product_description, date, id } =
      editableProduct;

    if (
      !company?.id ||
      !product_code.trim() ||
      !product_description.trim() ||
      !date.trim()
    ) {
      toast.error("⚠️ All fields are required!");
      return;
    }

    try {
      const updatedProduct = {
        company_id: company.id, // Ensure correct company ID is sent
        product_code,
        product_description,
        date,
      };

      // ✅ Make the API call to update the product
      const response = await AxiosInstance.put(
        `/products/${id}/`,
        updatedProduct
      );

      if (response.status === 200) {
        // ✅ Update the product in the frontend state
        setProducts((prev) =>
          prev.map((item) => (item.id === id ? response.data : item))
        );
        setEditableProduct(null); // ✅ Clear edit form
        toast.success("Product updated successfully!");
        document.getElementById("product_modal").close(); // ✅ Close modal
      } else {
        toast.error("Failed to update product!");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product!");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      await AxiosInstance.delete(`/products/${id}/`);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      // toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product!");
    }
  };

  // Handle Search
  // Handle search functionality
  // Handle search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase(); // Get the search term and convert it to lowercase
    setSearchTerm(term); // Update the `searchTerm` state

    if (!term.trim()) {
      setSearchResult(null); // Reset search result when search is cleared
      setProducts(originalProducts); // Reset to show all products when search is cleared
      return;
    }

    // Filter products based on company_name
    const filteredProducts = originalProducts.filter(
      (item) => item.company?.company_name?.toLowerCase().includes(term) // Check if company name contains search term
    );

    setSearchResult(filteredProducts); // Set the filtered list to `searchResult`
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteProduct(id); // Call the actual delete function
        Swal.fire("Deleted!", "The product has been deleted.", "success");
      }
    });
  };

  return (
    <div className="m-8">
      <h2 className="text-sm">Search Product:*</h2>
      <div className="flex justify-between items-center">
        <div className="join items-center">
          <input
            type="text"
            id="companyName"
            placeholder="Enter company name"
            value={searchTerm}
            onChange={handleSearch}
            className="input input-bordered text-sm rounded-s-md h-[30px] join-item"
          />

          <div className="h-7 w-14 p-1 bg-blue-950 text-white">Search</div>
        </div>
        <button
          className="btn btn-sm bg-blue-950 text-white"
          onClick={() => {
            setEditableProduct(null); // Reset editing mode
            setNewProduct({
              company_id: "",
              product_code: "",
              product_description: "",
              date: "",
            }); // Clear form
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
          <thead className="bg-blue-950 text-white font-md font-normal">
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
            {searchResult && searchResult.length > 0 ? (
              searchResult.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.company?.company_name || "No Company"}</td>
                  <td>{item.date || "No Date"}</td>
                  <td>{item.product_code || "No Product Code"}</td>
                  <td>{item.product_description || "No Description"}</td>
                  <td>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        setEditableProduct({
                          ...item,
                          company: { id: item.company?.id }, // Ensure company ID is preserved
                        });
                        document.getElementById("product_modal").showModal();
                      }}
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => confirmDelete(item.id)}
                    >
                      <ImCross />
                    </button>
                  </td>
                </tr>
              ))
            ) : products.length > 0 ? (
              products.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.company?.company_name || "No Company"}</td>
                  <td>{item.date || "No Date"}</td>
                  <td>{item.product_code || "No Product Code"}</td>
                  <td>{item.product_description || "No Description"}</td>
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
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => confirmDelete(item.id)}
                    >
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
            <label className="text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <select
              className="select select-bordered w-full p-2"
              value={
                editableProduct
                  ? editableProduct.company.id // For editing product
                  : newProduct.company_id // For adding new product
              }
              onChange={(e) =>
                editableProduct
                  ? setEditableProduct((prev) => ({
                      ...prev,
                      company: { ...prev.company, id: e.target.value },
                    }))
                  : setNewProduct((prev) => ({
                      ...prev,
                      company_id: e.target.value,
                    }))
              }
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.company_name}
                </option>
              ))}
            </select>

            {/* 🔹 Product Code */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Product Code
              </label>
              <input
                type="text"
                className="input input-bordered w-full p-2"
                placeholder="Enter Product Code"
                value={
                  editableProduct
                    ? editableProduct.product_code
                    : newProduct.product_code
                }
                onChange={(e) =>
                  editableProduct
                    ? setEditableProduct((prev) => ({
                        ...prev,
                        product_code: e.target.value,
                      }))
                    : setNewProduct((prev) => ({
                        ...prev,
                        product_code: e.target.value,
                      }))
                }
              />
            </div>

            {/* 🔹 Product Description */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Product Description
              </label>
              <input
                type="text"
                className="input input-bordered w-full p-2"
                placeholder="Enter Product Description"
                value={
                  editableProduct
                    ? editableProduct.product_description
                    : newProduct.product_description
                }
                onChange={(e) =>
                  editableProduct
                    ? setEditableProduct((prev) => ({
                        ...prev,
                        product_description: e.target.value,
                      }))
                    : setNewProduct((prev) => ({
                        ...prev,
                        product_description: e.target.value,
                      }))
                }
              />
            </div>

            {/* 🔹 Date Picker */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="input input-bordered w-full p-2"
                value={editableProduct ? editableProduct.date : newProduct.date}
                onChange={(e) =>
                  editableProduct
                    ? setEditableProduct((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    : setNewProduct((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                }
              />
            </div>
          </div>

          {/* 🔹 Action Buttons */}
          <div className="modal-action justify-center mt-6">
            <button
              className="btn bg-blue-700 text-white w-full p-2"
              onClick={editableProduct ? handleEditProduct : handleAddProduct}
            >
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
