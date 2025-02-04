import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-semibold">Sharif Shopkeeper</Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          </li>
          <li>
            <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
          </li>
          <li>
            <Link to="/about" className="text-white hover:text-gray-300">About</Link>
          </li>
          <li>
            <Link to="/contact" className="text-white hover:text-gray-300">Contact</Link>
          </li>
        </ul>
        <div className="flex space-x-4">
          <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
          <Link to="/signup" className="text-white hover:text-gray-300">Signup</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
