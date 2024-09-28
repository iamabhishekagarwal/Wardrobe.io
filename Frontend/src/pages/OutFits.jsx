import React, { useState, useEffect } from 'react';

function OutFits() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateOutfits = async () => {
      try {
        const response = await fetch('http://localhost:5172/api/outfits/generateOutfits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({userId:1 }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(response.data)
        setOutfits(response.outfits); // Assuming outfits is the key in the returned object
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    generateOutfits();
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Generated Outfits</h2>
      <ul>
        {outfits.map((outfit, index) => (
          <li key={index}>{outfit}</li> // Customize this to display outfit details
        ))}
      </ul>
    </div>
  );
}

export default OutFits;
