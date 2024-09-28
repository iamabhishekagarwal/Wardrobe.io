import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import OutfitCard from "../components/cards/OutFitCard";
import Navbar from "../components/navbar/Navbar";

function OutFits() {
  const [randoutfit, setRandoutfit] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch outfits
  const generateOutfits = async () => {
    try {
      setLoading(true); // Set loading to true when generating outfits
      const response = await axiosInstance.post("/outfits/generateOutfits", {
        userId: 1, // Sending userId in the request body
      });

      // Set outfits from the response
      setOutfits(response.data.outfits); // Access outfits from response data
    } catch (error) {
      setError(error.message); // Set the error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to select a random outfit
  const selectRandomOutfit = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/outfits/randomOutfits", {
        userId: 1, // Sending userId in the request body
      });
      setRandoutfit(response.data.outfit); // Set the random outfit
    } catch (error) {
      setError(error.message); // Set the error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateOutfits(); // Fetch outfits on initial render
  }, []);

  if (loading) {
    return <div className="text-center font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
     

      <div className="bg-grey-300 rounded-lg shadow-lg p-6 mt-12">
        {/* Button to select a random outfit */}
        <div className="flex justify-center mb-6">
          <button
            onClick={selectRandomOutfit}
            className="bg-teal-600 text-white text-2xl font-bold py-2 px-6 rounded-full shadow hover:bg-teal-800 transition duration-300 transform hover:scale-105"
          >
            Select Random Outfit
          </button>
        </div>

        {/* Display the random outfit if selected */}
        {randoutfit && (
          <div className="mb-8">
            <h2 className="text-3xl  font-semibold text-center mb-4">Your Random Outfit</h2>
            <OutfitCard outfit={randoutfit} />
          </div>
        )}

        {/* Display the list of generated outfits */}
        <div>
          <h2 className="text-4xl pt-6 pb-4 font-bold text-center mb-4">Generated Outfits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {outfits.map((outfit, index) => (
              <div className="hover:shadow-lg transition-shadow duration-300">
                <OutfitCard key={index} outfit={outfit} /> {/* Pass each outfit as a prop */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutFits;
