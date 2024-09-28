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
        const response = await axiosInstance.get("/api/wardrobe/analytics"); // Adjust this URL
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
        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-gray-700">Total Items</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalItems}</p>
        </div>
        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-gray-700">Total Wears</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalWears}</p>
        </div>
        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-gray-700">Most Worn Item</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.mostWornItem || "N/A"}</p>
        </div>
        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition duration-300 ease-in-out">
          <h3 className="text-xl font-semibold text-gray-700">Least Worn Item</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.leastWornItem || "N/A"}</p>
        </div>
      </div>

      {/* Wear Frequency Chart */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Wear Frequency by Category</h2>
        <div className="bg-white p-6 shadow-md rounded-lg">
          <ul className="divide-y divide-gray-200">
            {wearFrequencyData.length > 0 ? (
              wearFrequencyData.map((item, index) => (
                <li key={index} className="flex justify-between py-2">
                  <span className="text-gray-700">{item.category}</span>
                  <span className="font-medium text-gray-800">{item.frequency}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-center py-4">No wear frequency data available.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Suggestions Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Suggestions for Underused Items</h2>
        <div className="bg-white p-6 shadow-md rounded-lg">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left text-gray-700">Item</th>
                <th className="p-3 text-left text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition duration-300">
                    <td className="p-3 border-b border-gray-300">{suggestion.item}</td>
                    <td className="p-3 border-b border-gray-300">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={suggestion.action}
                      >
                        {suggestion.actionText}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 border-b border-gray-300" colSpan="2">No suggestions available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    
  );
};

export default WardrobeAnalyticsDashboard;
