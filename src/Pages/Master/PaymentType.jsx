import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios"; 

const PaymentType = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentMethod, setNewPaymentMethod] = useState("");
    const [editMethod, setEditMethod] = useState(null);
    const [payment, setPayment] = useState([]); // ✅ Initialize as empty array
    const [backupPayment, setBackupPayment] = useState([]); // ✅ Stores original data

    // Fetch payment methods
    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/payment_method/");
            setPayment(response.data);
            setBackupPayment(response.data); // ✅ Store unfiltered data
        } catch (error) {
            console.error("Error fetching payment methods:", error);
        }
    };

    // Add a new payment method
    const handleAddPayment = async () => {
        if (!paymentMethod.trim()) {
            toast.error("⚠️ পেমেন্ট পদ্ধতির নাম আবশ্যক!");
            return;
        }
    
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/payment_method/",
                { payment_method: paymentMethod.trim() }, // ✅ Ensure data format is correct
                { headers: { "Content-Type": "application/json" } } // ✅ Add headers
            );
    
            // ✅ Update state correctly
            setPayment([...payment, response.data]);
    
            // ✅ Clear input and close modal
            setNewPaymentMethod("");
            document.getElementById("my_modal_5").close();
            toast.success("✅ পেমেন্ট পদ্ধতি সফলভাবে যোগ করা হয়েছে!");
        } catch (error) {
            console.error("Error adding payment method:", error);
    
            if (error.response) {
                // Server responded with an error
                toast.error(`❌ সার্ভার ত্রুটি: ${error.response.data.message || "সমস্যা হয়েছে!"}`);
            } else {
                // Network error
                toast.error("❌ সার্ভারের সাথে সংযোগ করতে ব্যর্থ হয়েছে!");
            }
        }
    };
    

    // Edit an existing payment method
    const handleEditPayment = async () => {
        if (!editMethod) return;

        const { id, payment_method } = editMethod;

        if (!payment_method.trim()) {
            toast.error("⚠️ পেমেন্ট পদ্ধতির নাম আবশ্যক!");
            return;
        }

        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/payment_method/${id}/`,
                { payment_method: payment_method.trim() }
            );

            setPayment((prev) => prev.map((item) => (item.id === id ? response.data : item)));
            setBackupPayment((prev) => prev.map((item) => (item.id === id ? response.data : item)));

            setEditMethod(null);
            document.getElementById("my_modal_5").close();
            toast.success("✅ পেমেন্ট পদ্ধতি সফলভাবে আপডেট হয়েছে!");
        } catch (error) {
            console.error("Error updating payment method:", error);
            toast.error("❌ পেমেন্ট পদ্ধতি আপডেট করতে ব্যর্থ হয়েছে!");
        }
    };

    // Delete a payment method
    const handleDeletePayment = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/payment_method/${id}/`);
            setPayment((prev) => prev.filter((item) => item.id !== id));
            setBackupPayment((prev) => prev.filter((item) => item.id !== id)); // ✅ Remove from backup
            toast.success("✅ পেমেন্ট পদ্ধতি সফলভাবে মুছে ফেলা হয়েছে!");
        } catch (error) {
            console.error("Error deleting payment method:", error);
            toast.error("❌ পেমেন্ট পদ্ধতি মুছতে ব্যর্থ হয়েছে!");
        }
    };

    // Search functionality (does not modify original data)
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setPayment(backupPayment); // ✅ Reset data if search is cleared
            return;
        }

        const filtered = backupPayment.filter(
            (item) =>
                item.payment_method &&
                item.payment_method.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setPayment(filtered);
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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered text-sm rounded-s-md h-[30px] join-item"
                        />
                        <button className="btn btn-sm join-item bg-blue-950 text-white" onClick={handleSearch}>
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
                        <TiPlus  /><span className="text-xs"> Add Payment Method</span>
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
                                    <td>{item.payment_method}</td>
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
                                        <button className="text-red-500 hover:underline" onClick={() => handleDeletePayment(item.id)}>
                                            <ImCross />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                    No Payment Methods are Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <button className="absolute top-2 right-2 text-lg" onClick={() => document.getElementById("my_modal_5").close()}>
                        <ImCross />
                    </button>
                    <h3 className="text-center font-bold text-lg my-5">
                        {editMethod ? "Edit Payment Method" : "Add Payment Method"}
                    </h3>
                    <div className="join">
                    <input
                        className="input input-bordered rounded-r-none w-80 mx-auto mb-4"
                        placeholder="Enter Payment Type Name:"
                        value={editMethod ? editMethod.payment_method : paymentMethod}
                        onChange={(e) =>
                            editMethod ? setEditMethod({ ...editMethod, payment_method: e.target.value }) : setNewPaymentMethod(e.target.value)
                        }
                    />
                    <button className="btn bg-blue-950 text-white rounded-l-none mx-auto" onClick={editMethod ? handleEditPayment : handleAddPayment}>
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
