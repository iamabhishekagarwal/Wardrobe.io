import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/AxiosInstance';
import Slider from 'react-slick'; // Import React Slick
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
        setItem(response.data); // Assuming the response contains the item details directly
      } catch (error) {
        setError(`Error fetching item with ID ${id}: ${error.message}`);
      }
    };

    // Fetch details for top, bottom, and shoes
    fetchItemDetails(outfit.top, setTopItem);
    fetchItemDetails(outfit.bottom, setBottomItem);
    fetchItemDetails(outfit.shoes, setShoesItem);

    setLoading(false); // Set loading to false after initiating fetch calls
  }, [outfit.top, outfit.bottom, outfit.shoes]); // Dependencies to refetch if IDs change

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
    <div className="outfit-card max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Occasion: {outfit.occasion}</h3>
      <Slider {...settings}>
        {topItem && (
          <div className="flex flex-col items-center">
            <img src={`http://localhost:5172${topItem.imageUrl}`} alt={topItem.name} className="w-full h-auto rounded-lg mb-2" />
            <p className="text-center">Top: {topItem.name} (ID: {topItem.id})</p>
          </div>
        )}
        {bottomItem && (
          <div className="flex flex-col items-center">
            <img src={`http://localhost:5172${bottomItem.imageUrl}`} alt={bottomItem.name} className="w-full h-auto rounded-lg mb-2" />
            <p className="text-center">Bottom: {bottomItem.name} (ID: {bottomItem.id})</p>
          </div>
        )}
        {shoesItem && (
          <div className="flex flex-col items-center">
            <img src={`http://localhost:5172${shoesItem.imageUrl}`} alt={shoesItem.name} className="w-full h-auto rounded-lg mb-2" />
            <p className="text-center">Shoes: {shoesItem.name} (ID: {shoesItem.id})</p>
          </div>
        )}
      </Slider>
    </div>
  );
};

export default OutfitCard;
