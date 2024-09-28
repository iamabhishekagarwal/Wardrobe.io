import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import OutfitCard from "../components/cards/OutFitCard";
import Navbar from "../components/navbar/Navbar";
import { useAuth0 } from "@auth0/auth0-react";

function OutFits() {
  const [randoutfit, setRandoutfit] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const {isAuthenticated} = useAuth0();
  // Fetch outfits
  const generateOutfits = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/outfits/generateOutfits", {
        userId: 1,
      });
      setOutfits(response.data.outfits);
      console.log(response.data.outfits)
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Select random outfit
  const selectRandomOutfit = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/outfits/randomOutfits", {
        userId: 1,
      });
      setRandoutfit(response.data.outfit);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle outfit selection
  const handleSelectOutfit = async(outfit,top,bottom,shoes) => {
    
    setSelectedOutfit(outfit);
    console.log(top)
    console.log(bottom)
    console.log(shoes)
    try{
      const response = await axiosInstance.post("/wardrobeItems/updateSelected",{
        top,
        bottom,
        shoes
      }
      )
    }
    catch(e){
      console.log("Error sending top bottom shoe")
    }
  };

  useEffect(() => {
    generateOutfits();
  }, []);

  if (loading) return <div className="text-center text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <>
      <Navbar />
      {isAuthenticated?<><div className="bg-gray-100 min-h-screen py-6">

<div className="container mx-auto px-4">
  <div className="text-center mb-8">
    <button
      className="bg-gradient-to-r from-blue-500 to-teal-400 text-white py-2 px-4 rounded-lg shadow-md hover:from-teal-400 hover:to-blue-500 transition-colors"
      onClick={selectRandomOutfit}
    >
      Select Random Outfit
    </button>
  </div>

  {randoutfit && (
    <div className="text-center mb-12">
      <OutfitCard outfit={randoutfit} />
      <button
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        onClick={() => handleSelectOutfit(randoutfit)}
      >
        Select This Outfit
      </button>
    </div>
  )}

  <h2 className="text-2xl font-semibold mb-6 text-center">Generated Outfits</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {outfits.map((outfit, index) => (
      <div key={index} className="bg-white rounded-lg shadow-lg p-4">
        <OutfitCard outfit={outfit} />
        <button
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors w-full"
          onClick={() => handleSelectOutfit(outfit,outfit.top,outfit.bottom,outfit.shoes)}
        >
          Select This Outfit
        </button>
      </div>
    ))}
  </div>

  {selectedOutfit && (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-center mb-6">Selected Outfit</h2>
      <OutfitCard outfit={selectedOutfit} />
    </div>
  )}
</div>
</div></>:<div className="flex items-center justify-center h-screen">
  <p className="text-center">Login to access the Wardrobe</p>
</div>}
    
    </>
  );
}

export default OutFits;
