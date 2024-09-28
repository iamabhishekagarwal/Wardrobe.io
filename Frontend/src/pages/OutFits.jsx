import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/AxiosInstance';
import OutfitCard from '../components/cards/OutFitCard';
import Navbar from '../components/navbar/Navbar';
function OutFits() {

  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const generateOutfits = async () => {
      try {
        const response = await axiosInstance.post('/outfits/generateOutfits', {
          userId: 1, // Sending userId in the request body
        });

        // Log the full response to inspect its structure

        // Set outfits from the response
        setOutfits(response.data.outfits); // Access outfits from response data
      } catch (error) {
        setError(error.message); // Set the error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    generateOutfits();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Navbar></Navbar>
      <h2>Generated Outfits</h2>
      <div>
      {outfits.map((outfit, index) => (
          <OutfitCard key={index} outfit={outfit} /> // Pass each outfit as a prop
        ))}
      </div>
    </div>
  );
}

export default OutFits;
