import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/AxiosInstance';

const ListItemCard = ({ itemId }) => {
     // Add userId prop
    const [item, setItem] = useState(null); // Start with null to avoid rendering issues
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const response = axiosInstance.post(`user/signin`);
        const fetchItem = async () => {
            try {
                const response = await axiosInstance.get(`wardrobeItems/getItemByID/${itemId}`);
                setItem(response.data); // Set item data
            } catch (error) {
                console.error("Error fetching item:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchItem();
    }, [itemId]); // Fetch item when itemId changes

    if (loading) {
        return <div>Loading...</div>; // Optionally show a loading indicator
    }

    if (!item) {
        return <div>No item found.</div>; // Handle case where item doesn't exist
    }

    // Button click handlers
    const handleSell = async () => {
        const price = prompt("Enter the selling price:"); // Prompt for price
        // Validate price input
        if (price && !isNaN(price)) {
            try {
                const response = await axiosInstance.post("marketplace/sell", {  // Ensure correct endpoint
                    userId,
                    wardrobeItemId: itemId,
                    price: parseFloat(price), // Convert price to a number
                });
                console.log(`Item sold: ${response.data}`);
                alert('Item listed for sale successfully!');
            } catch (error) {
                console.error("Error selling item:", error);
                // Show a more specific error message if available
                alert(error.response?.data?.error || 'Failed to list item for sale.');
            }
        } else {
            alert("Please enter a valid price."); // Alert for invalid input
        }
    };
    

    const handleDonate = async () => {
        try {
            const response = await axiosInstance.post("marketPlace/donate", {
                userId,
                wardrobeItemId: itemId,
            });
            console.log(`Item donated: ${response.data}`);
            alert('Item donated successfully!');
        } catch (error) {
            console.error("Error donating item:", error);
            alert('Failed to donate item.');
        }
    };

    const handleRent = async () => {
        const rentalPrice = prompt("Enter the rental price:"); // Prompt for rental price
        if (rentalPrice) {
            try {
                const response = await axiosInstance.post("marketPlace/rent", {
                    userId,
                    wardrobeItemId: itemId,
                    rentalPrice,
                });
                console.log(`Item rented: ${response.data}`);
                alert('Item listed for rent successfully!');
            } catch (error) {
                console.error("Error renting item:", error);
                alert('Failed to list item for rent.');
            }
        }
    };

    return (
        <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition duration-200">
            <img
                src={`http://localhost:5172${item.imageUrl}`}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md mb-2"
            />
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-gray-600">Category: {item.category}</p>
            <p className="text-gray-600">Occasion: {item.occasion}</p>
            <p className="text-gray-600">Type: {item.type}</p>
            <p className="text-gray-600">Color: {item.color}</p>
            <p className="mt-2 text-gray-800">{item.description}</p>
            <p className="text-sm text-gray-500 mt-2">Last Worn: {item.lastWorn ? item.lastWorn : "N/A"}</p>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-around">
                <button
                    onClick={handleSell}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Sell
                </button>
                <button
                    onClick={handleDonate}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                    Donate
                </button>
                <button
                    onClick={handleRent}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                    Rent
                </button>
            </div>
        </div>
    );
};

export default ListItemCard;
