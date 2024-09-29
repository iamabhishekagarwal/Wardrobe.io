import React, { useState } from 'react';

const EnhancedFooter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Implement your subscription logic here
    console.log(`Subscribed with email: ${email}`);
    setEmail(''); // Clear the email input after submission
  };

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto text-center">
        {/* Newsletter Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Subscribe to Our Newsletter</h3>
          <form onSubmit={handleSubscribe} className="mt-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            <button type="submit" className="bg-teal-500 p-2 rounded-r-md hover:bg-teal-600 transition">
              Subscribe
            </button>
          </form>
        </div>

        {/* Social Media Links */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold">Follow Us</h4>
          <ul className="flex justify-center space-x-4 mt-2">
            <li>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Links to Policy and Terms */}
        <div className="mb-4">
          <a href="/privacy-policy" className="text-sm hover:underline mx-2">Privacy Policy</a>
          <a href="/terms-of-service" className="text-sm hover:underline mx-2">Terms of Service</a>
        </div>

        {/* Copyright Section */}
        <div>
          <p className="text-sm">© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;
