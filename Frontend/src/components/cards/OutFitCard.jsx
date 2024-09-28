import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/AxiosInstance';
import Slider from 'react-slick'; 
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

const OutfitCard = ({ outfit }) => {
  const [topItem, setTopItem] = useState(null);
  const [bottomItem, setBottomItem] = useState(null);
  const [shoesItem, setShoesItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async (id, setItem) => {
      try {
        const response = await axiosInstance.get(`wardrobeItems/getItemByID/${id}`);
        setItem(response.data);
      } catch (error) {
        setError(`Error fetching item with ID ${id}: ${error.message}`);
      }
    };

    fetchItemDetails(outfit.top, setTopItem);
    fetchItemDetails(outfit.bottom, setBottomItem);
    fetchItemDetails(outfit.shoes, setShoesItem);

    setLoading(false);
  }, [outfit.top, outfit.bottom, outfit.shoes]);

  if (loading) {
    return <div className="text-center">Loading outfit details...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="outfit-card max-w-lg mx-auto p-6 border rounded-lg shadow-xl bg-white transition-shadow duration-300 ease-in-out hover:shadow-2xl">
      <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">Occasion: {outfit.occasion}</h3>
      <Slider {...settings}>
        {topItem && (
          <div className="flex flex-col items-center">
            <div className="overflow-hidden w-full h-80"> {/* Increased height */}
              <img src={`http://localhost:5172${topItem.imageUrl}`} alt={topItem.name} className="w-full h-full object-contain transition-transform duration-300 ease-in-out transform hover:scale-105" />
            </div>
            <p className="text-center text-gray-700 font-medium text-lg">Top: {topItem.name} (ID: {topItem.id})</p>
          </div>
        )}
        {bottomItem && (
          <div className="flex flex-col items-center">
            <div className="overflow-hidden w-full h-80"> {/* Increased height */}
              <img src={`http://localhost:5172${bottomItem.imageUrl}`} alt={bottomItem.name} className="w-full h-full object-contain transition-transform duration-300 ease-in-out transform hover:scale-105" />
            </div>
            <p className="text-center text-gray-700 font-medium text-lg">Bottom: {bottomItem.name} (ID: {bottomItem.id})</p>
          </div>
        )}
        {shoesItem && (
          <div className="flex flex-col items-center">
            <div className="overflow-hidden w-full h-80"> {/* Increased height */}
              <img src={`http://localhost:5172${shoesItem.imageUrl}`} alt={shoesItem.name} className="w-full h-full object-contain transition-transform duration-300 ease-in-out transform hover:scale-105" />
            </div>
            <p className="text-center text-gray-700 font-medium text-lg">Shoes: {shoesItem.name} (ID: {shoesItem.id})</p>
          </div>
        )}
      </Slider>
    </div>
  );
};

export default OutfitCard;
