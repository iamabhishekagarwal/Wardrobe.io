import React, { useEffect, useState } from "react";
import axiosInstance from '../api/AxiosInstance';

const WardrobeAnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalWears: 0,
    mostWornItem: "",
    leastWornItem: "",
  });
  const [wearFrequencyData, setWearFrequencyData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("/api/wardrobe/analytics"); // Adjust this URL
        setStats(response.data.stats);
        setWearFrequencyData(response.data.wearFrequency);
        setSuggestions(response.data.suggestions);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 shadow-md rounded-md">
          <h3 className="text-xl font-bold">Total Items</h3>
          <p className="text-2xl">{stats.totalItems}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-md">
          <h3 className="text-xl font-bold">Total Wears</h3>
          <p className="text-2xl">{stats.totalWears}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-md">
          <h3 className="text-xl font-bold">Most Worn Item</h3>
          <p className="text-2xl">{stats.mostWornItem}</p>
        </div>
        <div className="bg-white p-4 shadow-md rounded-md">
          <h3 className="text-xl font-bold">Least Worn Item</h3>
          <p className="text-2xl">{stats.leastWornItem}</p>
        </div>
      </div>

      {/* Wear Frequency Chart */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Wear Frequency by Category</h2>
        <div className="bg-white p-4 shadow-md rounded-md">
          <ul>
            {wearFrequencyData.map((item, index) => (
              <li key={index} className="flex justify-between mb-2">
                <span>{item.category}</span>
                <span>{item.frequency}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Suggestions for Underused Items</h2>
        <div className="bg-white p-4 shadow-md rounded-md">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Item</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((suggestion, index) => (
                <tr key={index}>
                  <td className="p-2 border-b">{suggestion.item}</td>
                  <td className="p-2 border-b">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={suggestion.action}
                    >
                      {suggestion.actionText}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WardrobeAnalyticsDashboard;
