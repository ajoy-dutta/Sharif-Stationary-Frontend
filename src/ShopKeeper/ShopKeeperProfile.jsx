import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShopkeeperProfile = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch the shopkeeper's profile data from the backend when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/shopkeeper/profile/');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Handle changes to the profile form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit the updated profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://127.0.0.1:8000/api/shopkeeper/profile/', profileData);
      setIsEditing(false); // Turn off editing mode after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Shopkeeper Profile</h2>
      <div className="bg-white p-6 rounded shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            {isEditing && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopkeeperProfile;
