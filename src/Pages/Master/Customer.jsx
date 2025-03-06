import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast, Toaster } from "react-hot-toast";
import AxiosInstance from "../../Components/AxiosInstance";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [backupCustomers, setBackupCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    customer_name: "",
    customer_address: "",
    customer_phone_no: "",
    customer_shop: "",
    shop_address: "",
    due_amount: "",
  });
  const [editableCustomer, setEditableCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await AxiosInstance.get("/customers/");
        setCustomers(response.data);
        setBackupCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleAddCustomer = async () => {
    const { customer_name, customer_address, customer_phone_no, customer_shop, shop_address, due_amount } = newCustomer;

    if (!customer_name.trim() || !customer_phone_no.trim()) {
      toast.error( "⚠️ Customer Name and Phone Number are required!");
      return;
    }

    try {
      const response = await AxiosInstance.post("/customers/", {
        customer_name,
        customer_address,
        customer_phone_no,
        customer_shop,
        shop_address,
        due_amount: due_amount ? parseFloat(due_amount) : 0.0,
      });

      if (response.status === 201) {
        setCustomers((prev) => [...prev, response.data]);
        toast.success("Customer added successfully!");
        setNewCustomer({ customer_name: "", customer_address: "", customer_phone_no: "", customer_shop: "", shop_address: "", due_amount: "" });
        document.getElementById("customer_modal").close();
      } else {
        toast.error("❌ Failed to add customer!");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("❌ Failed to add customer!");
    }
  };

  const handleEditCustomer = async () => {
    if (!editableCustomer) return;

    const { customer_name, customer_address, customer_phone_no, customer_shop, shop_address, due_amount, id } = editableCustomer;

    if (!customer_name.trim() || !customer_phone_no.trim()) {
      toast.error("⚠️ Customer Name and Phone Number are required!");
      return;
    }

    try {
      const response = await AxiosInstance.put(`/customers/${id}/`, {
        customer_name,
        customer_address,
        customer_phone_no,
        customer_shop,
        shop_address,
        due_amount,
      });

      if (response.status === 200) {
        setCustomers((prev) =>
          prev.map((item) => (item.id === id ? response.data : item))
        );
        toast.success("Customer updated successfully!");
        setEditableCustomer(null);
        document.getElementById("customer_modal").close();
      } else {
        toast.error("Failed to update customer!");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer!");
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await AxiosInstance.delete(`/customers/${id}/`);
      setCustomers((prev) => prev.filter((item) => item.id !== id));
      toast.success("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer!");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setCustomers(backupCustomers);
      return;
    }

    const filtered = backupCustomers.filter(
      (item) =>
        item.customer_name &&
        item.customer_name.toLowerCase().includes(term)
    );

    setCustomers(filtered);
  };

  return (
    <div className="m-8">
      <h2 className="text-sm">Customer Name:*</h2>
      <div className="flex justify-between items-center">
        <div className="join items-center">
          <input
            type="text"
            placeholder="Enter customer name"
            value={searchTerm}
            onChange={handleSearch}
            className="input input-bordered text-sm rounded-s-md h-[30px] join-item"
          />
          <div className="h-7 w-14 p-1 bg-blue-950 text-white">Search</div>
        </div>
        <button
          className="btn btn-sm bg-blue-950 text-white"
          onClick={() => {
            setEditableCustomer(null);
            setNewCustomer({ customer_name: "", customer_address: "", customer_phone_no: "", customer_shop: "", shop_address: "", due_amount: "" });
            document.getElementById("customer_modal").showModal();
          }}
        >
          <TiPlus /> Add Customer
        </button>
      </div>

      <div className="m-8 text-center font-bold text-gray-700 border-b-[1px] pb-2">
        <h2 className="text-lg">List of Customers</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-sm text-sm table-zebra table-fixed table-compact w-3/4 mx-auto">
          <thead className="bg-blue-950 text-white">
            <tr className="text-left">
            <th className="w-4">SL</th> {/* Adjust width */}
        <th className="w-16">Customer Name</th>
        <th className="w-16">Phone Number</th>
        <th className="w-16">Address</th>
        <th className="w-8">Due Amount</th>
        <th className="w-4">Edit</th>
        <th className="w-4">Delete</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {customers.length > 0 ? (
              customers.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.customer_name}</td>
                  <td>{item.customer_phone_no}</td>
                  <td>{item.customer_address}</td>
                  <td>{item.due_amount}</td>
                  <td>
                    <button className="text-blue-500 hover:underline" onClick={() => { setEditableCustomer(item); document.getElementById("customer_modal").showModal(); }}>
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button className="text-red-500 hover:underline" onClick={() => handleDeleteCustomer(item.id)}>
                      <ImCross />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-gray-500">No customers found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <dialog id="customer_modal" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box p-6">
    <button
      className="absolute top-2 right-2 text-lg"
      onClick={() => document.getElementById("customer_modal").close()}
    >
      <ImCross />
    </button>

    <h3 className="font-bold text-lg my-5 text-center">
      {editableCustomer ? "Edit Customer" : "Add Customer"}
    </h3>

    {/* Customer Name */}
    <div className="flex flex-col mt-2">
      <label className="text-sm font-medium text-gray-700 mb-1">Customer Name</label>
      <input
        type="text"
        placeholder="Enter customer name"
        className="input input-bordered w-full p-2"
        value={editableCustomer ? editableCustomer.customer_name : newCustomer.customer_name}
        onChange={(e) =>
          editableCustomer
            ? setEditableCustomer({ ...editableCustomer, customer_name: e.target.value })
            : setNewCustomer({ ...newCustomer, customer_name: e.target.value })
        }
      />
    </div>

    {/* Customer Address */}
    <div className="flex flex-col mt-2">
      <label className="text-sm font-medium text-gray-700 mb-1">Customer Address</label>
      <input
        type="text"
        placeholder="Enter customer address"
        className="input input-bordered w-full p-2"
        value={editableCustomer ? editableCustomer.customer_address : newCustomer.customer_address}
        onChange={(e) =>
          editableCustomer
            ? setEditableCustomer({ ...editableCustomer, customer_address: e.target.value })
            : setNewCustomer({ ...newCustomer, customer_address: e.target.value })
        }
      />
    </div>

    {/* Phone Number */}
    <div className="flex flex-col mt-2">
      <label className="text-sm font-medium text-gray-700 mb-1">Phone Number</label>
      <input
        type="text"
        placeholder="Enter phone number"
        className="input input-bordered w-full p-2"
        value={editableCustomer ? editableCustomer.customer_phone_no : newCustomer.customer_phone_no}
        onChange={(e) =>
          editableCustomer
            ? setEditableCustomer({ ...editableCustomer, customer_phone_no: e.target.value })
            : setNewCustomer({ ...newCustomer, customer_phone_no: e.target.value })
        }
      />
    </div>

    {/* Customer Shop */}
    <div className="flex flex-col mt-2">
      <label className="text-sm font-medium text-gray-700 mb-1">Customer Shop</label>
      <input
        type="text"
        placeholder="Enter shop name"
        className="input input-bordered w-full p-2"
        value={editableCustomer ? editableCustomer.customer_shop : newCustomer.customer_shop}
        onChange={(e) =>
          editableCustomer
            ? setEditableCustomer({ ...editableCustomer, customer_shop: e.target.value })
            : setNewCustomer({ ...newCustomer, customer_shop: e.target.value })
        }
      />
    </div>

    {/* Shop Address */}
    <div className="flex flex-col mt-2">
      <label className="text-sm font-medium text-gray-700 mb-1">Shop Address</label>
      <input
        type="text"
        placeholder="Enter shop address"
        className="input input-bordered w-full p-2"
        value={editableCustomer ? editableCustomer.shop_address : newCustomer.shop_address}
        onChange={(e) =>
          editableCustomer
            ? setEditableCustomer({ ...editableCustomer, shop_address: e.target.value })
            : setNewCustomer({ ...newCustomer, shop_address: e.target.value })
        }
      />
    </div>

    {/* Due Amount */}
    <div className="flex flex-col mt-2">
      <label className="text-sm font-medium text-gray-700 mb-1">Due Amount</label>
      <input
        type="number"
        placeholder="Enter due amount"
        className="input input-bordered w-full p-2"
        value={editableCustomer ? editableCustomer.due_amount : newCustomer.due_amount}
        onChange={(e) =>
          editableCustomer
            ? setEditableCustomer({ ...editableCustomer, due_amount: e.target.value })
            : setNewCustomer({ ...newCustomer, due_amount: e.target.value })
        }
      />
    </div>

    {/* Action Button */}
    <button
      className="btn bg-blue-950 text-white w-full p-2 mt-4"
   
      onClick={editableCustomer ? handleEditCustomer : handleAddCustomer}
    >
      {editableCustomer ? "Update Customer" : "Add Customer"}
    </button>
  </div>
</dialog>



      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Customer;
