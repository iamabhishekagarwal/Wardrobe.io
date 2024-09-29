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
  const { isAuthenticated } = useAuth0();

  // State for form fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [occasion, setOccasion] = useState("");
  const [image, setImage] = useState(null);
  const [userID,setUserID] = useState(undefined);

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
      if (msg=="User verified successfully") {
        console.log(response.data.id)
        setUserID(response.data.id); 
      }
      else{
        try{
          const response2 = await axiosInstance.post('/user/signup',
            {
              email: user.email,
              name: user.given_name ,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(response.data.id)
        }
        catch(e){
          console.log("error sending req to signup")
        }
      }
      
    } catch (error) {
      console.error("Error fetching user id : ", error);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      checkUser();
    }  
  })

  const generateOutfits = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/outfits/generateOutfits", {
        userId: userID,
      });
      setOutfits(response.data.outfits);
      console.log(response.data.outfits);
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
      const response = await axiosInstance.post("/wardrobeItems/updateSelected", {
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
      const response = await axiosInstance.post("/wardrobeItems/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      alert("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
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
      {isAuthenticated ? (
        <>
          <div className="bg-gray-100 min-h-screen py-6">
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
                <form
                  onSubmit={handleSubmit}
                  className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
                >
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Type</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Color</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Description</label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Occasion</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      required
                    />
                  </div>
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
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                  >
                    Add Item
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-center">Login to access the Wardrobe</p>
        </div>
      )}
    </>
  );
}

export default OutFits;
