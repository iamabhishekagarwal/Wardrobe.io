import React, { useEffect, useState } from "react";
import axiosInstance from '../api/AxiosInstance';
import Navbar from "../components/navbar/Navbar";
import { useAuth0 } from "@auth0/auth0-react";

const WardrobeAnalyticsDashboard = () => {
  const {isAuthenticated,user} = useAuth0();
  const [maxItems, setMaxItems] = useState({
    maxTop: null,
    maxBottom: null,
    maxShoes: null,
  });
  const [userID,setUserID] = useState(undefined);

  const [minItems, setMinItems] = useState({
    minTop: null,
    minBottom: null,
    minShoes: null,
  });
  const [allItems, setAllItems] = useState([]); // State to hold all wardrobe items

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
  },[isAuthenticated])

  useEffect(() => {
    // Fetch max count items data
    const fetchMaxCountItems = async () => {
      try {
        const response = await axiosInstance.post("/wardrobeItems/maxCounts",{userId:userID}); // Adjust this URL if needed
        setMaxItems(response.data);
      } catch (error) {
        console.error("Error fetching max count items:", error);
      }
    };

    // Fetch min count items data
    const fetchMinCountItems = async () => {
      try {
        const response = await axiosInstance.post("/wardrobeItems/minCounts",{userId:userID}); // Adjust this URL if needed
        setMinItems(response.data);
      } catch (error) {
        console.error("Error fetching min count items:", error);
      }
    };

    // Fetch all wardrobe items
    const fetchAllItems = async () => {
      try {
        const response = await axiosInstance.post("/wardrobeItems/getItems", { userId:userID });
        setAllItems(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching all wardrobe items:", error);
      }
    };

    fetchMaxCountItems();
    fetchMinCountItems();
    fetchAllItems();
  }, [userID]);

  // Group wardrobe items by category
  const groupedItems = allItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      {isAuthenticated?<><div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">Wardrobe Insights</h2>

        {/* Most Worn Items */}
        <h3 className="text-3xl font-bold text-gray-700 mb-6 text-center">Most Worn Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {/* Most Worn Top */}
          <div className="bg-white p-8 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Most Worn Top</h3>
            {maxItems.maxTop ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-2">{maxItems.maxTop.name}</p>
                <div className="h-64 flex justify-center">
                  <img
                    src={`http://localhost:5172${maxItems.maxTop.imageUrl}`}
                    alt={maxItems.maxTop.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-gray-600 mt-4">{maxItems.maxTop.description}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No top data available.</p>
            )}
          </div>

          {/* Most Worn Bottom */}
          <div className="bg-white p-8 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Most Worn Bottom</h3>
            {maxItems.maxBottom ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-2">{maxItems.maxBottom.name}</p>
                <div className="h-64 flex justify-center">
                  <img
                    src={`http://localhost:5172${maxItems.maxBottom.imageUrl}`}
                    alt={maxItems.maxBottom.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-gray-600 mt-4">{maxItems.maxBottom.description}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No bottom data available.</p>
            )}
          </div>

          {/* Most Worn Shoes */}
          <div className="bg-white p-8 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Most Worn Shoes</h3>
            {maxItems.maxShoes ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-2">{maxItems.maxShoes.name}</p>
                <div className="h-64 flex justify-center">
                  <img
                    src={`http://localhost:5172${maxItems.maxShoes.imageUrl}`}
                    alt={maxItems.maxShoes.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-gray-600 mt-4">{maxItems.maxShoes.description}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No shoes data available.</p>
            )}
          </div>
        </div>

        {/* Least Worn Items */}
        <h3 className="text-3xl font-bold text-gray-700 mb-6 text-center">Least Worn Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {/* Least Worn Top */}
          <div className="bg-white p-8 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Least Worn Top</h3>
            {minItems.minTop ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-2">{minItems.minTop.name}</p>
                <div className="h-64 flex justify-center">
                  <img
                    src={`http://localhost:5172${minItems.minTop.imageUrl}`}
                    alt={minItems.minTop.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-gray-600 mt-4">{minItems.minTop.description}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No top data available.</p>
            )}
          </div>

          {/* Least Worn Bottom */}
          <div className="bg-white p-8 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Least Worn Bottom</h3>
            {minItems.minBottom ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-2">{minItems.minBottom.name}</p>
                <div className="h-64 flex justify-center">
                  <img
                    src={`http://localhost:5172${minItems.minBottom.imageUrl}`}
                    alt={minItems.minBottom.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-gray-600 mt-4">{minItems.minBottom.description}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No bottom data available.</p>
            )}
          </div>

          {/* Least Worn Shoes */}
          <div className="bg-white p-8 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Least Worn Shoes</h3>
            {minItems.minShoes ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-2">{minItems.minShoes.name}</p>
                <div className="h-64 flex justify-center">
                  <img
                    src={`http://localhost:5172${minItems.minShoes.imageUrl}`}
                    alt={minItems.minShoes.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-gray-600 mt-4">{minItems.minShoes.description}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No shoes data available.</p>
            )}
          </div>
        </div>

        {/* All Wardrobe Items Categorized */}
        <h3 className="text-3xl font-bold text-gray-700 mb-6 text-center">All Wardrobe Items</h3>
        {Object.keys(groupedItems).map((category) => (
          <div key={category} className="mb-10">
            <h4 className="text-2xl font-semibold text-gray-700 mb-4 capitalize">{category}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedItems[category].map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 ease-in-out"
                >
                  <h5 className="text-xl font-bold text-gray-800">{item.name}</h5>
                  <div className="h-48 flex justify-center mt-4">
                    <img
                      src={`http://localhost:5172${item.imageUrl}`}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="text-gray-600 mt-2">Color: {item.color}</p>
                  <p className="text-gray-600 mt-2">Worn Count: {item.count}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div></>:<div className="flex items-center justify-center h-screen">
  <p className="text-center">Login to access this page</p>
</div>}
      
    </>
  );
};

export default WardrobeAnalyticsDashboard;