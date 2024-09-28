import React, { useState } from 'react';
import img1 from '../../assets/img1.webp';

const WardrobeData = [
  {
    id: 1,
    img: img1,
    title: 'Shirt',
    author: 'adi',
  },
];

const Wardrobecard = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [wardrobeData, setWardrobeData] = useState(WardrobeData);
  const [modalImage, setModalImage] = useState(null); // For enlarged image preview
  const [isUploading, setIsUploading] = useState(false);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true); // Show uploading state
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the uploaded image
      const newWardrobeItem = {
        id: wardrobeData.length + 1, // Increment ID based on current data length
        img: imageUrl,
        title: 'New Item',
        author: 'User',
      };

      // Simulate upload delay
      setTimeout(() => {
        setWardrobeData([...wardrobeData, newWardrobeItem]);
        setUploadedImage(imageUrl);
        setIsUploading(false); // Hide uploading state
      }, 1000);
    }
  };

  // Handle modal close
  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="flex justify-center py-10 bg-gray-50">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-[600px] mx-auto">
          <p className="text-lg text-purple-900 py-1">Wardrobe Collection</p>
          <h1 className="text-4xl text-black font-bold mb-2">Explore Your Wardrobe</h1>
          <p className="text-sm text-gray-500">Curate your perfect wardrobe with the finest selections.</p>
        </div>

        {/* Upload Section */}
        <div className="text-center mb-6">
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-block px-6 py-2 text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-300 rounded-lg font-semibold"
          >
            {isUploading ? 'Uploading...' : 'Upload New Item'}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Body Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wardrobeData.length > 0 ? (
            wardrobeData.map((data) => (
              <div
                key={data.id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
              >
                <img
                  src={data.img}
                  alt={data.title}
                  className="h-[250px] w-full object-cover rounded-md mb-4 cursor-pointer"
                  onClick={() => setModalImage(data.img)} // Open modal on click
                />
                <div className="text-center">
                  <h3 className="font-semibold text-lg text-gray-800">{data.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{data.author}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-gray-700">{data.rating}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <img
                src="https://via.placeholder.com/150" // Replace with an actual illustration
                alt="No items"
                className="mb-4"
              />
              <p className="text-center">No products available in your wardrobe yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={modalImage}
              alt="Preview"
              className="max-w-[90%] max-h-[90%] object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-white text-black rounded-full p-2"
              onClick={closeModal}
            >
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wardrobecard;