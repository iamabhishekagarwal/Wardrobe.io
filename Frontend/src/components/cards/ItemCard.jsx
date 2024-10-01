import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/AxiosInstance';

const ItemCard = ({ itemId }) => {
    const [item, setItem] = useState(null); // Start with null to avoid rendering issues
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
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

    return (
        <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition duration-200">
            <img
                src={`https://wardrobe-io.onrender.com${item.imageUrl}`}
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
        </div>
    );
};

export default ItemCard;
