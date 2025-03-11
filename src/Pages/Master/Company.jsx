import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast, Toaster } from "react-hot-toast";
import AxiosInstance from "../../Components/AxiosInstance";
import { Link } from "react-router-dom";

const Company = () => {
  const [company, setCompany] = useState([]);
  const [backupCompany, setBackupCompany] = useState([]); // Stores original company list
  const [searchTerm, setSearchTerm] = useState(""); // Stores search term
  const [selectedCompany, setSelectedCompany] = useState(null); // Track selected company for product add
  const [products, setProducts] = useState([]); // ✅ Declare products state

  const [newCompany, setNewCompany] = useState({
    company_name: "",
    company_representative_name: "",
    phone_number: "",
    address: "",
  });

  // State for product modal inputs
  const [productData, setProductData] = useState({
    product_name: "",
    product_type: "",
  });

  const [companies, setCompanies] = useState([]); // ✅ Ensure this is included

  const [editableCompany, setEditableCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await AxiosInstance.get("/companies/"); // Base URL already in AxiosInstance
        setCompany(response.data);
        console.log(response.data);
        setBackupCompany(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompany();
  }, []);

  const handleAddCompany = async () => {
    const {
      company_name,
      company_representative_name,
      phone_number,
      address,
      previous_due,
    } = newCompany;

    if (!company_name.trim()) {
      toast.error("⚠️ Please fill up Company Name!");
      return;
    }

    try {
      const response = await AxiosInstance.post("/companies/", {
        company_name,
        company_representative_name,
        phone_number,
        address,
        previous_due: previous_due ? parseFloat(previous_due) : 0.0, // Convert to float
      });


      if (response.status === 201) {
        // Add the new company directly to the company state
        setCompany((prev) => [...prev, response.data]);
        toast.success(" Company added successfully!");
        setNewCompany({
          company_name: "",
          company_representative_name: "",
          phone_number: "",
          address: "",
          previous_due: "",
        });
        document.getElementById("my_modal_5").close(); // Close modal
      } else {
        toast.error("Failed to add company!");
      }
    } catch (error) {
      console.error(
        "Error adding company:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to add company!");
    }
  };

  const handleEditCompany = async () => {
    if (!editableCompany) return;
  
    const {
      phone_number,
      company_representative_name,
      company_name,
      address,
      id,
    } = editableCompany;
  
    // ✅ Ensure company_name is not empty or null
    if (!company_name || company_name.trim() === "") {
      toast.error("⚠️ Please fill up Company Name!");
      return;
    }
  
    try {
      const response = await AxiosInstance.put(`/companies/${id}/`, {
        phone_number: phone_number?.trim() || "", // Allow empty/null values
        company_name: company_name.trim(), // Required field
        company_representative_name: company_representative_name?.trim() || "",
        address: address?.trim() || "",
      });
  
      if (response.status === 200) {
        setCompany((prev) =>
          prev.map((item) => (item.id === id ? response.data : item))
        );
        toast.success("Company updated successfully!");
        setEditableCompany(null);
        document.getElementById("my_modal_5").close();
      } else {
        toast.error("Failed to update company!");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company!");
    }
  };

  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        const activeElement = document.activeElement;

        // Check if the active element is a table row or within a table row
        const row =
          activeElement.tagName === "TR"
            ? activeElement
            : activeElement.closest("tr");

        if (row && row.hasAttribute("data-company-id")) {
          const companyId = row.getAttribute("data-company-id");
          const selectedCompany = company.find((c) => c.id == companyId);

          if (selectedCompany) {
            console.log(
              "Opening modal for company:",
              selectedCompany.company_name
            ); // Debug log
            setSelectedCompany(selectedCompany);

            // Use setTimeout to ensure state is updated before opening modal
            setTimeout(() => {
              const modal = document.getElementById("product_modal");
              if (modal) {
                modal.showModal();
              } else {
                console.error("Product modal element not found");
              }
            }, 0);
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [company]);


  // Handle product addition (Logs data to console)
  const handleAddProduct = async () => {
    if (!productData.product_name || !productData.product_type) {
      toast.error("⚠️ Please fill all required fields!");
      return;
    }

    const newProduct = {
      company_id: selectedCompany.id, // Send only the company ID
      product_name: productData.product_name,
      product_type: productData.product_type,
      date: new Date().toISOString().split('T')[0] // Ensures YYYY-MM-DD format

    };

    try {
      // ✅ Send data to API
      const response = await AxiosInstance.post("/products/", newProduct);

      if (response.status === 201) {
        toast.success("✅ Product added successfully!");

        // Optionally, update the state to reflect the new product (if needed)
        setProducts((prev) => [...prev, response.data]);

        // Close modal
        document.getElementById("product_modal").close();

        // Clear product form
        setProductData({ product_name: "", product_type: "" });
      } else {
        toast.error("❌ Failed to add product!");
      }
    } catch (error) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message
      );
      toast.error("❌ Error adding product. Please try again!");
    }
  };


  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setCompany(backupCompany); // Reset data when search is cleared
      return;
    }

    const filtered = backupCompany.filter(
      (item) =>
        item.company_name && item.company_name.toLowerCase().includes(term)
    );

    setCompany(filtered);
  };


  return (
    <div className="m-8">
      <h2 className="text-sm mb-1">Company / Supplier Name:*</h2>
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
            setEditableCompany(null); // Reset editing mode when adding a new company
            setNewCompany({
              company_name: "",
              company_representative_name: "",
              phone_number: "",
              address: "",
              previous_due: "",
            }); // Clear form for new company
            document.getElementById("my_modal_5").showModal(); // Open modal
          }}
        >
          <TiPlus /> Add Company / Supplier
        </button>
      </div>
      <div className="m-8 text-center font-bold text-gray-700 border-b-[1px] pb-2">
        <h2 className="text-lg"> List of Company / Supplier </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-sm text-sm table-zebra table-fixed table-compact w-3/4 mx-auto">
          <thead className="bg-blue-950 text-white font-md font-normal">
            <tr className="text-center">
              <th>SL</th>
              <th>Company / Supplier Name</th>
              <th>Representative Name</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th> Due</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {company.length > 0 ? (
              company.map((item, index) => (
                <tr
                  key={index}
                  data-company-id={item.id}
                  className="cursor-pointer hover:bg-gray-100 focus:bg-blue-100 focus:outline-none"
                  tabIndex="0" // This makes the row focusable
                  onClick={() => {
                    // Optional: Add click handling too
                    setSelectedCompany(item);
                    document.getElementById("product_modal").showModal();
                  }}
                >
                  <td>{item.id || "N/A"}</td>
                  <td>{item.company_name || "N/A"}</td>
                  <td>{item.company_representative_name || "N/A"}</td>
                  <td>{item.phone_number || "N/A"}</td>
                  <td>{item.address || "N/A"}</td>

                  <td>{item.previous_due}</td>
                  <td className="flex items-center gap-5">
                    <button
                      className="text-blue-9500 "
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents row click conflict
                        setEditableCompany(item);
                        document.getElementById("my_modal_5").showModal();
                      }}
                    >
                      <FaEdit />
                    </button>

                    <Link
                      to={`/company/${item.id}`} // ✅ Navigate to Product page of this company
                      className=""
                      onClick={(e) => e.stopPropagation()} // ✅ Prevent row click event
                    >
                      <button className="text-white btn text-xs btn-sm bg-blue-950">
                        View Products
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-gray-500">
                  <span>No Company / Supplier found!</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box relative p-6">
    {/* Close Button */}
    <button
      className="absolute top-2 right-2 text-lg"
      onClick={() => document.getElementById("my_modal_5").close()} // Close modal
    >
      <ImCross />
    </button>

    <h3 className="font-bold text-lg my-5 text-center">
      {editableCompany ? "Edit Company / Supplier" : "Add Company / Supplier"}
    </h3>

    {/* ✅ Two-Column Grid Layout */}
    <div className="grid grid-cols-1 gap-4">
      {/* Company / Supplier Name */}
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 w-1/3">
          Company / Supplier Name
        </label>
        <input
          className="input input-bordered w-2/3 p-2"
          placeholder="Enter Name"
          value={
            editableCompany ? editableCompany.company_name : newCompany.company_name
          }
          onChange={(e) =>
            editableCompany
              ? setEditableCompany((prev) => ({
                  ...prev,
                  company_name: e.target.value,
                }))
              : setNewCompany((prev) => ({
                  ...prev,
                  company_name: e.target.value,
                }))
          }
        />
      </div>

      {/* Representative Name */}
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 w-1/3">
          Representative Name
        </label>
        <input
          className="input input-bordered w-2/3 p-2"
          placeholder="Enter Representative Name"
          value={
            editableCompany
              ? editableCompany.company_representative_name
              : newCompany.company_representative_name
          }
          onChange={(e) =>
            editableCompany
              ? setEditableCompany((prev) => ({
                  ...prev,
                  company_representative_name: e.target.value,
                }))
              : setNewCompany((prev) => ({
                  ...prev,
                  company_representative_name: e.target.value,
                }))
          }
        />
      </div>

      {/* Phone Number */}
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 w-1/3">
          Phone Number
        </label>
        <input
          className="input input-bordered w-2/3 p-2"
          placeholder="Enter Phone Number"
          value={
            editableCompany ? editableCompany.phone_number : newCompany.phone_number
          }
          onChange={(e) =>
            editableCompany
              ? setEditableCompany((prev) => ({
                  ...prev,
                  phone_number: e.target.value,
                }))
              : setNewCompany((prev) => ({
                  ...prev,
                  phone_number: e.target.value,
                }))
          }
        />
      </div>

      {/* Address */}
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 w-1/3">
          Company / Supplier Address
        </label>
        <input
          className="input input-bordered w-2/3 p-2"
          placeholder="Enter Address"
          value={editableCompany ? editableCompany.address : newCompany.address}
          onChange={(e) =>
            editableCompany
              ? setEditableCompany((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              : setNewCompany((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
          }
        />
      </div>

      {/* Previous Due */}
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 w-1/3">
          Previous Due
        </label>
        <input
          className="input input-bordered w-2/3 p-2"
          type="number"
          placeholder="Enter Previous Due Amount"
          value={
            editableCompany ? editableCompany.previous_due : newCompany.previous_due
          }
          onChange={(e) =>
            editableCompany
              ? setEditableCompany((prev) => ({
                  ...prev,
                  previous_due: e.target.value,
                }))
              : setNewCompany((prev) => ({
                  ...prev,
                  previous_due: e.target.value,
                }))
          }
        />
      </div>
    </div>

    {/* Modal Actions */}
    <div className="modal-action justify-center mt-6">
      <button
        className="btn bg-blue-950 text-white w-full p-2"
        onClick={editableCompany ? handleEditCompany : handleAddCompany}
      >
        {editableCompany ? "Update" : "Add"}
      </button>
    </div>
  </div>
  <Toaster position="top-center" reverseOrder={false} />
</dialog>


      <dialog id="product_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative p-6">
          <button
            className="absolute top-2 right-2 text-lg"
            onClick={() => document.getElementById("product_modal").close()}
          >
            <ImCross />
          </button>
          <h3 className="font-bold text-lg my-5 text-center">
            Add Product to {selectedCompany?.company_name}
          </h3>

          <input
            className="input input-bordered w-full p-2"
            placeholder="Product Name"
            value={productData.product_name}
            onChange={(e) =>
              setProductData({ ...productData, product_name: e.target.value })
            }
          />
          <select
            className="select select-bordered w-full p-2 mt-4"
            value={productData.product_type}
            onChange={(e) =>
              setProductData({ ...productData, product_type: e.target.value })
            }
          >
            <option value="">Select Product Type</option>{" "}
            {/* Default empty option */}
            <option value="RIM-A4">RIM-A4</option>
            <option value="RIM-LEGAL">RIM-LEGAL</option>
            <option value="DOZEN">DOZEN</option>
          </select>

          <button
            className="btn bg-blue-950 text-white w-full p-2 mt-6"
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        </div>
      </dialog>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Company;
