import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast, Toaster } from "react-hot-toast";
import AxiosInstance from "../../Components/AxiosInstance";

const Warehouse = () => {
  const [godown, setGodown] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [backupGodown, setBackupGodown] = useState([]);
  const [newGodown, setNewGodown] = useState({
    shop_name: "",
    godown_name: "",
    address: "",
  });
  const [editableGodown, setEditableGodown] = useState(null);

  // ✅ Fetch Godowns using `axiosInstance`
  useEffect(() => {
    const fetchGodown = async () => {
      try {
        const response = await AxiosInstance.get("/godowns/");
        setGodown(response.data);
        setBackupGodown(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching godowns:", error);
      }
    };
    fetchGodown();
  }, []);

  // ✅ Handle Add Godown
  const handleAddGodown = async () => {
    const { shop_name, godown_name, address } = newGodown;

    if (!godown_name.trim()) {
      toast.error("⚠️ Warehouse Name is required!");
      return;
    }

    try {
      const response = await AxiosInstance.post("/godowns/", newGodown);

      if (response.status === 201) {
        setGodown((prev) => [...prev, response.data]);
        setNewGodown({ shop_name: "", godown_name: "", address: "" });

        toast.success("Warehouse added successfully!");
        document.getElementById("my_modal_5").close();
      } else {
        toast.error("Failed to add warehouse!");
      }
    } catch (error) {
      console.error("Error adding godown:", error);
      toast.error("Failed to add warehouse!");
    }
  };

  // ✅ Handle Edit Godown
  const handleEditGodown = async () => {
    if (!editableGodown) return;

    const { shop_name, godown_name, address, id } = editableGodown;

    if (!godown_name.trim()) {
      toast.error("⚠️Warehouse Name is required!");
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
      toast.error("⚠️ No changes were made!");
      return;
    }

    try {
      const response = await AxiosInstance.put(`/godowns/${id}/`, {
        shop_name: shop_name.trim(),
        godown_name: godown_name.trim(),
        address: address.trim(),
      });

      if (response.status === 200) {
        setGodown((prev) =>
          prev.map((item) => (item.id === id ? response.data : item))
        );
        toast.success(" Warehouse updated successfully!");

        // ✅ Reset state after successful edit
        setEditableGodown(null);

        // ✅ Close the modal
        document.getElementById("my_modal_5").close();
      } else {
        toast.error(" Failed to update warehouse!");
      }
    } catch (error) {
      console.error("Error updating godown:", error);
      toast.error(" Failed to update warehouse!");
    }
  };

  // ✅ Handle Delete Godown
  const handleDeleteGodown = async (id) => {
    try {
      await AxiosInstance.delete(`/godowns/${id}/`);
      setGodown((prev) => prev.filter((item) => item.id !== id));
      toast.success("Warehouse deleted successfully!");
    } catch (error) {
      console.error("Error deleting godown:", error);
      toast.error("Failed to delete warehouse!");
    }
  };

  // handlw search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setGodown(backupGodown); // ✅ Reset data when search is cleared
      return;
    }
    const filtered = godown.filter(
      (item) =>
        item.godown_name &&
        item.godown_name.toLowerCase().includes(term.toLowerCase())
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
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="indicator">
                <button
                  className="btn btn-sm rounded-s-none join-item bg-blue-950 text-xs text-white"
                  // Trigger the search when button is clicked
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div>
            <button
              className="btn btn-sm bg-blue-950 text-white"
              onClick={() => {
                setEditableGodown(null); // ✅ Clear previous edit data
                setNewGodown({ shop_name: "", godown_name: "", address: "" }); // ✅ Reset input fields
                document.getElementById("my_modal_5").showModal();
              }}
            >
              <TiPlus /> <span className="text-xs">Add Warehouse</span>
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
            <thead className="bg-blue-950 text-white font-md font-normal">
              <tr className="text-center">
                <th className="px-4 py-2">SL</th>
                <th className="px-4 py-2">Shop Name</th>
                <th className="px-4 py-2">Warehouse Name</th>
                <th className="px-4 py-2">Warehouse Address</th>
                <th className="px-4 py-2">Edit</th>
                {/* <th className="px-4 py-2">Delete</th> */}
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
                        className="text-blue-950 hover:underline"
                        onClick={() => {
                          setEditableGodown(item); // ✅ Load item data into modal
                          document.getElementById("my_modal_5").showModal();
                        }}
                      >
                        <FaEdit />
                      </button>
                    </td>
                    {/* <td className="px-4 py-2 text-center">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeleteGodown(item.id)}
                      >
                        <ImCross />
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-gray-500">
                    No warehouse found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Godown Modal */}
      <dialog id="my_modal_5" className="modal modal-bottom modal-sm sm:modal-middle">
  <div className="modal-box relative p-4">
    <button
      className="absolute top-2 right-2 text-lg"
      onClick={() => document.getElementById("my_modal_5").close()} // Close modal
    >
      <ImCross />
    </button>

    <h3 className="font-bold text-lg my-3 text-center">
      {editableGodown ? "Edit Warehouse" : "Add Warehouse"}
    </h3>

    {/* Form Fields using Grid Layout */}
    <div className="flex flex-col gap-4 mb-2">
      {/* Shop Name Input */}
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 w-full">
          Shop Name :
        </label>
        <input
          className="input input-bordered w-full p-2 text-sm"
          placeholder="Enter Shop Name"
          value={editableGodown ? editableGodown.shop_name : newGodown.shop_name}
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
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 w-full">
          Warehouse Name :
        </label>
        <input
          className="input input-bordered w-full p-2 text-sm"
          placeholder="Enter Warehouse Name"
          value={editableGodown ? editableGodown.godown_name : newGodown.godown_name}
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
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 w-full">
          Warehouse Address :
        </label>
        <input
          className="input input-bordered w-full p-2 text-sm"
          placeholder="Enter Warehouse Address"
          value={editableGodown ? editableGodown.address : newGodown.address}
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
    </div>

    {/* Modal Action */}
    <div className="modal-action justify-center mt-4">
      <button
        className="btn bg-blue-950 text-white mx-auto"
        onClick={editableGodown ? handleEditGodown : handleAddGodown} // Trigger appropriate action
      >
        {editableGodown ? "Update Warehouse" : "Add Warehouse"}
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
