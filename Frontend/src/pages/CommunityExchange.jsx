import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import axiosInstance from "../api/AxiosInstance";
import ItemCard from "../components/cards/ItemCard";
import ListItemCard from "../components/cards/ListItemCard";

const CommunityExchange = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [type, setType] = useState("all");
  const [listedItems, setListedItems] = useState([]);
  const [wardrobe, setWardrobe] = useState([]);

  // Fetch items when the component mounts
  useEffect(() => {
    const fetchWardrobeItems = async () => {
      try {
        const response = await axiosInstance.get("/wardrobeItems/getAllItems");
        setWardrobe(response.data); // Correctly set wardrobe items
      } catch (error) {
        console.error("Error fetching wardrobe items:", error);
      }
    };

    const fetchListedItems = async () => {
      try {
        const response = await axiosInstance.get("marketplace/items/status/ACTIVE");
        setListedItems(response.data); // Set items to those with status ACTIVE
      } catch (error) {
        console.error("Error fetching listed items:", error);
      }
    };

    fetchWardrobeItems();
    fetchListedItems();
  }, []); // Empty dependency array to run only once on mount

  const handleSetType = async (data) => {
    setType(data);
    try {
      let response;
      if (data === "all") {
        response = await axiosInstance.get("marketplace/items/status/ACTIVE");
      } else {
        response = await axiosInstance.get(`marketplace/items/type/${data}`);
      }
      const activeItems = response.data.filter(item => item.status === "ACTIVE");
      setListedItems(activeItems); // Update listed items based on selected type
    } catch (error) {
      console.error("Error fetching filtered items:", error);
    }
  };

  // Further filter items based on search term
  const filteredItems = listedItems.filter(item =>
    item.wardrobeItemId && item.wardrobeItemId.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <button onClick={() => setFilter("all")} className="text-lg font-bold">
              Browse Items
            </button>
            <button onClick={() => setFilter("list")} className="text-lg font-bold">
              List an Item
            </button>
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
                  value={type}
                  onChange={(e) => handleSetType(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="all">All Items</option>
                  <option value="SELL">Buy</option>
                  <option value="RENT">Rent</option>
                  <option value="DONATE">Donation</option>
                </select>
              </div>
              <div>
                {/* Display filtered items */}
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <ItemCard key={index} itemId={item.wardrobeItemId} />
                  ))
                ) : (
                  <p>No items found.</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              {wardrobe.length > 0 ? (
                wardrobe.map((item, index) => (
                  <ListItemCard key={index} itemId={item.id} />
                ))
              ) : (
                <p>No items found.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-muted-foreground">
            Join the sustainable fashion movement! 🌱
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CommunityExchange;
