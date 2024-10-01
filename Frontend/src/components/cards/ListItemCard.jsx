import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/AxiosInstance';
import { useAuth0 } from '@auth0/auth0-react';

const ListItemCard = ({ itemId }) => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user } = useAuth0();
    const [userId, setUserId] = useState(undefined);

    useEffect(() => {
        // Fetch item details
        const fetchItem = async () => {
            try {
                const response = await axiosInstance.get(`wardrobeItems/getItemByID/${itemId}`);
                setItem(response.data);
            } catch (error) {
                console.error("Error fetching item:", error);
            } finally {
                setLoading(false);
            }
        };

        // Check user authentication and fetch user ID
        const checkUser = async () => {
            if (isAuthenticated) {
                try {
                    const response = await axiosInstance.post(
                        "/user/signin",
                        { email: user.email },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    if (response.data.msg === "User verified successfully") {
                        setUserId(response.data.id);
                    } else {
                        // If user not verified, sign them up
                        const signupResponse = await axiosInstance.post(
                            '/user/signup',
                            {
                                email: user.email,
                                name: user.given_name,
                            },
                            { headers: { "Content-Type": "application/json" } }
                        );
                        setUserId(signupResponse.data.id); // Use signup response ID
                    }
                } catch (error) {
                    console.error("Error fetching user ID: ", error);
                }
            }
        };

        fetchItem();
        checkUser(); // Call checkUser here

    }, [itemId, isAuthenticated, user]); // Add dependencies

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!item) {
        return <div>No item found.</div>;
    }

    // Button click handlers
    const handleSell = async () => {
        const price = prompt("Enter the selling price:"); // Prompt for price
        if (price && !isNaN(price)) {
            try {
                const response = await axiosInstance.post("marketplace/sell", {
                    userId,
                    wardrobeItemId: itemId,
                    price: parseFloat(price), // Convert price to a number
                });
                console.log(`Item sold: ${response.data}`);
                alert('Item listed for sale successfully!');
            } catch (error) {
                console.error("Error selling item:", error);
                alert(error.response?.data?.error || 'Failed to list item for sale.');
            }
        } else {
            alert("Please enter a valid price.");
        }
    };

    const handleDonate = async () => {
        try {
            const response = await axiosInstance.post("marketplace/donate", {
                userId, // Make sure to use userId
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
        if (rentalPrice && !isNaN(rentalPrice)) {
            try {
                const response = await axiosInstance.post("marketplace/rent", {
                    userId,
                    wardrobeItemId: itemId,
                    rentalPrice: parseFloat(rentalPrice), // Ensure the price is a number
                });
                console.log(`Item rented: ${response.data}`);
                alert('Item listed for rent successfully!');
            } catch (error) {
                console.error("Error renting item:", error);
                alert('Failed to list item for rent.');
            }
        } else {
            alert("Please enter a valid rental price.");
        }
    };

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
