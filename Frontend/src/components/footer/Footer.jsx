// Footer.jsx
// Footer.jsx
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPinterest } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-center gap-96 items-start">
        
        {/* Contact Section */}
        <div className="mb-4 md:mb-0">
          <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:text-gray-400">Email: support@wardrobemanager.com</a></li>
            <li><a href="#" className="hover:text-gray-400">Phone: +123 456 7890</a></li>
          </ul>
        </div>

        {/* Mission Statement */}
        {/* <div className="mb-4 md:mb-0">
          <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
          <p className="text-sm text-gray-300">
            Helping individuals like Ravi manage their belongings efficiently,
            reduce overconsumption, and make informed choices about sustainability.
          </p>
        </div> */}

        {/* Social Media Links */}
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg mb-2">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-gray-400"><FaFacebook size={20} /></a>
            <a href="#" className="hover:text-gray-400"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-gray-400"><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-gray-400"><FaLinkedin size={20} /></a>
            <a href="#" className="hover:text-gray-400"><FaPinterest size={20} /></a>
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="text-center text-gray-500 mt-4">
        <p>&copy; {new Date().getFullYear()} Wardrobe Manager. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
