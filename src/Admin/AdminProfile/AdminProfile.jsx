const AdminProfile = () => {
    return (
        <div className="container mx-auto p-6 mb-72">
            {/* Admin Header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
                <p className="text-lg text-gray-500">Welcome to your admin panel</p>
            </div>

            {/* Admin Info Section */}
            <div className="flex justify-center mb-10">
                <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Admin Information</h3>
                    <div className="space-y-4">
                        <p className="text-lg text-gray-600">
                            <strong>Name:</strong> Sharif Shop Keeper
                        </p>
                        <p className="text-lg text-gray-600">
                            <strong>Email:</strong> admin@sharifshopkeeper.com
                        </p>
                    </div>
                </div>
            </div>

            {/* Shop Statistics Section */}
            <div className="flex justify-around mb-10">
                {/* Total Sales */}
                <div className="bg-white p-6 rounded-lg shadow-md w-1/4">
                    <h4 className="text-lg font-semibold text-gray-700">Total Sales</h4>
                    <p className="text-xl font-bold text-green-600">৳ 50,000</p>
                </div>

                {/* Total Products */}
                <div className="bg-white p-6 rounded-lg shadow-md w-1/4">
                    <h4 className="text-lg font-semibold text-gray-700">Total Products</h4>
                    <p className="text-xl font-bold text-blue-600">120</p>
                </div>

                {/* Total Orders */}
                <div className="bg-white p-6 rounded-lg shadow-md w-1/4">
                    <h4 className="text-lg font-semibold text-gray-700">Total Orders</h4>
                    <p className="text-xl font-bold text-yellow-600">85</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center">
                <button className="px-6 py-3 bg-blue-950 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300 mb-4">
                    Manage Products
                </button>
                <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition duration-300">
                    View Orders
                </button>
            </div>
        </div>
    );
};

export default AdminProfile;
