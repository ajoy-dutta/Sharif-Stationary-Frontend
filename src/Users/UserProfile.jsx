import { useEffect, useState } from "react";
import AxiosInstance from "../../src/Components/AxiosInstance"; // Assuming AxiosInstance is set up for handling requests

const Profile = () => {
  // States for user data and loading state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data on component mount
    const fetchUserData = async () => {
      try {

        const response = await AxiosInstance.get("/user/");

        setUser(response.data); // Set user data to state
      } catch (err) {
        console.error("Error fetching user data:", err.response?.data || err.message);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  
  const profilePictureUrl = user.profile_picture
    ? `https://ajoydutta.com/api/${user.profile_picture}`
    : "https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"; 

    return (
      <div className="w-full max-w-screen-xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col lg:flex-row">
          {/* Profile Image */}
          <figure className="bg-gradient-to-r from-indigo-300 to-purple-400 flex justify-center items-center p-6 lg:w-1/4 xl:w-1/5">
            <img
              src={profilePictureUrl}
              alt="Profile"
              className="w-48 h-48 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </figure>
    
          {/* User Info */}
          <div className="p-8 flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">User Information</h2>
            
            <div className="grid grid-cols-2 gap-6 text-gray-600">
              <div>
                <label className="block font-medium">Username:</label>
                <p className="text-lg">{user.username || "Not provided"}</p>
              </div>
              <div>
                <label className="block font-medium">Role:</label>
                <p className="text-lg capitalize">{user.role || "Not provided"}</p>
              </div>
            </div>
    
            <hr className="my-6 border-t-2 border-gray-100" />
    
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
    
            <div className="grid grid-cols-2 gap-6 text-gray-600">
              <div>
                <label className="block font-medium">Email:</label>
                <p className="text-lg">{user.email || "Not provided"}</p>
              </div>
              <div>
                <label className="block font-medium">Phone:</label>
                <p className="text-lg">{user.phone || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    
    
    
};

export default Profile;
