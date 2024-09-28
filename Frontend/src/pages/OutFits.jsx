import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import OutfitCard from "../components/cards/OutFitCard";

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
          <Navbar></Navbar>


      {/* Button to select a random outfit */}
      <button onClick={selectRandomOutfit} style={{ marginBottom: "20px" }}>
        Select Random Outfit
      </button>

      {/* Display the random outfit if selected */}
      {randoutfit && <OutfitCard outfit={randoutfit} />}


      {/* Display the list of generated outfits */}
     <div>
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
