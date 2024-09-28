// src/components/Navbar.jsx
import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return (
    <nav className="bg-gray-800 p-5 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">BrandName</div>
        <ul className="flex space-x-12 text-white text-lg font-medium">
          <li className="hover:text-gray-400 transition-colors duration-300"><a href="#">Home</a></li>
          <li className="hover:text-gray-400 transition-colors duration-300"><a href="#">Features</a></li>
          <li className="hover:text-gray-400 transition-colors duration-300"><a href="#">Pricing</a></li>
          <li className="hover:text-gray-400 transition-colors duration-300"><a href="#">Contact</a></li>
        </ul>
        {isAuthenticated ? (
          <button 
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-transform duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        ) : (
          <button 
            onClick={() => loginWithRedirect()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition-transform duration-300 transform hover:scale-105"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
