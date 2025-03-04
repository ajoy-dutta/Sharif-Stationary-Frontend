import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { toast, Toaster } from "react-hot-toast";


const Godown = () => {

    const [godown, setGodown] = useState([]); 
    const [newGodown, setNewGodown] = useState({
        shop_name: '',
        godown_name: '',
        godown_address: '',
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
        toast.error("⚠️ দোকানের নাম আবশ্যক!");
        return;
    }
    if (!godown_name.trim()) {
        toast.error("⚠️ গুদামের নাম আবশ্যক!");
        return;
    }
    if (!godown_address.trim()) {
        toast.error("⚠️ গুদামের ঠিকানা আবশ্যক!");
        return;
    }

    try {
        const response = await axios.post("http://127.0.0.1:8000/api/godowns/", newGodown);

        if (response.status === 201) {
            setGodown((prev) => [...prev, response.data]);

            setNewGodown({
                shop_name: '',
                godown_name: '',
                address: '',
            });

            // ✅ Show success message
            toast.success("গুদাম সফলভাবে যোগ করা হয়েছে!");

            // ✅ Close modal
            document.getElementById('my_modal_5').close();
        } else {
            toast.error("গুদাম যোগ করতে ব্যর্থ হয়েছে!");
        }
    } catch (error) {
        console.error("Error adding godown:", error);
        toast.error("গুদাম যোগ করতে ব্যর্থ হয়েছে!");
    }
};

    


    const handleEditGodown = async () => {
      if (!editableGodown) return;
  
      const { shop_name, godown_name, address, id } = editableGodown;
  
      // ✅ Validation: Ensure required fields are filled
      if (!shop_name.trim()) {
          toast.error("⚠️ দোকানের নাম আবশ্যক!");
          return;
      }
      if (!godown_name.trim()) {
          toast.error("⚠️ গুদামের নাম আবশ্যক!");
          return;
      }
      if (!address.trim()) {
          toast.error("⚠️ গুদামের ঠিকানা আবশ্যক!");
          return;
      }
  
      // ✅ Check if any changes were made before updating
      const originalGodown = godown.find((g) => g.id === id); // 🔹 FIXED: Replaced `godowns` with `godown`
  
      if (
          originalGodown &&
          originalGodown.shop_name === shop_name.trim() &&
          originalGodown.godown_name === godown_name.trim() &&
          originalGodown.address === address.trim()
      ) {
          toast.error("⚠️ কোনো পরিবর্তন করা হয়নি!");
          return;
      }
  
      try {
          const response = await AxiosInstance.put(`/godown/${id}/`, {
              shop_name: shop_name.trim(),
              godown_name: godown_name.trim(),
              address: address.trim(),
          });
  
          if (response.status === 200) {
              // ✅ Update `godown` state instantly
              setGodown((prev) =>
                  prev.map((item) => (item.id === id ? response.data : item))
              );
  
              // ✅ Show success message
              toast.success("গুদাম সফলভাবে আপডেট হয়েছে!");
  
              // ✅ Close modal & Reset edit state
              setEditableGodown(null);
              document.getElementById("my_modal_5").close();
          } else {
              toast.error("গুদাম আপডেট করতে ব্যর্থ হয়েছে!");
          }
      } catch (error) {
          console.error("Error updating godown:", error);
          toast.error("গুদাম আপডেট করতে ব্যর্থ হয়েছে!");
      }
  };
  
  
  const handleDeleteGodown = async (id) => {
    try {
        await AxiosInstance.delete(`/godown/${id}/`);

        // ✅ Instantly update the state
        setGodown((prev) => prev.filter((item) => item.id !== id));

        // ✅ Show success toast
        toast.success("গুদাম সফলভাবে মুছে ফেলা হয়েছে!");
    } catch (error) {
        console.error("Error deleting godown:", error);

        // ❌ Show error toast
        toast.error("গুদাম মুছতে ব্যর্থ হয়েছে!");
    }
};


     // handlw search
      const handleSearch = () => {
        const searchTerm = document.getElementById("godownName").value;
        const filtered = godown.filter((item) =>
            item.godown_name && item.godown_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setGodown(filtered); // Update the divisions state with filtered data
      };
    


    
    return (
      <div className="m-8">
        <div className="">
        <h2 className="text-sm">গুদামের নাম :*</h2>
          <div className="flex justify-between items-center ">
          <div className="">
            <div className="join items-center">
              <input
                type="text"
                id="godownName"
                placeholder="Enter গুদামের নাম"
                 className="input input-bordered text-sm rounded-s-md h-[30px] join-item"
                // className="  px-4 py-2 w-1/4 "
              />
              <div className="indicator">
                <button
                  className="btn btn-sm rounded-s-none join-item bg-blue-950 text-white"
                  onClick={handleSearch} // Trigger the search when button is clicked
                >
                  Search
                </button>
              </div>
            </div>
          </div>
            <div>
              <button
                className="btn btn-sm bg-blue-950 text-white"
                onClick={() =>
                  document.getElementById("my_modal_5").showModal()
                }
              >
                <TiPlus /> Add Warehouse
              </button>
            </div>
          </div>
       <div className="m-8">
       <label
              htmlFor="godownName"
              className="block text-center  pb-2 border-b-[1px] text-gray-700 font-bold"
            >
              গুদামের নামের তালিকা
            </label>
       </div>
          <div className="overflow-x-auto ">
       
            <table className="table table-xs text-sm table-zebra table-fixed table-compact w-3/4 mx-auto">
              <thead className="bg-gray-200 text-black font-md font-normal">
                <tr className="text-center">
                  <th className="px-4 py-2">SL</th>
                  <th className="px-4 py-2">দোকানের নাম</th>
                  <th className="px-4 py-2">গুদামের নাম</th>
                  <th className="px-4 py-2">গুদামের ঠিকানা</th>
                  <th className="px-4 py-2">সম্পাদনা</th>
                  <th className="px-4 py-2">মুছে ফেলুন</th>
                </tr>
              </thead>
              <tbody className="text-center">
  {godown.length > 0 ? (
    godown.map((item, index) => (
      <tr
        key={index}
      
      >
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
        কোনো গুদাম পাওয়া যায়নি!
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
                  editableGodown
                    ? editableGodown.shop_name
                    : newGodown.shop_name
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
                  editableGodown
                    ? editableGodown.address
                    : newGodown.address
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
                className="btn bg-blue-950 text-white mx-auto"
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

export default Godown;