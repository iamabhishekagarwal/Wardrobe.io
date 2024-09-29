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
  const { isAuthenticated, user } = useAuth0();

  // State for form fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [occasion, setOccasion] = useState("");
  const [image, setImage] = useState(null);
  const [userID, setUserID] = useState(undefined);

  // Fetch outfits

  async function checkUser() {
    try {
      const response = await axiosInstance.post(
        "/user/signin",
        {
          email: user.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const msg = response.data.msg;
      if (msg === "User verified successfully") {
        setUserID(response.data.id);
      } else {
        await axiosInstance.post('/user/signup', {
          email: user.email,
          name: user.given_name,
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching user id: ", error);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      checkUser();
    }
  }, [isAuthenticated]);

  const generateOutfits = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/outfits/generateOutfits", {
        userId: userID,
      });
      setOutfits(response.data.outfits);
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
        userId: userID,
      });
      setRandoutfit(response.data.outfit);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle outfit selection
  const handleSelectOutfit = async (outfit, top, bottom, shoes) => {
    setSelectedOutfit(outfit);
    try {
      await axiosInstance.post("/wardrobeItems/updateSelected", {
        top,
        bottom,
        shoes,
      });
    } catch (e) {
      console.log("Error sending top, bottom, shoes");
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission to add item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("category", category);
    formData.append("type", type);
    formData.append("color", color);
    formData.append("description", description);
    formData.append("occasion", occasion);

    try {
      await axiosInstance.post("/wardrobeItems/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  useEffect(() => {
    generateOutfits();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <>
      <Navbar />
      {isAuthenticated ? (
        <div className="bg-gray-100 min-h-screen py-6">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <button
                className="bg-gradient-to-r from-blue-500 to-teal-400 text-white py-3 px-6 rounded-lg shadow-md hover:from-teal-400 hover:to-blue-500 transition-all duration-300"
                onClick={selectRandomOutfit}
              >
                Select Random Outfit
              </button>
            </div>

            {randoutfit && (
              <div className="text-center mb-12">
                <OutfitCard outfit={randoutfit} />
                <button
                  className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                  onClick={() => handleSelectOutfit(randoutfit)}
                >
                  Select This Outfit
                </button>
              </div>
            )}

            <h2 className="text-2xl font-semibold mb-6 text-center">Generated Outfits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outfits.map((outfit, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105">
                  <OutfitCard outfit={outfit} />
                  <button
                    className="mt-4 bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 w-full"
                    onClick={() => handleSelectOutfit(outfit, outfit.top, outfit.bottom, outfit.shoes)}
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

            {/* Add Item Form */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4 text-center">Add a New Item</h2>
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                {[
                  { label: "Name", value: name, setValue: setName },
                  { label: "Category", value: category, setValue: setCategory },
                  { label: "Type", value: type, setValue: setType },
                  { label: "Color", value: color, setValue: setColor },
                  { label: "Description", value: description, setValue: setDescription, isTextArea: true },
                  { label: "Occasion", value: occasion, setValue: setOccasion },
                ].map((field, index) => (
                  <div className="mb-4" key={index}>
                    <label className="block text-gray-700 font-semibold mb-2">{field.label}</label>
                    {field.isTextArea ? (
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        value={field.value}
                        onChange={(e) => field.setValue(e.target.value)}
                        required
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        value={field.value}
                        onChange={(e) => field.setValue(e.target.value)}
                        required
                      />
                    )}
                  </div>
                ))}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Upload Image</label>
                  <input
                    type="file"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    onChange={handleImageChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all duration-300"
                >
                  Add Item
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">Please log in to view your outfits.</div>
      )}
    </>
  );
}

export default OutFits;
