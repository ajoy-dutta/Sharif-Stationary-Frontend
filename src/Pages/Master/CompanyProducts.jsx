import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";
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
        setCompanyName(companyResponse.data.company_name);

        const allProductsResponse = await AxiosInstance.get(`/products/`);
        const filteredProducts = allProductsResponse.data.filter(
          (product) => product.company.id === parseInt(companyId)
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [companyId]);

  const handleEditProduct = (product) => {
    setEditableProduct(product);
    document.getElementById("edit_product_modal").showModal();
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await AxiosInstance.put(`/products/${editableProduct.id}/`, editableProduct);
      if (response.status === 200) {
        setProducts((prev) =>
          prev.map((item) => (item.id === editableProduct.id ? response.data : item))
        );
        Swal.fire("Updated!", "Product updated successfully.", "success");
        document.getElementById("edit_product_modal").close();
      } else {
        Swal.fire("Error!", "Failed to update product.", "error");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire("Error!", "Failed to update product.", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AxiosInstance.delete(`/products/${id}/`);
          setProducts((prev) => prev.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "The product has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire("Error!", "Failed to delete product.", "error");
        }
      }
    });
  };

  const filteredProducts = products.filter((product) =>
    product.product_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_code.includes(searchTerm)
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="m-8">
      <h2 className="text-xl font-bold text-gray-700 text-center border-b-2 pb-2">
        Products of {companyName}
      </h2>

      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Search Product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-1/3 p-2"
        />
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="table table-sm text-sm table-zebra table-fixed table-compact w-3/4 mx-auto">
          <thead className="bg-blue-950 text-white">
            <tr className="text-center">
              <th>SL</th>
              <th>Product Code</th>
              <th>Product Description</th>
              <th>Date</th>
              <th>Actions</th> {/* ✅ New column for actions */}
            </tr>
          </thead>
          <tbody className="text-center">
            {currentProducts.length > 0 ? (
              currentProducts.map((item, index) => (
                <tr key={index}>
                  <td>{indexOfFirstProduct + index + 1}</td>
                  <td>{item.product_code}</td>
                  <td>{item.product_description}</td>
                  <td>{item.date}</td>
                  <td className="flex items-center gap-4 justify-center">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEditProduct(item)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteProduct(item.id)}
                    >
                      <ImCross />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-gray-500">
                  No products found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
      <dialog id="edit_product_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative p-6">
          <button
            className="absolute top-4 right-4 text-lg"
            onClick={() => document.getElementById("edit_product_modal").close()}
          >
            <ImCross />
          </button>

          <h3 className="font-bold text-lg my-5 text-center">Edit Product</h3>

          <div className="space-y-4">
            <input
              type="text"
              className="input input-bordered w-full p-2"
              placeholder="Product Code"
              value={editableProduct?.product_code || ""}
              onChange={(e) => setEditableProduct({ ...editableProduct, product_code: e.target.value })}
            />
            <input
              type="text"
              className="input input-bordered w-full p-2"
              placeholder="Product Description"
              value={editableProduct?.product_description || ""}
              onChange={(e) => setEditableProduct({ ...editableProduct, product_description: e.target.value })}
            />
            <input
              type="date"
              className="input input-bordered w-full p-2"
              value={editableProduct?.date || ""}
              onChange={(e) => setEditableProduct({ ...editableProduct, date: e.target.value })}
            />
          </div>

          <button className="btn bg-blue-700 text-white w-full p-2 mt-6" onClick={handleUpdateProduct}>
            Update Product
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default CompanyProducts;
