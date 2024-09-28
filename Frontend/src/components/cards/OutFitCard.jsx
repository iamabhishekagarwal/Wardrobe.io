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

  if (loading) return <div className="text-center text-lg">Loading outfit details...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">Occasion: {outfit.occasion}</h3>
      <Slider {...settings}>
        {topItem && (
          <div className="flex flex-col items-center">
            <img
              src={`http://localhost:5172${topItem.imageUrl}`}
              alt={topItem.name}
              className="w-full h-auto rounded-lg mb-2"
            />
            <p className="text-lg font-semibold">Top: {topItem.name}</p>
          </div>
        )}
        {bottomItem && (
          <div className="flex flex-col items-center">
            <img
              src={`http://localhost:5172${bottomItem.imageUrl}`}
              alt={bottomItem.name}
              className="w-full h-auto rounded-lg mb-2"
            />
            <p className="text-lg font-semibold">Bottom: {bottomItem.name}</p>
          </div>
        )}
        {shoesItem && (
          <div className="flex flex-col items-center">
            <img
              src={`http://localhost:5172${shoesItem.imageUrl}`}
              alt={shoesItem.name}
              className="w-full h-auto rounded-lg mb-2"
            />
            <p className="text-lg font-semibold">Shoes: {shoesItem.name}</p>
          </div>
        )}
      </Slider>
    </div>
  );
};

export default OutfitCard;
