import React from 'react';

const WardrobeData = [
 
];

const Wardrobecard = () => {
  return (
    <div className='flex justify-center py-10 bg-gray-50'>
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-[600px] mx-auto">
          <p className='text-lg text-purple-900 py-1'>Wardrobe Collection</p>
          <h1 className="text-3xl text-black font-bold mb-2">Explore Your Wardrobe</h1>
          <p className='text-sm text-gray-500'>Curate your perfect wardrobe with the finest selections.</p>
        </div>
        {/* Body Section */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {/* Card Sections */}
          {WardrobeData.length > 0 ? (
            WardrobeData.map((data) => (
              <div
                key={data.id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
              >
                <img src={data.img} alt={data.title} className='h-[250px] w-full object-cover rounded-md mb-4'/>
                <div className='text-center'>
                  <h3 className="font-semibold text-lg text-gray-800">{data.title}</h3>
                  <p className='text-sm text-gray-600 mb-2'>{data.author}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className='text-gray-700'>{data.rating}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products available in your wardrobe yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wardrobecard;
