import { React, useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import { HeroParallax } from '../components/ui/Parallax';
import axiosInstance from '../api/AxiosInstance';

const Homepage = ({ products }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axiosInstance.get('/wardrobeItems/getAllItems')
      .then(response => {
        setItems(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      <Navbar />

      {/* Hero Parallax Section */}
      <HeroParallax products={items} />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Sustainability Impact Section */}
      <SustainabilityImpact />

      <Footer />
    </div>
  );
};

const HowItWorks = () => (
  <section className="bg-gray-100 py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>
      <div className="flex space-x-6">
        <div className="w-1/3 text-center">
          <img src="/path-to-icon1.png" alt="Icon 1" className="mx-auto mb-4" />
          <h3 className="text-2xl font-semibold">Track Your Usage</h3>
          <p className="text-gray-600 mt-2">Automatically track how often you wear items.</p>
        </div>
        <div className="w-1/3 text-center">
          <img src="/path-to-icon2.png" alt="Icon 2" className="mx-auto mb-4" />
          <h3 className="text-2xl font-semibold">Create Outfits</h3>
          <p className="text-gray-600 mt-2">Mix and match to create your favorite looks.</p>
        </div>
        <div className="w-1/3 text-center">
          <img src="/path-to-icon3.png" alt="Icon 3" className="mx-auto mb-4" />
          <h3 className="text-2xl font-semibold">Sustainability Insights</h3>
          <p className="text-gray-600 mt-2">Learn how your choices impact the environment.</p>
        </div>
      </div>
    </div>
  </section>
);

const SustainabilityImpact = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-10">Your Sustainability Impact</h2>
      <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
        Each time you make a thoughtful choice about your wardrobe, you're reducing waste and
        contributing to a more sustainable planet. Keep track of your impact and see how small
        changes can make a big difference.
      </p>
    </div>
  </section>
);

export default Homepage;
