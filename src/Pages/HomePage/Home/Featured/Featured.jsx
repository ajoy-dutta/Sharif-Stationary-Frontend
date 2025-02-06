import featuredImg from '../../../../assets/fresh-100.jpg';

const Featured = () => {
    return (
        <div className="bg-fixed text-white pt-8 my-20">
            <div className="bg-gray-800 bg-opacity-70 grid md:grid-cols-2 items-center gap-8 p-10 rounded-lg shadow-lg">
                {/* Image Section */}
                <div className="flex justify-center">
                    <img className="w-full max-w-md object-contain rounded-lg shadow-md" src={featuredImg} alt="Featured Stationary" />
                </div>

                {/* Text Content */}
                <div className="text-white">
                    <p className="text-lg text-gray-300">Aug 20, 2024</p>
                    <h3 className="text-3xl font-bold uppercase text-blue-400">Best Quality Stationary Items</h3>
                    <p className="mt-4 text-gray-300">
                        Get the best notebooks, pens, and office supplies at Sharif Shopkeeper Stationary. Premium products at unbeatable prices!
                    </p>
                    <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md uppercase font-semibold transition duration-300">
                        Order Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Featured;
