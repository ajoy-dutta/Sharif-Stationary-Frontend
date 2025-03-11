import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast, Toaster } from "react-hot-toast"; // ✅ Import Hot Toast
import AxiosInstance from "../../Components/AxiosInstance";

const CompanyProducts = () => {
  const { companyId } = useParams();
  const [products, setProducts] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editableProduct, setEditableProduct] = useState(null);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const companyResponse = await AxiosInstance.get(`/companies/${companyId}/`);
        setCompanyName(companyResponse.data.company_name || "N/A");

        const allProductsResponse = await AxiosInstance.get(`/products/`);
        const filteredProducts = allProductsResponse.data.filter(
          (product) => product.company.id === parseInt(companyId)
        );
        setProducts(filteredProducts);
      } catch (error) {
        toast.error("Failed to fetch products!");
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [companyId]);

  // ✅ Fix: Search with null/undefined handling
// ✅ Fix: Search with null/undefined handling
const filteredProducts = products.filter((product) =>
  (product.product_name &&
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
  (product.product_code &&
    product.product_code.toLowerCase().includes(searchTerm.toLowerCase()))
);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // // ✅ Delete Product with Hot Toast
  // const handleDeleteProduct = async (id) => {
  //   try {
  //     await AxiosInstance.delete(`/products/${id}/`);
  //     setProducts((prev) => prev.filter((item) => item.id !== id));
  //     toast.success("Product deleted successfully!");
  //   } catch (error) {
  //     console.error("Error deleting product:", error);
  //     toast.error("Failed to delete product!");
  //   }
  // };

  return (
    <div className="m-8">
      <h2 className="text-xl font-bold text-gray-700 text-center border-b-2 pb-2">
        Products of {companyName}
      </h2>

      {/* 🔍 Search Input */}
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Search Product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-1/3 p-2"
        />
      </div>

      {/* 📌 Product Table */}
      <div className="overflow-x-auto mt-4">
        <table className="table table-sm text-sm table-zebra table-fixed table-compact w-3/4 mx-auto">
          <thead className="bg-blue-950 text-white">
            <tr className="text-center">
              <th>SL</th>
              <th>Product Code</th>
              <th>Product Name</th>
              <th>Product Type</th>
              <th>Date</th>
              <th>Actions</th> {/* ✅ Actions column */}
            </tr>
          </thead>
          <tbody className="text-center">
            {currentProducts.length > 0 ? (
              currentProducts.map((item, index) => (
                <tr key={index}>
                  <td>{indexOfFirstProduct + index + 1}</td>
                  <td>{item.product_code || "N/A"}</td>
                  <td>{item.product_name || "N/A"}</td>
                  <td>{item.product_type || "N/A"}</td>
                  <td>{item.date || "N/A"}</td>
                  <td className="flex items-center gap-4 justify-center">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setEditableProduct(item)}
                    >
                      <FaEdit />
                    </button>
                    {/* <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteProduct(item.id)}
                    >
                      <ImCross />
                    </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-gray-500">
                  No products found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📌 Pagination */}
      {/* <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn btn-sm mx-1 ${currentPage === i + 1 ? "bg-blue-900 text-white" : "bg-gray-200"}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div> */}

      {/* ✅ Edit Product Modal */}
      {editableProduct && (
        <dialog id="edit_product_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box relative p-6">
            <button
              className="absolute top-4 right-4 text-lg"
              onClick={() => setEditableProduct(null)}
            >
              <ImCross />
            </button>

            <h3 className="font-bold text-lg my-5 text-center">Edit Product</h3>

            <div className="space-y-4">
              <input
                type="text"
                className="input input-bordered w-full p-2"
                placeholder="Product Code"
                value={editableProduct.product_code || ""}
                onChange={(e) => setEditableProduct({ ...editableProduct, product_code: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full p-2"
                placeholder="Product Name"
                value={editableProduct.product_name || ""}
                onChange={(e) => setEditableProduct({ ...editableProduct, product_name: e.target.value })}
              />
              <input
                type="text"
                className="input input-bordered w-full p-2"
                placeholder="Product Type"
                value={editableProduct.product_type || ""}
                onChange={(e) => setEditableProduct({ ...editableProduct, product_type: e.target.value })}
              />
              <input
                type="date"
                className="input input-bordered w-full p-2"
                value={editableProduct.date || ""}
                onChange={(e) => setEditableProduct({ ...editableProduct, date: e.target.value })}
              />
            </div>

            <button className="btn bg-blue-700 text-white w-full p-2 mt-6">
              Update Product
            </button>
          </div>
          <Toaster position="top-center" reverseOrder={false} />
        </dialog>
      )}

 
    </div>
  );
};

export default CompanyProducts;
