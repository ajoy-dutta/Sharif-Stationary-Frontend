import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const Company = () => {
  const [company, setCompany] = useState([]);
  const [newCompany, setNewCompany] = useState({
    company_name: "",
    phone_number: "",
    address: "",
  });
  const [editableCompany, setEditableCompany] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/companies/"
        );
        setCompany(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompany();
  }, []);

  const handleAddCompany = async () => {
    const { phone_number, company_name, address } = newCompany;

    // Validation
    if (!phone_number.trim() || !company_name.trim() || !address.trim()) {
      toast.error("⚠️ All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/companies/",
        newCompany
      );
      if (response.status === 201) {
        setCompany((prev) => [...prev, response.data]);
        setNewCompany({ phone_number: "", company_name: "", address: "" });
        toast.success("Company added successfully!");
        document.getElementById("my_modal_5").close();
      } else {
        toast.error("Failed to add company!");
      }
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("Failed to add company!");
    }
  };

  const handleEditCompany = async () => {
    if (!editableCompany) return;

    const { phone_number, company_name, address, id } = editableCompany;

    if (!phone_number.trim() || !company_name.trim() || !address.trim()) {
        toast.error("⚠️ All fields are required!");
      return;
    }

    // Check if any changes were made before updating
    const originalCompany = company.find((c) => c.id === id);
    if (
      originalCompany &&
      originalCompany.phone_number === phone_number.trim() &&
      originalCompany.company_name === company_name.trim() &&
      originalCompany.address === address.trim()
    ) {
      toast.error("⚠️ No changes were made!");
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/companies/${id}/`,
        {
          phone_number: phone_number.trim(),
          company_name: company_name.trim(),
          address: address.trim(),
        }
      );

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

  const handleDeleteCompany = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/companies/${id}/`);
      setCompany((prev) => prev.filter((item) => item.id !== id));
      toast.success("Company deleted successfully!");
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company!");
    }
  };

  // Handle search
  const handleSearch = () => {
    const searchTerm = document.getElementById("companyName").value;
    const filtered = company.filter(
      (item) =>
        item.company_name &&
        item.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCompany(filtered);
  };

  return (
    <div className="m-8">
      <h2 className="text-sm">Company Name:*</h2>
      <div className="flex justify-between items-center">
        <div className="join items-center">
          <input
            type="text"
            id="companyName"
            placeholder="Enter company name"
            className="input input-bordered text-sm rounded-s-md h-[30px] join-item"
          />
          <button
            className="btn btn-sm bg-blue-700 text-white"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        <button className="btn btn-sm bg-blue-700 text-white" onClick={() => document.getElementById("my_modal_5")?.showModal()}>
    <TiPlus /> Add Company
</button>
      </div>
      <div className="m-8 text-center font-bold text-gray-700 border-b-[1px] pb-2">
     <h2 className="text-lg"> List of Product </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-sm text-sm table-zebra table-fixed table-compact w-3/4 mx-auto">
          <thead className="bg-blue-700 text-white font-md font-normal">
            <tr className="text-center">
              <th>SL</th>
              <th>Company Name</th>
<th>Phone Number</th>
<th>Address</th>
<th>Edit</th>
<th>Delete</th>

            </tr>
          </thead>
          <tbody className="text-center">
            {company.length > 0 ? (
              company.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.company_name}</td>
                  <td>{item.phone_number}</td>
                  <td>{item.address}</td>
                  <td>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        setEditableCompany(item);
                        document.getElementById("my_modal_5").showModal();
                      }}
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteCompany(item.id)}
                    >
                      <ImCross />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-gray-500">
               <span>কোনো কোম্পানি পাওয়া যায়নি!</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <button
            className="absolute top-2 right-2 text-lg"
            onClick={() => document.getElementById("my_modal_5").close()} // Close modal
          >
            <ImCross />
          </button>

          <h3 className="font-bold text-lg my-5 text-center">
            {editableCompany ? "Edit Company" : "Add Company"}
          </h3>

          {/* Company Name Input */}
          <div className="flex justify-center">
            <input
              className="input input-bordered w-80 mx-auto mb-4"
              placeholder="Enter Company Name"
              value={
                editableCompany
                  ? editableCompany.company_name
                  : newCompany.company_name
              } // Use editableCompany if editing
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

          {/* phone number Input */}
          <div className="flex justify-center">
            <input
              className="input input-bordered w-80 mx-auto mb-4"
              placeholder="Enter Phone Number"
              value={
                editableCompany
                  ? editableCompany.phone_number
                  : newCompany.phone_number
              } // Use editableCompany if editing
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

          {/* Company Address Input */}
          <div className="flex justify-center">
            <input
              className="input input-bordered w-80 mx-auto mb-4"
              placeholder="Enter Company Address"
              value={
                editableCompany ? editableCompany.address : newCompany.address
              } // Use editableCompany if editing
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

          {/* Modal Action */}
          <div className="modal-action justify-center">
            <button
              className="btn bg-blue-700 text-white mx-auto"
              onClick={editableCompany ? handleEditCompany : handleAddCompany} // Trigger appropriate action
            >
              {editableCompany ? "Update Company" : "Add Company"}
            </button>
          </div>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </dialog>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Company;
