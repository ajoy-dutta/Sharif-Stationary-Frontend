import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const Warehouse = () => {
  const [godown, setGodown] = useState([]);
  const [newGodown, setNewGodown] = useState({
    shop_name: "",
    godown_name: "",
    address: "",
  });
  const [editableGodown, setEditableGodown] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchGodown = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/godowns/");
        const data = response.data;
        setGodown(data);
        console.log(data); // Logging the fetched data instead of state
      } catch (error) {
        console.error("Error fetching godowns:", error);
      }
    };

    fetchGodown();
  }, []);

  const handleAddGodown = async () => {
    const { shop_name, godown_name, address } = newGodown;

    // ✅ Validation: Ensure required fields are filled
    if (!shop_name.trim()) {
      toast.error("⚠️ Shop name required!");
      return;
    }
    if (!godown_name.trim()) {
      toast.error("⚠️ Warehouse name required!");
      return;
    }
    if (!address.trim()) {
      toast.error("⚠️Address required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/godowns/",
        newGodown
      );

      if (response.status === 201) {
        setGodown((prev) => [...prev, response.data]);

        setNewGodown({
          shop_name: "",
          godown_name: "",
          address: "",
        });

        // ✅ Show success message
        toast.success("Warehouse added successfully!");

        // ✅ Close modal
        document.getElementById("my_modal_5").close();
      } else {
        toast.error("Failed to add warehouse!");
      }
    } catch (error) {
      console.error("Error adding godown:", error);
      toast.error("Failed to add warehouse!");
    }
  };

  const handleEditGodown = async () => {
    if (!editableGodown) return;

    const { shop_name, godown_name, address, id } = editableGodown;

    // ✅ Validation: Ensure required fields are filled
    if (!shop_name.trim()) {
      toast.error("⚠️ Shop name required!");
      return;
    }
    if (!godown_name.trim()) {
      toast.error("⚠️ Warehouse name required!");
      return;
    }
    if (!address.trim()) {
      toast.error("⚠️Address required!");
      return;
    }
    // ✅ Check if any changes were made before updating
    const originalGodown = godown.find((g) => g.id === id);

    if (
      originalGodown &&
      originalGodown.shop_name === shop_name.trim() &&
      originalGodown.godown_name === godown_name.trim() &&
      originalGodown.address === address.trim()
    ) {
      toast.error("⚠️ No change detected!");
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/godowns/${id}/`,
        {
          shop_name: shop_name.trim(),
          godown_name: godown_name.trim(),
          address: address.trim(),
        }
      );

      if (response.status === 200) {
        // ✅ Update `godown` state instantly
        setGodown((prev) =>
          prev.map((item) => (item.id === id ? response.data : item))
        );

        // ✅ Show success message
        toast.success("Warehouse updated successfully!");

        // ✅ Close modal & Reset edit state
        setEditableGodown(null);
        document.getElementById("my_modal_5").close();
      } else {
        toast.error("Failed to update warehouse!");
      }
    } catch (error) {
      console.error("Error updating godown:", error);
      toast.error("Failed to update warehouse!");
    }
  };

  const handleDeleteGodown = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/godowns/${id}/`);

      // ✅ Instantly update the state
      setGodown((prev) => prev.filter((item) => item.id !== id));

      // ✅ Show success toast
      toast.success("Warehouse deleted successfully!");
    } catch (error) {
      console.error("Error deleting godown:", error);

      // ❌ Show error toast
      toast.error("Failed to delete warehouse! ");
    }
  };

  // handlw search
  const handleSearch = () => {
    const searchTerm = document.getElementById("godownName").value;
    const filtered = godown.filter(
      (item) =>
        item.godown_name &&
        item.godown_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setGodown(filtered); // Update the divisions state with filtered data
  };

  return (
    <div className="m-8">
      <div className="">
        <h2 className="text-sm mb-1">Warehouse name :*</h2>
        <div className="flex justify-between items-center ">
          <div className="">
            <div className="join items-center">
              <input
                type="text"
                id="godownName"
                placeholder="Enter warehouse name"
                className="input input-bordered text-sm rounded-s-md h-[30px] join-item"
                // className="  px-4 py-2 w-1/4 "
              />
              <div className="indicator">
                <button
                  className="btn btn-sm rounded-s-none join-item bg-blue-700 text-white"
                  onClick={handleSearch} // Trigger the search when button is clicked
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div>
            <button
              className="btn btn-sm bg-blue-700 text-white"
              onClick={() => document.getElementById("my_modal_5").showModal()}
            >
              <TiPlus /> Add Warehouse
            </button>
          </div>
        </div>
        <div className="m-8">
          <label
            htmlFor="godownName"
            className="block text-center text-lg  pb-2 border-b-[1px] text-gray-700 font-bold"
          >
            List of warehouse
          </label>
        </div>
        <div className="overflow-x-auto ">
          <table className="table table-xs text-md table-zebra table-fixed table-compact w-3/4 mx-auto">
            <thead className="bg-blue-700 text-white font-md font-normal">
              <tr className="text-center">
                <th className="px-4 py-2">SL</th>
                <th className="px-4 py-2">Shop Name</th>
                <th className="px-4 py-2">Warehouse Name</th>
                <th className="px-4 py-2">Warehouse Address</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {godown.length > 0 ? (
                godown.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.shop_name}</td>
                    <td className="px-4 py-2">{item.godown_name}</td>
                    <td className="px-4 py-2">{item.address}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => {
                          setEditableGodown(item);
                          document.getElementById("my_modal_5").showModal();
                        }}
                      >
                        <FaEdit />
                      </button>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeleteGodown(item.id)}
                      >
                        <ImCross />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-gray-500">
                    No warehouse found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Godown Modal */}
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <button
            className="absolute top-2 right-2 text-lg"
            onClick={() => document.getElementById("my_modal_5").close()} // Close modal
          >
            <ImCross />
          </button>

          <h3 className="font-bold text-lg my-5 text-center">
            {editableGodown ? "Edit Godown" : "Add Godown"}
          </h3>

          {/* Shop Name Input */}
          <div className="flex justify-center">
            <input
              className="input input-bordered w-80 mx-auto mb-4"
              placeholder="Enter Shop Name"
              value={
                editableGodown ? editableGodown.shop_name : newGodown.shop_name
              } // Use editableGodown if editing
              onChange={(e) =>
                editableGodown
                  ? setEditableGodown((prev) => ({
                      ...prev,
                      shop_name: e.target.value,
                    }))
                  : setNewGodown((prev) => ({
                      ...prev,
                      shop_name: e.target.value,
                    }))
              }
            />
          </div>

          {/* Godown Name Input */}
          <div className="flex justify-center">
            <input
              className="input input-bordered w-80 mx-auto mb-4"
              placeholder="Enter Godown Name"
              value={
                editableGodown
                  ? editableGodown.godown_name
                  : newGodown.godown_name
              } // Use editableGodown if editing
              onChange={(e) =>
                editableGodown
                  ? setEditableGodown((prev) => ({
                      ...prev,
                      godown_name: e.target.value,
                    }))
                  : setNewGodown((prev) => ({
                      ...prev,
                      godown_name: e.target.value,
                    }))
              }
            />
          </div>

          {/* Godown Address Input */}
          <div className="flex justify-center">
            <input
              className="input input-bordered w-80 mx-auto mb-4"
              placeholder="Enter Godown Address"
              value={
                editableGodown ? editableGodown.address : newGodown.address
              } // Use editableGodown if editing
              onChange={(e) =>
                editableGodown
                  ? setEditableGodown((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  : setNewGodown((prev) => ({
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
              onClick={editableGodown ? handleEditGodown : handleAddGodown} // Trigger appropriate action
            >
              {editableGodown ? "Update Godown" : "Add Godown"}
            </button>
          </div>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </dialog>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Warehouse;
