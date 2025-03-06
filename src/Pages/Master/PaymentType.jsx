import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast, Toaster } from "react-hot-toast";
import AxiosInstance from "../../Components/AxiosInstance";

const PaymentType = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setNewPaymentMethod] = useState("");
  const [editMethod, setEditMethod] = useState(null);
  const [payment, setPayment] = useState([]); // ✅ Initialize as an empty array
  const [backupPayment, setBackupPayment] = useState([]); // ✅ Stores original data

  // Fetch payment methods
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await AxiosInstance.get("/payment-types/");
      setPayment(response.data);
      setBackupPayment(response.data); // ✅ Store unfiltered data
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  // Add a new payment method
  const handleAddPayment = async () => {
    if (!paymentMethod.trim()) {
      toast.error("⚠️ Payment method name is required!");
      return;
    }

    try {
      const response = await AxiosInstance.post(
        "/payment-types/",
        { payment_type: paymentMethod.trim() }, // ✅ Ensure data format is correct
        { headers: { "Content-Type": "application/json" } } // ✅ Add headers
      );

      // ✅ Update state correctly
      setPayment([...payment, response.data]);

      // ✅ Clear input and close modal
      setNewPaymentMethod("");
      document.getElementById("my_modal_5").close();
      toast.success(" Payment method added successfully!");
    } catch (error) {
      console.error("Error adding payment method:", error);

      if (error.response) {
        // Server responded with an error
        toast.error(
          `❌ Server error: ${
            error.response.data.message || "Something went wrong!"
          }`
        );
      } else {
        // Network error
        toast.error("❌ Failed to connect to the server!");
      }
    }
  };

  // Edit an existing payment method
  const handleEditPayment = async () => {
    if (!editMethod) return;

    const { id, payment_type } = editMethod;

    if (!payment_type.trim()) {
      toast.error("⚠️ Payment method name is required!");
      return;
    }

    try {
      const response = await AxiosInstance.put(`/payment-types/${id}/`, {
        payment_type: payment_type.trim(),
      });

      setPayment((prev) =>
        prev.map((item) => (item.id === id ? response.data : item))
      );
      setBackupPayment((prev) =>
        prev.map((item) => (item.id === id ? response.data : item))
      );

      setEditMethod(null);
      document.getElementById("my_modal_5").close();
      toast.success("Payment method updated successfully!");
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("❌ Failed to update payment method!");
    }
  };

  // Delete a payment method
  const handleDeletePayment = async (id) => {
    try {
      await AxiosInstance.delete(`/payment-types/${id}/`);
      setPayment((prev) => prev.filter((item) => item.id !== id));
      setBackupPayment((prev) => prev.filter((item) => item.id !== id)); // ✅ Remove from backup
      toast.success("✅ Payment method deleted successfully!");
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("❌ Failed to delete payment method!");
    }
  };

 
 // Search functionality (does not modify original data)
const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term); // ✅ Update the search term state
  
    if (!term.trim()) {
      setPayment(backupPayment); // ✅ Reset data when search is cleared
      return;
    }
  
    const filtered = backupPayment.filter(
      (item) =>
        item.payment_type &&
        item.payment_type.toLowerCase().includes(term.toLowerCase())
    );
  
    setPayment(filtered); // ✅ Update the displayed data
  };
  

  return (
    <div className="m-8">
      <div>
        <h2 className="text-sm">Payment Methods</h2>
        <div className="flex justify-between items-center">
          <div className="join items-center">
            <input
              type="text"
              placeholder="Search Payment Method"
              value={searchTerm}
              onChange={handleSearch} // ✅ Updated to handleSearch
              className="input input-bordered text-sm rounded-s-md h-[30px] join-item"
            />
            <button className="btn btn-sm join-item bg-blue-950 text-white">
              Search
            </button>
          </div>
          <button
            className="btn btn-sm bg-blue-950 text-sm text-white"
            onClick={() => {
              setEditMethod(null);
              setNewPaymentMethod("");
              document.getElementById("my_modal_5").showModal();
            }}
          >
            <TiPlus />
            <span className="text-xs"> Add Payment Method</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-8">
        <table className="table table-xs text-sm table-zebra table-compact w-3/4 mx-auto">
          <thead className="bg-gray-200 text-black font-md font-normal">
            <tr>
              <th>SL</th>
              <th>Payment Type</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {payment.length > 0 ? (
              payment.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.payment_type}</td>
                  <td>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        setEditMethod(item);
                        document.getElementById("my_modal_5").showModal();
                      }}
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeletePayment(item.id)}
                    >
                      <ImCross />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No Payment Methods Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <button
            className="absolute top-2 right-2 text-lg"
            onClick={() => document.getElementById("my_modal_5").close()}
          >
            <ImCross />
          </button>
          <h3 className="text-center font-bold text-lg my-5">
            {editMethod ? "Edit Payment Method" : "Add Payment Method"}
          </h3>
          <div className="join">
            <input
              className="input input-bordered rounded-r-none w-80 mx-auto mb-4"
              placeholder="Enter Payment Type Name:"
              value={editMethod ? editMethod.payment_type : paymentMethod} // ✅ Fixed here
              onChange={(e) =>
                editMethod
                  ? setEditMethod({
                      ...editMethod,
                      payment_type: e.target.value,
                    })
                  : setNewPaymentMethod(e.target.value)
              }
            />
            <button
              className="btn bg-blue-950 text-white rounded-l-none mx-auto"
              onClick={editMethod ? handleEditPayment : handleAddPayment}
            >
              {editMethod ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </dialog>

      <Toaster position="top-center" />
    </div>
  );
};

export default PaymentType;
