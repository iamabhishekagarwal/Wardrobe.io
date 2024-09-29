import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import axiosInstance from "../api/AxiosInstance";

const CommunityExchange = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [listedItems, setListedItems] = useState([]);
  const [chooseData, setChooseData] = useState([]);

  // Fetch all wardrobe items when 'Choose' is clicked
  const handleChoose = async () => {
    try {
      const response = await axiosInstance.get("/wardrobeItems/getAllItems");
      console.log(response.data);
      setChooseData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch items initially (for listed items)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get("/wardrobeItems/getAllItems"); // Adjust API path as per your setup
        setListedItems(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = listedItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === "all" || item.type === filter)
  );

  const handleListItem = async (e) => {
    e.preventDefault();
    const newItem = {
      id: listedItems.length + 1,
      name: e.target.name.value,
      type: e.target.type.value,
      condition: e.target.condition.value,
      size: e.target.size.value,
      image: e.target.image.value || "/placeholder.svg",
    };

    try {
      // Optionally, you can send this newItem to the backend using a POST request:
      await axiosInstance.post("/wardrobeItems/addItem", newItem); // Adjust the API endpoint
      setListedItems([...listedItems, newItem]); // Update local state
    } catch (e) {
      console.log("Error adding item:", e);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Exchange 🔄</h1>
          <p className="text-muted-foreground">
            Trade, donate, or lend clothes in your local community. Reduce clutter and promote sustainability! 🌍
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex justify-center space-x-8 mb-4">
            <button onClick={() => setFilter("list")} className="text-lg font-bold">Browse Items</button>
            <button onClick={() => setFilter("all")} className="text-lg font-bold">List an item</button>
          </div>

          

          {filter !== "list" ? (
            <div>
              {/* Browse Items */}
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="all">All Items</option>
                  <option value="trade">Trade</option>
                  <option value="donate">Donate</option>
                  <option value="lend">Lend</option>
                </select>
              </div>

              {/* Display Filtered Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="border p-4 rounded shadow-lg">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p>Size: {item.size} | Condition: {item.condition}</p>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-40 object-cover mb-4 rounded-md"
                    />
                    <span
                      className={`inline-block py-1 px-2 rounded text-white ${
                        item.type === "trade"
                          ? "bg-green-500"
                          : item.type === "donate"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Choose from API Fetched Items */}
              {chooseData.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">Choose an Item:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chooseData.map((item) => (
                      <div key={item.id} className="border p-4 rounded shadow-lg">
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <p>Size: {item.size} | Condition: {item.condition}</p>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-40 object-cover mb-4 rounded-md"
                        />
                        <span
                          className={`inline-block py-1 px-2 rounded text-white ${
                            item.type === "trade"
                              ? "bg-green-500"
                              : item.type === "donate"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* List an Item */}
              <form onSubmit={handleListItem} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-2">Item Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g., Blue Denim Jacket"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block mb-2">Exchange Type</label>
                  <select
                    id="type"
                    name="type"
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="trade">Trade</option>
                    <option value="donate">Donate</option>
                    <option value="lend">Lend</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="condition" className="block mb-2">Condition</label>
                  <input
                    type="text"
                    id="condition"
                    name="condition"
                    placeholder="e.g., Good, Like New"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="size" className="block mb-2">Size</label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    placeholder="e.g., M, 38, 10"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="image" className="block mb-2">Image URL</label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    placeholder="http://example.com/image.jpg"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">List Item</button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-muted-foreground">Join the sustainable fashion movement! 🌱</p>
        </footer>
      </div>
    </div>
  );
};

export default CommunityExchange;
